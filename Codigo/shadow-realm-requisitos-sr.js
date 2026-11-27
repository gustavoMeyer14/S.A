/* shadow-realm-requisitos-sr.js */
// =========================================================
// PACOTE COMPLETO DE REQUISITOS (RF04, RF06-RF08, RN02-RN06, RNF06)
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

    function lerJSON(chave, fallback) {
        try {
            const raw = localStorage.getItem(chave);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function salvarJSON(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
        } catch {
            // Ignora erro de quota
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
        return (localStorage.getItem(CHAVES_SR.usuarioAtual) || 'visitante').trim().toLowerCase();
    }

    function getUsuarioNome() {
        return (localStorage.getItem(CHAVES_SR.usuarioNome) || 'Cliente Shadow Realm').trim();
    }

    // ---------------------------------------------------------
    // RF06: NOTIFICAÇÕES EM TEMPO REAL
    // ---------------------------------------------------------
    window.srNotificar = function (titulo, mensagem, tipo = 'info') {
        const lista = lerJSON(CHAVES_SR.notificacoes, []);
        const nova = {
            id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            usuarioEmail: getUsuarioEmail(),
            titulo,
            mensagem,
            tipo,
            lida: false,
            dataHora: new Date().toLocaleString('pt-BR')
        };
        lista.unshift(nova);
        salvarJSON(CHAVES_SR.notificacoes, lista.slice(0, 60));
        window.dispatchEvent(new CustomEvent('sr:notificacoes-atualizadas', { detail: nova }));
        return nova;
    };

    // ---------------------------------------------------------
    // RF04 / HU03: HISTÓRICO DE COMPRAS E PESQUISAS
    // ---------------------------------------------------------
    window.srRegistrarPesquisa = function (termo, meta = {}) {
        const limpo = String(termo || '').trim();
        if (!limpo && !meta.categoria && !meta.preco) return;
        const lista = lerJSON(CHAVES_SR.pesquisas, []);
        lista.push({
            id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
            usuarioEmail: getUsuarioEmail(),
            termo: limpo || '(Filtro aplicado)',
            categoria: meta.categoria || 'Todos',
            preco: meta.preco || 'todos',
            timestamp: Date.now(),
            dataHora: new Date().toLocaleString('pt-BR')
        });
        salvarJSON(CHAVES_SR.pesquisas, lista.slice(-120));
    };

    window.srListarPesquisas = function (ordem = 'recentes') {
        const email = getUsuarioEmail();
        const lista = lerJSON(CHAVES_SR.pesquisas, []).filter(
            (item) => !item.usuarioEmail || item.usuarioEmail === email || item.usuarioEmail === 'visitante'
        );
        return lista.sort((a, b) =>
            ordem === 'antigas'
                ? (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0)
                : (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0)
        );
    };

    window.srListarCompras = function (ordem = 'recentes') {
        const email = getUsuarioEmail();
        const pedidos = lerJSON(CHAVES_SR.pedidos, []).filter(
            (p) => !p.clienteEmail || String(p.clienteEmail).toLowerCase() === email || email === 'visitante'
        );
        return pedidos
            .map((p, idx) => ({
                ...p,
                _ts: Number(p.timestamp) || (Number(p.numeroPedido) || idx + 1) * 1000
            }))
            .sort((a, b) =>
                ordem === 'antigas' ? a._ts - b._ts : b._ts - a._ts
            );
    };

    // ---------------------------------------------------------
    // RF07 / HU06: SISTEMA DE RECLAMAÇÕES COM PROTOCOLO
    // ---------------------------------------------------------
    window.srCriarReclamacao = function ({ pedidoNumero = '', categoria = 'Pedido / Entrega', descricao = '' }) {
        const protocolo = `SR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const lista = lerJSON(CHAVES_SR.reclamacoes, []);
        const ticket = {
            protocolo,
            usuarioEmail: getUsuarioEmail(),
            usuarioNome: getUsuarioNome(),
            pedidoNumero: String(pedidoNumero || '').trim(),
            categoria,
            descricao: String(descricao || '').trim(),
            status: 'Aberto',
            timestamp: Date.now(),
            dataHora: new Date().toLocaleString('pt-BR')
        };
        lista.unshift(ticket);
        salvarJSON(CHAVES_SR.reclamacoes, lista);
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
    const ETAPAS_RASTREIO = [
        'Pagamento Aprovado',
        'Em Separação & Embalagem Reforçada',
        'Coletado pela Transportadora',
        'Em Trânsito para a Região de Entrega',
        'Saiu para Entrega / Pronto para Retirada',
        'Entregue'
    ];

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
        const idxPedido = pedidos.findIndex((p) => String(p.numeroPedido) === String(numeroPedido));
        if (idxPedido === -1) return null;

        const pedido = pedidos[idxPedido];
        const proxEtapa = Math.min(ETAPAS_RASTREIO.length - 1, (Number(pedido.etapaRastreio ?? 0) + 1));
        pedido.etapaRastreio = proxEtapa;
        pedido.status = ETAPAS_RASTREIO[proxEtapa];
        pedido.ultimaAtualizacaoRastreio = new Date().toLocaleString('pt-BR');
        pedidos[idxPedido] = pedido;
        salvarJSON(CHAVES_SR.pedidos, pedidos);

        window.srNotificar(
            `Pedido #${pedido.numeroPedido} atualizado`,
            `Novo status de rastreamento: ${pedido.status}.`,
            'rastreio'
        );
        return pedido;
    };

    // ---------------------------------------------------------
    // ESTILOS & MODAIS DO USUÁRIO (HISTÓRICO E RECLAMAÇÕES)
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
                    max-width: 720px;
                    max-height: 85vh;
                    overflow-y: auto;
                    background: #171717;
                    color: #ffffff;
                    border: 2px solid #C62828;
                    border-radius: 18px;
                    padding: 24px;
                    z-index: 99999;
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
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #C62828; padding-bottom:10px;">
                    <h2 style="margin:0; font-size:22px;">🕒 Histórico de Compras e Pesquisas</h2>
                    <select id="sr-ordem-hist" style="width:auto; margin:0; padding:6px 12px; border-radius:10px; background:#222; color:#ffca28; border:1px solid #C62828;">
                        <option value="recentes">Mais recentes</option>
                        <option value="antigas">Mais antigas</option>
                    </select>
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
                        box.innerHTML = '<p style="color:#bbb;">Nenhuma compra registrada para esta conta.</p>';
                        return;
                    }
                    box.innerHTML = compras.map((c) => `
                        <div class="sr-card-hist">
                            <strong>Pedido #${esc(c.numeroPedido)}</strong> • <span style="color:#ffca28;">${esc(c.status || 'Confirmado')}</span>
                            <p style="margin:4px 0; font-size:14px;">Data: ${esc(c.data || '-')} • Total: <strong>R$ ${fmtBRL(c.total)}</strong></p>
                            <small style="color:#aaa;">Itens: ${esc((c.itens || []).map((i) => `${i.nome} (${i.quantidade}x)`).join(', '))}</small>
                        </div>
                    `).join('');
                } else {
                    const buscas = window.srListarPesquisas(ordem);
                    if (!buscas.length) {
                        box.innerHTML = '<p style="color:#bbb;">Nenhuma pesquisa registrada ainda.</p>';
                        return;
                    }
                    box.innerHTML = buscas.map((b) => `
                        <div class="sr-card-hist">
                            <strong>Termo: "${esc(b.termo)}"</strong>
                            <p style="margin:4px 0; font-size:13px; color:#ddd;">Anime: ${esc(b.categoria)} • Faixa: ${esc(b.preco)}</p>
                            <small style="color:#999;">${esc(b.dataHora)}</small>
                        </div>
                    `).join('');
                }
            };

            document.getElementById('sr-tab-compras')?.addEventListener('click', (e) => {
                abaAtiva = 'compras';
                e.target.classList.add('ativo');
                document.getElementById('sr-tab-pesquisas')?.classList.remove('ativo');
                renderHist();
            });

            document.getElementById('sr-tab-pesquisas')?.addEventListener('click', (e) => {
                abaAtiva = 'pesquisas';
                e.target.classList.add('ativo');
                document.getElementById('sr-tab-compras')?.classList.remove('ativo');
                renderHist();
            });

            document.getElementById('sr-ordem-hist')?.addEventListener('change', renderHist);
            document.getElementById('sr-fechar-historico')?.addEventListener('click', () => dlgHist.close());

            window.srAbrirModalHistorico = function () {
                abaAtiva = 'compras';
                document.getElementById('sr-tab-compras')?.classList.add('ativo');
                document.getElementById('sr-tab-pesquisas')?.classList.remove('ativo');
                renderHist();
                if (!dlgHist.open) dlgHist.showModal();
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
                const lista = lerJSON(CHAVES_SR.reclamacoes, []).filter(
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
                dlgRec.close();
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
                    if (typeof fechaModalCliente === 'function') fechaModalCliente();
                    window.srAbrirModalHistorico();
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
                    if (typeof fechaModalCliente === 'function') fechaModalCliente();
                    window.srAbrirModalReclamacao();
                });
                navUsuario.appendChild(aRec);
            }
        }
    }

    document.addEventListener('DOMContentLoaded', injetarEstilosEModais);
})();