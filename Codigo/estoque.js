/* estoque.js */
// =========================================================
// CONTROLE DE ESTOQUE E PRODUTOS - SHADOW REALM STORE (estoque.js)
// =========================================================

(function () {
    const CHAVE_ESTOQUE_SR = 'estoqueShadowRealm';
    const CHAVE_PRODUTOS_CUSTOM_SR = 'produtosCustomShadowRealm';

    const ESTOQUE_INICIAL_SR = {
        'Ichigo Kurosaki': 5,
        'Kisuke Urahara': 3,
        'Renji Abarai': 4,
        'Rukia Kuchiki': 6,
        'Toshiro Hitsugaya': 2,
        'Levi Ackerman': 5,
        'Maomao': 4,
        'Satoru Gojo': 3,
        'Greninja': 2,
        'Snorlax': 1
    };

    function escaparHTMLEstoqueSR(texto) {
        return String(texto ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function lerEstoqueSeguroSR() {
        try {
            const bruto = localStorage.getItem(CHAVE_ESTOQUE_SR);
            if (!bruto) return null;
            const parsed = JSON.parse(bruto);
            return parsed && typeof parsed === 'object' ? parsed : null;
        } catch {
            return null;
        }
    }

    function salvarEstoqueSeguroSR(mapa) {
        try {
            localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(mapa && typeof mapa === 'object' ? mapa : {}));
        } catch {}
    }

    function lerProdutosCustomSR() {
        try {
            const bruto = localStorage.getItem(CHAVE_PRODUTOS_CUSTOM_SR);
            if (!bruto) return [];
            const parsed = JSON.parse(bruto);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function salvarProdutosCustomSR(lista) {
        try {
            localStorage.setItem(CHAVE_PRODUTOS_CUSTOM_SR, JSON.stringify(Array.isArray(lista) ? lista : []));
        } catch {}
    }

    function formatarMoedaEstoqueSR(valor) {
        return (Number(valor) || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    async function inicializarEstoqueSR() {
        let estoqueAtual = lerEstoqueSeguroSR();
        let alterou = false;

        if (!estoqueAtual) {
            estoqueAtual = { ...ESTOQUE_INICIAL_SR };
            alterou = true;
        }

        try {
            const resp = await fetch('produtos.json');
            if (resp.ok) {
                const lista = await resp.json();
                if (Array.isArray(lista)) {
                    lista.forEach((prod) => {
                        if (!prod || !prod.nome) return;
                        if (estoqueAtual[prod.nome] === undefined) {
                            const qtd = Number(prod.estoque);
                            estoqueAtual[prod.nome] = !Number.isNaN(qtd) && qtd >= 0 ? qtd : 5;
                            alterou = true;
                        }
                    });
                }
            }
        } catch {}

        const custom = lerProdutosCustomSR();
        custom.forEach((prod) => {
            if (!prod || !prod.nome) return;
            if (estoqueAtual[prod.nome] === undefined) {
                const qtd = Number(prod.estoque);
                estoqueAtual[prod.nome] = !Number.isNaN(qtd) && qtd >= 0 ? qtd : 5;
                alterou = true;
            }
        });

        if (alterou) {
            salvarEstoqueSeguroSR(estoqueAtual);
        }

        return estoqueAtual;
    }

    window.promessaEstoqueSR = inicializarEstoqueSR();

    function obterEstoque(nomeProduto) {
        if (!nomeProduto) return 0;
        const estoqueAtual = lerEstoqueSeguroSR();

        if (estoqueAtual && Object.prototype.hasOwnProperty.call(estoqueAtual, nomeProduto)) {
            const valor = Number(estoqueAtual[nomeProduto]);
            return Number.isNaN(valor) ? 0 : Math.max(0, valor);
        }

        if (Object.prototype.hasOwnProperty.call(ESTOQUE_INICIAL_SR, nomeProduto)) {
            return ESTOQUE_INICIAL_SR[nomeProduto];
        }

        const custom = lerProdutosCustomSR();
        const encontradoCustom = custom.find(
            (p) => p && p.nome && String(p.nome).toLowerCase() === String(nomeProduto).toLowerCase()
        );
        if (encontradoCustom) {
            const qtd = Number(encontradoCustom.estoque);
            return Number.isNaN(qtd) ? 0 : Math.max(0, qtd);
        }

        return 0;
    }

    function definirEstoque(nomeProduto, novaQuantidade) {
        if (!nomeProduto) return 0;
        const qtdLimpa = Math.max(0, parseInt(novaQuantidade, 10) || 0);
        const estoqueAtual = lerEstoqueSeguroSR() || { ...ESTOQUE_INICIAL_SR };
        estoqueAtual[nomeProduto] = qtdLimpa;
        salvarEstoqueSeguroSR(estoqueAtual);

        const custom = lerProdutosCustomSR();
        let mudouCustom = false;
        custom.forEach((item) => {
            if (item && item.nome && String(item.nome).toLowerCase() === String(nomeProduto).toLowerCase()) {
                item.estoque = qtdLimpa;
                mudouCustom = true;
            }
        });
        if (mudouCustom) {
            salvarProdutosCustomSR(custom);
        }

        renderizarTabelaProdutosCadastrados();
        atualizarInterfaceEstoque();
        return qtdLimpa;
    }

    function darBaixaNoEstoque(itensCarrinho) {
        const itens = Array.isArray(itensCarrinho) ? itensCarrinho : [];
        const estoqueAtual = lerEstoqueSeguroSR() || { ...ESTOQUE_INICIAL_SR };

        for (const item of itens) {
            if (!item || !item.nome) continue;
            const qtdSolicitada = Math.max(1, parseInt(item.quantidade, 10) || 1);
            const disponivel = Number(estoqueAtual[item.nome] ?? obterEstoque(item.nome)) || 0;

            if (disponivel < qtdSolicitada) {
                return {
                    sucesso: false,
                    mensagem: `Estoque insuficiente para "${escaparHTMLEstoqueSR(item.nome)}". Disponível: ${disponivel} un., solicitado: ${qtdSolicitada} un.`
                };
            }
        }

        for (const item of itens) {
            if (!item || !item.nome) continue;
            const qtdSolicitada = Math.max(1, parseInt(item.quantidade, 10) || 1);
            const disponivel = Number(estoqueAtual[item.nome] ?? obterEstoque(item.nome)) || 0;
            estoqueAtual[item.nome] = Math.max(0, disponivel - qtdSolicitada);
        }

        salvarEstoqueSeguroSR(estoqueAtual);
        renderizarTabelaProdutosCadastrados();
        atualizarInterfaceEstoque();
        return { sucesso: true };
    }

    function devolverAoEstoque(itensPedido) {
        const itens = Array.isArray(itensPedido) ? itensPedido : [];
        const estoqueAtual = lerEstoqueSeguroSR() || { ...ESTOQUE_INICIAL_SR };

        itens.forEach((item) => {
            if (!item || !item.nome) return;
            const qtdDevolver = Math.max(1, parseInt(item.quantidade, 10) || 1);
            const atual = Number(estoqueAtual[item.nome] ?? obterEstoque(item.nome)) || 0;
            estoqueAtual[item.nome] = atual + qtdDevolver;
        });

        salvarEstoqueSeguroSR(estoqueAtual);
        renderizarTabelaProdutosCadastrados();
        atualizarInterfaceEstoque();
    }

    function obterStatusEstoqueSR(qtd) {
        if (qtd <= 0) {
            return {
                texto: 'Esgotado',
                bg: 'rgba(198, 40, 40, 0.25)',
                cor: '#ff6b6b',
                borda: '#c62828'
            };
        }
        if (qtd <= 2) {
            return {
                texto: `Últimas ${qtd} un.`,
                bg: 'rgba(255, 202, 40, 0.18)',
                cor: '#ffca28',
                borda: '#ffca28'
            };
        }
        return {
            texto: 'Em estoque',
            bg: 'rgba(46, 125, 50, 0.22)',
            cor: '#69f0ae',
            borda: '#2e7d32'
        };
    }

    function atualizarInterfaceEstoque() {
        const cards = document.querySelectorAll('.destaques > div');
        cards.forEach((card) => {
            const nomeEl = card.querySelector('p');
            if (!nomeEl) return;

            const nomeProduto = nomeEl.textContent.trim();
            const qtd = obterEstoque(nomeProduto);
            const st = obterStatusEstoqueSR(qtd);

            let badge = card.querySelector('.badge-estoque-sr');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge-estoque-sr';
                badge.style.cssText = 'display:inline-block; margin:4px 0 8px 0; padding:3px 10px; border-radius:12px; font-size:12px; font-weight:bold;';
                const precoEl = card.querySelector('h3');
                if (precoEl && precoEl.parentNode) {
                    precoEl.insertAdjacentElement('afterend', badge);
                } else {
                    card.appendChild(badge);
                }
            }

            badge.textContent = qtd <= 0 ? 'Esgotado' : `Em estoque: ${qtd} un.`;
            badge.style.backgroundColor = st.bg;
            badge.style.color = st.cor;
            badge.style.border = `1px solid ${st.borda}`;

            const modalId = card.querySelector('button[id^="card"]')?.id;
            if (modalId) {
                const modal = document.getElementById(`modal-${modalId}`);
                if (modal) {
                    const btnsCompra = modal.querySelectorAll('.btn-carrinho, .btn-comprar-agora');
                    btnsCompra.forEach((btn) => {
                        if (qtd <= 0) {
                            btn.disabled = true;
                            btn.style.opacity = '0.45';
                            btn.style.cursor = 'not-allowed';
                        } else {
                            btn.disabled = false;
                            btn.style.opacity = '';
                            btn.style.cursor = '';
                        }
                    });
                }
            }
        });
    }

    function encontrarCorpoTabelaEstoque() {
        const candidatas = [
            document.getElementById('tbodyProdutosCadastrados'),
            document.getElementById('tabelaProdutosCadastrados'),
            document.getElementById('listaProdutosCadastrados'),
            document.querySelector('table tbody')
        ];

        for (const el of candidatas) {
            if (!el) continue;
            if (el.tagName === 'TBODY') return el;
            const innerBody = el.querySelector('tbody');
            if (innerBody) return innerBody;
            return el;
        }
        return null;
    }

    function coletarProdutosParaTabela() {
        const custom = lerProdutosCustomSR();
        const mapa = new Map();

        Object.keys(ESTOQUE_INICIAL_SR).forEach((nome) => {
            mapa.set(nome.toLowerCase(), {
                nome,
                preco: 0,
                descricao: 'Figure colecionável da Shadow Realm Store.',
                imagem: 'imagens/produto.png',
                estoque: obterEstoque(nome),
                custom: false
            });
        });

        custom.forEach((item, idx) => {
            if (!item || !item.nome) return;
            const chave = String(item.nome).trim().toLowerCase();
            mapa.set(chave, {
                nome: String(item.nome).trim(),
                preco: Number(item.preco) || 0,
                descricao: String(item.descricao || item.categoria || 'Produto cadastrado no estoque.'),
                imagem: String(item.imagem || 'imagens/produto.png').trim(),
                estoque: obterEstoque(item.nome),
                custom: true,
                customIndex: idx
            });
        });

        return Array.from(mapa.values());
    }

    function renderizarTabelaProdutosCadastrados() {
        const corpo = encontrarCorpoTabelaEstoque();
        if (!corpo) return;

        const produtos = coletarProdutosParaTabela();
        if (produtos.length === 0) {
            corpo.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center; padding:18px; color:#bbbbbb;">
                        Nenhum produto cadastrado ainda.
                    </td>
                </tr>
            `;
            return;
        }

        corpo.innerHTML = produtos.map((prod) => {
            const qtd = obterEstoque(prod.nome);
            const st = obterStatusEstoqueSR(qtd);
            const nomeSeguro = escaparHTMLEstoqueSR(prod.nome);
            const imgSegura = escaparHTMLEstoqueSR(prod.imagem || 'imagens/produto.png');
            const descSegura = escaparHTMLEstoqueSR(prod.descricao || '-');
            const precoTexto = prod.preco > 0 ? `R$ ${formatarMoedaEstoqueSR(prod.preco)}` : 'Catálogo base';

            const btnRemoverHTML = prod.custom
                ? `<button type="button" class="btn-remover-prod-estoque" data-nome-prod="${nomeSeguro}" style="background:#8e1616; color:#ffffff; border:none; border-radius:8px; padding:5px 10px; font-size:12px; font-weight:bold; cursor:pointer; margin-left:6px;">Excluir</button>`
                : '';

            return `
                <tr data-produto-linha="${nomeSeguro}">
                    <td style="padding:10px; vertical-align:middle;">
                        <img src="${imgSegura}" alt="${nomeSeguro}" style="width:46px; height:46px; object-fit:cover; border-radius:8px; border:1px solid #3a3a3a;">
                    </td>
                    <td style="padding:10px; vertical-align:middle; font-weight:bold; color:#ffffff;">${nomeSeguro}</td>
                    <td style="padding:10px; vertical-align:middle; color:#ffca28; font-weight:bold;">${escaparHTMLEstoqueSR(precoTexto)}</td>
                    <td style="padding:10px; vertical-align:middle; color:#dddddd; max-width:260px;">${descSegura}</td>
                    <td style="padding:10px; vertical-align:middle;">
                        <span style="display:inline-block; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:bold; background:${st.bg}; color:${st.cor}; border:1px solid ${st.borda};">${escaparHTMLEstoqueSR(st.texto)}</span>
                    </td>
                    <td style="padding:10px; vertical-align:middle;">
                        <input type="number" min="0" value="${qtd}" data-qtd-produto="${nomeSeguro}" aria-label="Quantidade em estoque de ${nomeSeguro}" style="width:74px; padding:5px 8px; border-radius:8px; border:1px solid #C62828; background:#121212; color:#ffffff; font-weight:bold;">
                    </td>
                    <td style="padding:10px; vertical-align:middle; white-space:nowrap;">
                        <button type="button" class="btn-salvar-qtd-estoque" data-nome-prod="${nomeSeguro}" style="background:#C62828; color:#ffffff; border:none; border-radius:8px; padding:5px 12px; font-size:12px; font-weight:bold; cursor:pointer;">Salvar</button>
                        ${btnRemoverHTML}
                    </td>
                </tr>
            `;
        }).join('');

        corpo.querySelectorAll('.btn-salvar-qtd-estoque').forEach((btn) => {
            btn.addEventListener('click', () => {
                const nomeAlvo = btn.getAttribute('data-nome-prod') || '';
                const inputQtd = corpo.querySelector(`input[data-qtd-produto="${CSS.escape(nomeAlvo)}"]`);
                if (!inputQtd) return;
                definirEstoque(nomeAlvo, inputQtd.value);
                if (window.srModal && typeof window.srModal.toast === 'function') {
                    window.srModal.toast(`Estoque de "${nomeAlvo}" atualizado!`);
                }
            });
        });

        corpo.querySelectorAll('.btn-remover-prod-estoque').forEach((btn) => {
            btn.addEventListener('click', () => {
                const nomeAlvo = btn.getAttribute('data-nome-prod') || '';
                const lista = lerProdutosCustomSR().filter(
                    (item) => String(item.nome || '').trim().toLowerCase() !== nomeAlvo.toLowerCase()
                );
                salvarProdutosCustomSR(lista);
                renderizarTabelaProdutosCadastrados();
                if (window.srModal && typeof window.srModal.toast === 'function') {
                    window.srModal.toast(`"${nomeAlvo}" removido do cadastro.`);
                }
            });
        });
    }

    function conectarFormularioEstoque() {
        const forms = Array.from(document.querySelectorAll('form'));
        const formEstoque = forms.find((f) => {
            const texto = (f.textContent || '').toLowerCase();
            return texto.includes('estoque inicial') || texto.includes('adicionar produto') || f.id === 'formCadastroEstoque';
        });

        if (!formEstoque || formEstoque.dataset.srEstoqueBind === '1') return;
        formEstoque.dataset.srEstoqueBind = '1';

        formEstoque.addEventListener('submit', (e) => {
            const camposTexto = Array.from(formEstoque.querySelectorAll('input[type="text"], input[type="number"], textarea, select'));
            const nomeInput = formEstoque.querySelector('input[name*="nome" i], input[id*="nome" i], input[placeholder*="nome" i]');
            const precoInput = formEstoque.querySelector('input[name*="preco" i], input[id*="preco" i], input[placeholder*="preço" i], input[placeholder*="preco" i]');
            const categoriaInput = formEstoque.querySelector('input[name*="categoria" i], select[name*="categoria" i], input[id*="categoria" i], select[id*="categoria" i], input[value="Bleach"]');
            const estoqueInput = formEstoque.querySelector('input[name*="estoque" i], input[id*="estoque" i], input[type="number"]:not([name*="preco" i]):not([id*="preco" i])');
            const imagemInput = formEstoque.querySelector('input[name*="imagem" i], input[id*="imagem" i], input[placeholder*="imagem" i], input[placeholder*="imagens/" i]');
            const descInput = formEstoque.querySelector('textarea, input[name*="desc" i], input[id*="desc" i]');
            const homeCheckbox = formEstoque.querySelector('input[type="checkbox"]');

            const nome = (nomeInput?.value || camposTexto[0]?.value || '').trim();
            if (!nome) return;

            e.preventDefault();

            const preco = parseFloat(String(precoInput?.value || '0').replace(',', '.')) || 0;
            const estoqueInicial = Math.max(0, parseInt(estoqueInput?.value || '0', 10) || 0);
            const categoria = (categoriaInput?.value || 'Bleach').trim();
            const imagem = (imagemInput?.value || 'imagens/produto.png').trim();
            const descricao = (descInput?.value || '').trim();
            const exibirHome = Boolean(homeCheckbox?.checked);

            const listaCustom = lerProdutosCustomSR();
            const idxExistente = listaCustom.findIndex(
                (item) => String(item.nome || '').trim().toLowerCase() === nome.toLowerCase()
            );

            const novoRegistro = {
                id: idxExistente >= 0 ? listaCustom[idxExistente].id : `prod_${Date.now()}`,
                nome,
                preco,
                estoque: estoqueInicial,
                categoria,
                imagem,
                descricao,
                exibirHome
            };

            if (idxExistente >= 0) {
                listaCustom[idxExistente] = novoRegistro;
            } else {
                listaCustom.push(novoRegistro);
            }

            salvarProdutosCustomSR(listaCustom);
            definirEstoque(nome, estoqueInicial);
            formEstoque.reset();
            renderizarTabelaProdutosCadastrados();

            if (window.srModal && typeof window.srModal.toast === 'function') {
                window.srModal.toast(`Produto "${nome}" salvo no estoque!`);
            }
        });
    }

    window.obterEstoque = obterEstoque;
    window.definirEstoque = definirEstoque;
    window.darBaixaNoEstoque = darBaixaNoEstoque;
    window.devolverAoEstoque = devolverAoEstoque;
    window.atualizarInterfaceEstoque = atualizarInterfaceEstoque;
    window.renderizarTabelaProdutosCadastrados = renderizarTabelaProdutosCadastrados;

    document.addEventListener('DOMContentLoaded', async () => {
        if (window.promessaEstoqueSR) {
            await window.promessaEstoqueSR;
        }
        conectarFormularioEstoque();
        renderizarTabelaProdutosCadastrados();
        atualizarInterfaceEstoque();
    });
})();