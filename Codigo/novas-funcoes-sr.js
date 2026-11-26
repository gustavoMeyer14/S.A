/* ==========================================================================
   NOVAS-FUNCOES-SR.JS — SHADOW REALM STORE
   Módulo 100% isolado (IIFE + prefixo #sr-nf-). Não altera arquivos existentes
   e não entra em conflito com nenhum script ou CSS do projeto.
   ========================================================================== */
(function () {
    'use strict';

    const PREFIXO = 'sr-nf';
    const CHAVES = {
        giroRoleta: 'sr_nf_roleta_girada',
        premioRoleta: 'sr_nf_premio_roleta',
        pontosExtras: 'sr_nf_pontos_extras',
        pontosResgatados: 'sr_nf_pontos_resgatados',
        cupomResgateAtivo: 'sr_nf_cupom_resgate_ativo',
        modoPresente: 'sr_nf_modo_presente',
        alertasEstoque: 'sr_nf_alertas_estoque'
    };

    // ----------------------------------------------------------------------
    // 0. ESTILOS ISOLADOS (INJETADOS VIA JS PARA NÃO EXIGIR NOVO CSS)
    // ----------------------------------------------------------------------
    function injetarEstilosIsolados() {
        if (document.getElementById(`${PREFIXO}-estilos`)) return;
        const style = document.createElement('style');
        style.id = `${PREFIXO}-estilos`;
        style.textContent = `
            #${PREFIXO}-dock {
                position: fixed;
                bottom: 22px;
                left: 22px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 9991;
            }
            .${PREFIXO}-fab {
                width: 52px;
                height: 52px;
                border-radius: 50%;
                background: #141414;
                color: #ffffff;
                border: 2px solid #ffca28;
                font-size: 22px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.8);
                transition: transform 0.2s ease, background-color 0.2s ease;
                padding: 0;
                margin: 0;
            }
            .${PREFIXO}-fab:hover {
                background: #C62828;
                border-color: #ffffff;
                transform: scale(1.1);
            }
            dialog#${PREFIXO}-dialog {
                background: #141414;
                color: #ffffff;
                border: 2px solid #C62828;
                border-radius: 18px;
                padding: 24px;
                max-width: 480px;
                width: 92%;
                box-shadow: 0 14px 40px rgba(0, 0, 0, 0.9);
                text-align: center;
            }
            dialog#${PREFIXO}-dialog::backdrop {
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(2px);
            }
            .${PREFIXO}-titulo {
                color: #ffca28;
                font-size: 22px;
                margin: 0 0 12px 0;
            }
            .${PREFIXO}-btn {
                background: #C62828;
                color: #ffffff;
                border: 1px solid #C62828;
                border-radius: 20px;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: 0.2s;
                margin: 4px;
            }
            .${PREFIXO}-btn:hover {
                background: #1b1b1b;
                box-shadow: 0 0 14px rgba(198, 40, 40, 0.7);
            }
            .${PREFIXO}-btn-sec {
                background: #242424;
                color: #e0e0e0;
                border: 1px solid #555;
                border-radius: 20px;
                padding: 9px 18px;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
                margin: 4px;
            }
            .${PREFIXO}-btn-sec:hover {
                background: #333;
            }
            .${PREFIXO}-roleta-visor {
                background: #1d1d1d;
                border: 2px dashed #ffca28;
                border-radius: 14px;
                padding: 22px 15px;
                margin: 15px 0;
                font-size: 20px;
                font-weight: bold;
                color: #00e676;
                min-height: 76px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .${PREFIXO}-card-info {
                background: #1c1c1c;
                border: 1px solid #333;
                border-radius: 12px;
                padding: 14px;
                margin: 12px 0;
                text-align: left;
                font-size: 14px;
                line-height: 1.5;
            }
            .${PREFIXO}-presente-box {
                background: #161616;
                border: 1px dashed #ffca28;
                border-radius: 12px;
                padding: 12px;
                margin: 12px 0;
                text-align: left;
                font-size: 13px;
            }
            .${PREFIXO}-presente-box select,
            .${PREFIXO}-presente-box textarea {
                width: 100% !important;
                margin: 6px 0 0 0 !important;
                padding: 8px 10px !important;
                background: #0d0d0d !important;
                color: #ffffff !important;
                border: 1px solid #C62828 !important;
                border-radius: 8px !important;
                font-size: 13px !important;
                text-align: left !important;
                height: auto !important;
            }
            @media (max-width: 600px) {
                #${PREFIXO}-dock {
                    bottom: 16px;
                    left: 14px;
                }
                .${PREFIXO}-fab {
                    width: 46px;
                    height: 46px;
                    font-size: 19px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ----------------------------------------------------------------------
    // UTILITÁRIOS DE MODAL E NOTIFICAÇÃO ISOLADOS
    // ----------------------------------------------------------------------
    function abrirDialogoNF(titulo, conteudoHTML, botoesHTML) {
        injetarEstilosIsolados();
        let dlg = document.getElementById(`${PREFIXO}-dialog`);
        if (!dlg) {
            dlg = document.createElement('dialog');
            dlg.id = `${PREFIXO}-dialog`;
            document.body.appendChild(dlg);
            dlg.addEventListener('click', (e) => {
                if (e.target === dlg) dlg.close();
            });
        }

        dlg.innerHTML = `
            <h2 class="${PREFIXO}-titulo">${titulo}</h2>
            <div id="${PREFIXO}-dialog-body">${conteudoHTML}</div>
            <div style="margin-top: 16px;">${botoesHTML}</div>
        `;

        if (dlg.open) dlg.close();
        dlg.showModal();
        return dlg;
    }

    function notificarNF(msg) {
        if (window.srModal && typeof window.srModal.toast === 'function') {
            window.srModal.toast(msg);
            return;
        }
        const aviso = document.createElement('div');
        aviso.textContent = msg;
        aviso.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #141414; color: #fff; border: 2px solid #00e676;
            padding: 10px 20px; border-radius: 12px; font-weight: bold;
            font-size: 14px; z-index: 1000001; box-shadow: 0 8px 25px rgba(0,0,0,0.85);
        `;
        document.body.appendChild(aviso);
        setTimeout(() => aviso.remove(), 3200);
    }

    // ----------------------------------------------------------------------
    // 1. DOCK FLUTUANTE (ROLETA DA SORTE + SHADOW POINTS)
    // ----------------------------------------------------------------------
    function criarDockFlutuante() {
        if (document.getElementById(`${PREFIXO}-dock`)) return;
        injetarEstilosIsolados();

        const dock = document.createElement('div');
        dock.id = `${PREFIXO}-dock`;

        const btnRoleta = document.createElement('button');
        btnRoleta.type = 'button';
        btnRoleta.className = `${PREFIXO}-fab`;
        btnRoleta.title = 'Roleta da Sorte Geek';
        btnRoleta.textContent = '🎰';
        btnRoleta.addEventListener('click', abrirRoletaDaSorte);

        const btnPontos = document.createElement('button');
        btnPontos.type = 'button';
        btnPontos.className = `${PREFIXO}-fab`;
        btnPontos.title = 'Shadow Points & Cashback';
        btnPontos.textContent = '🏆';
        btnPontos.addEventListener('click', abrirPainelShadowPoints);

        dock.appendChild(btnRoleta);
        dock.appendChild(btnPontos);
        document.body.appendChild(dock);
    }

    // ----------------------------------------------------------------------
    // 2. ROLETA DA SORTE GEEK
    // ----------------------------------------------------------------------
    function abrirRoletaDaSorte() {
        const jaGirou = sessionStorage.getItem(CHAVES.giroRoleta) === 'true';
        const premioSalvo = JSON.parse(sessionStorage.getItem(CHAVES.premioRoleta) || 'null');

        const premios = [
            { label: '🎟️ Cupom 10% OFF: SHADOW26', cupom: 'SHADOW26', pontos: 0 },
            { label: '🔥 Cupom 15% OFF: GEEK15', cupom: 'GEEK15', pontos: 0 },
            { label: '💎 +150 Shadow Points na Conta!', cupom: null, pontos: 150 },
            { label: '⚡ Cupom VIP 50% OFF: SHADOW50', cupom: 'SHADOW50', pontos: 0 }
        ];

        const visorInicial = jaGirou && premioSalvo
            ? `Você já ganhou hoje:<br>${premioSalvo.label}`
            : 'Clique em GIRAR para testar sua sorte!';

        const dlg = abrirDialogoNF(
            '🎰 Roleta da Sorte Shadow Realm',
            `
                <p style="color:#ccc; font-size:14px;">Gire a roleta e ganhe descontos ou pontos extras para suas figures!</p>
                <div class="${PREFIXO}-roleta-visor" id="${PREFIXO}-visor-roleta">${visorInicial}</div>
            `,
            `
                ${!jaGirou ? `<button type="button" class="${PREFIXO}-btn" id="${PREFIXO}-btn-girar">🎲 Girar Agora</button>` : ''}
                ${jaGirou && premioSalvo?.cupom ? `<button type="button" class="${PREFIXO}-btn" id="${PREFIXO}-btn-copiar-roleta">📋 Copiar Cupom (${premioSalvo.cupom})</button>` : ''}
                <button type="button" class="${PREFIXO}-btn-sec" id="${PREFIXO}-fechar-dlg">Fechar</button>
            `
        );

        dlg.querySelector(`#${PREFIXO}-fechar-dlg`).onclick = () => dlg.close();

        const btnCopiar = dlg.querySelector(`#${PREFIXO}-btn-copiar-roleta`);
        if (btnCopiar && premioSalvo?.cupom) {
            btnCopiar.onclick = () => {
                navigator.clipboard?.writeText(premioSalvo.cupom);
                notificarNF(`Cupom ${premioSalvo.cupom} copiado!`);
            };
        }

        const btnGirar = dlg.querySelector(`#${PREFIXO}-btn-girar`);
        if (btnGirar) {
            btnGirar.onclick = () => {
                btnGirar.disabled = true;
                btnGirar.textContent = 'Girando...';
                const visor = document.getElementById(`${PREFIXO}-visor-roleta`);
                let ticks = 0;

                const anim = setInterval(() => {
                    const temp = premios[ticks % premios.length];
                    visor.textContent = temp.label;
                    ticks++;
                    if (ticks > 14) {
                        clearInterval(anim);
                        const escolhido = premios[Math.floor(Math.random() * premios.length)];
                        sessionStorage.setItem(CHAVES.giroRoleta, 'true');
                        sessionStorage.setItem(CHAVES.premioRoleta, JSON.stringify(escolhido));

                        if (escolhido.pontos > 0) {
                            const atual = Number(localStorage.getItem(CHAVES.pontosExtras)) || 0;
                            localStorage.setItem(CHAVES.pontosExtras, String(atual + escolhido.pontos));
                        }
                        if (escolhido.cupom === 'SHADOW50') {
                            localStorage.setItem('vipShadowRealm', 'true');
                        }

                        visor.innerHTML = `🎉 PARABÉNS!<br>${escolhido.label}`;
                        btnGirar.remove();
                        if (escolhido.cupom) {
                            navigator.clipboard?.writeText(escolhido.cupom);
                            notificarNF(`Cupom ${escolhido.cupom} copiado para a área de transferência!`);
                        } else {
                            notificarNF(`+${escolhido.pontos} Shadow Points adicionados!`);
                        }
                    }
                }, 90);
            };
        }
    }

    // ----------------------------------------------------------------------
    // 3. PROGRAMA DE FIDELIDADE (SHADOW POINTS)
    // ----------------------------------------------------------------------
    function calcularSaldoPontos() {
        const email = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();
        const pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];

        const totalCompras = pedidos
            .filter(p => (p.clienteEmail || '').trim().toLowerCase() === email && p.status !== 'Cancelado' && p.status !== 'Pedido Cancelado')
            .reduce((acc, p) => acc + (Number(p.total) || 0), 0);

        const pontosPedidos = Math.floor(totalCompras);
        const pontosExtras = Number(localStorage.getItem(CHAVES.pontosExtras)) || 0;
        const resgatados = Number(localStorage.getItem(CHAVES.pontosResgatados)) || 0;
        const saldo = Math.max(0, pontosPedidos + pontosExtras - resgatados);

        let patente = '🥉 Iniciante das Sombras';
        if (saldo >= 1500) patente = '👑 Rei das Sombras';
        else if (saldo >= 700) patente = '⚔️ Hashira / Capitão';
        else if (saldo >= 250) patente = '🛡️ Caçador de Relíquias';

        return { saldo, patente };
    }

    function abrirPainelShadowPoints() {
        const logado = localStorage.getItem('usuarioLogado') === 'true';
        if (!logado) {
            abrirDialogoNF(
                '🏆 Shadow Points',
                '<p style="color:#ddd;">Faça login na sua conta para acumular pontos a cada compra e trocar por descontos!</p>',
                `<button type="button" class="${PREFIXO}-btn" onclick="window.location.href='cliente.html'">Fazer Login</button>
                 <button type="button" class="${PREFIXO}-btn-sec" id="${PREFIXO}-fechar-pts">Fechar</button>`
            ).querySelector(`#${PREFIXO}-fechar-pts`).onclick = () => document.getElementById(`${PREFIXO}-dialog`).close();
            return;
        }

        const { saldo, patente } = calcularSaldoPontos();
        const podeResgatar = saldo >= 300;

        const dlg = abrirDialogoNF(
            '🏆 Clube Shadow Points',
            `
                <div class="${PREFIXO}-card-info">
                    <p><strong>Patente Atual:</strong> <span style="color:#ffca28;">${patente}</span></p>
                    <p><strong>Saldo Disponível:</strong> <span style="color:#00e676; font-size:18px;">${saldo} pts</span></p>
                    <p style="color:#aaa; font-size:12px; margin-top:6px;">Regra: R$ 1,00 em pedidos confirmados = 1 Shadow Point. Com 300 pts você resgata R$ 30,00 de desconto!</p>
                </div>
            `,
            `
                ${podeResgatar
                    ? `<button type="button" class="${PREFIXO}-btn" id="${PREFIXO}-resgatar-pts">🎁 Trocar 300 pts por R$ 30 OFF</button>`
                    : `<button type="button" class="${PREFIXO}-btn-sec" disabled style="opacity:0.5;">Faltam ${300 - saldo} pts para resgate</button>`
                }
                <button type="button" class="${PREFIXO}-btn-sec" id="${PREFIXO}-fechar-pts">Fechar</button>
            `
        );

        dlg.querySelector(`#${PREFIXO}-fechar-pts`).onclick = () => dlg.close();

        const btnResgatar = dlg.querySelector(`#${PREFIXO}-resgatar-pts`);
        if (btnResgatar) {
            btnResgatar.onclick = () => {
                const atualResgatado = Number(localStorage.getItem(CHAVES.pontosResgatados)) || 0;
                localStorage.setItem(CHAVES.pontosResgatados, String(atualResgatado + 300));
                localStorage.setItem(CHAVES.cupomResgateAtivo, 'true');
                dlg.close();
                notificarNF('🎉 Resgatado! Desconto de R$ 30,00 aplicado no seu carrinho!');
                aplicarDescontoResgateNoCarrinho();
            };
        }
    }

    // ----------------------------------------------------------------------
    // 4. MODO PRESENTE & DESCONTO DE PONTOS NO CARRINHO
    // ----------------------------------------------------------------------
    function inicializarExtrasCarrinho() {
        const resumo = document.querySelector('.checkout-summary');
        if (!resumo) return;

        if (!document.getElementById(`${PREFIXO}-box-presente`)) {
            injetarEstilosIsolados();
            const salvo = JSON.parse(localStorage.getItem(CHAVES.modoPresente) || '{"ativo":false,"embalagem":"Akatsuki (Vermelho Carmesim)","mensagem":""}');

            const box = document.createElement('div');
            box.id = `${PREFIXO}-box-presente`;
            box.className = `${PREFIXO}-presente-box`;
            box.innerHTML = `
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:bold; color:#ffca28;">
                    <input type="checkbox" id="${PREFIXO}-chk-presente" ${salvo.ativo ? 'checked' : ''} style="width:16px; height:16px; margin:0;">
                    🎁 Enviar como Presente (Grátis)
                </label>
                <div id="${PREFIXO}-campos-presente" style="display:${salvo.ativo ? 'block' : 'none'}; margin-top:8px;">
                    <label style="color:#ccc; font-size:12px;">Embalagem Temática:</label>
                    <select id="${PREFIXO}-emb-presente">
                        <option value="Akatsuki (Vermelho Carmesim)" ${salvo.embalagem.includes('Akatsuki') ? 'selected' : ''}>☁️ Akatsuki (Vermelho Carmesim)</option>
                        <option value="Soul Society (Preto & Dourado)" ${salvo.embalagem.includes('Soul') ? 'selected' : ''}>⚔️ Soul Society (Preto & Dourado)</option>
                        <option value="Pokéball Collector" ${salvo.embalagem.includes('Pokéball') ? 'selected' : ''}>⚡ Pokéball Collector</option>
                    </select>
                    <label style="color:#ccc; font-size:12px; display:block; margin-top:8px;">Cartão / Dedicatória:</label>
                    <textarea id="${PREFIXO}-msg-presente" rows="2" maxlength="140" placeholder="Escreva uma mensagem especial...">${salvo.mensagem || ''}</textarea>
                </div>
            `;

            const btnComprar = resumo.querySelector('.btn-buy');
            if (btnComprar) {
                resumo.insertBefore(box, btnComprar);
            } else {
                resumo.appendChild(box);
            }

            const chk = document.getElementById(`${PREFIXO}-chk-presente`);
            const campos = document.getElementById(`${PREFIXO}-campos-presente`);
            const emb = document.getElementById(`${PREFIXO}-emb-presente`);
            const msg = document.getElementById(`${PREFIXO}-msg-presente`);

            const salvarEstadoPresente = () => {
                campos.style.display = chk.checked ? 'block' : 'none';
                localStorage.setItem(CHAVES.modoPresente, JSON.stringify({
                    ativo: chk.checked,
                    embalagem: emb.value,
                    mensagem: msg.value.trim()
                }));
            };

            chk.addEventListener('change', salvarEstadoPresente);
            emb.addEventListener('change', salvarEstadoPresente);
            msg.addEventListener('input', salvarEstadoPresente);
        }

        aplicarDescontoResgateNoCarrinho();

        // Anexa informação do presente ao último pedido assim que o checkout concluir
        window.addEventListener('storage', (e) => {
            if (e.key === 'pedidosShadowRealm') {
                anexarPresenteAoUltimoPedido();
            }
        });
    }

    function aplicarDescontoResgateNoCarrinho() {
        if (localStorage.getItem(CHAVES.cupomResgateAtivo) !== 'true') return;
        const summaryPrices = document.getElementById('summary-prices');
        const summaryTotal = document.getElementById('summary-total');
        if (!summaryPrices || !summaryTotal) return;

        if (!document.getElementById(`${PREFIXO}-linha-resgate`)) {
            const p = document.createElement('p');
            p.id = `${PREFIXO}-linha-resgate`;
            p.className = 'price-item';
            p.style.color = '#00e676';
            p.textContent = 'Resgate Shadow Points: - R$ 30,00';
            summaryPrices.appendChild(p);

            const spanTotal = summaryTotal.querySelector('span');
            if (spanTotal) {
                const atual = parseFloat(spanTotal.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                const novo = Math.max(0, atual - 30);
                spanTotal.textContent = `R$ ${novo.toFixed(2).replace('.', ',')}`;
            }
        }
    }

    function anexarPresenteAoUltimoPedido() {
        const presente = JSON.parse(localStorage.getItem(CHAVES.modoPresente) || 'null');
        if (!presente || !presente.ativo) return;

        const pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];
        if (pedidos.length === 0) return;

        const ultimo = pedidos[pedidos.length - 1];
        if (!ultimo.presenteInfo) {
            ultimo.presenteInfo = `🎁 Presente (${presente.embalagem})${presente.mensagem ? ': "' + presente.mensagem + '"' : ''}`;
            localStorage.setItem('pedidosShadowRealm', JSON.stringify(pedidos));
            localStorage.removeItem(CHAVES.modoPresente);
        }
    }

    // ----------------------------------------------------------------------
    // 5. COMPARTILHAR PRODUTO & ALERTA "AVISE-ME QUANDO CHEGAR"
    // ----------------------------------------------------------------------
    function turbinarModaisDeProduto() {
        injetarEstilosIsolados();

        function processarModais() {
            document.querySelectorAll('dialog.modalProduto').forEach((modal) => {
                const footer = modal.querySelector('.modal-footer');
                const btnAdd = modal.querySelector('.btn-carrinho');
                if (!footer || !btnAdd) return;

                const nomeProd = btnAdd.getAttribute('data-nome') || 'Produto';

                // Botão Compartilhar Link Direto
                if (!footer.querySelector(`.${PREFIXO}-btn-share`)) {
                    const btnShare = document.createElement('button');
                    btnShare.type = 'button';
                    btnShare.className = `${PREFIXO}-btn-sec ${PREFIXO}-btn-share`;
                    btnShare.textContent = '🔗 Compartilhar';
                    btnShare.onclick = () => {
                        const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
                        const url = `${base}produtos.html?busca=${encodeURIComponent(nomeProd)}`;
                        navigator.clipboard?.writeText(url);
                        notificarNF(`Link de "${nomeProd}" copiado!`);
                    };
                    footer.appendChild(btnShare);
                }

                // Botão "Avise-me" se estoque == 0
                const qtd = typeof window.obterEstoque === 'function' ? window.obterEstoque(nomeProd) : 1;
                const jaTemAviso = footer.querySelector(`.${PREFIXO}-btn-aviseme`);

                if (qtd <= 0 && !jaTemAviso) {
                    const btnAvise = document.createElement('button');
                    btnAvise.type = 'button';
                    btnAvise.className = `${PREFIXO}-btn ${PREFIXO}-btn-aviseme`;
                    btnAvise.textContent = '🔔 Avise-me';
                    btnAvise.onclick = () => {
                        modal.close();
                        const emailPadrao = localStorage.getItem('usuarioAtual') || '';
                        const dlg = abrirDialogoNF(
                            '🔔 Avise-me Quando Chegar',
                            `
                                <p style="color:#ddd; font-size:14px; margin-bottom:12px;">Informe seu e-mail para receber um alerta assim que <strong>${nomeProd}</strong> voltar ao estoque:</p>
                                <input type="email" id="${PREFIXO}-email-aviso" value="${emailPadrao}" placeholder="seuemail@exemplo.com"
                                    style="width:90%; padding:10px; border-radius:10px; background:#0d0d0d; color:#fff; border:1px solid #C62828;">
                            `,
                            `
                                <button type="button" class="${PREFIXO}-btn" id="${PREFIXO}-salvar-aviso">Ativar Alerta</button>
                                <button type="button" class="${PREFIXO}-btn-sec" id="${PREFIXO}-cancelar-aviso">Cancelar</button>
                            `
                        );
                        dlg.querySelector(`#${PREFIXO}-cancelar-aviso`).onclick = () => dlg.close();
                        dlg.querySelector(`#${PREFIXO}-salvar-aviso`).onclick = () => {
                            const email = dlg.querySelector(`#${PREFIXO}-email-aviso`).value.trim();
                            if (!email || !email.includes('@')) {
                                notificarNF('Digite um e-mail válido.');
                                return;
                            }
                            const lista = JSON.parse(localStorage.getItem(CHAVES.alertasEstoque) || '[]');
                            lista.push({ produto: nomeProd, email, data: new Date().toLocaleDateString('pt-BR') });
                            localStorage.setItem(CHAVES.alertasEstoque, JSON.stringify(lista));
                            dlg.close();
                            notificarNF(`🔔 Alerta ativado para ${nomeProd}!`);
                        };
                    };
                    footer.appendChild(btnAvise);
                }
            });
        }

        processarModais();
        const vitrine = document.querySelector('.destaques');
        if (vitrine) {
            new MutationObserver(processarModais).observe(vitrine, { childList: true });
        }
    }

    // Verifica se algum produto com alerta voltou ao estoque
    function verificarAlertasDeReposicao() {
        if (typeof window.obterEstoque !== 'function') return;
        const lista = JSON.parse(localStorage.getItem(CHAVES.alertasEstoque) || '[]');
        if (lista.length === 0) return;

        const restantes = [];
        lista.forEach((alerta) => {
            if (window.obterEstoque(alerta.produto) > 0) {
                notificarNF(`🎉 Boa notícia! "${alerta.produto}" voltou ao estoque!`);
            } else {
                restantes.push(alerta);
            }
        });
        localStorage.setItem(CHAVES.alertasEstoque, JSON.stringify(restantes));
    }

    // ----------------------------------------------------------------------
    // 6. BOTÃO DE IMPRESSÃO / PDF OFICIAL NA PÁGINA DE PEDIDOS
    // ----------------------------------------------------------------------
    function adicionarImpressaoPedidos() {
        const lista = document.getElementById('listaPedidos');
        if (!lista) return;

        function injetarBotoesImprimir() {
            const pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];
            lista.querySelectorAll('.pedido-card').forEach((card) => {
                const acoes = card.querySelector('.pedido-acoes');
                if (!acoes || acoes.querySelector(`.${PREFIXO}-btn-print`)) return;

                const numTxt = (card.querySelector('.pedido-numero')?.textContent || '').replace(/\D/g, '');
                const pedido = pedidos.find(p => String(p.numeroPedido) === String(numTxt));
                if (!pedido) return;

                const btnPrint = document.createElement('button');
                btnPrint.type = 'button';
                btnPrint.className = `btn-rastrear ${PREFIXO}-btn-print`;
                btnPrint.textContent = '🖨️ Imprimir / PDF';
                btnPrint.onclick = () => {
                    const janela = window.open('', '_blank', 'width=760,height=650');
                    if (!janela) return;
                    const itensRows = (pedido.itens || []).map(i => `
                        <tr>
                            <td style="padding:8px; border-bottom:1px solid #ddd;">${i.nome}</td>
                            <td style="padding:8px; border-bottom:1px solid #ddd; text-align:center;">${i.quantidade}</td>
                            <td style="padding:8px; border-bottom:1px solid #ddd; text-align:right;">R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</td>
                        </tr>
                    `).join('');

                    janela.document.write(`
                        <!DOCTYPE html>
                        <html lang="pt-BR">
                        <head><title>Recibo Pedido #${pedido.numeroPedido} - Shadow Realm Store</title></head>
                        <body style="font-family: Arial, sans-serif; padding: 30px; color: #111;">
                            <h2 style="color: #C62828; margin-bottom: 4px;">SHADOW REALM STORE</h2>
                            <p style="margin-top: 0; color: #555;">Comprovante Oficial de Pedido</p>
                            <hr>
                            <p><strong>Número do Pedido:</strong> #${pedido.numeroPedido}</p>
                            <p><strong>Data:</strong> ${pedido.data}</p>
                            <p><strong>Cliente:</strong> ${pedido.clienteEmail}</p>
                            <p><strong>Status:</strong> ${pedido.status}</p>
                            <p><strong>Pagamento:</strong> ${pedido.cartaoUsado || 'Pix'}</p>
                            <p><strong>Endereço de Entrega:</strong> ${pedido.enderecoEntrega || '-'}</p>
                            ${pedido.presenteInfo ? `<p><strong>Observação:</strong> ${pedido.presenteInfo}</p>` : ''}
                            <table style="width:100%; border-collapse:collapse; margin-top:20px;">
                                <thead>
                                    <tr style="background:#f2f2f2;">
                                        <th style="padding:8px; text-align:left;">Figure</th>
                                        <th style="padding:8px; text-align:center;">Qtd</th>
                                        <th style="padding:8px; text-align:right;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>${itensRows}</tbody>
                            </table>
                            <h3 style="text-align:right; margin-top:20px;">Total Pago: R$ ${Number(pedido.total || 0).toFixed(2).replace('.', ',')}</h3>
                            <script>window.onload = function() { window.print(); };<\/script>
                        </body>
                        </html>
                    `);
                    janela.document.close();
                };
                acoes.appendChild(btnPrint);
            });
        }

        injetarBotoesImprimir();
        new MutationObserver(injetarBotoesImprimir).observe(lista, { childList: true });
    }

    // ----------------------------------------------------------------------
    // INICIALIZAÇÃO SEGURA
    // ----------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        criarDockFlutuante();
        inicializarExtrasCarrinho();
        turbinarModaisDeProduto();
        verificarAlertasDeReposicao();
        adicionarImpressaoPedidos();
    });
})();