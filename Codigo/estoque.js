const CHAVE_ESTOQUE_SR = 'estoqueShadowRealm';

// 1. Carrega o produtos.json e inicializa o estoque no localStorage sem apagar vendas já feitas
window.promessaEstoqueSR = (async function inicializarEstoque() {
    let estoqueSalvo = null;
    try {
        estoqueSalvo = JSON.parse(localStorage.getItem(CHAVE_ESTOQUE_SR));
    } catch {
        estoqueSalvo = null;
    }

    try {
        const resp = await fetch('produtos.json');
        if (resp.ok) {
            const produtos = await resp.json();
            const estoqueAtualizado = estoqueSalvo && typeof estoqueSalvo === 'object' ? { ...estoqueSalvo } : {};
            let mudou = !estoqueSalvo;

            produtos.forEach(prod => {
                if (estoqueAtualizado[prod.nome] === undefined) {
                    estoqueAtualizado[prod.nome] = typeof prod.estoque === 'number' ? prod.estoque : 5;
                    mudou = true;
                }
            });

            if (mudou) {
                localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoqueAtualizado));
            }
            return estoqueAtualizado;
        }
    } catch (erro) {
        console.error('Erro ao carregar estoque do produtos.json:', erro);
    }

    return estoqueSalvo || {};
})();

function obterTodoEstoque() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_ESTOQUE_SR)) || {};
    } catch {
        return {};
    }
}

function obterEstoque(nomeProduto) {
    const estoque = obterTodoEstoque();
    return estoque[nomeProduto] !== undefined ? Number(estoque[nomeProduto]) : 0;
}

function definirEstoque(nomeProduto, novaQtd) {
    const estoque = obterTodoEstoque();
    estoque[nomeProduto] = Math.max(0, parseInt(novaQtd, 10) || 0);
    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
    atualizarInterfaceEstoque();
}

// 2. Desconta os itens quando a compra é finalizada
function darBaixaNoEstoque(carrinho) {
    const estoque = obterTodoEstoque();

    for (const item of carrinho) {
        const disponivel = estoque[item.nome] ?? 0;
        if (item.quantidade > disponivel) {
            return {
                sucesso: false,
                mensagem: `Estoque insuficiente para "${item.nome}". Disponível no momento: ${disponivel} unidade(s).`
            };
        }
    }

    carrinho.forEach(item => {
        estoque[item.nome] = Math.max(0, (estoque[item.nome] ?? 0) - item.quantidade);
    });

    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
    return { sucesso: true };
}

// 3. Devolve os itens ao estoque quando um pedido é cancelado
function devolverAoEstoque(itens) {
    if (!Array.isArray(itens)) return;
    const estoque = obterTodoEstoque();

    itens.forEach(item => {
        estoque[item.nome] = (estoque[item.nome] ?? 0) + (item.quantidade || 1);
    });

    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
}

// 4. Atualiza os textos e botões nos cards e modais de produto
function atualizarInterfaceEstoque() {
    // Atualiza cards da vitrine (index.html e produtos.html)
    document.querySelectorAll('.destaques > div').forEach(card => {
        const nomeEl = card.querySelector('p');
        if (!nomeEl) return;

        const nome = nomeEl.innerText.trim();
        const qtd = obterEstoque(nome);

        // Aproveita o espaço já criado pelo shopee.js
        const textoShopee = card.querySelector('.shopee-estoque-texto');
        if (textoShopee) {
            if (qtd === 0) {
                textoShopee.textContent = '❌ Esgotado';
                textoShopee.style.color = '#ff4d4d';
            } else if (qtd <= 2) {
                textoShopee.textContent = `🔥 Últimas ${qtd} unidade(s)!`;
                textoShopee.style.color = '#ffca28';
            } else {
                textoShopee.textContent = `📦 Em estoque: ${qtd} un.`;
                textoShopee.style.color = '#00e676';
            }
        }

        if (qtd === 0) {
            card.style.opacity = '0.7';
        }
    });

    // Atualiza modais de detalhes (.modalProduto)
    document.querySelectorAll('.modalProduto').forEach(modal => {
        const tituloEl = modal.querySelector('.modalProduto-conteudo h2');
        if (!tituloEl) return;

        const nome = tituloEl.innerText.replace(/^-\s*/, '').trim();
        const qtd = obterEstoque(nome);

        let infoModal = modal.querySelector('.info-estoque-modal');
        if (!infoModal) {
            infoModal = document.createElement('p');
            infoModal.className = 'info-estoque-modal';
            infoModal.style.cssText = 'font-weight:bold; font-size:18px; margin: 10px 20px;';
            modal.querySelector('.modalProduto-conteudo')?.appendChild(infoModal);
        }

        const btnCarrinho = modal.querySelector('.btn-carrinho');
        const btnComprar = modal.querySelector('.btn-comprar-agora');

        if (qtd === 0) {
            infoModal.textContent = '❌ Produto Esgotado no momento';
            infoModal.style.color = '#ff4d4d';
            [btnCarrinho, btnComprar].forEach(btn => {
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = 'Esgotado';
                    btn.style.backgroundColor = '#444';
                    btn.style.borderColor = '#555';
                    btn.style.cursor = 'not-allowed';
                }
            });
        } else {
            infoModal.textContent = `📦 Disponível em estoque: ${qtd} unidade(s)`;
            infoModal.style.color = qtd <= 2 ? '#ffca28' : '#00e676';
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await window.promessaEstoqueSR;
    setTimeout(atualizarInterfaceEstoque, 60);
});