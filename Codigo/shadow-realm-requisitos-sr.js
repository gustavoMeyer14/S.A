/* shadow-realm-requisitos-sr.js */
// =========================================================
// PACOTE COMPLETO TURBINADO (RF04, RF06, RF07, RF08, RN02-RN06, RNF06)
// SHADOW REALM STORE
// =========================================================

(function () {
    const CHAVES_SR = {
        usuarioLogado: 'usuarioLogado',
        usuarioAtual: 'usuarioAtual',
        usuarioNome: 'usuarioNome',
        clienteLogado: 'clienteLogado',
        pedidos: 'pedidosShadowRealm',
        pesquisas: 'historicoPesquisasShadowRealm',
        notificacoes: 'notificacoesShadowRealm',
        reclamacoes: 'reclamacoesShadowRealm',
        carrinho: 'carrinhoShadowRealm'
    };

    const ETAPAS_RASTREIO = [
        'Pagamento Aprovado',
        'Em Separação & Embalagem Reforçada',
        'Coletado pela Transportadora',
        'Em Trânsito para a Região de Entrega',
        'Saiu para Entrega / Pronto para Retirada',
        'Entregue'
    ];

    function lerJSON(chave, fallback) {
        try {
            const raw = localStorage.getItem(chave);
            if (raw === null || raw === '') return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function salvarJSON(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
        } catch {
            // Ignora erro de quota do navegador
        }
    }

    function esc(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function fmtBRL(v) {
        return (Number(v) || 0).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function getUsuarioEmail() {
        const atual = (localStorage.getItem(CHAVES_SR.usuarioAtual) || '').trim().toLowerCase();
        if (atual) return atual;
        const cliente = lerJSON(CHAVES_SR.clienteLogado, null);
        if (cliente && cliente.email) return String(cliente.email).trim().toLowerCase();
        return 'visitante';
    }

    function getUsuarioNome() {
        const nome = (localStorage.getItem(CHAVES_SR.usuarioNome) || '').trim();
        if (nome) return nome;
        const cliente = lerJSON(CHAVES_SR.clienteLogado, null);
        if (cliente && cliente.nome) return String(cliente.nome).trim();
        return 'Cliente Shadow Realm';
    }

    function normalizarTimestamp(valor, fallbackSeq = 1) {
        if (typeof valor === 'number' && Number.isFinite(valor) && valor > 0) return valor;
        if (typeof valor === 'string' && valor.trim() !== '') {
            const num = Number(valor);
            if (Number.isFinite(num) && num > 0) return num;
            const parsed = Date.parse(valor);
            if (!Number.isNaN(parsed) && parsed > 0) return parsed;
        }
        return fallbackSeq * 1000;
    }

    // ---------------------------------------------------------
    // RF06: NOTIFICAÇÕES EM TEMPO REAL
    // ---------------------------------------------------------
    window.srNotificar = function (titulo, mensagem, tipo = 'info') {
        const lista = lerJSON(CHAVES_SR.notificacoes, []);
        const arr = Array.isArray(lista) ? lista : [];
        const agora = Date.now();
        const nova = {
            id: `n_${agora}_${Math.random().toString(36).slice(2, 6)}`,
            usuarioEmail: getUsuarioEmail(),
            titulo: String(titulo || 'Aviso Shadow Realm'),
            mensagem: String(mensagem || ''),
            tipo,
            lida: false,
            timestamp: agora,
            dataHora: new Date(agora).toLocaleString('pt-BR')
        };
        arr.unshift(nova);
        salvarJSON(CHAVES_SR.notificacoes, arr.slice(0, 80));
        window.dispatchEvent(new CustomEvent('sr:notificacoes-atualizadas', { detail: nova }));
        return nova;
    };

    // ---------------------------------------------------------
    // RF04 / HU03: HISTÓRICO DE COMPRAS E PESQUISAS
    // ---------------------------------------------------------
    window.srRegistrarPesquisa = function (termo, meta = {}) {
        const limpo = String(termo || '').trim();
        const categoria = meta.categoria || 'Todos';
        const preco = meta.preco || 'todos';
        if (!limpo && categoria === 'Todos' && preco === 'todos') return;

        const lista = lerJSON(CHAVES_SR.pesquisas, []);
        const arr = Array.isArray(lista) ? lista : [];
        const agora = Date.now();

        const ultimo = arr[arr.length - 1];
        const rotulo = limpo || `Filtro: ${categoria}`;
        if (ultimo && ultimo.termo === rotulo && ultimo.categoria === categoria && (agora - (ultimo.timestamp || 0)) < 1500) {
            return;
        }

        arr.push({
            id: `p_${agora}_${Math.random().toString(36).slice(2, 6)}`,
            usuarioEmail: getUsuarioEmail(),
            termo: rotulo,
            categoria,
            preco,
            timestamp: agora,
            dataHora: new Date(agora).toLocaleString('pt-BR')
        });
        salvarJSON(CHAVES_SR.pesquisas, arr.slice(-150));
        window.dispatchEvent(new CustomEvent('sr:historico-atualizado', { detail: { tipo: 'pesquisa' } }));
    };

    window.srListarPesquisas = function (ordem = 'recentes') {
        const email = getUsuarioEmail();
        const raw = lerJSON(CHAVES_SR.pesquisas, []);
        const lista = (Array.isArray(raw) ? raw : []).filter((item) => {
            if (!item || !item.termo) return false;
            if (!item.usuarioEmail || email === 'visitante') return true;
            const itemEmail = String(item.usuarioEmail).toLowerCase();
            return itemEmail === email || itemEmail === 'visitante';
        });

        return lista
            .map((item, idx) => ({
                ...item,
                _ts: normalizarTimestamp(item.timestamp, idx + 1)
            }))
            .sort((a, b) => (ordem === 'antigas' ? a._ts - b._ts : b._ts - a._ts));
    };

    window.srListarCompras = function (ordem = 'recentes') {
        const email = getUsuarioEmail();
        const raw = lerJSON(CHAVES_SR.pedidos, []);
        const pedidos = (Array.isArray(raw) ? raw : []).filter((p) => {
            if (!p) return false;
            if (!p.clienteEmail || email === 'visitante') return true;
            return String(p.clienteEmail).toLowerCase() === email;
        });

        return pedidos
            .map((p, idx) => ({
                ...p,
                _ts: normalizarTimestamp(p.timestamp, Number(p.numeroPedido) || (idx + 1))
            }))
            .sort((a, b) => (ordem === 'antigas' ? a._ts - b._ts : b._ts - a._ts));
    };

    // ---------------------------------------------------------
    // RF07 / HU06: SISTEMA DE RECLAMAÇÕES COM PROTOCOLO
    // ---------------------------------------------------------
    window.srCriarReclamacao = function ({ pedidoNumero = '', categoria = 'Pedido / Entrega', descricao = '' }) {
        const protocolo = `SR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const lista = lerJSON(CHAVES_SR.reclamacoes, []);
        const arr = Array.isArray(lista) ? lista : [];
        const agora = Date.now();
        const ticket = {
            protocolo,
            usuarioEmail: getUsuarioEmail(),
            usuarioNome: getUsuarioNome(),
            pedidoNumero: String(pedidoNumero || '').trim(),
            categoria,
            descricao: String(descricao || '').trim(),
            status: 'Aberto',
            timestamp: agora,
            dataHora: new Date(agora).toLocaleString('pt-BR')
        };
        arr.unshift(ticket);
        salvarJSON(CHAVES_SR.reclamacoes, arr);
        window.srNotificar(
            `Protocolo ${protocolo} criado`,
            `Sua ocorrência sobre "${categoria}" foi aberta e será acompanhada pela equipe.`,
            'suporte'
        );
        return ticket;
    };

    // ---------------------------------------------------------
    // RF08 / HU07: RASTREAMENTO DE COMPRA EM TEMPO REAL
    // ---------------------------------------------------------
    window.srObterEtapasRastreio = function (pedido) {
        const atualIdx = Math.min(
            ETAPAS_RASTREIO.length - 1,
            Math.max(0, Number(pedido?.etapaRastreio ?? 1))
        );
        return ETAPAS_RASTREIO.map((titulo, idx) => ({
            indice: idx,
            titulo,
            concluida: idx <= atualIdx,
            atual: idx === atualIdx
        }));
    };

    window.srAvancarRastreioPedido = function (numeroPedido) {
        const pedidos = lerJSON(CHAVES_SR.pedidos, []);
        const arr = Array.isArray(pedidos) ? pedidos : [];
        const idxPedido = arr.findIndex((p) => String(p.numeroPedido) === String(numeroPedido));
        if (idxPedido === -1) return null;

        const pedido = arr[idxPedido];
        const proxEtapa = Math.min(ETAPAS_RASTREIO.length - 1, (Number(pedido.etapaRastreio ?? 0) + 1));
        pedido.etapaRastreio = proxEtapa;
        pedido.status = ETAPAS_RASTREIO[proxEtapa];
        pedido.ultimaAtualizacaoRastreio = new Date().toLocaleString('pt-BR');
        arr[idxPedido] = pedido;
        salvarJSON(CHAVES_SR.pedidos, arr);

        window.srNotificar(
            `Pedido #${pedido.numeroPedido} atualizado`,
            `Novo status de rastreamento: ${pedido.status}.`,
            'rastreio'
        );
        window.dispatchEvent(new CustomEvent('sr:historico-atualizado', { detail: { tipo: 'pedido' } }));
        return pedido;
    };

    // ---------------------------------------------------------
    // CAPTURA AUTOMÁTICA DE PESQUISAS E FILTROS
    // ---------------------------------------------------------
    function conectarCapturadoresBusca() {
        const inputBusca = document.getElementById('barraPesquisa');
        const btnBusca = document.getElementById('enviarPesquisa');
        const selCat = document.getElementById('filtroCategoria');
        const selPreco = document.getElementById('filtroPreco');

        let debounceBusca = null;

        if (inputBusca && !inputBusca.dataset.srBuscaLigada) {
            inputBusca.dataset.srBuscaLigada = '1';
            inputBusca.addEventListener('input', () => {
                clearTimeout(debounceBusca);
                debounceBusca = setTimeout(() => {
                    const termo = inputBusca.value.trim();
                    if (termo.length >= 2) {
                        window.srRegistrarPesquisa(termo, {
                            categoria: selCat ? selCat.value : 'Todos',
                            preco: selPreco ? selPreco.value : 'todos'
                        });
                    }
                }, 500);
            });

            inputBusca.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && inputBusca.value.trim()) {
                    window.srRegistrarPesquisa(inputBusca.value.trim(), {
                        categoria: selCat ? selCat.value : 'Todos',
                        preco: selPreco ? selPreco.value : 'todos'
                    });
                }
            });
        }

        if (btnBusca && !btnBusca.dataset.srBuscaLigada) {
            btnBusca.dataset.srBuscaLigada = '1';
            btnBusca.addEventListener('click', () => {
                const termo = inputBusca ? inputBusca.value.trim() : '';
                window.srRegistrarPesquisa(termo || 'Catálogo geral', {
                    categoria: selCat ? selCat.value : 'Todos',
                    preco: selPreco ? selPreco.value : 'todos'
                });
            });
        }

        if (selCat && !selCat.dataset.srBuscaLigada) {
            selCat.dataset.srBuscaLigada = '1';
            selCat.addEventListener('change', () => {
                window.srRegistrarPesquisa(inputBusca ? inputBusca.value.trim() : '', {
                    categoria: selCat.value,
                    preco: selPreco ? selPreco.value : 'todos'
                });
            });
        }
    }

    // ---------------------------------------------------------
    // ESTILOS & MODAIS (RF04, RF07, RF08, RNF06)
    // ---------------------------------------------------------
    function injetarEstilosEModais() {
        if (!document.getElementById('sr-estilos-requisitos')) {
            const style = document.createElement('style');
            style.id = 'sr-estilos-requisitos';
            style.textContent = `
                html, body {
                    max-width: 100%;
                    overflow-x: hidden;
                }
                .sr-dialog-req[open] {
                    position: fixed !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    margin: 0 !important;
                    width: 92vw;
                    max-width: 740px;
                    max-height: 85vh;
                    overflow-y: auto;
                    background: #171717;
                    color: #ffffff;
                    border: 2px solid #C62828;
                    border-radius: 18px;
                    padding: 24px;
                    z-index: 100000;
                    text-align: left;
                }
                .sr-dialog-req::backdrop {
                    background: rgba(0, 0, 0, 0.78);
                    backdrop-filter: blur(4px);
                }
                .sr-tabs-hist {
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin: 14px 0;
                }
                .sr-tab-btn {
                    padding: 8px 16px;
                    border-radius: 14px;
                    border: 1px solid #C62828;
                    background: #252525;
                    color: #fff;
                    font-weight: 700;
                    cursor: pointer;
                }
                .sr-tab-btn.ativo {
                    background: #C62828;
                    color: #fff;
                }
                .sr-card-hist {
                    background: #222;
                    border: 1px solid #444;
                    border-radius: 12px;
                    padding: 12px 14px;
                    margin-bottom: 10px;
                }
                .sr-rastreio-step {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 8px 12px;
                    border-radius: 10px;
                    background: #202020;
                    border: 1px solid #383838;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                .sr-rastreio-step.concluida {
                    border-color: #00e676;
                    color: #e8fff1;
                }
                .sr-rastreio-step.atual {
                    border-color: #ffca28;
                    background: #2b2410;
                    color: #ffca28;
                    font-weight: 700;
                }
                .sr-form-reclamacao {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 10px;
                }
                .sr-form-reclamacao input,
                .sr-form-reclamacao select,
                .sr-form-reclamacao textarea {
                    width: 100% !important;
                    margin: 0 !important;
                    background: #121212 !important;
                    color: #fff !important;
                    border: 1px solid #C62828 !important;
                    border-radius: 12px !important;
                    padding: 10px 14px !important;
                    text-align: left !important;
                }
                .sr-btn-acao {
                    background: #C62828;
                    color: #fff;
                    border: 1px solid #C62828;
                    border-radius: 16px;
                    padding: 10px 18px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .sr-btn-acao.sec {
                    background: #262626;
                    border-color: #ffca28;
                    color: #ffca28;
                }
                @media (max-width: 600px) {
                    header {
                        height: auto !important;
                        min-height: 90px;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        justify-content: space-between;
                        padding: 8px 12px;
                    }
                    header h1 {
                        float: none !important;
                        width: auto !important;
                        font-size: 20px !important;
                        margin: 0 !important;
                    }
                    .logo {
                        float: none !important;
                        width: 56px !important;
                        height: 56px !important;
                        margin-left: 0 !important;
                    }
                    .nav {
                        float: none !important;
                        width: 100%;
                        height: auto !important;
                        margin: 6px 0 0 0 !important;
                        justify-content: center;
                    }
                    .link, .botaoUsuario {
                        width: 54px !important;
                        height: 54px !important;
                    }
                    .pesquisa input {
                        width: 100% !important;
                        max-width: 100%;
                    }
                    .cart-content {
                        width: 94% !important;
                        padding: 16px !important;
                    }
                    .product-card {
                        width: 100% !important;
                        flex-wrap: wrap;
                        gap: 10px;
                    }
                    .formLogin {
                        width: 94% !important;
                        height: auto !important;
                    }
                    .colunas, .colunasBotao {
                        float: none !important;
                        width: 100% !important;
                        height: auto !important;
                        margin: 10px 0 !important;
                    }
                    .login input {
                        width: 100% !important;
                        margin: 10px 0 !important;
                    }
                    .faq-container {
                        grid-template-columns: 1fr !important;
                    }
                    .contato-form input,
                    .contato-form select,
                    .contato-form textarea {
                        width: 100% !important;
                        margin: 10px 0 !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        if (!document.getElementById('sr-modal-historico')) {
            const dlgHist = document.createElement('dialog');
            dlgHist.id = 'sr-modal-historico';
            dlgHist.className = 'sr-dialog-req';
            dlgHist.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; border-bottom:1px solid #C62828; padding-bottom:10px;">
                    <h2 style="margin:0; font-size:22px;">🕒 Histórico de Compras e Pesquisas</h2>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <label for="sr-ordem-hist" style="font-size:13px; color:#ddd;">Ordenação:</label>
                        <select id="sr-ordem-hist" style="width:auto; margin:0; padding:6px 12px; border-radius:10px; background:#222; color:#ffca28; border:1px solid #C62828; cursor:pointer;">
                            <option value="recentes">Mais recentes</option>
                            <option value="antigas">Mais antigas</option>
                        </select>
                    </div>
                </div>
                <div class="sr-tabs-hist">
                    <button type="button" class="sr-tab-btn ativo" id="sr-tab-compras">🛍️ Compras</button>
                    <button type="button" class="sr-tab-btn" id="sr-tab-pesquisas">🔎 Pesquisas</button>
                </div>
                <div id="sr-conteudo-historico"></div>
                <div style="text-align:right; margin-top:16px;">
                    <button type="button" class="sr-btn-acao" id="sr-fechar-historico">Fechar</button>
                </div>
            `;
            document.body.appendChild(dlgHist);

            let abaAtiva = 'compras';

            const renderHist = () => {
                const ordem = document.getElementById('sr-ordem-hist')?.value || 'recentes';
                const box = document.getElementById('sr-conteudo-historico');
                if (!box) return;

                if (abaAtiva === 'compras') {
                    const compras = window.srListarCompras(ordem);
                    if (!compras.length) {
                        box.innerHTML = '<p style="color:#bbb;">Nenhuma compra registrada até o momento.</p>';
                        return;
                    }
                    box.innerHTML = compras.map((c) => {
                        const num = c.numeroPedido ?? '-';
                        return `
                            <div class="sr-card-hist">
                                <div style="display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;">
                                    <strong>Pedido #${esc(num)}</strong>
                                    <span style="color:#ffca28;">${esc(c.status || 'Confirmado')}</span>
                                </div>
                                <p style="margin:4px 0; font-size:14px;">Data: ${esc(c.data || c.dataHora || '-')} • Total: <strong>R$ ${fmtBRL(c.total)}</strong></p>
                                <small style="color:#aaa; display:block; margin-bottom:8px;">Itens: ${esc((c.itens || []).map((i) => `${i.nome} (${i.quantidade}x)`).join(', ') || 'Itens da compra')}</small>
                                <button type="button" class="sr-btn-acao sec sr-btn-abrir-rastreio" data-pedido-rastreio="${esc(num)}" style="padding:6px 12px; font-size:12px;">
                                    📍 Rastrear Pedido
                                </button>
                            </div>
                        `;
                    }).join('');

                    box.querySelectorAll('.sr-btn-abrir-rastreio').forEach((btn) => {
                        btn.addEventListener('click', () => {
                            window.srAbrirModalRastreio(btn.getAttribute('data-pedido-rastreio'));
                        });
                    });
                } else {
                    const buscas = window.srListarPesquisas(ordem);
                    if (!buscas.length) {
                        box.innerHTML = '<p style="color:#bbb;">Nenhuma pesquisa registrada ainda. Use a barra de pesquisa ou filtros para registrar.</p>';
                        return;
                    }
                    box.innerHTML = buscas.map((b) => `
                        <div class="sr-card-hist">
                            <div style="display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;">
                                <strong>Termo: "${esc(b.termo)}"</strong>
                                <small style="color:#ffca28;">${esc(b.dataHora || '-')}</small>
                            </div>
                            <p style="margin:4px 0 0 0; font-size:13px; color:#ddd;">Categoria: ${esc(b.categoria || 'Todos')} • Faixa de preço: ${esc(b.preco || 'todos')}</p>
                        </div>
                    `).join('');
                }
            };

            const btnCompras = document.getElementById('sr-tab-compras');
            const btnPesquisas = document.getElementById('sr-tab-pesquisas');
            const selOrdem = document.getElementById('sr-ordem-hist');
            const btnFechar = document.getElementById('sr-fechar-historico');

            btnCompras?.addEventListener('click', () => {
                abaAtiva = 'compras';
                btnCompras.classList.add('ativo');
                btnPesquisas?.classList.remove('ativo');
                renderHist();
            });

            btnPesquisas?.addEventListener('click', () => {
                abaAtiva = 'pesquisas';
                btnPesquisas.classList.add('ativo');
                btnCompras?.classList.remove('ativo');
                renderHist();
            });

            selOrdem?.addEventListener('change', renderHist);
            btnFechar?.addEventListener('click', () => {
                if (dlgHist.open) dlgHist.close();
            });

            dlgHist.addEventListener('click', (e) => {
                if (e.target === dlgHist) dlgHist.close();
            });

            window.addEventListener('sr:historico-atualizado', () => {
                if (dlgHist.open) renderHist();
            });

            window.srAbrirModalHistorico = function (abaInicial = 'compras') {
                abaAtiva = abaInicial === 'pesquisas' ? 'pesquisas' : 'compras';
                if (abaAtiva === 'pesquisas') {
                    btnPesquisas?.classList.add('ativo');
                    btnCompras?.classList.remove('ativo');
                } else {
                    btnCompras?.classList.add('ativo');
                    btnPesquisas?.classList.remove('ativo');
                }
                renderHist();
                if (!dlgHist.open) dlgHist.showModal();
            };
        }

        if (!document.getElementById('sr-modal-rastreio')) {
            const dlgRast = document.createElement('dialog');
            dlgRast.id = 'sr-modal-rastreio';
            dlgRast.className = 'sr-dialog-req';
            dlgRast.innerHTML = `
                <h2 style="margin:0 0 12px 0; font-size:22px; border-bottom:1px solid #C62828; padding-bottom:10px;">📍 Rastreamento de Compra</h2>
                <div id="sr-conteudo-rastreio"></div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                    <button type="button" class="sr-btn-acao" id="sr-fechar-rastreio">Fechar</button>
                </div>
            `;
            document.body.appendChild(dlgRast);

            let pedidoAtualRastreio = null;

            const renderRastreio = () => {
                const alvo = document.getElementById('sr-conteudo-rastreio');
                if (!alvo) return;

                const pedidos = window.srListarCompras('recentes');
                const pedido = pedidos.find((p) => String(p.numeroPedido) === String(pedidoAtualRastreio)) || pedidos[0];

                if (!pedido) {
                    alvo.innerHTML = '<p style="color:#bbb;">Nenhum pedido disponível para rastreamento.</p>';
                    return;
                }

                pedidoAtualRastreio = pedido.numeroPedido;
                const etapas = window.srObterEtapasRastreio(pedido);
                const isFinal = etapas[etapas.length - 1]?.concluida;

                alvo.innerHTML = `
                    <div class="sr-card-hist">
                        <strong>Pedido #${esc(pedido.numeroPedido)}</strong> • Status atual: <span style="color:#ffca28;">${esc(pedido.status || etapas.find((e) => e.atual)?.titulo || 'Em processamento')}</span>
                        <p style="margin:4px 0 0 0; font-size:13px; color:#ccc;">Destino: ${esc(pedido.enderecoEntrega || 'Endereço cadastrado')} ${pedido.cep ? `(${esc(pedido.cep)})` : ''}</p>
                        ${pedido.ultimaAtualizacaoRastreio ? `<small style="color:#999;">Atualizado em: ${esc(pedido.ultimaAtualizacaoRastreio)}</small>` : ''}
                    </div>
                    <div style="margin:12px 0;">
                        ${etapas.map((et) => `
                            <div class="sr-rastreio-step ${et.concluida ? 'concluida' : ''} ${et.atual ? 'atual' : ''}">
                                <span>${et.concluida ? '✔' : '○'}</span>
                                <span>${esc(et.titulo)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div style="display:flex; justify-content:flex-end;">
                        <button type="button" class="sr-btn-acao sec" id="sr-btn-avancar-rastreio" ${isFinal ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
                            ${isFinal ? 'Entrega Concluída' : 'Simular Próxima Etapa (Notifica Cliente)'}
                        </button>
                    </div>
                `;

                document.getElementById('sr-btn-avancar-rastreio')?.addEventListener('click', () => {
                    window.srAvancarRastreioPedido(pedidoAtualRastreio);
                    renderRastreio();
                });
            };

            document.getElementById('sr-fechar-rastreio')?.addEventListener('click', () => {
                if (dlgRast.open) dlgRast.close();
            });

            dlgRast.addEventListener('click', (e) => {
                if (e.target === dlgRast) dlgRast.close();
            });

            window.srAbrirModalRastreio = function (numeroPedido = null) {
                pedidoAtualRastreio = numeroPedido;
                renderRastreio();
                if (!dlgRast.open) dlgRast.showModal();
            };
        }

        if (!document.getElementById('sr-modal-reclamacao')) {
            const dlgRec = document.createElement('dialog');
            dlgRec.id = 'sr-modal-reclamacao';
            dlgRec.className = 'sr-dialog-req';
            dlgRec.innerHTML = `
                <h2 style="margin:0 0 12px 0; font-size:22px; border-bottom:1px solid #C62828; padding-bottom:10px;">🛠️ Canal de Reclamações e Suporte</h2>
                <form id="sr-form-reclamacao" class="sr-form-reclamacao">
                    <label>Número do Pedido (opcional):
                        <input type="text" id="sr-rec-pedido" placeholder="Ex.: 1001">
                    </label>
                    <label>Tipo de Ocorrência:
                        <select id="sr-rec-categoria">
                            <option value="Atraso ou Problema na Entrega">Atraso ou Problema na Entrega</option>
                            <option value="Embalagem Danificada / Colecionável">Embalagem Danificada / Colecionável</option>
                            <option value="Dúvida de Originalidade">Dúvida de Originalidade</option>
                            <option value="Erro ou Bug no Site">Erro ou Bug no Site</option>
                            <option value="Pagamento ou Cupom">Pagamento ou Cupom</option>
                        </select>
                    </label>
                    <label>Descrição detalhada:
                        <textarea id="sr-rec-descricao" rows="4" required placeholder="Descreva o ocorrido para gerarmos seu protocolo de atendimento..."></textarea>
                    </label>
                    <div id="sr-rec-resultado"></div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
                        <button type="button" class="sr-btn-acao" id="sr-fechar-reclamacao" style="background:#262626;">Fechar</button>
                        <button type="submit" class="sr-btn-acao">Gerar Protocolo</button>
                    </div>
                </form>
                <div id="sr-lista-reclamacoes" style="margin-top:18px;"></div>
            `;
            document.body.appendChild(dlgRec);

            const renderTickets = () => {
                const email = getUsuarioEmail();
                const raw = lerJSON(CHAVES_SR.reclamacoes, []);
                const lista = (Array.isArray(raw) ? raw : []).filter(
                    (t) => !t.usuarioEmail || t.usuarioEmail === email || email === 'visitante'
                );
                const alvo = document.getElementById('sr-lista-reclamacoes');
                if (!alvo) return;
                if (!lista.length) {
                    alvo.innerHTML = '';
                    return;
                }
                alvo.innerHTML = '<h3 style="font-size:16px; color:#ffca28; margin-bottom:8px;">Seus Protocolos Abertos</h3>' +
                    lista.slice(0, 6).map((t) => `
                        <div class="sr-card-hist">
                            <strong>Protocolo: ${esc(t.protocolo)}</strong> • <span style="color:#00e676;">${esc(t.status)}</span>
                            <p style="margin:4px 0; font-size:13px;">Categoria: ${esc(t.categoria)} ${t.pedidoNumero ? `• Pedido #${esc(t.pedidoNumero)}` : ''}</p>
                            <p style="margin:4px 0; font-size:13px; color:#ddd;">${esc(t.descricao)}</p>
                            <small style="color:#999;">${esc(t.dataHora)}</small>
                        </div>
                    `).join('');
            };

            document.getElementById('sr-form-reclamacao')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const pedidoNumero = document.getElementById('sr-rec-pedido')?.value || '';
                const categoria = document.getElementById('sr-rec-categoria')?.value || 'Suporte';
                const descricao = document.getElementById('sr-rec-descricao')?.value || '';
                if (!descricao.trim()) return;

                const criado = window.srCriarReclamacao({ pedidoNumero, categoria, descricao });
                const resEl = document.getElementById('sr-rec-resultado');
                if (resEl) {
                    resEl.innerHTML = `<div style="background:#132a1c; border:1px solid #00e676; color:#b9f6ca; padding:10px 14px; border-radius:10px; font-size:14px;">
                        Protocolo gerado com sucesso: <strong>${esc(criado.protocolo)}</strong>.
                    </div>`;
                }
                e.target.reset();
                renderTickets();
            });

            document.getElementById('sr-fechar-reclamacao')?.addEventListener('click', () => {
                const resEl = document.getElementById('sr-rec-resultado');
                if (resEl) resEl.innerHTML = '';
                if (dlgRec.open) dlgRec.close();
            });

            dlgRec.addEventListener('click', (e) => {
                if (e.target === dlgRec) dlgRec.close();
            });

            window.srAbrirModalReclamacao = function (pedidoInicial = '') {
                const inpPedido = document.getElementById('sr-rec-pedido');
                if (inpPedido) inpPedido.value = pedidoInicial;
                renderTickets();
                if (!dlgRec.open) dlgRec.showModal();
            };
        }

        const navUsuario = document.querySelector('#modalCliente .nav-usuario');
        if (navUsuario) {
            if (!document.getElementById('sr-link-historico')) {
                const aHist = document.createElement('a');
                aHist.href = '#';
                aHist.id = 'sr-link-historico';
                aHist.textContent = '🕒 Histórico';
                aHist.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof window.fechaModalCliente === 'function') window.fechaModalCliente();
                    window.srAbrirModalHistorico('compras');
                });
                navUsuario.appendChild(aHist);
            }
            if (!document.getElementById('sr-link-reclamacao')) {
                const aRec = document.createElement('a');
                aRec.href = '#';
                aRec.id = 'sr-link-reclamacao';
                aRec.textContent = '🛠️ Reclamações';
                aRec.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof window.fechaModalCliente === 'function') window.fechaModalCliente();
                    window.srAbrirModalReclamacao();
                });
                navUsuario.appendChild(aRec);
            }
        }
    }

    function iniciarTudoSR() {
        injetarEstilosEModais();
        conectarCapturadoresBusca();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarTudoSR);
    } else {
        iniciarTudoSR();
    }

    // Garante ligação mesmo se elementos forem renderizados de forma assíncrona
    setTimeout(iniciarTudoSR, 400);
    setTimeout(iniciarTudoSR, 1200);
})();