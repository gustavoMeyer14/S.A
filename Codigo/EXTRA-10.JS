/* ==========================================================================
   EXTRAS-10-FUNCOES-SR.JS — SHADOW REALM STORE
   Módulo 100% isolado (IIFE + prefixo sr-10-).
   Adiciona 10 novas funcionalidades sem alterar os arquivos já existentes
   e sem incluir qualquer funcionalidade de comparação.
   ========================================================================== */
(function () {
    'use strict';

    const CHAVES_10 = {
        notasDesejos: 'sr_10_lista_desejos',
        somAtivo: 'sr_10_som_ativo',
        lembretesLancamento: 'sr_10_lembretes_geek'
    };

    // ----------------------------------------------------------------------
    // 1. ESTILOS EXCLUSIVOS (PREFIXO sr-10-)
    // ----------------------------------------------------------------------
    function injetarEstilos10() {
        if (document.getElementById('sr-10-estilos')) return;
        const style = document.createElement('style');
        style.id = 'sr-10-estilos';
        style.textContent = `
            .sr-10-fab {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: #141414;
                color: #ffffff;
                border: 2px solid #ffca28;
                font-size: 19px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.85);
                transition: transform 0.2s ease, background-color 0.2s ease;
                padding: 0;
                margin: 0;
            }
            .sr-10-fab:hover {
                background: #C62828;
                border-color: #ffffff;
                transform: scale(1.1);
            }
            dialog#sr-10-dialog {
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
            dialog#sr-10-dialog::backdrop {
                background: rgba(0, 0, 0, 0.82);
                backdrop-filter: blur(2px);
            }
            .sr-10-titulo {
                color: #ffca28;
                font-size: 21px;
                margin: 0 0 12px 0;
            }
            .sr-10-btn {
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
            .sr-10-btn:hover {
                background: #1b1b1b;
                box-shadow: 0 0 12px rgba(198, 40, 40, 0.7);
            }
            .sr-10-btn-sec {
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
            .sr-10-btn-sec:hover {
                background: #333;
            }
            /* Barra de Filtro de Preço & Ordenação na Vitrine */
            .sr-10-toolbar-vitrine {
                width: 90%;
                max-width: 1400px;
                margin: 15px auto 5px auto;
                padding: 12px 18px;
                background: #121212;
                border: 1px solid #C62828;
                border-radius: 14px;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                font-size: 13px;
            }
            .sr-10-toolbar-vitrine select {
                background: #1e1e1e;
                color: #fff;
                border: 1px solid #ffca28;
                border-radius: 10px;
                padding: 6px 10px;
                font-size: 13px;
                cursor: pointer;
            }
            /* Barra Progresso Frete Grátis */
            .sr-10-frete-bar-wrap {
                background: #181818;
                border: 1px solid #333;
                border-radius: 10px;
                padding: 10px 12px;
                margin-bottom: 12px;
                font-size: 12px;
                text-align: center;
            }
            .sr-10-frete-track {
                width: 100%;
                height: 8px;
                background: #2b2b2b;
                border-radius: 6px;
                overflow: hidden;
                margin-top: 6px;
            }
            .sr-10-frete-fill {
                height: 100%;
                background: linear-gradient(90deg, #C62828, #00e676);
                transition: width 0.3s ease;
            }
            /* Linha do Tempo Rastreio */
            .sr-10-timeline {
                text-align: left;
                margin: 14px 0;
                padding-left: 14px;
                border-left: 3px solid #ffca28;
            }
            .sr-10-step {
                margin-bottom: 10px;
                font-size: 13px;
            }
            .sr-10-step.pendente {
                opacity: 0.45;
            }
            /* Lista de Desejos / Notas */
            .sr-10-nota-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #1c1c1c;
                border: 1px solid #333;
                border-radius: 10px;
                padding: 8px 12px;
                margin-bottom: 6px;
                font-size: 13px;
                text-align: left;
            }
            /* Botão Voltar ao Topo */
            #sr-10-btn-topo {
                position: fixed;
                bottom: 22px;
                right: 22px;
                width: 46px;
                height: 46px;
                border-radius: 50%;
                background: #C62828;
                color: #ffffff;
                border: 2px solid #ffca28;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.85);
                z-index: 9990;
                display: none;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
            }
            #sr-10-btn-topo:hover {
                transform: translateY(-4px);
                background: #141414;
            }
            /* Selo de Autenticidade no Modal */
            .sr-10-selo-garantia {
                display: inline-block;
                margin: 6px auto 10px auto;
                padding: 5px 12px;
                background: #1b1b1b;
                border: 1px solid #ffca28;
                border-radius: 14px;
                color: #ffca28;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
            }
            .sr-10-selo-garantia:hover {
                background: #2b220a;
            }
            .sr-10-input {
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
        `;
        document.head.appendChild(style);
    }

    function abrirModal10(titulo, corpoHTML, botoesHTML) {
        injetarEstilos10();
        let dlg = document.getElementById('sr-10-dialog');
        if (!dlg) {
            dlg = document.createElement('dialog');
            dlg.id = 'sr-10-dialog';
            document.body.appendChild(dlg);
            dlg.addEventListener('click', (e) => {
                if (e.target === dlg) dlg.close();
            });
        }
        dlg.innerHTML = `
            <h2 class="sr-10-titulo">${titulo}</h2>
            <div>${corpoHTML}</div>
            <div style="margin-top: 14px;">${botoesHTML}</div>
        `;
        if (dlg.open) dlg.close();
        dlg.showModal();
        return dlg;
    }

    function avisar10(msg) {
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
            font-size: 14px; z-index: 1000005; box-shadow: 0 8px 25px rgba(0,0,0,0.85);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    // ----------------------------------------------------------------------
    // ACOPLAMENTO NO DOCK LATERAL (SEM CONFLITO)
    // ----------------------------------------------------------------------
    function acoplarBotoes10NoDock() {
        injetarEstilos10();
        let dock = document.getElementById('sr-nf-dock') || document.getElementById('sr-ext-dock-proprio');

        if (!dock) {
            dock = document.createElement('div');
            dock.id = 'sr-10-dock-proprio';
            dock.style.cssText = 'position:fixed; bottom:22px; left:22px; display:flex; flex-direction:column; gap:8px; z-index:9991;';
            document.body.appendChild(dock);
        }

        const somLigado = localStorage.getItem(CHAVES_10.somAtivo) === 'true';

        const botoes = [
            { id: 'sr-10-btn-quiz', icone: '🎯', titulo: 'Quiz: Qual Figure Combina com Você?', acao: abrirQuizPersonalidade },
            { id: 'sr-10-btn-rastreio', icone: '🚚', titulo: 'Rastreador Visual de Encomenda', acao: abrirRastreadorVisual },
            { id: 'sr-10-btn-notas', icone: '🗒️', titulo: 'Bloco de Desejos do Colecionador', acao: abrirBlocoDesejos },
            { id: 'sr-10-btn-calendario', icone: '📅', titulo: 'Calendário de Lançamentos Geek', acao: abrirCalendarioLancamentos },
            { id: 'sr-10-btn-som', icone: somLigado ? '🔊' : '🔈', titulo: 'Ativar / Desativar Som de Clique', acao: alternarSomCliques }
        ];

        botoes.forEach((b) => {
            if (document.getElementById(b.id)) return;
            const btn = document.createElement('button');
            btn.id = b.id;
            btn.type = 'button';
            btn.className = 'sr-10-fab';
            btn.title = b.titulo;
            btn.textContent = b.icone;
            btn.addEventListener('click', b.acao);
            dock.appendChild(btn);
        });
    }

    // ----------------------------------------------------------------------
    // FUNÇÃO 1: QUIZ DE PERSONALIDADE ANIME
    // ----------------------------------------------------------------------
    function abrirQuizPersonalidade() {
        const dlg = abrirModal10(
            '🎯 Qual Figure Combina com Você?',
            `
                <p style="color:#ccc; font-size:13px; margin-bottom:10px;">Responda às 3 perguntas rápidas e descubra sua relíquia ideal:</p>
                <div style="text-align:left; font-size:13px;">
                    <label style="color:#ffca28; font-weight:bold;">1. Qual estilo de batalha você prefere?</label>
                    <select id="sr-10-q1" class="sr-10-input">
                        <option value="espada">Espadas e técnicas de respiração / lâminas</option>
                        <option value="energia">Poderes oculares, maldições ou energia espiritual</option>
                        <option value="aventura">Aventuras épicas e companheiros de jornada</option>
                    </select>

                    <label style="color:#ffca28; font-weight:bold; display:block; margin-top:8px;">2. Onde você vai expor sua estatueta?</label>
                    <select id="sr-10-q2" class="sr-10-input">
                        <option value="setup">Na mesa do Setup Gamer</option>
                        <option value="estante">Numa estante iluminada de colecionador</option>
                    </select>
                </div>
                <div id="sr-10-quiz-res" style="margin-top:12px;"></div>
            `,
            `
                <button type="button" class="sr-10-btn" id="sr-10-ver-resultado-quiz">✨ Descobrir Minha Figure</button>
                <button type="button" class="sr-10-btn-sec" id="sr-10-fechar-quiz">Fechar</button>
            `
        );

        dlg.querySelector('#sr-10-fechar-quiz').onclick = () => dlg.close();
        dlg.querySelector('#sr-10-ver-resultado-quiz').onclick = () => {
            const q1 = dlg.querySelector('#sr-10-q1').value;
            let recomendacao = { nome: 'Satoru Gojo', desc: 'Aura imponente e detalhes translúcidos perfeitos para destaque!' };

            if (q1 === 'espada') {
                recomendacao = { nome: 'Levi Ackerman', desc: 'Precisão letal e pose dinâmica em escala 1/6!' };
            } else if (q1 === 'aventura') {
                recomendacao = { nome: 'Monkey D. Luffy', desc: 'Espírito livre e acabamento vibrante para sua coleção!' };
            }

            dlg.querySelector('#sr-10-quiz-res').innerHTML = `
                <div style="background:#1c1c1c; border:1px solid #00e676; border-radius:12px; padding:12px;">
                    <strong style="color:#00e676; font-size:15px;">🏆 Resultado: ${recomendacao.nome}</strong>
                    <p style="font-size:12px; color:#ddd; margin:6px 0;">${recomendacao.desc}</p>
                    <button type="button" class="sr-10-btn" onclick="window.location.href='produtos.html?busca=${encodeURIComponent(recomendacao.nome)}'">Ver no Catálogo</button>
                </div>
            `;
        };
    }

    // ----------------------------------------------------------------------
    // FUNÇÃO 2: RASTREADOR VISUAL DE ENCOMENDA COM LINHA DO TEMPO
    // ----------------------------------------------------------------------
    function abrirRastreadorVisual() {
        const pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];
        const ultimoNum = pedidos.length > 0 ? pedidos[pedidos.length - 1].numeroPedido : '';

        const dlg = abrirModal10(
            '🚚 Rastreador Visual de Pedido',
            `
                <p style="color:#ccc; font-size:13px;">Digite o número do seu pedido para acompanhar o trajeto:</p>
                <input type="text" id="sr-10-cod-rastreio" class="sr-10-input" value="${ultimoNum}" placeholder="Ex: 482910">
                <div id="sr-10-rastreio-timeline"></div>
            `,
            `
                <button type="button" class="sr-10-btn" id="sr-10-buscar-rastreio">🔍 Rastrear Agora</button>
                <button type="button" class="sr-10-btn-sec" id="sr-10-fechar-rastreio">Fechar</button>
            `
        );

        dlg.querySelector('#sr-10-fechar-rastreio').onclick = () => dlg.close();
        const renderizarTimeline = () => {
            const num = dlg.querySelector('#sr-10-cod-rastreio').value.replace(/\D/g, '');
            const ped = pedidos.find((p) => String(p.numeroPedido) === num);
            const box = dlg.querySelector('#sr-10-rastreio-timeline');

            if (!num) {
                box.innerHTML = '<p style="color:#ffca28; font-size:13px; margin-top:10px;">Informe um número de pedido válido.</p>';
                return;
            }

            const status = ped ? ped.status : 'Em Preparação';
            const cancelado = status === 'Cancelado' || status === 'Pedido Cancelado';

            if (cancelado) {
                box.innerHTML = `<div style="margin-top:12px; padding:12px; background:#2a0d0d; border:1px solid #C62828; border-radius:10px; color:#ff6b6b;">❌ Pedido #${num} foi cancelado.</div>`;
                return;
            }

            const etapa3Ok = status === 'Enviado' || status === 'Entregue';
            const etapa4Ok = status === 'Entregue';

            box.innerHTML = `
                <div class="sr-10-timeline">
                    <div class="sr-10-step">✅ <strong>1. Pagamento Aprovado</strong> — Pedido #${num} confirmado.</div>
                    <div class="sr-10-step">📦 <strong>2. Proteção & Embalagem</strong> — Caixa reforçada com espuma de alta densidade.</div>
                    <div class="sr-10-step ${etapa3Ok ? '' : 'pendente'}">${etapa3Ok ? '🚚' : '⏳'} <strong>3. Em Transporte</strong> — Objeto encaminhado para sua cidade.</div>
                    <div class="sr-10-step ${etapa4Ok ? '' : 'pendente'}">${etapa4Ok ? '🎉' : '⏳'} <strong>4. Entregue</strong> — Relíquia entregue ao colecionador.</div>
                </div>
            `;
        };

        dlg.querySelector('#sr-10-buscar-rastreio').onclick = renderizarTimeline;
        if (ultimoNum) renderizarTimeline();
    }

    // ----------------------------------------------------------------------
    // FUNÇÃO 3: BLOCO DE DESEJOS / ANOTAÇÕES DO COLECIONADOR
    // ----------------------------------------------------------------------
    function abrirBlocoDesejos() {
        function renderizarNotas() {
            const notas = JSON.parse(localStorage.getItem(CHAVES_10.notasDesejos) || '[]');
            const listaHtml = notas.length === 0
                ? '<p style="color:#888; font-size:13px;">Nenhuma anotação salva ainda.</p>'
                : notas.map((n, idx) => `
                    <div class="sr-10-nota-item">
                        <span style="text-decoration:${n.feito ? 'line-through' : 'none'}; color:${n.feito ? '#777' : '#fff'};">
                            <strong style="color:#ffca28;">[${n.prioridade}]</strong> ${n.texto}
                        </span>
                        <div>
                            <button type="button" data-toggle="${idx}" style="background:#1b3b24; color:#00e676; border:1px solid #00e676; border-radius:6px; padding:3px 7px; cursor:pointer; font-size:11px;">✔</button>
                            <button type="button" data-del="${idx}" style="background:#3b1414; color:#ff6b6b; border:1px solid #C62828; border-radius:6px; padding:3px 7px; cursor:pointer; font-size:11px;">✕</button>
                        </div>
                    </div>
                `).join('');

            const dlg = abrirModal10(
                '🗒️ Lista de Metas do Colecionador',
                `
                    <div style="display:flex; gap:6px; margin-bottom:12px;">
                        <input type="text" id="sr-10-nova-nota" placeholder="Ex: Comprar Zoro Escala 1/6..." style="flex:1; padding:8px; border-radius:8px; background:#0d0d0d; color:#fff; border:1px solid #C62828; font-size:13px;">
                        <select id="sr-10-prio-nota" style="padding:8px; border-radius:8px; background:#1e1e1e; color:#ffca28; border:1px solid #C62828; font-size:12px;">
                            <option value="Alta">Alta</option>
                            <option value="Média" selected>Média</option>
                            <option value="Baixa">Baixa</option>
                        </select>
                    </div>
                    <div style="max-height:220px; overflow-y:auto;">${listaHtml}</div>
                `,
                `
                    <button type="button" class="sr-10-btn" id="sr-10-add-nota">+ Adicionar Meta</button>
                    <button type="button" class="sr-10-btn-sec" id="sr-10-fechar-notas">Fechar</button>
                `
            );

            dlg.querySelector('#sr-10-fechar-notas').onclick = () => dlg.close();
            dlg.querySelector('#sr-10-add-nota').onclick = () => {
                const txt = dlg.querySelector('#sr-10-nova-nota').value.trim();
                const prio = dlg.querySelector('#sr-10-prio-nota').value;
                if (!txt) return;
                notas.push({ texto: txt, prioridade: prio, feito: false });
                localStorage.setItem(CHAVES_10.notasDesejos, JSON.stringify(notas));
                renderizarNotas();
            };

            dlg.querySelectorAll('[data-toggle]').forEach((b) => {
                b.onclick = () => {
                    const i = Number(b.getAttribute('data-toggle'));
                    notas[i].feito = !notas[i].feito;
                    localStorage.setItem(CHAVES_10.notasDesejos, JSON.stringify(notas));
                    renderizarNotas();
                };
            });

            dlg.querySelectorAll('[data-del]').forEach((b) => {
                b.onclick = () => {
                    const i = Number(b.getAttribute('data-del'));
                    notas.splice(i, 1);
                    localStorage.setItem(CHAVES_10.notasDesejos, JSON.stringify(notas));
                    renderizarNotas();
                };
            });
        }
        renderizarNotas();
    }

    // ----------------------------------------------------------------------
    // FUNÇÃO 4: FEEDBACK SONORO DE CLIQUE (WEB AUDIO API SEM MP3 EXTERNO)
    // ----------------------------------------------------------------------
    function tocarBipSutil() {
        if (localStorage.getItem(CHAVES_10.somAtivo) !== 'true') return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.06);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.07);
        } catch {}
    }

    function alternarSomCliques() {
        const atual = localStorage.getItem(CHAVES_10.somAtivo) === 'true';
        const novo = !atual;
        localStorage.setItem(CHAVES_10.somAtivo, String(novo));
        const btn = document.getElementById('sr-10-btn-som');
        if (btn) btn.textContent = novo ? '🔊' : '🔈';
        if (novo) tocarBipSutil();
        avisar10(novo ? '🔊 Efeitos sonoros ativados!' : '🔈 Efeitos sonoros silenciados.');
    }

    // ----------------------------------------------------------------------
    // FUNÇÕES 5 & 6: FILTRO DE PREÇO + ORDENAÇÃO INSTANTÂNEA NA VITRINE
    // (ESTRICTAMENTE SEM COMPARAÇÃO DE PRODUTOS)
    // ----------------------------------------------------------------------
    function criarBarraFiltroEOrdenacao() {
        const vitrine = document.querySelector('.destaques');
        if (!vitrine || document.getElementById('sr-10-toolbar')) return;

        injetarEstilos10();
        const bar = document.createElement('div');
        bar.id = 'sr-10-toolbar';
        bar.className = 'sr-10-toolbar-vitrine';
        bar.innerHTML = `
            <span id="sr-10-contador-itens" style="color:#ffca28; font-weight:bold;">🗿 Exibindo catálogo</span>
            <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
                <select id="sr-10-filtro-preco" aria-label="Filtrar por preço">
                    <option value="todos">💰 Preço: Todos</option>
                    <option value="ate200">Até R$ 200,00</option>
                    <option value="200a350">R$ 200,00 a R$ 350,00</option>
                    <option value="acima350">Acima de R$ 350,00</option>
                </select>
                <select id="sr-10-ordenar-vitrine" aria-label="Ordenar catálogo">
                    <option value="padrao">↕️ Ordenar: Padrão</option>
                    <option value="menor">Menor Preço</option>
                    <option value="maior">Maior Preço</option>
                    <option value="az">Nome (A - Z)</option>
                </select>
            </div>
        `;

        vitrine.parentNode.insertBefore(bar, vitrine);

        const selPreco = document.getElementById('sr-10-filtro-preco');
        const selOrdem = document.getElementById('sr-10-ordenar-vitrine');
        const contador = document.getElementById('sr-10-contador-itens');

        function aplicarFiltroEOrdem() {
            const cards = Array.from(vitrine.children).filter((el) => el.tagName === 'DIV');
            const faixa = selPreco.value;
            const ordem = selOrdem.value;

            // Ordenação
            if (ordem !== 'padrao') {
                cards.sort((a, b) => {
                    const nomeA = (a.querySelector('p')?.innerText || '').trim();
                    const nomeB = (b.querySelector('p')?.innerText || '').trim();
                    const precoA = parseFloat((a.querySelector('h3')?.innerText || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                    const precoB = parseFloat((b.querySelector('h3')?.innerText || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;

                    if (ordem === 'menor') return precoA - precoB;
                    if (ordem === 'maior') return precoB - precoA;
                    if (ordem === 'az') return nomeA.localeCompare(nomeB);
                    return 0;
                });
                cards.forEach((c) => vitrine.appendChild(c));
            }

            // Filtro de faixa de preço
            let visiveis = 0;
            cards.forEach((card) => {
                const preco = parseFloat((card.querySelector('h3')?.innerText || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                let mostra = true;
                if (faixa === 'ate200') mostra = preco <= 200;
                else if (faixa === '200a350') mostra = preco > 200 && preco <= 350;
                else if (faixa === 'acima350') mostra = preco > 350;

                card.style.display = mostra ? '' : 'none';
                if (mostra) visiveis++;
            });

            contador.textContent = `🗿 ${visiveis} figure(s) exibida(s)`;
        }

        selPreco.addEventListener('change', aplicarFiltroEOrdem);
        selOrdem.addEventListener('change', aplicarFiltroEOrdem);
        aplicarFiltroEOrdem();
    }

    // ----------------------------------------------------------------------
    // FUNÇÃO 7: BARRA DE PROGRESSO PARA FRETE GRÁTIS NO CARRINHO
    // ----------------------------------------------------------------------
    function criarBarraProgressoFreteGratis() {
        const resumo = document.querySelector('.checkout-summary');
        if (!resumo || document.getElementById('sr-10-frete-progresso')) return;

        const carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];
        if (carrinho.length === 0) return;

        const subtotal = carrinho.reduce((acc, i) => acc + (Number(i.preco) * Number(i.quantidade)), 0);
        const meta = 250;
        const pct = Math.min(100, Math.round((subtotal / meta) * 100));
        const falta = Math.max(0, meta - subtotal);

        const box = document.createElement('div');
        box.id = 'sr-10-frete-progresso';
        box.className = 'sr-10-frete-bar-wrap';
        box.innerHTML = falta === 0
            ? `<span style="color:#00e676; font-weight:bold;">🎉 Parabéns! Você desbloqueou FRETE GRÁTIS!</span>
               <div class="sr-10-frete-track"><div class="sr-10-frete-fill" style="width:100%;"></div></div>`
            : `<span style="color:#ddd;">Faltam <strong style="color:#ffca28;">R$ ${falta.toFixed(2).replace('.', ',')}</strong> para ganhar <strong>FRETE GRÁTIS</strong>!</span>
               <div class="sr-10-frete-track"><div class="sr-10-frete-fill" style="width:${pct}%;"></div></div>`;

        resumo.prepend(box);
    }

    // ----------------------------------------------------------------------
    // FUNÇÃO 8: SELO INTERATIVO DE AUTENTICIDADE NOS MODAIS DE PRODUTO
    // ----------------------------------------------------------------------
    function adicionarSeloAutenticidadeModais() {
        injetarEstilos10();

        function aplicarNosModais() {
            document.querySelectorAll('dialog.modalProduto').forEach((modal) => {
                const conteudo = modal.querySelector('.modalProduto-conteudo');
                const footer = modal.querySelector('.modal-footer');
                if (!conteudo || !footer || modal.querySelector('.sr-10-selo-garantia')) return;

                const selo = document.createElement('div');
                selo.className = 'sr-10-selo-garantia';
                selo.textContent = '🛡️ Selo Oficial de Autenticidade & Garantia';
                selo.onclick = () => {
                    modal.close();
                    const dlg = abrirModal10(
                        '🛡️ Certificado Shadow Realm Store',
                        `
                            <div style="text-align:left; background:#1b1b1b; border:1px solid #ffca28; border-radius:12px; padding:14px; font-size:13px; line-height:1.6;">
                                <p>✔ <strong>Material:</strong> Resina maciça colecionável de alta densidade.</p>
                                <p>✔ <strong>Acabamento:</strong> Pintura artesanal detalhada com verniz protetor UV.</p>
                                <p>✔ <strong>Envio Blindado:</strong> Embalagem com proteção anti-impacto e seguro contra avarias.</p>
                            </div>
                        `,
                        `<button type="button" class="sr-10-btn-sec" id="sr-10-fechar-selo">Entendi</button>`
                    );
                    dlg.querySelector('#sr-10-fechar-selo').onclick = () => dlg.close();
                };
                footer.insertAdjacentElement('beforebegin', selo);
            });
        }

        aplicarNosModais();
        const vitrine = document.querySelector('.destaques');
        if (vitrine) {
            new MutationObserver(aplicarNosModais).observe(vitrine, { childList: true });
        }
    }

    // ----------------------------------------------------------------------
    // FUNÇÃO 9: BOTÃO FLUTUANTE "VOLTAR AO TOPO"
    // ----------------------------------------------------------------------
    function criarBotaoVoltarTopo() {
        if (document.getElementById('sr-10-btn-topo')) return;
        injetarEstilos10();

        const btn = document.createElement('button');
        btn.id = 'sr-10-btn-topo';
        btn.type = 'button';
        btn.title = 'Voltar ao topo';
        btn.textContent = '↑';
        btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 320 ? 'flex' : 'none';
        }, { passive: true });
    }

    // ----------------------------------------------------------------------
    // FUNÇÃO 10: CALENDÁRIO DE LANÇAMENTOS & PRÉ-VENDAS GEEK
    // ----------------------------------------------------------------------
    function abrirCalendarioLancamentos() {
        const salvo = JSON.parse(localStorage.getItem(CHAVES_10.lembretesLancamento) || '[]');
        const lancamentos = [
            { id: 'sukuna-2026', titulo: 'Ryomen Sukuna — Santuário Malevolente (1/6)', data: '15/12/2026' },
            { id: 'zoro-ashura', titulo: 'Roronoa Zoro — Estilo Nove Espadas Ashura', data: '10/01/2027' },
            { id: 'goku-ui', titulo: 'Son Goku — Instinto Superior Completo', data: '28/01/2027' }
        ];

        const itensHtml = lancamentos.map((l) => {
            const marcado = salvo.includes(l.id);
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; background:#1c1c1c; border:1px solid #333; border-radius:10px; padding:10px; margin-bottom:8px; text-align:left; font-size:13px;">
                    <div>
                        <strong style="color:#fff; display:block;">${l.titulo}</strong>
                        <small style="color:#ffca28;">Previsto para: ${l.data}</small>
                    </div>
                    <button type="button" data-lembrar="${l.id}" class="${marcado ? 'sr-10-btn-sec' : 'sr-10-btn'}" style="padding:6px 12px; font-size:12px;">
                        ${marcado ? '🔔 Lembrete Ativo' : 'Lembrar-me'}
                    </button>
                </div>
            `;
        }).join('');

        const dlg = abrirModal10(
            '📅 Próximos Lançamentos & Pré-Vendas',
            itensHtml,
            `<button type="button" class="sr-10-btn-sec" id="sr-10-fechar-cal">Fechar</button>`
        );

        dlg.querySelector('#sr-10-fechar-cal').onclick = () => dlg.close();
        dlg.querySelectorAll('[data-lembrar]').forEach((btn) => {
            btn.onclick = () => {
                const id = btn.getAttribute('data-lembrar');
                const lista = JSON.parse(localStorage.getItem(CHAVES_10.lembretesLancamento) || '[]');
                if (!lista.includes(id)) {
                    lista.push(id);
                    localStorage.setItem(CHAVES_10.lembretesLancamento, JSON.stringify(lista));
                    avisar10('🔔 Você será avisado quando esta pré-venda abrir!');
                    abrirCalendarioLancamentos();
                }
            };
        });
    }

    // ----------------------------------------------------------------------
    // INICIALIZAÇÃO AUTOMÁTICA
    // ----------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        acoplarBotoes10NoDock();
        criarBarraFiltroEOrdenacao();
        criarBarraProgressoFreteGratis();
        adicionarSeloAutenticidadeModais();
        criarBotaoVoltarTopo();

        document.addEventListener('click', (e) => {
            if (e.target.closest('button')) tocarBipSutil();
        });
    });
})();