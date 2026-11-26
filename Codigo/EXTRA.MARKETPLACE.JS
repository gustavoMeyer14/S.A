
(function () {
    'use strict';

    const CHAVES_MKT = {
        coins: 'sr_mkt_shadow_coins',
        ultimoCheckin: 'sr_mkt_ultimo_checkin',
        streakDias: 'sr_mkt_streak_dias',
        vistosRecentemente: 'sr_mkt_vistos_recentes',
        perguntasProdutos: 'sr_mkt_perguntas_vendedor',
        cuponsColetados: 'sr_mkt_cupons_coletados',
        missaoVistos: 'sr_mkt_missao_vistos',
        missaoResgatada: 'sr_mkt_missao_resgatada',
        bauUltimoDia: 'sr_eng_bau_ultimo_dia',
        avaliacoesProdutos: 'sr_eng_avaliacoes_clientes',
        alertasPreco: 'sr_eng_alertas_preco'
    };

    // ----------------------------------------------------------------------
    // 1. ESTILOS UNIFICADOS (PREFIXO sr-mkt-)
    // ----------------------------------------------------------------------
    function injetarEstilosMarketplace() {
        if (document.getElementById('sr-mkt-estilos')) return;
        const style = document.createElement('style');
        style.id = 'sr-mkt-estilos';
        style.textContent = `
            /* Barra Superior Estilo Shopee */
            #sr-mkt-top-strip {
                background: linear-gradient(90deg, #1b0707 0%, #2d0b0b 50%, #1b0707 100%);
                border-bottom: 1px solid #C62828;
                color: #ffffff;
                padding: 8px 16px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                gap: 10px;
                font-size: 13px;
                z-index: 9980;
            }
            .sr-mkt-pill-btn {
                background: #141414;
                color: #ffca28;
                border: 1px solid #ffca28;
                border-radius: 20px;
                padding: 5px 13px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                transition: 0.2s;
            }
            .sr-mkt-pill-btn:hover {
                background: #C62828;
                color: #ffffff;
                transform: translateY(-1px);
            }
            .sr-mkt-pill-btn.destaque-verde {
                color: #00e676;
                border-color: #00e676;
            }
            .sr-mkt-pill-btn.destaque-verde:hover {
                background: #00e676;
                color: #000000;
            }

            /* Banner Ofertas Relâmpago (Shopee Flash Sale) */
            #sr-mkt-flash-banner {
                width: 90%;
                max-width: 1400px;
                margin: 18px auto 8px auto;
                background: linear-gradient(135deg, #2a0808 0%, #141414 100%);
                border: 2px solid #ffca28;
                border-radius: 16px;
                padding: 14px 20px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                box-shadow: 0 8px 24px rgba(198, 40, 40, 0.35);
            }
            .sr-mkt-relogio-box {
                background: #000000;
                color: #ffca28;
                border: 1px solid #C62828;
                padding: 4px 8px;
                border-radius: 6px;
                font-family: monospace;
                font-weight: bold;
                font-size: 15px;
            }

            /* Selos & Barra de Urgência nos Cards */
            .sr-mkt-selo-vendas {
                display: inline-block;
                background: rgba(198, 40, 40, 0.22);
                border: 1px solid #C62828;
                color: #ffca28;
                font-size: 11px;
                font-weight: bold;
                padding: 3px 8px;
                border-radius: 10px;
                margin: 4px 0 6px 0;
            }
            .sr-mkt-barra-fogo-wrap {
                width: 85%;
                margin: 4px auto 8px auto;
                background: #262626;
                border-radius: 10px;
                height: 14px;
                position: relative;
                overflow: hidden;
                border: 1px solid #444;
            }
            .sr-mkt-barra-fogo-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff5722, #ffca28);
            }
            .sr-mkt-barra-fogo-txt {
                position: absolute;
                inset: 0;
                font-size: 10px;
                font-weight: bold;
                color: #ffffff;
                text-shadow: 0 1px 2px #000;
                line-height: 13px;
                text-align: center;
            }

            /* Seção Vistos Recentemente (Mercado Livre) */
            #sr-mkt-vistos-sec {
                width: 90%;
                max-width: 1400px;
                margin: 28px auto;
                background: #121212;
                border: 1px solid #333;
                border-radius: 16px;
                padding: 18px;
            }
            .sr-mkt-vistos-grid {
                display: flex;
                gap: 14px;
                overflow-x: auto;
                padding: 10px 4px;
            }
            .sr-mkt-visto-card {
                min-width: 155px;
                max-width: 155px;
                background: #1a1a1a;
                border: 1px solid #C62828;
                border-radius: 12px;
                padding: 10px;
                text-align: center;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .sr-mkt-visto-card:hover {
                transform: translateY(-4px);
                border-color: #ffca28;
            }
            .sr-mkt-visto-card img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 6px;
            }

            /* Blocos CEP, Perguntas & Avaliações nos Modais */
            .sr-mkt-ml-box {
                margin: 12px 20px;
                padding: 12px;
                background: #141414;
                border: 1px solid #333;
                border-radius: 12px;
                text-align: left;
                font-size: 13px;
            }
            .sr-mkt-qa-item {
                background: #1c1c1c;
                border-left: 3px solid #00e676;
                padding: 7px 10px;
                border-radius: 6px;
                margin-top: 6px;
                font-size: 12px;
            }
            .sr-mkt-review-item {
                background: #1a1a1a;
                border-left: 3px solid #ffca28;
                padding: 8px 10px;
                border-radius: 6px;
                margin-top: 7px;
                font-size: 12px;
            }
            .sr-mkt-tag-chip {
                display: inline-block;
                background: #262626;
                border: 1px solid #555;
                color: #ddd;
                border-radius: 12px;
                padding: 3px 9px;
                font-size: 11px;
                margin: 3px 3px 0 0;
                cursor: pointer;
            }
            .sr-mkt-tag-chip.ativa {
                border-color: #00e676;
                color: #00e676;
                background: #102618;
            }

            /* Modais Marketplace */
            dialog#sr-mkt-dialog {
                background: linear-gradient(160deg, #181818 0%, #0d0d0d 100%);
                color: #ffffff;
                border: 2px solid #ffca28;
                border-radius: 18px;
                padding: 24px;
                max-width: 540px;
                width: 92%;
                box-shadow: 0 14px 40px rgba(0, 0, 0, 0.94);
                text-align: center;
            }
            dialog#sr-mkt-dialog::backdrop {
                background: rgba(0, 0, 0, 0.84);
                backdrop-filter: blur(3px);
            }
            .sr-mkt-dias-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 6px;
                margin: 14px 0;
            }
            .sr-mkt-dia-card {
                background: #1e1e1e;
                border: 1px solid #444;
                border-radius: 10px;
                padding: 8px 4px;
                font-size: 11px;
            }
            .sr-mkt-dia-card.coletado {
                background: #2b1d07;
                border-color: #ffca28;
                color: #ffca28;
            }
            .sr-mkt-cupom-ticket {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #260b0b, #161616);
                border: 1px dashed #ffca28;
                border-radius: 12px;
                padding: 12px;
                margin-bottom: 10px;
                text-align: left;
            }
            .sr-mkt-baus-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin: 16px 0;
            }
            .sr-mkt-bau-card {
                background: linear-gradient(180deg, #260d0d 0%, #141414 100%);
                border: 2px solid #ffca28;
                border-radius: 14px;
                padding: 18px 8px;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .sr-mkt-bau-card:hover {
                transform: translateY(-6px) scale(1.04);
                box-shadow: 0 10px 24px rgba(255, 202, 40, 0.4);
            }
            .sr-mkt-bau-icone {
                font-size: 40px;
                display: block;
                margin-bottom: 6px;
            }
            .sr-mkt-rank-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #1b1b1b;
                border: 1px solid #333;
                border-radius: 10px;
                padding: 9px 14px;
                margin-bottom: 7px;
                font-size: 13px;
            }
            .sr-mkt-rank-row.voce {
                border-color: #00e676;
                background: #102618;
            }
            .sr-mkt-btn {
                background: #C62828;
                color: #ffffff;
                border: 1px solid #ffca28;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
            }
            .sr-mkt-btn:hover {
                background: #1f1f1f;
            }
            .sr-mkt-btn-sec {
                background: #252525;
                color: #ddd;
                border: 1px solid #555;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
            }

            /* Moeda Flutuante Surpresa */
            @keyframes srMktFlutuar {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(12deg); }
            }
            #sr-mkt-moeda-surpresa {
                position: fixed;
                bottom: 95px;
                right: 28px;
                background: radial-gradient(circle, #ffca28 0%, #d49400 100%);
                color: #000000;
                border: 2px solid #ffffff;
                border-radius: 50px;
                padding: 8px 14px;
                font-size: 13px;
                font-weight: 900;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(255, 202, 40, 0.75);
                z-index: 9998;
                animation: srMktFlutuar 1.2s infinite ease-in-out;
                display: flex;
                align-items: center;
                gap: 6px;
            }
        `;
        document.head.appendChild(style);
    }

    function getCoins() {
        return Number(localStorage.getItem(CHAVES_MKT.coins)) || 0;
    }

    function addCoins(qtd) {
        const novo = getCoins() + qtd;
        localStorage.setItem(CHAVES_MKT.coins, String(novo));
        atualizarBarraSuperior();
        return novo;
    }

    function avisarMkt(msg) {
        if (window.srModal && typeof window.srModal.toast === 'function') {
            window.srModal.toast(msg);
            return;
        }
        const el = document.createElement('div');
        el.textContent = msg;
        el.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: #141414; color: #fff; border: 2px solid #ffca28;
            padding: 10px 20px; border-radius: 12px; font-weight: bold;
            font-size: 14px; z-index: 1000020; box-shadow: 0 8px 25px rgba(0,0,0,0.85);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    function abrirDialogMkt(titulo, corpoHTML, botoesHTML) {
        injetarEstilosMarketplace();
        let dlg = document.getElementById('sr-mkt-dialog');
        if (!dlg) {
            dlg = document.createElement('dialog');
            dlg.id = 'sr-mkt-dialog';
            document.body.appendChild(dlg);
            dlg.addEventListener('click', (e) => {
                if (e.target === dlg) dlg.close();
            });
        }
        dlg.innerHTML = `
            <h2 style="color:#ffca28; font-size:20px; margin:0 0 12px 0;">${titulo}</h2>
            <div>${corpoHTML}</div>
            <div style="margin-top:14px;">${botoesHTML}</div>
        `;
        if (dlg.open) dlg.close();
        dlg.showModal();
        return dlg;
    }

    // ----------------------------------------------------------------------
    // 2. BARRA SUPERIOR UNIFICADA (MOEDAS + CHECK-IN + CUPONS + MISSÃO + BAÚ + RANKING)
    // ----------------------------------------------------------------------
    function atualizarBarraSuperior() {
        let strip = document.getElementById('sr-mkt-top-strip');
        if (!strip) {
            injetarEstilosMarketplace();
            strip = document.createElement('div');
            strip.id = 'sr-mkt-top-strip';
            document.body.prepend(strip);
        }

        const coins = getCoins();
        const hoje = new Date().toDateString();
        const jaFezCheckin = localStorage.getItem(CHAVES_MKT.ultimoCheckin) === hoje;
        const jaAbriuBau = localStorage.getItem(CHAVES_MKT.bauUltimoDia) === hoje;
        const vistosCount = (JSON.parse(localStorage.getItem(CHAVES_MKT.missaoVistos) || '[]')).length;
        const missaoFeita = localStorage.getItem(CHAVES_MKT.missaoResgatada) === 'true';

        strip.innerHTML = `
            <span>🪙 Saldo: <strong style="color:#ffca28;">${coins} Shadow Coins</strong> (= R$ ${(coins * 0.10).toFixed(2).replace('.', ',')})</span>
            <button type="button" class="sr-mkt-pill-btn" id="sr-mkt-open-checkin">
                ${jaFezCheckin ? '✅ Check-in Feito' : '🪙 Moedas Diárias'}
            </button>
            <button type="button" class="sr-mkt-pill-btn destaque-verde" id="sr-mkt-open-bau">
                ${jaAbriuBau ? '📭 Baú Aberto' : '🎁 Baú Misterioso'}
            </button>
            <button type="button" class="sr-mkt-pill-btn" id="sr-mkt-open-cupons">
                🎟️ Cupons
            </button>
            <button type="button" class="sr-mkt-pill-btn" id="sr-mkt-open-missao">
                🎯 Missão (${Math.min(3, vistosCount)}/3) ${missaoFeita ? '✔' : '+30 🪙'}
            </button>
            <button type="button" class="sr-mkt-pill-btn destaque-verde" id="sr-mkt-open-rank">
                🏆 Arena Ranking
            </button>
        `;

        strip.querySelector('#sr-mkt-open-checkin').onclick = abrirModalCheckinDiario;
        strip.querySelector('#sr-mkt-open-bau').onclick = abrirBauMisterioso;
        strip.querySelector('#sr-mkt-open-cupons').onclick = abrirCentralCupons;
        strip.querySelector('#sr-mkt-open-missao').onclick = abrirModalMissao;
        strip.querySelector('#sr-mkt-open-rank').onclick = abrirRankingColecionadores;
    }

    // ----------------------------------------------------------------------
    // 3. CHECK-IN DIÁRIO DE 7 DIAS (ESTILO SHOPEE)
    // ----------------------------------------------------------------------
    function abrirModalCheckinDiario() {
        const hoje = new Date().toDateString();
        const ultimo = localStorage.getItem(CHAVES_MKT.ultimoCheckin);
        let streak = Number(localStorage.getItem(CHAVES_MKT.streakDias)) || 0;
        const jaColetouHoje = ultimo === hoje;
        const premios = [10, 15, 20, 30, 40, 50, 100];

        const diasHtml = premios.map((val, i) => {
            const diaNum = i + 1;
            const ativo = diaNum <= streak;
            return `
                <div class="sr-mkt-dia-card ${ativo ? 'coletado' : ''}">
                    <strong>Dia ${diaNum}</strong><br>
                    🪙 +${val}
                </div>
            `;
        }).join('');

        const dlg = abrirDialogMkt(
            '🪙 Check-in Diário Shadow Coins',
            `
                <p style="font-size:13px; color:#ccc;">Entre todos os dias para acumular moedas e trocar por descontos no carrinho (10 moedas = R$ 1,00):</p>
                <div class="sr-mkt-dias-grid">${diasHtml}</div>
                <p style="font-size:13px; color:#ffca28;">Saldo atual: <strong>${getCoins()} moedas</strong></p>
            `,
            `
                <button type="button" class="sr-mkt-btn" id="sr-mkt-coletar-hoje" ${jaColetouHoje ? 'disabled style="opacity:0.5; cursor:default;"' : ''}>
                    ${jaColetouHoje ? '✅ Moedas de Hoje Coletadas' : '🎁 Coletar Recompensa de Hoje'}
                </button>
                <button type="button" class="sr-mkt-btn-sec" id="sr-mkt-fechar-chk">Fechar</button>
            `
        );

        dlg.querySelector('#sr-mkt-fechar-chk').onclick = () => dlg.close();
        const btnColetar = dlg.querySelector('#sr-mkt-coletar-hoje');
        if (!jaColetouHoje) {
            btnColetar.onclick = () => {
                streak = (streak % 7) + 1;
                const ganho = premios[streak - 1];
                localStorage.setItem(CHAVES_MKT.ultimoCheckin, hoje);
                localStorage.setItem(CHAVES_MKT.streakDias, String(streak));
                addCoins(ganho);
                avisarMkt(`🎉 +${ganho} Shadow Coins adicionadas ao seu saldo!`);
                abrirModalCheckinDiario();
            };
        }
    }

    // ----------------------------------------------------------------------
    // 4. CAIXA MISTERIOSA DIÁRIA ("GACHA / LOOT BOX" ESTILO ALIEXPRESS)
    // ----------------------------------------------------------------------
    function abrirBauMisterioso() {
        const hoje = new Date().toDateString();
        const jaAbriu = localStorage.getItem(CHAVES_MKT.bauUltimoDia) === hoje;

        const dlg = abrirDialogMkt(
            '🎁 Baú Misterioso do Reino das Sombras',
            `
                <p style="font-size:13px; color:#ccc;">
                    ${jaAbriu
                        ? 'Você já abriu o seu baú gratuito de hoje! Volte amanhã para tentar a sorte novamente.'
                        : 'Escolha <strong>1 dos 3 baús selados</strong> abaixo para revelar sua recompensa diária:'}
                </p>
                <div class="sr-mkt-baus-grid">
                    <div class="sr-mkt-bau-card"><span class="sr-mkt-bau-icone">${jaAbriu ? '📭' : '🧰'}</span><strong>Baú Carmesim</strong></div>
                    <div class="sr-mkt-bau-card"><span class="sr-mkt-bau-icone">${jaAbriu ? '📭' : '⚱️'}</span><strong>Relíquia Dourada</strong></div>
                    <div class="sr-mkt-bau-card"><span class="sr-mkt-bau-icone">${jaAbriu ? '📭' : '📦'}</span><strong>Cofre Sombrio</strong></div>
                </div>
                <div id="sr-mkt-bau-resultado"></div>
            `,
            `<button type="button" class="sr-mkt-btn-sec" id="sr-mkt-fechar-bau">Fechar</button>`
        );

        dlg.querySelector('#sr-mkt-fechar-bau').onclick = () => dlg.close();

        if (!jaAbriu) {
            dlg.querySelectorAll('.sr-mkt-bau-card').forEach((card) => {
                card.onclick = () => {
                    if (localStorage.getItem(CHAVES_MKT.bauUltimoDia) === hoje) return;
                    localStorage.setItem(CHAVES_MKT.bauUltimoDia, hoje);

                    const premios = [
                        { tipo: 'coins', valor: 25, texto: '🪙 +25 Shadow Coins!' },
                        { tipo: 'coins', valor: 50, texto: '🔥 SUPER PRÉMIO: +50 Shadow Coins!' },
                        { tipo: 'coins', valor: 80, texto: '👑 JACKPOT LENDÁRIO: +80 Shadow Coins!' },
                        { tipo: 'cupom', codigo: 'GEEK15', texto: '🎟️ Cupom Secreto GEEK15 (15% OFF) copiado!' }
                    ];
                    const sorteado = premios[Math.floor(Math.random() * premios.length)];

                    if (sorteado.tipo === 'coins') {
                        addCoins(sorteado.valor);
                    } else {
                        navigator.clipboard?.writeText(sorteado.codigo);
                        atualizarBarraSuperior();
                    }

                    dlg.querySelectorAll('.sr-mkt-bau-icone').forEach((ic) => { ic.textContent = '✨'; });
                    dlg.querySelector('#sr-mkt-bau-resultado').innerHTML = `
                        <div style="background:#102618; border:1px solid #00e676; border-radius:12px; padding:12px; margin-top:8px;">
                            <strong style="color:#00e676; font-size:16px;">${sorteado.texto}</strong>
                        </div>
                    `;
                    avisarMkt(`🎁 ${sorteado.texto}`);
                };
            });
        }
    }

    // ----------------------------------------------------------------------
    // 5. RANKING DE COLECIONADORES & ARENA SHADOW
    // ----------------------------------------------------------------------
    function abrirRankingColecionadores() {
        const nomeUser = (localStorage.getItem('usuarioAtual') || 'Você (Visitante)').split('@')[0];
        const meusPontos = getCoins() + 120;

        const competidores = [
            { nome: 'Kurogane_99', pts: 680, medalha: '🥇' },
            { nome: 'SakuraCollector', pts: 540, medalha: '🥈' },
            { nome: 'GojoSensei_SC', pts: 410, medalha: '🥉' },
            { nome: `${nomeUser} (Você)`, pts: meusPontos, medalha: '⚡', isVoce: true },
            { nome: 'ZoroEspadachim', pts: 190, medalha: '🏅' }
        ].sort((a, b) => b.pts - a.pts);

        const listaHtml = competidores.map((c, i) => `
            <div class="sr-mkt-rank-row ${c.isVoce ? 'voce' : ''}">
                <span><strong>#${i + 1} ${c.medalha}</strong> ${c.nome}</span>
                <strong style="color:#ffca28;">${c.pts} pts</strong>
            </div>
        `).join('');

        const dlg = abrirDialogMkt(
            '🏆 Ranking Semanal — Arena Shadow',
            `
                <p style="font-size:12px; color:#ccc; margin-bottom:12px;">Suba no ranking abrindo baús diários, avaliando figures e acumulando Shadow Coins!</p>
                ${listaHtml}
            `,
            `<button type="button" class="sr-mkt-btn-sec" id="sr-mkt-fechar-rank">Fechar</button>`
        );
        dlg.querySelector('#sr-mkt-fechar-rank').onclick = () => dlg.close();
    }

    // ----------------------------------------------------------------------
    // 6. CENTRAL DE CUPONS COLETÁVEIS (ESTILO SHOPEE)
    // ----------------------------------------------------------------------
    function abrirCentralCupons() {
        const coletados = JSON.parse(localStorage.getItem(CHAVES_MKT.cuponsColetados) || '[]');
        const listaCupons = [
            { codigo: 'SHADOW26', titulo: '10% OFF em Toda a Loja', regra: 'Válido para qualquer figure do catálogo' },
            { codigo: 'GEEK15', titulo: '15% OFF Colecionador', regra: 'Desconto especial para fãs de anime' },
            { codigo: 'SHADOW50', titulo: '50% OFF VIP Relâmpago', regra: 'Super desconto exclusivo Shadow Realm' }
        ];

        const cardsHtml = listaCupons.map((c) => {
            const pego = coletados.includes(c.codigo);
            return `
                <div class="sr-mkt-cupom-ticket">
                    <div>
                        <strong style="color:#ffca28; font-size:15px;">${c.titulo}</strong><br>
                        <small style="color:#ccc;">${c.regra} • Código: <strong>${c.codigo}</strong></small>
                    </div>
                    <button type="button" class="${pego ? 'sr-mkt-btn-sec' : 'sr-mkt-btn'}" data-pegar-cupom="${c.codigo}">
                        ${pego ? '✔ Coletado' : 'Pegar'}
                    </button>
                </div>
            `;
        }).join('');

        const dlg = abrirDialogMkt(
            '🎟️ Central de Cupons Coletáveis',
            cardsHtml,
            `<button type="button" class="sr-mkt-btn-sec" id="sr-mkt-fechar-cup">Fechar</button>`
        );

        dlg.querySelector('#sr-mkt-fechar-cup').onclick = () => dlg.close();
        dlg.querySelectorAll('[data-pegar-cupom]').forEach((btn) => {
            btn.onclick = () => {
                const cod = btn.getAttribute('data-pegar-cupom');
                const atuais = JSON.parse(localStorage.getItem(CHAVES_MKT.cuponsColetados) || '[]');
                if (!atuais.includes(cod)) {
                    atuais.push(cod);
                    localStorage.setItem(CHAVES_MKT.cuponsColetados, JSON.stringify(atuais));
                }
                navigator.clipboard?.writeText(cod);
                avisarMkt(`🎟️ Cupom ${cod} coletado e copiado! Use no carrinho.`);
                abrirCentralCupons();
            };
        });
    }

    // ----------------------------------------------------------------------
    // 7. MISSÃO DE NAVEGAÇÃO (VISITAR 3 FIGURES PARA GANHAR +30 COINS)
    // ----------------------------------------------------------------------
    function abrirModalMissao() {
        const vistos = JSON.parse(localStorage.getItem(CHAVES_MKT.missaoVistos) || '[]');
        const resgatada = localStorage.getItem(CHAVES_MKT.missaoResgatada) === 'true';
        const completa = vistos.length >= 3;

        const dlg = abrirDialogMkt(
            '🎯 Missão Explorador Geek',
            `
                <p style="font-size:14px; color:#ddd;">Clique para ver detalhes de <strong>3 figures diferentes</strong> no catálogo e ganhe <strong>+30 Shadow Coins</strong>!</p>
                <div style="margin:14px 0; font-size:16px; color:#ffca28;">
                    Progresso: <strong>${Math.min(3, vistos.length)} / 3 figures visualizadas</strong>
                </div>
            `,
            `
                <button type="button" class="sr-mkt-btn" id="sr-mkt-resgatar-missao" ${(!completa || resgatada) ? 'disabled style="opacity:0.5; cursor:default;"' : ''}>
                    ${resgatada ? '✅ Recompensa Resgatada' : completa ? '🎁 Resgatar +30 Moedas' : 'Explore mais figures...'}
                </button>
                <button type="button" class="sr-mkt-btn-sec" id="sr-mkt-fechar-mis">Fechar</button>
            `
        );

        dlg.querySelector('#sr-mkt-fechar-mis').onclick = () => dlg.close();
        if (completa && !resgatada) {
            dlg.querySelector('#sr-mkt-resgatar-missao').onclick = () => {
                localStorage.setItem(CHAVES_MKT.missaoResgatada, 'true');
                addCoins(30);
                avisarMkt('🎉 Missão concluída! +30 Shadow Coins ganhas!');
                abrirModalMissao();
            };
        }
    }

    // ----------------------------------------------------------------------
    // 8. OFERTAS RELÂMPAGO COM CRONÓMETRO & SELOS DE POPULARIDADE NOS CARDS
    // ----------------------------------------------------------------------
    function iniciarOfertasRelampagoESelos() {
        const vitrine = document.querySelector('.destaques');
        if (!vitrine) return;

        injetarEstilosMarketplace();

        if (!document.getElementById('sr-mkt-flash-banner')) {
            const banner = document.createElement('div');
            banner.id = 'sr-mkt-flash-banner';
            banner.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:22px;">⚡</span>
                    <div>
                        <strong style="color:#ffca28; font-size:16px; letter-spacing:0.5px;">OFERTAS RELÂMPAGO SHADOW REALM</strong>
                        <div style="font-size:12px; color:#ccc;">Garanta sua figure antes que o lote promocional acabe!</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:12px; color:#aaa;">Termina em:</span>
                    <span class="sr-mkt-relogio-box" id="sr-mkt-hh">02</span>:
                    <span class="sr-mkt-relogio-box" id="sr-mkt-mm">45</span>:
                    <span class="sr-mkt-relogio-box" id="sr-mkt-ss">00</span>
                </div>
            `;
            vitrine.parentNode.insertBefore(banner, vitrine);

            setInterval(() => {
                const agora = new Date();
                const fimCiclo = new Date();
                fimCiclo.setHours(23, 59, 59, 999);
                const diff = Math.max(0, fimCiclo - agora);
                const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
                const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
                const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');

                const elH = document.getElementById('sr-mkt-hh');
                const elM = document.getElementById('sr-mkt-mm');
                const elS = document.getElementById('sr-mkt-ss');
                if (elH) elH.textContent = h;
                if (elM) elM.textContent = m;
                if (elS) elS.textContent = s;
            }, 1000);
        }

        function decorarCards() {
            const cards = Array.from(vitrine.children).filter((el) => el.tagName === 'DIV');
            cards.forEach((card, idx) => {
                if (card.dataset.srMktDecorado) return;
                card.dataset.srMktDecorado = 'true';

                const nome = card.querySelector('p')?.innerText.trim() || 'Figure';
                const imagem = card.querySelector('img')?.getAttribute('src') || 'imagens/produto.png';
                const precoTxt = card.querySelector('h3')?.innerText || 'R$ 0,00';

                card.addEventListener('click', () => {
                    registarVistoRecentemente({ nome, imagem, precoTxt });
                });

                const vendidos = 18 + ((idx * 13) % 65);
                const pctLote = Math.min(94, 55 + ((idx * 11) % 38));

                const selo = document.createElement('div');
                selo.className = 'sr-mkt-selo-vendas';
                selo.textContent = `🔥 +${vendidos} vendidos este mês`;

                const barra = document.createElement('div');
                barra.className = 'sr-mkt-barra-fogo-wrap';
                barra.innerHTML = `
                    <div class="sr-mkt-barra-fogo-fill" style="width:${pctLote}%;"></div>
                    <span class="sr-mkt-barra-fogo-txt">${pctLote}% DO LOTE GARANTIDO</span>
                `;

                const h3 = card.querySelector('h3');
                if (h3) {
                    h3.insertAdjacentElement('afterend', selo);
                    selo.insertAdjacentElement('afterend', barra);
                }
            });
        }

        decorarCards();
        new MutationObserver(decorarCards).observe(vitrine, { childList: true });
    }

    // ----------------------------------------------------------------------
    // 9. VISTOS RECENTEMENTE (ESTILO MERCADO LIVRE)
    // ----------------------------------------------------------------------
    function registarVistoRecentemente(item) {
        let lista = JSON.parse(localStorage.getItem(CHAVES_MKT.vistosRecentemente) || '[]');
        lista = lista.filter((x) => x.nome !== item.nome);
        lista.unshift(item);
        if (lista.length > 8) lista = lista.slice(0, 8);
        localStorage.setItem(CHAVES_MKT.vistosRecentemente, JSON.stringify(lista));

        const missao = JSON.parse(localStorage.getItem(CHAVES_MKT.missaoVistos) || '[]');
        if (!missao.includes(item.nome)) {
            missao.push(item.nome);
            localStorage.setItem(CHAVES_MKT.missaoVistos, JSON.stringify(missao));
            atualizarBarraSuperior();
        }

        renderizarVistosRecentemente();
    }

    function renderizarVistosRecentemente() {
        const lista = JSON.parse(localStorage.getItem(CHAVES_MKT.vistosRecentemente) || '[]');
        if (lista.length === 0) return;

        const footer = document.querySelector('footer');
        if (!footer) return;

        injetarEstilosMarketplace();
        let sec = document.getElementById('sr-mkt-vistos-sec');
        if (!sec) {
            sec = document.createElement('section');
            sec.id = 'sr-mkt-vistos-sec';
            footer.parentNode.insertBefore(sec, footer);
        }

        const cardsHtml = lista.map((p) => `
            <div class="sr-mkt-visto-card" onclick="window.location.href='produtos.html?busca=${encodeURIComponent(p.nome)}'">
                <img src="${p.imagem}" alt="${p.nome}">
                <div style="font-size:12px; color:#fff; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.nome}</div>
                <div style="font-size:12px; color:#ffca28; margin-top:4px;">${p.precoTxt}</div>
            </div>
        `).join('');

        sec.innerHTML = `
            <h3 style="color:#ffca28; font-size:17px; margin:0 0 8px 0; text-align:left;">👀 Vistos Recentemente por Você</h3>
            <div class="sr-mkt-vistos-grid">${cardsHtml}</div>
        `;
    }

    // ----------------------------------------------------------------------
    // 10. CEP + PERGUNTE AO VENDEDOR + AVALIAÇÕES (+15 COINS) + ALERTA DE PREÇO NOS MODAIS
    // ----------------------------------------------------------------------
    function enriquecerModaisUnificados() {
        injetarEstilosMarketplace();

        function processarModais() {
            document.querySelectorAll('dialog.modalProduto').forEach((modal) => {
                const footer = modal.querySelector('.modal-footer');
                const titulo = modal.querySelector('h2')?.innerText.trim() || 'Figure';
                if (!footer || modal.querySelector('.sr-mkt-ml-box')) return;

                const alertas = JSON.parse(localStorage.getItem(CHAVES_MKT.alertasPreco) || '[]');
                const jaAlertado = alertas.includes(titulo);

                const box = document.createElement('div');
                box.className = 'sr-mkt-ml-box';
                box.innerHTML = `
                    <!-- Calculadora de CEP -->
                    <div style="margin-bottom:10px;">
                        <strong style="color:#00e676;">🚚 Calcular Frete & Prazo (CEP):</strong>
                        <div style="display:flex; gap:6px; margin-top:6px;">
                            <input type="text" class="sr-mkt-cep-input" maxlength="9" placeholder="00000-000" style="width:130px; padding:6px 10px; border-radius:8px; background:#0d0d0d; color:#fff; border:1px solid #C62828; font-size:12px; margin:0;">
                            <button type="button" class="sr-mkt-btn sr-mkt-calc-cep">Calcular</button>
                            <button type="button" class="sr-mkt-btn-sec sr-mkt-btn-alerta" style="margin-left:auto; font-size:11px;">
                                ${jaAlertado ? '🔔 Alerta Ativo' : '🔔 Avise-me se Baixar'}
                            </button>
                        </div>
                        <div class="sr-mkt-cep-res" style="margin-top:6px; font-size:12px; color:#ffca28;"></div>
                    </div>

                    <hr style="border-color:#2b2b2b; margin:10px 0;">

                    <!-- Avaliações com Estrelas (+15 Coins) -->
                    <div style="margin-bottom:10px;">
                        <strong style="color:#ffca28;">⭐ Avaliações de Quem Comprou:</strong>
                        <div style="margin-top:6px;">
                            <select class="sr-mkt-nota-sel" style="padding:5px 8px; border-radius:8px; background:#0d0d0d; color:#ffca28; border:1px solid #C62828; font-size:12px;">
                                <option value="5">★★★★★ (5.0 - Perfeita)</option>
                                <option value="4">★★★★☆ (4.0 - Muito Boa)</option>
                                <option value="3">★★★☆☆ (3.0 - Boa)</option>
                            </select>
                            <div style="margin-top:4px;">
                                <span class="sr-mkt-tag-chip" data-tag="Pintura impecável">Pintura impecável</span>
                                <span class="sr-mkt-tag-chip" data-tag="Caixa super protegida">Caixa super protegida</span>
                                <span class="sr-mkt-tag-chip" data-tag="Entrega rápida">Entrega rápida</span>
                            </div>
                            <div style="display:flex; gap:6px; margin-top:6px;">
                                <input type="text" class="sr-mkt-review-input" placeholder="Avalie esta figure e ganhe +15 Shadow Coins..." style="flex:1; padding:6px 10px; border-radius:8px; background:#0d0d0d; color:#fff; border:1px solid #C62828; font-size:12px; margin:0;">
                                <button type="button" class="sr-mkt-btn sr-mkt-enviar-review">Avaliar</button>
                            </div>
                        </div>
                        <div class="sr-mkt-reviews-lista"></div>
                    </div>

                    <hr style="border-color:#2b2b2b; margin:10px 0;">

                    <!-- Pergunte ao Vendedor -->
                    <div>
                        <strong style="color:#00e676;">❓ Pergunte ao Vendedor:</strong>
                        <div style="display:flex; gap:6px; margin-top:6px;">
                            <input type="text" class="sr-mkt-qa-input" placeholder="Ex: Acompanha caixa original?" style="flex:1; padding:6px 10px; border-radius:8px; background:#0d0d0d; color:#fff; border:1px solid #C62828; font-size:12px; margin:0;">
                            <button type="button" class="sr-mkt-btn sr-mkt-enviar-qa">Perguntar</button>
                        </div>
                        <div class="sr-mkt-qa-lista"></div>
                    </div>
                `;

                footer.insertAdjacentElement('beforebegin', box);

                // CEP
                const inpCep = box.querySelector('.sr-mkt-cep-input');
                const resCep = box.querySelector('.sr-mkt-cep-res');
                box.querySelector('.sr-mkt-calc-cep').onclick = () => {
                    const digitos = inpCep.value.replace(/\D/g, '');
                    if (digitos.length !== 8) {
                        resCep.textContent = '⚠️ Digite um CEP válido com 8 números.';
                        return;
                    }
                    const prefixo = Number(digitos.charAt(0));
                    const prazo = (prefixo >= 8 || prefixo <= 3) ? '3 a 5 dias úteis' : '6 a 9 dias úteis';
                    resCep.innerHTML = `✅ Chegará em <strong>${prazo}</strong> • Frete Grátis acima de R$ 250,00!`;
                };

                // Alerta de Preço
                const btnAlerta = box.querySelector('.sr-mkt-btn-alerta');
                btnAlerta.onclick = () => {
                    const lista = JSON.parse(localStorage.getItem(CHAVES_MKT.alertasPreco) || '[]');
                    if (!lista.includes(titulo)) {
                        lista.push(titulo);
                        localStorage.setItem(CHAVES_MKT.alertasPreco, JSON.stringify(lista));
                        btnAlerta.textContent = '🔔 Alerta Ativo';
                        avisarMkt(`🔔 Você será avisado se "${titulo}" baixar de preço!`);
                    }
                };

                // Tags e Avaliações
                box.querySelectorAll('.sr-mkt-tag-chip').forEach((chip) => {
                    chip.onclick = () => chip.classList.toggle('ativa');
                });

                const listaReviews = box.querySelector('.sr-mkt-reviews-lista');
                const renderReviews = () => {
                    const todas = JSON.parse(localStorage.getItem(CHAVES_MKT.avaliacoesProdutos) || '{}');
                    const itens = todas[titulo] || [
                        { autor: 'Lucas M.', estrelas: 5, tag: 'Pintura impecável', texto: 'Detalhes absurdos na resina, chegou super protegida!' }
                    ];
                    listaReviews.innerHTML = itens.map((r) => `
                        <div class="sr-mkt-review-item">
                            <div style="display:flex; justify-content:space-between;">
                                <strong style="color:#fff;">${r.autor}</strong>
                                <span style="color:#ffca28;">${'★'.repeat(r.estrelas)}</span>
                            </div>
                            ${r.tag ? `<small style="color:#00e676;">✔ ${r.tag}</small><br>` : ''}
                            <span style="color:#ddd;">${r.texto}</span>
                        </div>
                    `).join('');
                };
                renderReviews();

                box.querySelector('.sr-mkt-enviar-review').onclick = () => {
                    const inp = box.querySelector('.sr-mkt-review-input');
                    const texto = inp.value.trim();
                    if (!texto) return;

                    const estrelas = Number(box.querySelector('.sr-mkt-nota-sel').value) || 5;
                    const tagsAtivas = Array.from(box.querySelectorAll('.sr-mkt-tag-chip.ativa')).map((t) => t.dataset.tag).join(' • ');
                    const autor = (localStorage.getItem('usuarioAtual') || 'Colecionador').split('@')[0];

                    const todas = JSON.parse(localStorage.getItem(CHAVES_MKT.avaliacoesProdutos) || '{}');
                    if (!todas[titulo]) todas[titulo] = [];
                    todas[titulo].unshift({ autor, estrelas, tag: tagsAtivas, texto });
                    localStorage.setItem(CHAVES_MKT.avaliacoesProdutos, JSON.stringify(todas));

                    inp.value = '';
                    addCoins(15);
                    renderReviews();
                    avisarMkt('⭐ Avaliação publicada! +15 Shadow Coins ganhas!');
                };

                // Pergunte ao Vendedor
                const inpQa = box.querySelector('.sr-mkt-qa-input');
                const listaQa = box.querySelector('.sr-mkt-qa-lista');
                const renderQa = () => {
                    const todas = JSON.parse(localStorage.getItem(CHAVES_MKT.perguntasProdutos) || '{}');
                    const itens = todas[titulo] || [
                        { p: 'O produto é novo e vai bem embalado?', r: 'Sim! Produto novo, lacrado e enviado com proteção reforçada.' }
                    ];
                    listaQa.innerHTML = itens.map((q) => `
                        <div class="sr-mkt-qa-item">
                            <div><strong>P:</strong> ${q.p}</div>
                            <div style="color:#00e676; margin-top:2px;"><strong>R:</strong> ${q.r}</div>
                        </div>
                    `).join('');
                };
                renderQa();

                box.querySelector('.sr-mkt-enviar-qa').onclick = () => {
                    const pergunta = inpQa.value.trim();
                    if (!pergunta) return;
                    const todas = JSON.parse(localStorage.getItem(CHAVES_MKT.perguntasProdutos) || '{}');
                    if (!todas[titulo]) todas[titulo] = [];
                    todas[titulo].unshift({
                        p: pergunta,
                        r: 'Olá, colecionador! Sim, peça em resina 1/6 original com envio imediato e garantia total.'
                    });
                    localStorage.setItem(CHAVES_MKT.perguntasProdutos, JSON.stringify(todas));
                    inpQa.value = '';
                    renderQa();
                    avisarMkt('❓ Pergunta respondida pelo vendedor!');
                };
            });
        }

        processarModais();
        const vitrine = document.querySelector('.destaques');
        if (vitrine) {
            new MutationObserver(processarModais).observe(vitrine, { childList: true });
        }
    }

    // ----------------------------------------------------------------------
    // 11. CARRINHO: RESGATE DE SHADOW COINS + COMBO COMPRE JUNTO (10% OFF)
    // ----------------------------------------------------------------------
    function integrarExtrasNoCarrinho() {
        const resumo = document.querySelector('.checkout-summary');
        if (!resumo) return;

        // A) Resgate de Shadow Coins
        const coins = getCoins();
        if (coins > 0 && !document.getElementById('sr-mkt-coins-checkout')) {
            const descontoReais = coins * 0.10;
            const box = document.createElement('div');
            box.id = 'sr-mkt-coins-checkout';
            box.style.cssText = 'background:#1c1608; border:1px solid #ffca28; border-radius:10px; padding:10px; margin:10px 0; font-size:12px; text-align:center;';
            box.innerHTML = `
                <label style="display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; color:#ffca28; font-weight:bold;">
                    <input type="checkbox" id="sr-mkt-chk-coins" style="width:16px; height:16px; accent-color:#ffca28; margin:0;">
                    <span>🪙 Usar ${coins} Shadow Coins (-R$ ${descontoReais.toFixed(2).replace('.', ',')})</span>
                </label>
            `;
            resumo.prepend(box);

            document.getElementById('sr-mkt-chk-coins').onchange = (e) => {
                const summaryPrices = document.getElementById('summary-prices');
                const summaryTotal = document.getElementById('summary-total');
                if (!summaryPrices || !summaryTotal) return;

                const spanTotal = summaryTotal.querySelector('span');
                const atual = parseFloat(spanTotal.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;

                if (e.target.checked) {
                    const p = document.createElement('p');
                    p.id = 'sr-mkt-linha-coins';
                    p.className = 'price-item';
                    p.style.color = '#ffca28';
                    p.textContent = `Desconto Shadow Coins (${coins}): - R$ ${descontoReais.toFixed(2).replace('.', ',')}`;
                    summaryPrices.appendChild(p);
                    spanTotal.textContent = `R$ ${Math.max(0, atual - descontoReais).toFixed(2).replace('.', ',')}`;
                } else {
                    document.getElementById('sr-mkt-linha-coins')?.remove();
                    spanTotal.textContent = `R$ ${(atual + descontoReais).toFixed(2).replace('.', ',')}`;
                }
            };
        }

        // B) Combo Compre Junto (+10% OFF na 2ª peça)
        const carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];
        if (carrinho.length > 0 && !document.getElementById('sr-mkt-combo-box')) {
            const sugestoes = [
                { nome: 'Satoru Gojo', preco: 289.90, imagem: 'imagens/gojo.png' },
                { nome: 'Levi Ackerman', preco: 269.90, imagem: 'imagens/levi.png' },
                { nome: 'Monkey D. Luffy', preco: 249.90, imagem: 'imagens/luffy.png' }
            ];
            const sugestao = sugestoes.find((s) => !carrinho.some((c) => c.nome.toLowerCase().includes(s.nome.toLowerCase())));
            if (sugestao) {
                const precoCombo = (sugestao.preco * 0.90).toFixed(2).replace('.', ',');
                const boxCombo = document.createElement('div');
                boxCombo.id = 'sr-mkt-combo-box';
                boxCombo.style.cssText = 'background:linear-gradient(135deg, #240b0b, #141414); border:1px dashed #00e676; border-radius:12px; padding:10px; margin:10px 0; font-size:12px; text-align:center;';
                boxCombo.innerHTML = `
                    <strong style="color:#00e676; display:block; margin-bottom:4px;">⚡ COMPRE JUNTO (+10% OFF NA 2ª PEÇA)</strong>
                    <span style="color:#eee;">Leve também <strong>${sugestao.nome}</strong> por apenas <strong style="color:#ffca28;">R$ ${precoCombo}</strong>!</span><br>
                    <button type="button" id="sr-mkt-add-combo" class="sr-mkt-btn" style="padding:5px 12px; font-size:11px; margin-top:6px;">+ Adicionar ao Combo</button>
                `;
                resumo.appendChild(boxCombo);

                document.getElementById('sr-mkt-add-combo').onclick = () => {
                    const atual = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];
                    atual.push({
                        nome: `${sugestao.nome} (Combo 10% OFF)`,
                        preco: Number((sugestao.preco * 0.90).toFixed(2)),
                        imagem: sugestao.imagem,
                        quantidade: 1
                    });
                    localStorage.setItem('carrinhoShadowRealm', JSON.stringify(atual));
                    avisarMkt(`🔥 ${sugestao.nome} adicionado ao combo com 10% OFF!`);
                    setTimeout(() => window.location.reload(), 700);
                };
            }
        }
    }

    // ----------------------------------------------------------------------
    // 12. CHUVA DE MOEDAS SURPRESA (CLIQUE RÁPIDO NA TELA PARA GANHAR +5 COINS)
    // ----------------------------------------------------------------------
    function iniciarChuvaDeMoedasSurpresa() {
        const pagina = window.location.pathname.toLowerCase();
        if (pagina.includes('admin') || pagina.includes('estoque')) return;

        injetarEstilosMarketplace();

        function lancarMoeda() {
            if (document.getElementById('sr-mkt-moeda-surpresa')) return;
            const moeda = document.createElement('button');
            moeda.id = 'sr-mkt-moeda-surpresa';
            moeda.type = 'button';
            moeda.innerHTML = '🪙 +5 Coins! Clique!';
            document.body.appendChild(moeda);

            const removerTimer = setTimeout(() => moeda.remove(), 7500);

            moeda.onclick = () => {
                clearTimeout(removerTimer);
                moeda.remove();
                addCoins(5);
                avisarMkt('🪙 Rápido no gatilho! +5 Shadow Coins coletadas!');
            };
        }

        setTimeout(() => {
            lancarMoeda();
            setInterval(lancarMoeda, 45000);
        }, 14000);
    }

    // ----------------------------------------------------------------------
    // INICIALIZAÇÃO AUTOMÁTICA
    // ----------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        atualizarBarraSuperior();
        iniciarOfertasRelampagoESelos();
        renderizarVistosRecentemente();
        enriquecerModaisUnificados();
        integrarExtrasNoCarrinho();
        iniciarChuvaDeMoedasSurpresa();
    });
})();