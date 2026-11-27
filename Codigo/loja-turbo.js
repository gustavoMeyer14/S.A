/* loja-turbo.js */
// =========================================================
// LOJA TURBO: AUTOCOMPLETE, COMPARADOR, VISTOS RECENTEMENTE,
// PRODUTOS CUSTOMIZADOS & COMPROVANTE DE PEDIDOS
// =========================================================

function escTurboSR(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function lerJsonTurboSR(chave, fallback = null) {
    try {
        const bruto = localStorage.getItem(chave);
        if (bruto === null || bruto === '') return fallback;
        return JSON.parse(bruto);
    } catch {
        return fallback;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const catalogo = await carregarCatalogoUnificadoSR();

    renderizarProdutosCustomizadosNaVitrine(catalogo);
    injetarAutocompleteBusca(catalogo);
    injetarComparadorFigures(catalogo);
    registrarEMostrarVistosRecentemente(catalogo);
    turbinarPaginaPedidos();
});

async function carregarCatalogoUnificadoSR() {
    let base = [];
    if (typeof carregarProdutosSR === 'function') {
        const carregados = await carregarProdutosSR();
        if (Array.isArray(carregados)) base = carregados;
    } else {
        try {
            const resp = await fetch('produtos.json');
            if (resp.ok) {
                const dados = await resp.json();
                if (Array.isArray(dados)) base = dados;
            }
        } catch {}
    }

    const customSalvos = lerJsonTurboSR('produtosCustomShadowRealm', []);
    const custom = Array.isArray(customSalvos) ? customSalvos : [];

    return [...base, ...custom];
}

// 1. Renderiza produtos criados pelo Admin na vitrine de produtos.html
function renderizarProdutosCustomizadosNaVitrine(catalogo) {
    const pagina = window.location.pathname.toLowerCase();
    if (!pagina.includes('produtos.html')) return;

    const secao = document.querySelector('.destaques');
    if (!secao) return;

    const customSalvos = lerJsonTurboSR('produtosCustomShadowRealm', []);
    const custom = Array.isArray(customSalvos) ? customSalvos : [];

    custom.forEach((prod, index) => {
        const cardId = `customCard${index + 1}`;
        if (document.getElementById(cardId)) return;

        const precoNum = Number(prod.preco) || 0;
        const precoFormatado = precoNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const imgSegura = escTurboSR(prod.imagem || 'imagens/produto.png');
        const nomeSeguro = escTurboSR(prod.nome);
        const descSegura = escTurboSR(prod.descricao || '');

        const card = document.createElement('div');
        card.innerHTML = `
            <img src="${imgSegura}" alt="${nomeSeguro}">
            <p>${nomeSeguro}</p>
            <h3><strong>R$ ${precoFormatado}</strong></h3>
            <button type="button" id="${cardId}">Ver mais</button>
        `;

        const dialog = document.createElement('dialog');
        dialog.id = `modal-${cardId}`;
        dialog.className = 'modalProduto';
        dialog.innerHTML = `
            <div class="modalProduto-conteudo">
                <img src="${imgSegura}" alt="${nomeSeguro}">
                <div class="modalProduto-texto">
                    <h2>- ${nomeSeguro}</h2>
                    <p>${descSegura}</p>
                </div>
            </div>
            <div class="modalProduto-comentarios"></div>
            <footer class="modal-footer">
                <button type="button" id="fechar-${cardId}" class="btn-fechar">Fechar</button>
                <button type="button" class="btn-carrinho" data-nome="${nomeSeguro}" data-preco="${precoNum}" data-imagem="${imgSegura}">+ Carrinho</button>
                <button type="button" class="btn-comprar-agora" data-nome="${nomeSeguro}" data-preco="${precoNum}" data-imagem="${imgSegura}">Comprar Agora</button>
            </footer>
        `;

        secao.appendChild(card);
        secao.appendChild(dialog);

        document.getElementById(cardId)?.addEventListener('click', () => dialog.showModal());
        document.getElementById(`fechar-${cardId}`)?.addEventListener('click', () => dialog.close());
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                dialog.close();
            }
        });

        dialog.querySelector('.btn-carrinho')?.addEventListener('click', function () {
            if (typeof processarCompra === 'function') processarCompra(this, false);
        });
        dialog.querySelector('.btn-comprar-agora')?.addEventListener('click', function () {
            if (typeof processarCompra === 'function') processarCompra(this, true);
        });
    });

    if (typeof atualizarInterfaceEstoque === 'function') {
        atualizarInterfaceEstoque();
    }
}

// 2. Autocomplete instantâneo na barra de pesquisa
function injetarAutocompleteBusca(catalogo) {
    const input = document.getElementById('barraPesquisa');
    if (!input || document.getElementById('sr-autocomplete-box')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'sr-autocomplete-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const dropdown = document.createElement('div');
    dropdown.id = 'sr-autocomplete-box';
    dropdown.className = 'sr-autocomplete-box';
    wrapper.appendChild(dropdown);

    function normalizar(txt) {
        return String(txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    }

    input.addEventListener('input', () => {
        const termo = normalizar(input.value);
        if (termo.length < 1) {
            dropdown.style.display = 'none';
            return;
        }

        const resultados = catalogo.filter(p =>
            normalizar(p.nome).includes(termo) || normalizar(p.categoria).includes(termo)
        ).slice(0, 5);

        if (resultados.length === 0) {
            dropdown.innerHTML = `<div class="sr-auto-vazio">Nenhuma figure encontrada para "${escTurboSR(input.value)}"</div>`;
            dropdown.style.display = 'block';
            return;
        }

        dropdown.innerHTML = resultados.map(p => `
            <a href="produtos.html?busca=${encodeURIComponent(p.nome || '')}" class="sr-auto-item">
                <img src="${escTurboSR(p.imagem || 'imagens/produto.png')}" alt="${escTurboSR(p.nome)}">
                <div class="sr-auto-info">
                    <strong>${escTurboSR(p.nome)}</strong>
                    <small>${escTurboSR(p.categoria || 'Colecionável')}</small>
                </div>
                <span class="sr-auto-preco">R$ ${(Number(p.preco) || 0).toFixed(2).replace('.', ',')}</span>
            </a>
        `).join('');
        dropdown.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// 3. Comparador de Figures lado a lado
function injetarComparadorFigures(catalogo) {
    const cards = document.querySelectorAll('.destaques > div');
    if (!cards.length) return;

    let selecionados = [];

    cards.forEach(card => {
        const nomeEl = card.querySelector('p');
        if (!nomeEl || card.querySelector('.btn-comparar-card')) return;

        const nome = nomeEl.innerText.trim();
        const btnComp = document.createElement('button');
        btnComp.type = 'button';
        btnComp.className = 'btn-comparar-card';
        btnComp.title = 'Comparar figure lado a lado';
        btnComp.textContent = '⚖️';

        btnComp.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = selecionados.indexOf(nome);
            if (idx >= 0) {
                selecionados.splice(idx, 1);
                btnComp.classList.remove('ativo');
            } else {
                if (selecionados.length >= 3) {
                    window.srModal?.alerta('Você pode comparar no máximo <strong>3 figures</strong> por vez!', '- Comparador -', true);
                    return;
                }
                selecionados.push(nome);
                btnComp.classList.add('ativo');
            }
            atualizarBarraComparacao();
        });

        card.appendChild(btnComp);
    });

    const barra = document.createElement('div');
    barra.id = 'sr-barra-comparacao';
    barra.className = 'sr-barra-comparacao';
    document.body.appendChild(barra);

    function atualizarBarraComparacao() {
        if (selecionados.length === 0) {
            barra.classList.remove('visivel');
            return;
        }
        barra.classList.add('visivel');
        const nomesSeguros = selecionados.map(n => escTurboSR(n)).join(' • ');
        barra.innerHTML = `
            <span>⚖️ Comparando <strong>${selecionados.length}/3</strong>: ${nomesSeguros}</span>
            <div style="display:flex; gap:8px; margin:0;">
                <button type="button" class="sr-btn-primario" id="btnAbrirComparadorSR" style="padding:7px 16px; font-size:13px;">Comparar Agora</button>
                <button type="button" class="sr-btn-secundario" id="btnLimparComparadorSR" style="padding:7px 12px; font-size:13px;">Limpar</button>
            </div>
        `;

        const btnLimpar = document.getElementById('btnLimparComparadorSR');
        if (btnLimpar) {
            btnLimpar.onclick = () => {
                selecionados = [];
                document.querySelectorAll('.btn-comparar-card').forEach(b => b.classList.remove('ativo'));
                atualizarBarraComparacao();
            };
        }

        const btnAbrir = document.getElementById('btnAbrirComparadorSR');
        if (btnAbrir) {
            btnAbrir.onclick = () => {
                const itens = selecionados
                    .map(n => catalogo.find(p => String(p.nome || '').toLowerCase() === n.toLowerCase()))
                    .filter(Boolean);

                const html = `
                    <div class="sr-grid-comparacao">
                        ${itens.map(item => {
                            const precoNum = Number(item.preco) || 0;
                            const est = typeof obterEstoque === 'function' ? obterEstoque(item.nome) : (Number(item.estoque) || 3);
                            const parcela = (precoNum / 12).toFixed(2).replace('.', ',');
                            return `
                                <div class="sr-col-comparacao">
                                    <img src="${escTurboSR(item.imagem || 'imagens/produto.png')}" alt="${escTurboSR(item.nome)}">
                                    <h4>${escTurboSR(item.nome)}</h4>
                                    <p><strong>Anime:</strong> ${escTurboSR(item.categoria || 'Geek')}</p>
                                    <p><strong>Preço:</strong> <span style="color:#ffca28;">R$ ${precoNum.toFixed(2).replace('.', ',')}</span></p>
                                    <p><strong>Parcelas:</strong> 12x de R$ ${parcela}</p>
                                    <p><strong>Estoque:</strong> ${est > 0 ? est + ' un.' : 'Esgotado'}</p>
                                    <p style="font-size:12px; color:#bbb;">${escTurboSR((item.descricao || '').slice(0, 130))}...</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                window.srModal?.alerta(html, '- Comparação de Figures ⚖️ -', true);
            };
        }
    }
}

// 4. Vistos Recentemente
function registrarEMostrarVistosRecentemente(catalogo) {
    const CHAVE_VISTOS = 'vistosRecentementeSR';

    function lerVistos() {
        const dados = lerJsonTurboSR(CHAVE_VISTOS, []);
        return Array.isArray(dados) ? dados : [];
    }

    document.querySelectorAll('.destaques > div > button[id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('div');
            const nome = card?.querySelector('p')?.innerText.trim();
            if (!nome) return;

            const vistos = lerVistos().filter(n => String(n).toLowerCase() !== nome.toLowerCase());
            vistos.unshift(nome);
            localStorage.setItem(CHAVE_VISTOS, JSON.stringify(vistos.slice(0, 5)));
        });
    });

    const pagina = window.location.pathname.toLowerCase();
    if (!pagina.includes('index.html') && !pagina.includes('produtos.html') && pagina !== '/') return;

    const vistos = lerVistos();
    if (vistos.length === 0) return;

    const itensVistos = vistos
        .map(nome => catalogo.find(p => String(p.nome || '').toLowerCase() === String(nome).toLowerCase()))
        .filter(Boolean);

    if (itensVistos.length === 0) return;

    const secaoDestaques = document.querySelector('.destaques');
    if (!secaoDestaques || document.getElementById('sr-vistos-recentemente')) return;

    const box = document.createElement('section');
    box.id = 'sr-vistos-recentemente';
    box.className = 'sr-vistos-box';
    box.innerHTML = `
        <h3>👀 Vistos Recentemente por Você</h3>
        <div class="sr-vistos-grid">
            ${itensVistos.map(p => `
                <a href="produtos.html?busca=${encodeURIComponent(p.nome || '')}" class="sr-visto-card">
                    <img src="${escTurboSR(p.imagem || 'imagens/produto.png')}" alt="${escTurboSR(p.nome)}">
                    <div>
                        <strong>${escTurboSR(p.nome)}</strong>
                        <span>R$ ${(Number(p.preco) || 0).toFixed(2).replace('.', ',')}</span>
                    </div>
                </a>
            `).join('')}
        </div>
    `;

    secaoDestaques.insertAdjacentElement('afterend', box);
}

// 5. Melhorias em Meus Pedidos: Comprovante Digital & Comprar Novamente
function turbinarPaginaPedidos() {
    const listaEl = document.getElementById('lista-pedidos-exclusiva');
    if (!listaEl) return;

    function injetarBotoesExtrasPedidos() {
        const pedidosSalvos = lerJsonTurboSR('pedidosShadowRealm', []);
        const pedidos = Array.isArray(pedidosSalvos) ? pedidosSalvos : [];

        document.querySelectorAll('.card-pedido').forEach(card => {
            const acoes = card.querySelector('.acoes-pedido');
            if (!acoes || acoes.querySelector('.btn-comprovante-sr')) return;

            const num = card.id.replace('card-pedido-', '');
            const pedido = pedidos.find(p => String(p.numeroPedido) === String(num));
            if (!pedido) return;

            const btnComprovante = document.createElement('button');
            btnComprovante.type = 'button';
            btnComprovante.className = 'btn-comprovante-sr';
            btnComprovante.textContent = '📄 Comprovante';
            btnComprovante.onclick = () => {
                const linhasItens = (pedido.itens || []).map(i => {
                    const qtd = Number(i.quantidade) || 1;
                    const preco = Number(i.preco) || 0;
                    return `<li>${qtd}x <strong>${escTurboSR(i.nome)}</strong> — R$ ${(preco * qtd).toFixed(2).replace('.', ',')}</li>`;
                }).join('');

                const html = `
                    <div style="text-align:left; background:#121212; border:1px dashed #ffca28; border-radius:12px; padding:16px; font-size:14px;">
                        <p style="margin-bottom:6px;"><strong>Pedido:</strong> #${Number(pedido.numeroPedido)}</p>
                        <p style="margin-bottom:6px;"><strong>Data:</strong> ${escTurboSR(pedido.data || '-')}</p>
                        <p style="margin-bottom:6px;"><strong>Status:</strong> ${escTurboSR(pedido.status || '-')}</p>
                        <p style="margin-bottom:6px;"><strong>Pagamento:</strong> ${escTurboSR(pedido.cartaoUsado || 'Pix')}</p>
                        <p style="margin-bottom:10px;"><strong>Entrega:</strong> ${escTurboSR(pedido.enderecoEntrega || 'Endereço cadastrado')}</p>
                        <hr style="border-color:#333; margin:10px 0;">
                        <ul style="padding-left:18px; margin-bottom:10px;">${linhasItens}</ul>
                        <p style="font-size:17px; color:#ffca28; text-align:right; margin:0;">
                            <strong>Total Pago: R$ ${(Number(pedido.total) || 0).toFixed(2).replace('.', ',')}</strong>
                        </p>
                    </div>
                `;
                window.srModal?.alerta(html, `- Comprovante Pedido #${Number(pedido.numeroPedido)} -`, true);
            };

            const btnRecomprar = document.createElement('button');
            btnRecomprar.type = 'button';
            btnRecomprar.className = 'btn-recomprar-sr';
            btnRecomprar.textContent = '🔄 Comprar Novamente';
            btnRecomprar.onclick = () => {
                const carrinhoSalvo = lerJsonTurboSR('carrinhoShadowRealm', []);
                const carrinho = Array.isArray(carrinhoSalvo) ? carrinhoSalvo : [];
                let adicionados = 0;

                (pedido.itens || []).forEach(item => {
                    const disp = typeof obterEstoque === 'function' ? obterEstoque(item.nome) : 5;
                    if (disp <= 0) return;

                    const existente = carrinho.find(c => c.nome === item.nome);
                    const qtdDesejada = Math.min(disp, Number(item.quantidade) || 1);
                    if (existente) {
                        existente.quantidade = Math.min(disp, (Number(existente.quantidade) || 0) + qtdDesejada);
                    } else {
                        carrinho.push({
                            nome: item.nome,
                            preco: Number(item.preco) || 0,
                            imagem: item.imagem || 'imagens/produto.png',
                            quantidade: qtdDesejada
                        });
                    }
                    adicionados++;
                });

                if (adicionados === 0) {
                    window.srModal?.alerta('Os itens deste pedido estão esgotados no momento.', '- Estoque Indisponível -');
                    return;
                }

                localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
                window.location.href = 'carrinho.html';
            };

            acoes.appendChild(btnComprovante);
            acoes.appendChild(btnRecomprar);
        });
    }

    injetarBotoesExtrasPedidos();
    const obs = new MutationObserver(injetarBotoesExtrasPedidos);
    obs.observe(listaEl, { childList: true });
}