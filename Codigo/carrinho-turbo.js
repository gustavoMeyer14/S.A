// =========================================================
// CARRINHO TURBO - SHADOW REALM STORE
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;

    injetarEstilosCarrinhoTurbo();
    injetarBarraFreteGratis();
    injetarBotaoLimparCarrinho();
    injetarExtrasPagamento();
    injetarSugestoesProdutos();
    configurarAcoesCarrinhoSemReload();

    const observer = new MutationObserver(() => {
        atualizarBarraFrete();
        atualizarParcelasCheckout();
    });

    observer.observe(productsList, { childList: true, subtree: true });

    const priceBreakdown = document.querySelector('.price-breakdown');
    if (priceBreakdown) {
        observer.observe(priceBreakdown, { childList: true, subtree: true });
    }

    atualizarBarraFrete();
    atualizarParcelasCheckout();
});

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
        const dados = JSON.parse(localStorage.getItem('carrinhoShadowRealm'));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function salvarCarrinhoTurbo(carrinho) {
    localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
}

function obterEstoqueTurbo(nomeProduto) {
    if (typeof obterEstoque === 'function') {
        return obterEstoque(nomeProduto);
    }
    try {
        const est = JSON.parse(localStorage.getItem('estoqueShadowRealm'));
        if (est && est[nomeProduto] !== undefined) {
            return Number(est[nomeProduto]);
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
                const subtotalItem = (Number(item.preco) || 0) * (Number(item.quantidade) || 0);

                const card = document.createElement('article');
                card.className = 'product-card';
                card.innerHTML = `
                    <div class="product-thumb">
                        <img src="${item.imagem || 'imagens/logo.png'}" alt="${item.nome}">
                    </div>
                    <div style="flex:1; margin-left: 20px;">
                        <h3 class="product-name" style="margin-left:0;">${item.nome}</h3>
                        <small style="color:#ffca28;">R$ ${subtotalItem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</small>
                        ${temLimite ? `<small style="display:block; margin-top:4px; font-size:12px; color:${atingiuLimite ? '#ff4d4d' : '#aaa'};">Disponível em estoque: ${disponivel} un.</small>` : ''}
                    </div>
                    <div class="quantity-controls">
                        <button type="button" class="btn-plus" onclick="alterarQuantidade(${index}, 1)"
                            ${atingiuLimite ? 'disabled style="opacity:0.35; cursor:not-allowed;" title="Limite máximo de estoque atingido"' : ''}>+</button>
                        <span class="qty-value">${item.quantidade}</span>
                        <button type="button" class="btn-minus" onclick="alterarQuantidade(${index}, -1)">-</button>
                    </div>
                    <button type="button" class="btn-remove" onclick="removerProduto(${index})" title="Remover item" aria-label="Remover ${item.nome}">
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
        const subtotal = carrinho.reduce((acc, item) => acc + ((Number(item.preco) || 0) * (Number(item.quantidade) || 0)), 0);
        const frete = subtotal === 0 ? 0 : (subtotal >= 250 ? 0 : 25);
        const totalFinal = subtotal + frete;

        let html = '';
        if (carrinho.length === 0) {
            html += '<p class="price-item">R$ 0,00</p>';
        } else {
            carrinho.forEach((item, idx) => {
                const prefixo = idx === 0 ? '' : '+ ';
                const sub = (Number(item.preco) || 0) * (Number(item.quantidade) || 0);
                html += `<p class="price-item">${prefixo}R$ ${sub.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
            });
            html += frete === 0
                ? '<p class="price-item" style="color: #00e676;">Frete: GRÁTIS (R$ 0,00)</p>'
                : '<p class="price-item" style="color: #ffca28;">Frete: + R$ 25,00</p>';
        }

        html += '<hr class="summary-divider">';
        html += `<p class="total-final">Valor Total: <span>R$ ${totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>`;
        priceBreakdown.innerHTML = html;

        if (modalTotalValue) {
            modalTotalValue.textContent = `Valor Total: R$ ${totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
    const subtotal = carrinho.reduce((acc, i) => acc + ((Number(i.preco) || 0) * (Number(i.quantidade) || 0)), 0);

    if (subtotal === 0) {
        box.style.display = 'none';
        return;
    }

    box.style.display = 'block';
    const perc = Math.min(100, (subtotal / 250) * 100);
    fill.style.width = `${perc}%`;

    if (subtotal >= 250) {
        texto.style.color = '#00e676';
        texto.innerHTML = '🚚 <strong>Parabéns!</strong> Você desbloqueou <strong>Frete Grátis</strong>!';
    } else {
        const falta = (250 - subtotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

    btn.addEventListener('click', () => {
        const carrinho = lerCarrinhoTurbo();
        if (carrinho.length === 0) {
            window.srModal?.alerta('Seu carrinho já está vazio!', '- Carrinho -');
            return;
        }

        const executarLimpeza = () => {
            localStorage.removeItem('carrinhoShadowRealm');
            reRenderizarCarrinhoSemReload();
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
        const codigoPix = '00020126580014BR.GOV.BCB.PIX0128shadowrealmstore@pix.com5204000053039865802BR5918SHADOW REALM STORE6009JOINVILLE62070503***6304SR26';
        boxPix.innerHTML = `
            <strong style="color:#00e676;">⚡ Pagamento instantâneo via Pix</strong>
            <p style="font-size:12px; color:#bbb; margin-top:4px;">Aprovação imediata! Copie o código abaixo se quiser simular o pagamento:</p>
            <div class="sr-pix-codigo">
                <input type="text" value="${codigoPix}" readonly id="sr-input-pix">
                <button type="button" class="sr-btn-copiar" id="sr-btn-copiar-pix">Copiar</button>
            </div>
        `;
        fieldset.appendChild(boxPix);

        document.getElementById('sr-btn-copiar-pix')?.addEventListener('click', (e) => {
            navigator.clipboard?.writeText(codigoPix);
            e.target.textContent = 'Copiado ✔';
            e.target.style.backgroundColor = '#28a745';
            setTimeout(() => {
                e.target.textContent = 'Copiar';
                e.target.style.backgroundColor = '';
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
    for (let i = 1; i <= 12; i++) {
        const valorParcela = (total / i).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        opcoes += `<option value="${i}x">${i}x de R$ ${valorParcela} sem juros</option>`;
    }
    select.innerHTML = opcoes;
}

async function injetarSugestoesProdutos() {
    const mainCart = document.querySelector('.cart-content');
    if (!mainCart || document.getElementById('sr-sugestoes-carrinho')) return;

    try {
        const resp = await fetch('produtos.json');
        if (!resp.ok) return;
        const produtos = await resp.json();
        if (!Array.isArray(produtos)) return;

        const carrinho = lerCarrinhoTurbo();
        const nomesNoCarrinho = carrinho.map((i) => String(i.nome || '').toLowerCase());
        const sugeridos = produtos.filter((p) => !nomesNoCarrinho.includes(String(p.nome || '').toLowerCase())).slice(0, 4);

        if (sugeridos.length === 0) return;

        const secao = document.createElement('section');
        secao.id = 'sr-sugestoes-carrinho';
        secao.className = 'sr-sugestoes-carrinho';
        secao.innerHTML = `
            <h3>✨ Aproveite e leve também</h3>
            <div class="sr-sugestoes-grid">
                ${sugeridos.map((p) => `
                    <div class="sr-sugestao-card">
                        <img src="${p.imagem}" alt="${p.nome}">
                        <strong>${p.nome}</strong>
                        <span>R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</span>
                        <button type="button" class="btn-add-sugestao" data-nome="${p.nome}" data-preco="${p.preco}" data-imagem="${p.imagem}">
                            + Adicionar
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        mainCart.insertAdjacentElement('afterend', secao);

        secao.querySelectorAll('.btn-add-sugestao').forEach((btn) => {
            btn.addEventListener('click', () => {
                const nome = btn.getAttribute('data-nome');
                const preco = parseFloat(btn.getAttribute('data-preco')) || 0;
                const imagem = btn.getAttribute('data-imagem') || 'imagens/logo.png';

                const atual = lerCarrinhoTurbo();
                const existente = atual.find((i) => i.nome === nome);
                const disp = obterEstoqueTurbo(nome);
                const qtdAtual = existente ? existente.quantidade : 0;

                if (Number.isFinite(disp) && (disp <= 0 || qtdAtual + 1 > disp)) {
                    window.srModal?.alerta(`Estoque insuficiente para <strong>${nome}</strong>.`, '- Estoque -', true);
                    return;
                }

                if (existente) {
                    existente.quantidade += 1;
                } else {
                    atual.push({ nome, preco, imagem, quantidade: 1 });
                }

                salvarCarrinhoTurbo(atual);
                reRenderizarCarrinhoSemReload();
                if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
            });
        });
    } catch (err) {
        console.error('Erro ao carregar sugestões:', err);
    }
}

function configurarAcoesCarrinhoSemReload() {
    window.alterarQuantidade = function (index, delta) {
        const carrinho = lerCarrinhoTurbo();
        if (!carrinho[index]) return;

        if (delta > 0) {
            const disponivel = obterEstoqueTurbo(carrinho[index].nome);
            if (Number.isFinite(disponivel) && carrinho[index].quantidade + delta > disponivel) {
                window.srModal?.alerta(
                    `Limite de estoque atingido! Temos apenas <strong>${disponivel}</strong> unidade(s) de <strong>${carrinho[index].nome}</strong>.`,
                    '- Estoque Máximo -',
                    true
                );
                return;
            }
        }

        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }

        salvarCarrinhoTurbo(carrinho);
        reRenderizarCarrinhoSemReload();
        if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
    };

    window.removerProduto = function (index) {
        const carrinho = lerCarrinhoTurbo();
        if (!carrinho[index]) return;
        carrinho.splice(index, 1);
        salvarCarrinhoTurbo(carrinho);
        reRenderizarCarrinhoSemReload();
        if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
    };
}