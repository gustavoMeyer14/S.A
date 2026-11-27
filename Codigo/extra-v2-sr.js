
(function () {
    'use strict';

    const CHAVES = {
        temaCrimson: 'sr_ext_tema_crimson',
        reservaCarrinho: 'sr_ext_reserva_fim',
        giftCards: 'sr_ext_gift_cards',
        giftAplicado: 'sr_ext_gift_aplicado',
        provaSocialSilenciada: 'sr_ext_social_off',
        visitasCatalogo: 'sr_ext_visitas_catalogo'
    };

    // ----------------------------------------------------------------------
    // 0. REMOÇÃO NÃO INTRUSIVA DO COMPARADOR DE FIGURES
    // ----------------------------------------------------------------------
    function removerComparadorFigures() {
        try {
            localStorage.removeItem('comparadorShadowRealm');
            sessionStorage.removeItem('comparadorShadowRealm');
        } catch {}

        const limparElementos = () => {
            document.querySelectorAll('.btn-comparar-card, .sr-barra-comparacao').forEach((el) => el.remove());
        };

        limparElementos();
        new MutationObserver(limparElementos).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // ----------------------------------------------------------------------
    // 1. ESTILOS ISOLADOS (PREFIXO sr-ext-)
    // ----------------------------------------------------------------------
    function injetarEstilosExtras() {
        if (document.getElementById('sr-ext-estilos')) return;
        const style = document.createElement('style');
        style.id = 'sr-ext-estilos';
        style.textContent = `
            /* Oculta definitivamente qualquer resquício do Comparador de Figures */
            .btn-comparar-card,
            .sr-barra-comparacao {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }

            .sr-ext-fab {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: #141414;
                color: #ffffff;
                border: 2px solid #00e676;
                font-size: 19px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.85);
                transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
                padding: 0;
                margin: 0;
            }
            .sr-ext-fab:hover {
                background: #C62828;
                border-color: #ffca28;
                transform: scale(1.1);
            }
            /* Quick Buy sobe para top: 102px ocupando o lugar vago do comparador */
            .sr-ext-quickbuy {
                position: absolute;
                top: 102px;
                left: 10px;
                width: 36px !important;
                height: 36px !important;
                border-radius: 50% !important;
                background: rgba(20, 20, 20, 0.92) !important;
                border: 1px solid #00e676 !important;
                color: #00e676 !important;
                font-size: 16px !important;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 5;
                padding: 0;
                transition: transform 0.2s ease, background-color 0.2s ease;
            }
            .sr-ext-quickbuy:hover {
                background: #00e676 !important;
                color: #000000 !important;
                transform: scale(1.12);
            }
            .sr-ext-zoom-wrap {
                overflow: hidden;
                border-radius: 12px;
                position: relative;
                cursor: zoom-in;
            }
            .sr-ext-zoom-wrap img {
                transition: transform 0.15s ease-out;
                transform-origin: center center;
            }
            .sr-ext-parcelas-details {
                margin: 10px 20px;
                background: #141414;
                border: 1px solid #333;
                border-radius: 10px;
                padding: 10px 14px;
                text-align: left;
                font-size: 13px;
            }
            .sr-ext-parcelas-details summary {
                cursor: pointer;
                font-weight: bold;
                color: #ffca28;
            }
            .sr-ext-parcelas-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4px 12px;
                margin-top: 8px;
                color: #ddd;
                font-size: 12px;
            }
            dialog#sr-ext-dialog {
                background: #141414;
                color: #ffffff;
                border: 2px solid #C62828;
                border-radius: 18px;
                padding: 24px;
                max-width: 520px;
                width: 92%;
                box-shadow: 0 14px 40px rgba(0, 0, 0, 0.92);
                text-align: center;
            }
            dialog#sr-ext-dialog::backdrop {
                background: rgba(0, 0, 0, 0.82);
                backdrop-filter: blur(2px);
            }
            .sr-ext-titulo {
                color: #ffca28;
                font-size: 21px;
                margin: 0 0 12px 0;
            }
            .sr-ext-btn {
                background: #C62828;
                color: #ffffff;
                border: 1px solid #C62828;
                border-radius: 20px;
                padding: 9px 18px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                margin: 4px;
                transition: 0.2s;
            }
            .sr-ext-btn:hover {
                background: #1b1b1b;
                box-shadow: 0 0 12px rgba(198, 40, 40, 0.7);
            }
            .sr-ext-btn-sec {
                background: #242424;
                color: #e0e0e0;
                border: 1px solid #555;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                margin: 4px;
            }
            .sr-ext-btn-sec:hover {
                background: #333;
            }
            .sr-ext-chat-box {
                background: #101010;
                border: 1px solid #333;
                border-radius: 12px;
                padding: 12px;
                height: 210px;
                overflow-y: auto;
                text-align: left;
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 10px;
                font-size: 13px;
            }
            .sr-ext-msg-bot {
                background: #1f1f1f;
                border-left: 3px solid #C62828;
                padding: 8px 10px;
                border-radius: 8px;
                color: #f0f0f0;
            }
            .sr-ext-msg-user {
                background: #2b1414;
                border-right: 3px solid #ffca28;
                padding: 8px 10px;
                border-radius: 8px;
                color: #ffca28;
                align-self: flex-end;
                max-width: 85%;
            }
            .sr-ext-chat-chips {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                justify-content: center;
                margin-bottom: 10px;
            }
            .sr-ext-chip {
                background: #222;
                color: #fff;
                border: 1px solid #C62828;
                border-radius: 14px;
                padding: 5px 10px;
                font-size: 12px;
                cursor: pointer;
            }
            .sr-ext-chip:hover {
                background: #C62828;
            }
            .sr-ext-grid-badges {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
                gap: 10px;
                margin: 12px 0;
                text-align: left;
            }
            .sr-ext-badge-card {
                background: #1b1b1b;
                border: 1px solid #333;
                border-radius: 12px;
                padding: 12px;
                opacity: 0.5;
            }
            .sr-ext-badge-card.desbloqueada {
                border-color: #ffca28;
                opacity: 1;
                box-shadow: 0 4px 14px rgba(255, 202, 40, 0.15);
            }
            .sr-ext-estante-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                gap: 12px;
                max-height: 300px;
                overflow-y: auto;
                margin: 12px 0;
            }
            .sr-ext-estante-item {
                background: #1c1c1c;
                border: 1px solid #C62828;
                border-radius: 12px;
                padding: 10px;
                text-align: center;
            }
            .sr-ext-estante-item img {
                width: 72px;
                height: 72px;
                object-fit: cover;
                border-radius: 10px;
                margin-bottom: 6px;
                border: 1px solid #ffca28;
            }
            .sr-ext-gift-ticket {
                background: linear-gradient(135deg, #2a0a0a 0%, #141414 100%);
                border: 2px dashed #ffca28;
                border-radius: 14px;
                padding: 16px;
                margin: 12px 0;
                text-align: left;
            }
            .sr-ext-input {
                width: 92% !important;
                padding: 9px 12px !important;
                margin: 6px 0 !important;
                border-radius: 10px !important;
                background: #0d0d0d !important;
                color: #ffffff !important;
                border: 1px solid #C62828 !important;
                font-size: 13px !important;
                text-align: left !important;
                height: auto !important;
            }
            #sr-ext-social-popup {
                position: fixed;
                bottom: 22px;
                left: 86px;
                background: rgba(20, 20, 20, 0.95);
                border: 1px solid #C62828;
                border-left: 4px solid #ffca28;
                color: #f0f0f0;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 12px;
                max-width: 280px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.85);
                z-index: 9989;
                display: none;
                align-items: center;
                gap: 10px;
            }
            body.sr-ext-crimson-mode {
                background: radial-gradient(circle at top, #2a0808 0%, #090909 65%) !important;
            }
            body.sr-ext-crimson-mode .destaques > div,
            body.sr-ext-crimson-mode .checkout-summary,
            body.sr-ext-crimson-mode .product-card {
                border-color: #ffca28 !important;
            }
            @media (max-width: 700px) {
                #sr-ext-social-popup {
                    display: none !important;
                }
                .sr-ext-fab {
                    width: 42px;
                    height: 42px;
                    font-size: 17px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    function abrirModalExtra(titulo, corpoHTML, botoesHTML) {
        injetarEstilosExtras();
        let dlg = document.getElementById('sr-ext-dialog');
        if (!dlg) {
            dlg = document.createElement('dialog');
            dlg.id = 'sr-ext-dialog';
            document.body.appendChild(dlg);
            dlg.addEventListener('click', (e) => {
                if (e.target === dlg) dlg.close();
            });
        }
        dlg.innerHTML = `
            <h2 class="sr-ext-titulo">${titulo}</h2>
            <div>${corpoHTML}</div>
            <div style="margin-top: 14px;">${botoesHTML}</div>
        `;
        if (dlg.open) dlg.close();
        dlg.showModal();
        return dlg;
    }

    function avisarExtra(msg) {
        if (window.srModal && typeof window.srModal.toast === 'function') {
            window.srModal.toast(msg);
            return;
        }
        const el = document.createElement('div');
        el.textContent = msg;
        el.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #141414; color: #fff; border: 2px solid #00e676;
            padding: 10px 20px; border-radius: 12px; font-weight: bold;
            font-size: 14px; z-index: 1000004; box-shadow: 0 8px 25px rgba(0,0,0,0.85);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    // ----------------------------------------------------------------------
    // 2. ACOPLA OS 5 NOVOS BOTÕES NO DOCK ESQUERDO EXISTENTE
    // ----------------------------------------------------------------------
    function acoplarBotoesNoDock() {
        injetarEstilosExtras();
        let dock = document.getElementById('sr-nf-dock');

        if (!dock) {
            dock = document.createElement('div');
            dock.id = 'sr-ext-dock-proprio';
            dock.style.cssText = 'position:fixed; bottom:22px; left:22px; display:flex; flex-direction:column; gap:8px; z-index:9991;';
            document.body.appendChild(dock);
        }

        const novosBotoes = [
            { id: 'sr-ext-btn-bot', icone: '💬', titulo: 'Assistente Virtual Geek', acao: abrirAssistenteGeek },
            { id: 'sr-ext-btn-gift', icone: '🎟️', titulo: 'Vale-Presente Digital (Gift Card)', acao: abrirPainelGiftCard },
            { id: 'sr-ext-btn-badges', icone: '🏅', titulo: 'Conquistas & Medalhas', acao: abrirPainelConquistas },
            { id: 'sr-ext-btn-estante', icone: '🗿', titulo: 'Minha Estante de Colecionador', acao: abrirMinhaEstante },
            { id: 'sr-ext-btn-tema', icone: '🎨', titulo: 'Alternar Tema Crimson / Dark', acao: alternarTemaVisual }
        ];

        novosBotoes.forEach((b) => {
            if (document.getElementById(b.id)) return;
            const btn = document.createElement('button');
            btn.id = b.id;
            btn.type = 'button';
            btn.className = 'sr-ext-fab';
            btn.title = b.titulo;
            btn.textContent = b.icone;
            btn.addEventListener('click', b.acao);
            dock.appendChild(btn);
        });
    }

    // ----------------------------------------------------------------------
    // 3. COMPRA EM 1 CLIQUE (⚡) NOS CARDS DA VITRINE
    // ----------------------------------------------------------------------
    function ativarQuickBuy() {
        injetarEstilosExtras();

        function processarCards() {
            document.querySelectorAll('.destaques > div').forEach((card) => {
                if (card.querySelector('.sr-ext-quickbuy')) return;

                const nome = card.querySelector('p')?.innerText.trim();
                const precoTxt = card.querySelector('h3')?.innerText || '0';
                const preco = parseFloat(precoTxt.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                const imagem = card.querySelector('img')?.getAttribute('src') || 'imagens/produto.png';
                if (!nome || preco <= 0) return;

                const btnQuick = document.createElement('button');
                btnQuick.type = 'button';
                btnQuick.className = 'sr-ext-quickbuy';
                btnQuick.title = 'Compra em 1 Clique (Ir direto para Checkout)';
                btnQuick.textContent = '⚡';

                btnQuick.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (localStorage.getItem('usuarioLogado') !== 'true') {
                        avisarExtra('Faça login para usar a Compra em 1 Clique!');
                        setTimeout(() => { window.location.href = 'cliente.html'; }, 1000);
                        return;
                    }
                    if (typeof window.obterEstoque === 'function' && window.obterEstoque(nome) <= 0) {
                        avisarExtra(`❌ "${nome}" está esgotado no momento.`);
                        return;
                    }

                    const carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];
                    const existente = carrinho.find((c) => c.nome === nome);
                    if (existente) existente.quantidade += 1;
                    else carrinho.push({ nome, preco, imagem, quantidade: 1 });

                    localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
                    window.location.href = 'carrinho.html#tela-pagamento';
                });

                card.appendChild(btnQuick);
            });
        }

        processarCards();
        const vitrine = document.querySelector('.destaques');
        if (vitrine) {
            new MutationObserver(processarCards).observe(vitrine, { childList: true });
        }
    }

    // ----------------------------------------------------------------------
    // 4. LUPA DE ZOOM NA IMAGEM + SIMULADOR DE PARCELAS (1x a 12x) NOS MODAIS
    // ----------------------------------------------------------------------
    function ativarZoomEParcelas() {
        injetarEstilosExtras();

        function processarModais() {
            document.querySelectorAll('dialog.modalProduto').forEach((modal) => {
                const footer = modal.querySelector('.modal-footer');
                const btnAdd = modal.querySelector('.btn-carrinho');
                if (!footer || !btnAdd) return;

                const precoProd = parseFloat(btnAdd.getAttribute('data-preco')) || 0;

                // Zoom na foto
                const imgModal = modal.querySelector('.modalProduto-conteudo > img');
                if (imgModal && !imgModal.parentElement.classList.contains('sr-ext-zoom-wrap')) {
                    const wrap = document.createElement('div');
                    wrap.className = 'sr-ext-zoom-wrap';
                    imgModal.parentNode.insertBefore(wrap, imgModal);
                    wrap.appendChild(imgModal);

                    wrap.addEventListener('mousemove', (e) => {
                        const rect = wrap.getBoundingClientRect();
                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                        imgModal.style.transformOrigin = `${x}% ${y}%`;
                        imgModal.style.transform = 'scale(1.65)';
                    });
                    wrap.addEventListener('mouseleave', () => {
                        imgModal.style.transform = 'scale(1)';
                    });
                }

                // Simulador de parcelas + desconto Pix
                if (precoProd > 0 && !modal.querySelector('.sr-ext-parcelas-details')) {
                    const pixValor = (precoProd * 0.95).toFixed(2).replace('.', ',');
                    let linhas = '';
                    for (let p = 1; p <= 12; p++) {
                        const valP = (precoProd / p).toFixed(2).replace('.', ',');
                        linhas += `<span>${p}x de R$ ${valP} s/ juros</span>`;
                    }
                    const details = document.createElement('details');
                    details.className = 'sr-ext-parcelas-details';
                    details.innerHTML = `
                        <summary>💳 Ver parcelas (1x a 12x) • Pix: R$ ${pixValor} (5% OFF)</summary>
                        <div class="sr-ext-parcelas-grid">${linhas}</div>
                    `;
                    footer.insertAdjacentElement('beforebegin', details);
                }
            });
        }

        processarModais();
        const vitrine = document.querySelector('.destaques');
        if (vitrine) {
            new MutationObserver(processarModais).observe(vitrine, { childList: true });
        }
    }

    // ----------------------------------------------------------------------
    // 5. RESERVA 15 MIN + RESGATE GIFT CARD + ECONOMIA NO CARRINHO
    // ----------------------------------------------------------------------
    function inicializarExtrasCarrinho() {
        const resumo = document.querySelector('.checkout-summary');
        if (!resumo) return;

        // A) Cronômetro de Reserva (15 min)
        const carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];
        if (carrinho.length > 0 && !document.getElementById('sr-ext-timer-reserva')) {
            let fim = Number(sessionStorage.getItem(CHAVES.reservaCarrinho));
            if (!fim || fim <= Date.now()) {
                fim = Date.now() + 15 * 60 * 1000;
                sessionStorage.setItem(CHAVES.reservaCarrinho, String(fim));
            }

            const banner = document.createElement('div');
            banner.id = 'sr-ext-timer-reserva';
            banner.style.cssText = 'background:#241212; border:1px solid #C62828; border-radius:10px; padding:8px 12px; margin-bottom:12px; font-size:13px; color:#ffca28; text-align:center;';
            resumo.prepend(banner);

            const atualizarTimer = () => {
                const rest = Math.max(0, fim - Date.now());
                const min = String(Math.floor(rest / 60000)).padStart(2, '0');
                const seg = String(Math.floor((rest % 60000) / 1000)).padStart(2, '0');
                banner.innerHTML = rest > 0
                    ? `⏳ Suas figures estão reservadas por <strong>${min}:${seg}</strong>`
                    : '⚠️ Tempo de reserva expirado! Finalize para garantir o estoque.';
            };
            atualizarTimer();
            setInterval(atualizarTimer, 1000);
        }

        // B) Campo para aplicar Vale-Presente (GIFT-XXXX)
        if (!document.getElementById('sr-ext-gift-box-carrinho')) {
            injetarEstilosExtras();
            const box = document.createElement('div');
            box.id = 'sr-ext-gift-box-carrinho';
            box.style.cssText = 'margin:10px 0; padding:10px; background:#151515; border:1px solid #333; border-radius:10px; text-align:center;';
            box.innerHTML = `
                <label style="display:block; font-size:12px; color:#ffca28; font-weight:bold; margin-bottom:6px;">🎟️ Possui Vale-Presente (GIFT-XXXX)?</label>
                <div style="display:flex; gap:6px; justify-content:center;">
                    <input type="text" id="sr-ext-input-gift" placeholder="Ex: GIFT-A1B2" style="width:140px; height:34px; padding:0 8px; border-radius:8px; background:#0d0d0d; color:#fff; border:1px solid #C62828; font-size:12px; margin:0;">
                    <button type="button" id="sr-ext-aplicar-gift" class="sr-ext-btn" style="padding:6px 12px; margin:0; font-size:12px;">Usar</button>
                </div>
            `;
            const btnComprar = resumo.querySelector('.btn-buy');
            if (btnComprar) resumo.insertBefore(box, btnComprar);
            else resumo.appendChild(box);

            document.getElementById('sr-ext-aplicar-gift').onclick = () => {
                const code = document.getElementById('sr-ext-input-gift').value.trim().toUpperCase();
                const lista = JSON.parse(localStorage.getItem(CHAVES.giftCards) || '[]');
                const card = lista.find((g) => g.codigo === code && !g.usado);

                if (!card) {
                    avisarExtra('❌ Vale-presente inválido ou já utilizado.');
                    return;
                }

                card.usado = true;
                localStorage.setItem(CHAVES.giftCards, JSON.stringify(lista));
                localStorage.setItem(CHAVES.giftAplicado, JSON.stringify({ codigo: card.codigo, valor: card.valor }));
                aplicarDescontoGiftNoCarrinho();
                atualizarResumoEconomiaCarrinho();
                avisarExtra(`🎉 Vale-presente ${card.codigo} (-R$ ${card.valor},00) aplicado!`);
            };
        }

        aplicarDescontoGiftNoCarrinho();
        atualizarResumoEconomiaCarrinho();
    }

    function aplicarDescontoGiftNoCarrinho() {
        const aplicado = JSON.parse(localStorage.getItem(CHAVES.giftAplicado) || 'null');
        if (!aplicado) return;

        const summaryPrices = document.getElementById('summary-prices');
        const summaryTotal = document.getElementById('summary-total');
        if (!summaryPrices || !summaryTotal) return;

        if (!document.getElementById('sr-ext-linha-gift')) {
            const p = document.createElement('p');
            p.id = 'sr-ext-linha-gift';
            p.className = 'price-item';
            p.style.color = '#00e676';
            p.textContent = `Vale-Presente (${aplicado.codigo}): - R$ ${Number(aplicado.valor).toFixed(2).replace('.', ',')}`;
            summaryPrices.appendChild(p);

            const spanTotal = summaryTotal.querySelector('span');
            if (spanTotal) {
                const atual = parseFloat(spanTotal.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                const novo = Math.max(0, atual - Number(aplicado.valor));
                spanTotal.textContent = `R$ ${novo.toFixed(2).replace('.', ',')}`;
            }
        }
    }

    function atualizarResumoEconomiaCarrinho() {
        const resumo = document.querySelector('.checkout-summary');
        if (!resumo) return;

        const carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];
        if (carrinho.length === 0) return;

        const subtotal = carrinho.reduce((acc, i) => acc + (Number(i.preco) * Number(i.quantidade)), 0);
        let economia = 0;
        if (subtotal >= 250) economia += 19.90;
        const gift = JSON.parse(localStorage.getItem(CHAVES.giftAplicado) || 'null');
        if (gift) economia += Number(gift.valor) || 0;
        if (localStorage.getItem('sr_nf_cupom_resgate_ativo') === 'true') economia += 30;

        const pontosGanhos = Math.floor(subtotal);

        let boxEco = document.getElementById('sr-ext-economia-box');
        if (!boxEco) {
            boxEco = document.createElement('div');
            boxEco.id = 'sr-ext-economia-box';
            boxEco.style.cssText = 'background:#102418; border:1px solid #00e676; border-radius:10px; padding:8px 10px; margin:8px 0; font-size:12px; color:#00e676; text-align:center;';
            resumo.appendChild(boxEco);
        }

        boxEco.innerHTML = `
            💰 Economia estimada: <strong>R$ ${economia.toFixed(2).replace('.', ',')}</strong><br>
            🏆 Você vai ganhar <strong>+${pontosGanhos} Shadow Points</strong> nesta compra!
        `;
    }

    // ----------------------------------------------------------------------
    // 6. ASSISTENTE VIRTUAL GEEK ("SHADOW BOT")
    // ----------------------------------------------------------------------
    function abrirAssistenteGeek() {
        const perguntas = [
            { q: '🚚 Prazo e Frete Grátis', r: 'Frete Grátis acima de R$ 250,00! Abaixo desse valor, o frete fixo é R$ 19,90 (entrega de 5 a 8 dias úteis).' },
            { q: '🗿 Escala e Material', r: 'Figures em resina maciça de alto padrão, pintura artesanal e escala colecionável 1/6.' },
            { q: '🏷️ Cupons Disponíveis', r: 'Use SHADOW26 (10% OFF), GEEK15 (15% OFF) ou gire a Roleta da Sorte (🎰) para tentar o cupom VIP SHADOW50!' },
            { q: '💳 Formas de Pagamento', r: 'Aceitamos Pix, Boleto Bancário e Cartão de Crédito em até 12x sem juros.' }
        ];

        const dlg = abrirModalExtra(
            '💬 Shadow Bot — Suporte Geek',
            `
                <div class="sr-ext-chat-box" id="sr-ext-chat-historico">
                    <div class="sr-ext-msg-bot">Olá, colecionador(a)! 👋 Selecione uma dúvida abaixo:</div>
                </div>
                <div class="sr-ext-chat-chips" id="sr-ext-chat-opcoes"></div>
            `,
            `<button type="button" class="sr-ext-btn-sec" id="sr-ext-fechar-bot">Fechar Chat</button>`
        );

        dlg.querySelector('#sr-ext-fechar-bot').onclick = () => dlg.close();
        const historico = dlg.querySelector('#sr-ext-chat-historico');
        const opcoes = dlg.querySelector('#sr-ext-chat-opcoes');

        perguntas.forEach((item) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'sr-ext-chip';
            chip.textContent = item.q;
            chip.onclick = () => {
                const u = document.createElement('div');
                u.className = 'sr-ext-msg-user';
                u.textContent = item.q;
                historico.appendChild(u);

                const b = document.createElement('div');
                b.className = 'sr-ext-msg-bot';
                b.textContent = item.r;
                historico.appendChild(b);
                historico.scrollTop = historico.scrollHeight;
            };
            opcoes.appendChild(chip);
        });
    }

    // ----------------------------------------------------------------------
    // 7. GERADOR DE VALE-PRESENTE DIGITAL (GIFT CARD)
    // ----------------------------------------------------------------------
    function abrirPainelGiftCard() {
        const cartoes = JSON.parse(localStorage.getItem(CHAVES.giftCards) || '[]');
        const listaHtml = cartoes.length > 0
            ? cartoes.slice(-3).reverse().map((g) =>
                `<div style="font-size:12px; color:#ccc; margin-top:4px;">• <strong>${g.codigo}</strong> — R$ ${g.valor},00 (Para: ${g.para}) ${g.usado ? '<span style="color:#ff4d4d;">[Usado]</span>' : '<span style="color:#00e676;">[Ativo]</span>'}</div>`
            ).join('')
            : '<small style="color:#888;">Nenhum vale-presente gerado ainda.</small>';

        const dlg = abrirModalExtra(
            '🎟️ Vale-Presente Shadow Realm',
            `
                <p style="color:#ccc; font-size:13px;">Gere um Gift Card digital com código exclusivo para presentear outro fã de anime:</p>
                <div style="margin:10px 0;">
                    <select id="sr-ext-gift-valor" class="sr-ext-input">
                        <option value="50">Valor: R$ 50,00</option>
                        <option value="100" selected>Valor: R$ 100,00</option>
                        <option value="200">Valor: R$ 200,00</option>
                    </select>
                    <input type="text" id="sr-ext-gift-para" class="sr-ext-input" placeholder="Nome do presenteado (Ex: Lucas)">
                </div>
                <div id="sr-ext-gift-resultado"></div>
                <div style="text-align:left; margin-top:10px; border-top:1px solid #333; padding-top:8px;">
                    <strong style="font-size:13px; color:#ffca28;">Últimos Gift Cards Gerados:</strong>
                    ${listaHtml}
                </div>
            `,
            `
                <button type="button" class="sr-ext-btn" id="sr-ext-gerar-gift">✨ Gerar Código</button>
                <button type="button" class="sr-ext-btn-sec" id="sr-ext-fechar-gift">Fechar</button>
            `
        );

        dlg.querySelector('#sr-ext-fechar-gift').onclick = () => dlg.close();
        dlg.querySelector('#sr-ext-gerar-gift').onclick = () => {
            const valor = Number(dlg.querySelector('#sr-ext-gift-valor').value) || 100;
            const para = dlg.querySelector('#sr-ext-gift-para').value.trim() || 'Colecionador(a)';
            const codigo = 'GIFT-' + Math.random().toString(36).substring(2, 6).toUpperCase();

            const lista = JSON.parse(localStorage.getItem(CHAVES.giftCards) || '[]');
            lista.push({ codigo, valor, para, usado: false, criadoEm: new Date().toLocaleDateString('pt-BR') });
            localStorage.setItem(CHAVES.giftCards, JSON.stringify(lista));

            navigator.clipboard?.writeText(codigo);
            dlg.querySelector('#sr-ext-gift-resultado').innerHTML = `
                <div class="sr-ext-gift-ticket">
                    <strong style="color:#ffca28; font-size:15px;">🎁 GIFT CARD GERADO!</strong><br>
                    <span>Para: <strong>${para}</strong> • Valor: <strong>R$ ${valor},00</strong></span><br>
                    <span>Código: <strong style="color:#00e676; font-size:16px;">${codigo}</strong> (copiado!)</span>
                </div>
            `;
            avisarExtra(`Código ${codigo} copiado! Use no carrinho.`);
        };
    }

    // ----------------------------------------------------------------------
    // 8. CONQUISTAS & MEDALHAS (BADGES)
    // ----------------------------------------------------------------------
    function abrirPainelConquistas() {
        const email = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();
        const pedidos = (JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [])
            .filter((p) => (p.clienteEmail || '').trim().toLowerCase() === email && p.status !== 'Cancelado');
        const favoritos = JSON.parse(localStorage.getItem('favoritosShadowRealm')) || [];
        const isVip = localStorage.getItem('vipShadowRealm') === 'true';
        const visitas = Number(localStorage.getItem(CHAVES.visitasCatalogo)) || 1;

        const conquistas = [
            { icone: '🗡️', nome: 'Primeira Relíquia', desc: 'Realize seu 1º pedido na loja.', ok: pedidos.length >= 1 },
            { icone: '👑', nome: 'Mestre Colecionador', desc: 'Acumule 3 ou mais pedidos confirmados.', ok: pedidos.length >= 3 },
            { icone: '❤️', nome: 'Curador Geek', desc: 'Salve 3 figures nos favoritos.', ok: favoritos.length >= 3 },
            { icone: '🔓', nome: 'Membro Clube VIP', desc: 'Desbloqueie o acesso VIP (SHADOW50).', ok: isVip },
            { icone: '🧭', nome: 'Explorador do Reino', desc: 'Visite o catálogo 5 vezes.', ok: visitas >= 5 }
        ];

        const desbloqueadas = conquistas.filter((c) => c.ok).length;
        const cardsHtml = conquistas.map((c) => `
            <div class="sr-ext-badge-card ${c.ok ? 'desbloqueada' : ''}">
                <div style="font-size:22px; margin-bottom:4px;">${c.icone} ${c.ok ? '✔' : '🔒'}</div>
                <strong style="font-size:13px; color:#ffca28;">${c.nome}</strong>
                <p style="font-size:11px; color:#ccc; margin:4px 0 0 0;">${c.desc}</p>
            </div>
        `).join('');

        const dlg = abrirModalExtra(
            `🏅 Conquistas (${desbloqueadas}/${conquistas.length})`,
            `<div class="sr-ext-grid-badges">${cardsHtml}</div>`,
            `<button type="button" class="sr-ext-btn-sec" id="sr-ext-fechar-badges">Fechar</button>`
        );
        dlg.querySelector('#sr-ext-fechar-badges').onclick = () => dlg.close();
    }

    // ----------------------------------------------------------------------
    // 9. MINHA ESTANTE DE COLECIONADOR
    // ----------------------------------------------------------------------
    function abrirMinhaEstante() {
        const logado = localStorage.getItem('usuarioLogado') === 'true';
        const email = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();

        if (!logado || !email) {
            const dlg = abrirModalExtra(
                '🗿 Minha Estante',
                '<p style="color:#ddd; font-size:14px;">Faça login para visualizar as figures que já fazem parte da sua coleção!</p>',
                `<button type="button" class="sr-ext-btn" onclick="window.location.href='cliente.html'">Fazer Login</button>
                 <button type="button" class="sr-ext-btn-sec" id="sr-ext-fechar-est">Fechar</button>`
            );
            dlg.querySelector('#sr-ext-fechar-est').onclick = () => dlg.close();
            return;
        }

        const pedidos = (JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [])
            .filter((p) => (p.clienteEmail || '').trim().toLowerCase() === email && p.status !== 'Cancelado' && p.status !== 'Pedido Cancelado');

        const mapaColecao = new Map();
        pedidos.forEach((ped) => {
            (ped.itens || []).forEach((item) => {
                const atual = mapaColecao.get(item.nome);
                if (atual) {
                    atual.qtd += (item.quantidade || 1);
                } else {
                    mapaColecao.set(item.nome, {
                        nome: item.nome,
                        imagem: item.imagem || 'imagens/produto.png',
                        qtd: item.quantidade || 1
                    });
                }
            });
        });

        let conteudo = '';
        if (mapaColecao.size === 0) {
            conteudo = '<p style="color:#ccc; font-size:14px;">Sua estante ainda está vazia. Adquira sua primeira figure para exibi-la aqui!</p>';
        } else {
            const itensHtml = Array.from(mapaColecao.values()).map((f) => `
                <div class="sr-ext-estante-item">
                    <img src="${f.imagem}" alt="${f.nome}">
                    <strong style="display:block; font-size:12px; color:#fff;">${f.nome}</strong>
                    <small style="color:#ffca28;">${f.qtd}x na estante</small>
                </div>
            `).join('');
            conteudo = `<div class="sr-ext-estante-grid">${itensHtml}</div>`;
        }

        const dlg = abrirModalExtra('🗿 Minha Estante de Colecionador', conteudo, `<button type="button" class="sr-ext-btn-sec" id="sr-ext-fechar-est">Fechar</button>`);
        dlg.querySelector('#sr-ext-fechar-est').onclick = () => dlg.close();
    }

    // ----------------------------------------------------------------------
    // 10. PROVA SOCIAL EM TEMPO REAL (DISCRETA E SILENCIÁVEL)
    // ----------------------------------------------------------------------
    function iniciarProvaSocial() {
        if (localStorage.getItem(CHAVES.provaSocialSilenciada) === 'true') return;
        const pagina = window.location.pathname.toLowerCase();
        if (pagina.includes('admin') || pagina.includes('estoque')) return;

        injetarEstilosExtras();
        const eventos = [
            '🔥 Lucas (Joinville/SC) acabou de garantir uma figure Satoru Gojo!',
            '⚡ Mariana (Curitiba/PR) usou o cupom GEEK15 no carrinho!',
            '🗿 Rafael (São Paulo/SP) adquiriu Levi Ackerman (Escala 1/6)!',
            '🚚 Pedido de Ichigo Kurosaki saiu para entrega com Frete Grátis!'
        ];

        const popup = document.createElement('div');
        popup.id = 'sr-ext-social-popup';
        document.body.appendChild(popup);

        let idx = 0;
        function mostrarProximo() {
            if (localStorage.getItem(CHAVES.provaSocialSilenciada) === 'true') return;
            popup.innerHTML = `
                <span style="flex:1;">${eventos[idx % eventos.length]}</span>
                <button type="button" id="sr-ext-silenciar-social" title="Silenciar avisos" style="background:none; border:none; color:#aaa; cursor:pointer; font-size:14px; padding:0; margin:0; width:auto; height:auto;">✕</button>
            `;
            popup.style.display = 'flex';
            idx++;

            popup.querySelector('#sr-ext-silenciar-social').onclick = () => {
                localStorage.setItem(CHAVES.provaSocialSilenciada, 'true');
                popup.style.display = 'none';
            };

            setTimeout(() => {
                popup.style.display = 'none';
            }, 4500);
        }

        setTimeout(() => {
            mostrarProximo();
            setInterval(mostrarProximo, 22000);
        }, 7000);
    }

    // ----------------------------------------------------------------------
    // 11. ALTERNADOR DE TEMA VISUAL (DARK / CRIMSON SHADOW)
    // ----------------------------------------------------------------------
    function aplicarTemaSalvo() {
        if (localStorage.getItem(CHAVES.temaCrimson) === 'true') {
            document.body.classList.add('sr-ext-crimson-mode');
        }
    }

    function alternarTemaVisual() {
        const ativo = document.body.classList.toggle('sr-ext-crimson-mode');
        localStorage.setItem(CHAVES.temaCrimson, String(ativo));
        avisarExtra(ativo ? '🎨 Tema Crimson Shadow ativado!' : '🌑 Tema Dark Clássico ativado!');
    }

    // ----------------------------------------------------------------------
    // 12. ATALHO DE TECLADO ("/" PARA FOCAR NA PESQUISA)
    // ----------------------------------------------------------------------
    function ativarAtalhosTeclado() {
        document.addEventListener('keydown', (e) => {
            const tag = (e.target.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            if (e.key === '/') {
                const barra = document.getElementById('barraPesquisa');
                if (barra) {
                    e.preventDefault();
                    barra.focus();
                    barra.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // ----------------------------------------------------------------------
    // INICIALIZAÇÃO AUTOMÁTICA
    // ----------------------------------------------------------------------
    injetarEstilosExtras();
    removerComparadorFigures();

    document.addEventListener('DOMContentLoaded', () => {
        const visitas = (Number(localStorage.getItem(CHAVES.visitasCatalogo)) || 0) + 1;
        localStorage.setItem(CHAVES.visitasCatalogo, String(visitas));

        removerComparadorFigures();
        aplicarTemaSalvo();
        acoplarBotoesNoDock();
        ativarQuickBuy();
        ativarZoomEParcelas();
        inicializarExtrasCarrinho();
        iniciarProvaSocial();
        ativarAtalhosTeclado();
    });
})();