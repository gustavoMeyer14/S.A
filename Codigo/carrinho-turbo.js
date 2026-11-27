// =========================================================
// CARRINHO TURBO - SHADOW REALM STORE
// =========================================================

const CONFIG_CARRINHO_SR = {
    chaveCarrinho: 'carrinhoShadowRealm',
    chaveEstoque: 'estoqueShadowRealm',
    limiteFreteGratis: 250,
    valorFretePadrao: 25,
    maxParcelas: 12,
    maxSugestoes: 4,
    codigoPix: '00020126580014BR.GOV.BCB.PIX0128shadowrealmstore@pix.com5204000053039865802BR5918SHADOW REALM STORE6009JOINVILLE62070503***6304SR26'
};

function escaparHtmlCarrinhoSR(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function sincronizarBadgesCarrinhoSR() {
    if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
    if (typeof atualizarContadorCarrinho === 'function') atualizarContadorCarrinho();
}

document.addEventListener('DOMContentLoaded', async () => {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;

    injetarEstilosCarrinhoTurbo();
    injetarBarraFreteGratis();
    injetarBotaoLimparCarrinho();
    injetarExtrasPagamento();
    configurarAcoesCarrinhoSemReload();

    reRenderizarCarrinhoSemReload();
    await injetarSugestoesProdutos();

    if (window.promessaEstoqueSR) {
        try {
            await window.promessaEstoqueSR;
            reRenderizarCarrinhoSemReload();
        } catch {}
    }

    let atualizandoObserver = false;
    const observer = new MutationObserver(() => {
        if (atualizandoObserver) return;
        atualizandoObserver = true;
        try {
            atualizarBarraFrete();
            atualizarParcelasCheckout();
        } finally {
            atualizandoObserver = false;
        }
    });

    observer.observe(productsList, { childList: true, subtree: true });

    const priceBreakdown = document.querySelector('.price-breakdown');
    if (priceBreakdown) {
        observer.observe(priceBreakdown, { childList: true, subtree: true });
    }
});

function formatarMoedaSR(valor) {
    return (Number(valor) || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function injetarEstilosCarrinhoTurbo() {
    if (document.getElementById('estilos-carrinho-turbo')) return;

    const style = document.createElement('style');
    style.id = 'estilos-carrinho-turbo';
    style.textContent = `
        .sr-frete-progresso-box {
            margin: 10px 0 14px 0;
            padding: 10px 12px;
            background: #151515;
            border: 1px solid #333;
            border-radius: 12px;
            text-align: center;
        }
        .sr-frete-progresso-texto {
            font-size: 13px;
            margin-bottom: 6px;
            color: #ffca28;
        }
        .sr-frete-barra-bg {
            width: 100%;
            height: 8px;
            background: #2b2b2b;
            border-radius: 10px;
            overflow: hidden;
        }
        .sr-frete-barra-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #C62828, #ffca28, #00e676);
            transition: width 0.35s ease;
        }
        .btn-limpar-carrinho-sr {
            width: 100%;
            margin-top: 10px;
            padding: 9px;
            background: transparent;
            color: #ff4d4d;
            border: 1px solid #ff4d4d;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            transition: 0.25s;
        }
        .btn-limpar-carrinho-sr:hover {
            background: #ff4d4d;
            color: #ffffff;
        }
        .sr-box-extra-pag {
            width: 100%;
            max-width: 350px;
            margin-top: 8px;
            padding: 12px;
            background: #151515;
            border: 1px solid #C62828;
            border-radius: 12px;
            text-align: left;
            font-size: 13px;
            color: #e0e0e0;
        }
        .sr-pix-codigo {
            display: flex;
            gap: 6px;
            margin-top: 8px;
        }
        .sr-pix-codigo input {
            flex: 1;
            background: #0d0d0d;
            border: 1px solid #444;
            color: #ffca28;
            border-radius: 8px;
            padding: 6px 8px;
            font-size: 12px;
            font-family: monospace;
        }
        .sr-btn-copiar {
            padding: 6px 12px;
            border-radius: 8px;
            border: 1px solid #C62828;
            background: #C62828;
            color: #ffffff;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            transition: 0.2s;
        }
        .sr-btn-copiar:hover {
            background: #8f1d1d;
        }
        .sr-sugestoes-carrinho {
            max-width: 1000px;
            width: 95%;
            margin: 30px auto;
            padding: 25px;
            background: #000000;
            border: 1px solid #C62828;
            border-radius: 20px;
        }
        .sr-sugestoes-carrinho h3 {
            font-size: 22px;
            margin-bottom: 18px;
            color: #ffffff;
        }
        .sr-sugestoes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .sr-sugestao-card {
            background: #1e1e1e;
            border: 1px solid #333;
            border-radius: 14px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            transition: 0.25s;
        }
        .sr-sugestao-card:hover {
            border-color: #C62828;
            transform: translateY(-4px);
        }
        .sr-sugestao-card img {
            width: 95px;
            height: 95px;
            object-fit: cover;
            border-radius: 10px;
            border: 1px solid #C62828;
        }
        .sr-sugestao-card strong {
            font-size: 15px;
            color: #ffffff;
            text-align: center;
        }
        .sr-sugestao-card span {
            color: #ffca28;
            font-weight: bold;
            font-size: 14px;
        }
        .sr-sugestao-card button {
            width: 100%;
            padding: 8px;
            border-radius: 14px;
            background: #C62828;
            color: #ffffff;
            border: 1px solid #C62828;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
        }
        .sr-sugestao-card button:hover {
            background: #151515;
            box-shadow: 0 4px 12px rgba(198, 40, 40, 0.5);
        }
    `;
    document.head.appendChild(style);
}

function lerCarrinhoTurbo() {
    try {
        const dados = JSON.parse(localStorage.getItem(CONFIG_CARRINHO_SR.chaveCarrinho));
        if (!Array.isArray(dados)) return [];
        return dados.map((item) => ({
            ...item,
            nome: String(item?.nome || 'Produto'),
            preco: Math.max(0, Number(item?.preco) || 0),
            quantidade: Math.max(1, parseInt(item?.quantidade, 10) || 1),
            imagem: item?.imagem || 'imagens/logo.png'
        }));
    } catch {
        return [];
    }
}

function salvarCarrinhoTurbo(carrinho) {
    localStorage.setItem(CONFIG_CARRINHO_SR.chaveCarrinho, JSON.stringify(carrinho));
}

function obterEstoqueTurbo(nomeProduto) {
    if (typeof obterEstoque === 'function') {
        const val = Number(obterEstoque(nomeProduto));
        if (Number.isFinite(val)) return val;
    }
    try {
        const est = JSON.parse(localStorage.getItem(CONFIG_CARRINHO_SR.chaveEstoque));
        if (est && typeof est === 'object') {
            if (est[nomeProduto] !== undefined && Number.isFinite(Number(est[nomeProduto]))) {
                return Number(est[nomeProduto]);
            }
            const chaveEncontrada = Object.keys(est).find(
                (k) => k.trim().toLowerCase() === String(nomeProduto || '').trim().toLowerCase()
            );
            if (chaveEncontrada !== undefined && Number.isFinite(Number(est[chaveEncontrada]))) {
                return Number(est[chaveEncontrada]);
            }
        }
    } catch {}
    return Infinity;
}

function reRenderizarCarrinhoSemReload() {
    const productsList = document.getElementById('products-list');
    const priceBreakdown = document.querySelector('.price-breakdown');
    const modalTotalValue = document.querySelector('.modal-total-value');
    const carrinho = lerCarrinhoTurbo();

    if (productsList) {
        if (carrinho.length === 0) {
            productsList.innerHTML = '<p class="empty-cart-msg" style="color: #ffffff; text-align: center;">Seu carrinho está vazio.</p>';
        } else {
            productsList.innerHTML = '';
            carrinho.forEach((item, index) => {
                const disponivel = obterEstoqueTurbo(item.nome);
                const temLimite = Number.isFinite(disponivel);
                const atingiuLimite = temLimite && item.quantidade >= disponivel;
                const subtotalItem = item.preco * item.quantidade;
                const nomeSeguro = escaparHtmlCarrinhoSR(item.nome);
                const imgSegura = escaparHtmlCarrinhoSR(item.imagem);

                const card = document.createElement('article');
                card.className = 'product-card';
                card.dataset.index = String(index);
                card.innerHTML = `
                    <div class="product-thumb">
                        <img src="${imgSegura}" alt="${nomeSeguro}">
                    </div>
                    <div style="flex:1; margin-left: 20px;">
                        <h3 class="product-name" style="margin-left:0;">${nomeSeguro}</h3>
                        <small style="color:#ffca28;">R$ ${formatarMoedaSR(subtotalItem)}</small>
                        ${temLimite ? `<small style="display:block; margin-top:4px; font-size:12px; color:${atingiuLimite ? '#ff4d4d' : '#aaa'};">Disponível em estoque: ${disponivel} un.</small>` : ''}
                    </div>
                    <div class="quantity-controls">
                        <button type="button" class="btn-plus" data-index="${index}" data-delta="1"
                            aria-label="Aumentar quantidade de ${nomeSeguro}"
                            ${atingiuLimite ? 'disabled style="opacity:0.35; cursor:not-allowed;" title="Limite máximo de estoque atingido"' : ''}>+</button>
                        <span class="qty-value">${item.quantidade}</span>
                        <button type="button" class="btn-minus" data-index="${index}" data-delta="-1"
                            aria-label="Diminuir quantidade de ${nomeSeguro}">-</button>
                    </div>
                    <button type="button" class="btn-remove" data-index="${index}" title="Remover item" aria-label="Remover ${nomeSeguro}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                `;
                productsList.appendChild(card);
            });
        }
    }

    if (priceBreakdown) {
        const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        const frete = subtotal === 0 ? 0 : (subtotal >= CONFIG_CARRINHO_SR.limiteFreteGratis ? 0 : CONFIG_CARRINHO_SR.valorFretePadrao);
        const totalFinal = subtotal + frete;

        let html = '';
        if (carrinho.length === 0) {
            html += '<p class="price-item">R$ 0,00</p>';
        } else {
            carrinho.forEach((item, idx) => {
                const prefixo = idx === 0 ? '' : '+ ';
                const sub = item.preco * item.quantidade;
                html += `<p class="price-item">${prefixo}R$ ${formatarMoedaSR(sub)}</p>`;
            });
            html += frete === 0
                ? '<p class="price-item" style="color: #00e676;">Frete: GRÁTIS (R$ 0,00)</p>'
                : `<p class="price-item" style="color: #ffca28;">Frete: + R$ ${formatarMoedaSR(frete)}</p>`;
        }

        html += '<hr class="summary-divider">';
        html += `<p class="total-final">Valor Total: <span>R$ ${formatarMoedaSR(totalFinal)}</span></p>`;
        priceBreakdown.innerHTML = html;

        if (modalTotalValue) {
            modalTotalValue.textContent = `Valor Total: R$ ${formatarMoedaSR(totalFinal)}`;
        }
    }

    atualizarBarraFrete();
    atualizarParcelasCheckout();
}

function injetarBarraFreteGratis() {
    const resumo = document.querySelector('.checkout-summary');
    if (!resumo || document.getElementById('sr-frete-progresso-box')) return;

    const avisoAntigo = document.getElementById('aviso-frete-gratis');
    if (avisoAntigo) avisoAntigo.style.display = 'none';

    const box = document.createElement('div');
    box.id = 'sr-frete-progresso-box';
    box.className = 'sr-frete-progresso-box';
    box.innerHTML = `
        <div class="sr-frete-progresso-texto" id="sr-frete-progresso-texto"></div>
        <div class="sr-frete-barra-bg">
            <div class="sr-frete-barra-fill" id="sr-frete-barra-fill"></div>
        </div>
    `;

    const couponField = resumo.querySelector('.coupon-field');
    if (couponField) {
        resumo.insertBefore(box, couponField);
    } else {
        resumo.appendChild(box);
    }

    atualizarBarraFrete();
}

function atualizarBarraFrete() {
    const box = document.getElementById('sr-frete-progresso-box');
    const texto = document.getElementById('sr-frete-progresso-texto');
    const fill = document.getElementById('sr-frete-barra-fill');
    const avisoAntigo = document.getElementById('aviso-frete-gratis');
    if (avisoAntigo) avisoAntigo.style.display = 'none';
    if (!box || !texto || !fill) return;

    const carrinho = lerCarrinhoTurbo();
    const subtotal = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0);

    if (subtotal === 0) {
        box.style.display = 'none';
        return;
    }

    box.style.display = 'block';
    const perc = Math.min(100, (subtotal / CONFIG_CARRINHO_SR.limiteFreteGratis) * 100);
    fill.style.width = `${perc}%`;

    if (subtotal >= CONFIG_CARRINHO_SR.limiteFreteGratis) {
        texto.style.color = '#00e676';
        texto.innerHTML = '🚚 <strong>Parabéns!</strong> Você desbloqueou <strong>Frete Grátis</strong>!';
    } else {
        const falta = formatarMoedaSR(CONFIG_CARRINHO_SR.limiteFreteGratis - subtotal);
        texto.style.color = '#ffca28';
        texto.innerHTML = `🚚 Falta <strong>R$ ${falta}</strong> para ganhar <strong>Frete Grátis</strong>!`;
    }
}

function injetarBotaoLimparCarrinho() {
    const resumo = document.querySelector('.checkout-summary');
    if (!resumo || document.getElementById('btn-limpar-carrinho-sr')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-limpar-carrinho-sr';
    btn.className = 'btn-limpar-carrinho-sr';
    btn.textContent = '🗑️ Esvaziar Carrinho';

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const carrinho = lerCarrinhoTurbo();
        if (carrinho.length === 0) {
            window.srModal?.alerta('Seu carrinho já está vazio!', '- Carrinho -');
            return;
        }

        const executarLimpeza = () => {
            localStorage.removeItem(CONFIG_CARRINHO_SR.chaveCarrinho);
            reRenderizarCarrinhoSemReload();
            sincronizarBadgesCarrinhoSR();
        };

        if (window.srModal) {
            window.srModal.confirmar(
                'Tem certeza que deseja remover <strong>todos</strong> os produtos do seu carrinho?',
                executarLimpeza,
                '- Esvaziar Carrinho -',
                true
            );
        } else {
            executarLimpeza();
        }
    });

    resumo.appendChild(btn);
}

function injetarExtrasPagamento() {
    const fieldset = document.querySelector('.payment-methods');
    const radios = document.querySelectorAll('input[name="payment-group"]');
    if (!fieldset || !radios.length) return;

    if (!document.getElementById('sr-box-pix')) {
        const boxPix = document.createElement('div');
        boxPix.id = 'sr-box-pix';
        boxPix.className = 'sr-box-extra-pag';
        const codigoPix = CONFIG_CARRINHO_SR.codigoPix;
        boxPix.innerHTML = `
            <strong style="color:#00e676;">⚡ Pagamento instantâneo via Pix</strong>
            <p style="font-size:12px; color:#bbb; margin-top:4px;">Aprovação imediata! Copie o código abaixo se quiser simular o pagamento:</p>
            <div class="sr-pix-codigo">
                <input type="text" value="${escaparHtmlCarrinhoSR(codigoPix)}" readonly id="sr-input-pix">
                <button type="button" class="sr-btn-copiar" id="sr-btn-copiar-pix">Copiar</button>
            </div>
        `;
        fieldset.appendChild(boxPix);

        document.getElementById('sr-btn-copiar-pix')?.addEventListener('click', async (e) => {
            const btnCopiar = e.currentTarget;
            let copiado = false;
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(codigoPix);
                    copiado = true;
                }
            } catch {}

            if (!copiado) {
                const inputPix = document.getElementById('sr-input-pix');
                if (inputPix) {
                    inputPix.select();
                    inputPix.setSelectionRange(0, 99999);
                    try {
                        copiado = document.execCommand('copy');
                    } catch {}
                }
            }

            btnCopiar.textContent = copiado ? 'Copiado ✔' : 'Selecionado';
            btnCopiar.style.backgroundColor = '#28a745';
            setTimeout(() => {
                btnCopiar.textContent = 'Copiar';
                btnCopiar.style.backgroundColor = '';
            }, 2000);
        });
    }

    if (!document.getElementById('sr-box-parcelas')) {
        const boxParcelas = document.createElement('div');
        boxParcelas.id = 'sr-box-parcelas';
        boxParcelas.className = 'sr-box-extra-pag';
        boxParcelas.style.display = 'none';
        boxParcelas.innerHTML = `
            <label for="sr-select-parcelas" style="display:block; margin-bottom:6px; color:#ffca28; font-weight:bold;">Número de parcelas (sem juros):</label>
            <select id="sr-select-parcelas" style="width:100%; height:36px; margin:0; padding:4px 8px; border-radius:8px; background:#222; color:#fff; border:1px solid #C62828; font-size:14px;"></select>
        `;
        fieldset.appendChild(boxParcelas);
    }

    function atualizarVisibilidadeMetodo() {
        const boxPixEl = document.getElementById('sr-box-pix');
        const boxParcEl = document.getElementById('sr-box-parcelas');
        const selecionado = document.querySelector('input[name="payment-group"]:checked')?.value || 'pix';
        if (boxPixEl) boxPixEl.style.display = selecionado === 'pix' ? 'block' : 'none';
        if (boxParcEl) boxParcEl.style.display = selecionado === 'parcelado' ? 'block' : 'none';
        atualizarParcelasCheckout();
    }

    radios.forEach((r) => r.addEventListener('change', atualizarVisibilidadeMetodo));
    atualizarVisibilidadeMetodo();
}

function atualizarParcelasCheckout() {
    const select = document.getElementById('sr-select-parcelas');
    const modalTotal = document.querySelector('.modal-total-value');
    if (!select || !modalTotal) return;

    const textoValor = modalTotal.textContent.replace(/[^\d,]/g, '').replace(',', '.');
    const total = parseFloat(textoValor) || 0;

    if (total <= 0) {
        select.innerHTML = '<option>R$ 0,00</option>';
        return;
    }

    let opcoes = '';
    for (let i = 1; i <= CONFIG_CARRINHO_SR.maxParcelas; i++) {
        opcoes += `<option value="${i}x">${i}x de R$ ${formatarMoedaSR(total / i)} sem juros</option>`;
    }
    select.innerHTML = opcoes;
}

async function injetarSugestoesProdutos() {
    const mainCart = document.querySelector('.cart-content');
    if (!mainCart || document.getElementById('sr-sugestoes-carrinho')) return;

    try {
        let produtos = [];
        if (typeof carregarProdutosSR === 'function') {
            produtos = await carregarProdutosSR();
        } else {
            const resp = await fetch('produtos.json');
            if (resp.ok) produtos = await resp.json();
        }
        if (!Array.isArray(produtos)) return;

        const carrinho = lerCarrinhoTurbo();
        const nomesNoCarrinho = carrinho.map((i) => String(i.nome || '').toLowerCase());
        const sugeridos = produtos
            .filter((p) => !nomesNoCarrinho.includes(String(p.nome || '').toLowerCase()))
            .slice(0, CONFIG_CARRINHO_SR.maxSugestoes);

        if (sugeridos.length === 0) return;

        const secao = document.createElement('section');
        secao.id = 'sr-sugestoes-carrinho';
        secao.className = 'sr-sugestoes-carrinho';
        secao.innerHTML = `
            <h3>✨ Aproveite e leve também</h3>
            <div class="sr-sugestoes-grid">
                ${sugeridos.map((p) => {
                    const nomeSeg = escaparHtmlCarrinhoSR(p.nome);
                    const imgSeg = escaparHtmlCarrinhoSR(p.imagem || 'imagens/logo.png');
                    const precoSeg = Number(p.preco) || 0;
                    return `
                        <div class="sr-sugestao-card">
                            <img src="${imgSeg}" alt="${nomeSeg}">
                            <strong>${nomeSeg}</strong>
                            <span>R$ ${formatarMoedaSR(precoSeg)}</span>
                            <button type="button" class="btn-add-sugestao" data-nome="${nomeSeg}" data-preco="${precoSeg}" data-imagem="${imgSeg}">
                                + Adicionar
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        mainCart.insertAdjacentElement('afterend', secao);

        secao.querySelectorAll('.btn-add-sugestao').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const nome = btn.getAttribute('data-nome');
                const preco = parseFloat(btn.getAttribute('data-preco')) || 0;
                const imagem = btn.getAttribute('data-imagem') || 'imagens/logo.png';

                const atual = lerCarrinhoTurbo();
                const existente = atual.find((i) => i.nome === nome);
                const disp = obterEstoqueTurbo(nome);
                const qtdAtual = existente ? existente.quantidade : 0;

                if (Number.isFinite(disp) && (disp <= 0 || qtdAtual + 1 > disp)) {
                    window.srModal?.alerta(`Estoque insuficiente para <strong>${escaparHtmlCarrinhoSR(nome)}</strong>.`, '- Estoque -', true);
                    return;
                }

                if (existente) {
                    existente.quantidade += 1;
                } else {
                    atual.push({ nome, preco, imagem, quantidade: 1 });
                }

                salvarCarrinhoTurbo(atual);
                reRenderizarCarrinhoSemReload();
                sincronizarBadgesCarrinhoSR();
            });
        });
    } catch (err) {
        console.error('Erro ao carregar sugestões:', err);
    }
}

function resolverIndiceCardCarrinho(alvo) {
    const attrIdx = alvo?.getAttribute('data-index');
    if (attrIdx !== null && attrIdx !== '' && !Number.isNaN(parseInt(attrIdx, 10))) {
        return parseInt(attrIdx, 10);
    }

    const card = alvo?.closest('.product-card');
    const productsList = document.getElementById('products-list');
    if (card && productsList) {
        const cards = Array.from(productsList.querySelectorAll('.product-card'));
        const pos = cards.indexOf(card);
        if (pos >= 0) return pos;
    }
    return -1;
}

function configurarAcoesCarrinhoSemReload() {
    window.alterarQuantidade = function (index, delta) {
        const carrinho = lerCarrinhoTurbo();
        if (!carrinho[index]) return;

        const passo = Number(delta) || 0;
        if (passo > 0) {
            const disponivel = obterEstoqueTurbo(carrinho[index].nome);
            if (Number.isFinite(disponivel) && carrinho[index].quantidade + passo > disponivel) {
                window.srModal?.alerta(
                    `Limite de estoque atingido! Temos apenas <strong>${disponivel}</strong> unidade(s) de <strong>${escaparHtmlCarrinhoSR(carrinho[index].nome)}</strong>.`,
                    '- Estoque Máximo -',
                    true
                );
                return;
            }
        }

        carrinho[index].quantidade += passo;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }

        salvarCarrinhoTurbo(carrinho);
        reRenderizarCarrinhoSemReload();
        sincronizarBadgesCarrinhoSR();
    };

    window.removerProduto = function (index) {
        const carrinho = lerCarrinhoTurbo();
        if (!carrinho[index]) return;
        carrinho.splice(index, 1);
        salvarCarrinhoTurbo(carrinho);
        reRenderizarCarrinhoSemReload();
        sincronizarBadgesCarrinhoSR();
    };

    if (document.body.dataset.srCarrinhoCapturaAtiva !== 'true') {
        document.body.dataset.srCarrinhoCapturaAtiva = 'true';
        document.addEventListener('click', (e) => {
            const productsList = document.getElementById('products-list');
            if (!productsList || !productsList.contains(e.target)) return;

            const btnPlus = e.target.closest('.btn-plus');
            const btnMinus = e.target.closest('.btn-minus');
            const btnQtd = btnPlus || btnMinus;

            if (btnQtd) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const idx = resolverIndiceCardCarrinho(btnQtd);
                const rawDelta = btnQtd.getAttribute('data-delta');
                const delta = rawDelta !== null ? parseInt(rawDelta, 10) : (btnPlus ? 1 : -1);
                if (idx >= 0 && !Number.isNaN(delta)) {
                    window.alterarQuantidade(idx, delta);
                }
                return;
            }

            const btnRem = e.target.closest('.btn-remove');
            if (btnRem) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const idx = resolverIndiceCardCarrinho(btnRem);
                if (idx >= 0) {
                    window.removerProduto(idx);
                }
            }
        }, true);
    }
}