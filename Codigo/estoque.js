const CHAVE_ESTOQUE_SR = 'estoqueShadowRealm';

// Lista reserva caso o navegador bloqueie o fetch('produtos.json') ao abrir direto da pasta
const PRODUTOS_PADRAO_SR = [
    { id: "1", nome: "Ichigo Kurosaki", preco: 340.00, estoque: 5, categoria: "Bleach", imagem: "imagens/bleach.png" },
    { id: "2", nome: "Kisuke Urahara", preco: 460.00, estoque: 3, categoria: "Bleach", imagem: "imagens/kisuke.png" },
    { id: "3", nome: "Renji Abarai", preco: 400.00, estoque: 4, categoria: "Bleach", imagem: "imagens/renje.png" },
    { id: "4", nome: "Rukia Kuchiki", preco: 430.00, estoque: 6, categoria: "Bleach", imagem: "imagens/rukia.png" },
    { id: "5", nome: "Toshiro Hitsugaya", preco: 200.00, estoque: 2, categoria: "Bleach", imagem: "imagens/toshiro.png" },
    { id: "6", nome: "Levi Ackerman", preco: 250.00, estoque: 5, categoria: "Attack on Titan", imagem: "imagens/Levi.png" },
    { id: "7", nome: "Maomao", preco: 300.00, estoque: 4, categoria: "Diário de uma Apotecária", imagem: "imagens/Maomao.png" },
    { id: "8", nome: "Satoru Gojo", preco: 350.00, estoque: 3, categoria: "Jujutsu Kaisen", imagem: "imagens/Canva - download.png" },
    { id: "9", nome: "Greninja", preco: 400.00, estoque: 2, categoria: "Pokémon", imagem: "imagens/Canva - download (1).png" },
    { id: "10", nome: "Snorlax", preco: 450.00, estoque: 1, categoria: "Pokémon", imagem: "imagens/Snorlax.png" }
];

// Tenta ler o produtos.json; se falhar, usa a lista reserva automaticamente
async function carregarProdutosSR() {
    try {
        const resp = await fetch('produtos.json');
        if (resp.ok) {
            const dados = await resp.json();
            if (Array.isArray(dados) && dados.length > 0) return dados;
        }
    } catch {
        // Ignora erro de CORS/arquivo local e usa o fallback abaixo
    }
    return PRODUTOS_PADRAO_SR;
}

window.promessaEstoqueSR = (async function inicializarEstoque() {
    let estoqueSalvo = null;
    try {
        estoqueSalvo = JSON.parse(localStorage.getItem(CHAVE_ESTOQUE_SR));
    } catch {
        estoqueSalvo = null;
    }

    const produtos = await carregarProdutosSR();
    const estoqueAtualizado = (estoqueSalvo && typeof estoqueSalvo === 'object') ? { ...estoqueSalvo } : {};
    let mudou = Object.keys(estoqueAtualizado).length === 0;

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

function devolverAoEstoque(itens) {
    if (!Array.isArray(itens)) return;
    const estoque = obterTodoEstoque();

    itens.forEach(item => {
        estoque[item.nome] = (estoque[item.nome] ?? 0) + (item.quantidade || 1);
    });

    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
}

function atualizarInterfaceEstoque() {
    document.querySelectorAll('.destaques > div').forEach(card => {
        const nomeEl = card.querySelector('p');
        if (!nomeEl) return;

        const nome = nomeEl.innerText.trim();
        const qtd = obterEstoque(nome);

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

        card.style.opacity = qtd === 0 ? '0.7' : '1';
    });

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
    setTimeout(atualizarInterfaceEstoque, 80);
});