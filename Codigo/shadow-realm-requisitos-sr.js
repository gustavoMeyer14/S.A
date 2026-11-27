/* shadow-realm-requisitos-sr.js */
// =========================================================
// PACOTE COMPLETO TURBINADO V4 - SHADOW REALM STORE
// Cobre: RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF08, RF09, RF10
//        RNF01, RNF04, RNF05, RNF06
//        RN01, RN02, RN03, RN04, RN05, RN06
// Sem bugs, sem duplicidades, pronto para evolução de criptografia
// =========================================================

(function () {
    'use strict';

    if (window.__SHADOW_REALM_TURBO_V4__) {
        if (typeof window.srSincronizarTudo === 'function') {
            window.srSincronizarTudo();
        }
        return;
    }
    window.__SHADOW_REALM_TURBO_V4__ = true;

    const CHAVES = {
        usuarioLogado: 'usuarioLogado',
        usuarioAtual: 'usuarioAtual',
        usuarioNome: 'usuarioNome',
        tipoUsuario: 'tipoUsuario',
        clienteLogado: 'clienteLogado',
        usuarios: 'usuariosShadowRealm',
        carrinho: 'carrinhoShadowRealm',
        estoque: 'estoqueShadowRealm',
        pedidos: 'pedidosShadowRealm',
        pesquisas: 'historicoPesquisasShadowRealm',
        notificacoes: 'notificacoesShadowRealm',
        reclamacoes: 'reclamacoesShadowRealm',
        favoritos: 'favoritosShadowRealm',
        cuponsUsados: 'cuponsUsadosShadowRealm',
        cartoesBase: 'cartoesShadowRealm',
        produtosCustom: 'produtosCustomShadowRealm',
        fimOferta: 'fimOfertaShopee'
    };

    const CUPONS = {
        'SHADOW26': { desconto: 0.15, apenasPrimeiraCompra: true, descricao: '15% OFF na 1ª compra' },
        'GEEK15': { desconto: 0.15, apenasPrimeiraCompra: false, descricao: '15% OFF colecionáveis' },
        'SHADOW50': { desconto: 0.50, apenasPrimeiraCompra: false, descricao: '50% OFF VIP' }
    };

    const ETAPAS_RASTREIO = [
        { titulo: 'Pagamento Aprovado', detalhe: 'Confirmação financeira e reserva da figure no estoque.' },
        { titulo: 'Em Separação & Embalagem Reforçada', detalhe: 'Conferência de originalidade, espuma protetora e caixa reforçada.' },
        { titulo: 'Coletado pela Transportadora', detalhe: 'Etiqueta emitida e pacote coletado para despacho.' },
        { titulo: 'Em Trânsito para a Região de Entrega', detalhe: 'Movimentação logística em rota para o CEP de destino.' },
        { titulo: 'Saiu para Entrega / Pronto para Retirada', detalhe: 'Disponível para entrega final ou retirada na loja física.' },
        { titulo: 'Entregue', detalhe: 'Pedido entregue com sucesso ao colecionador.' }
    ];

    const LIMITE_FRETE_GRATIS = 150.00;
    const VALOR_FRETE_PADRAO = 25.00;
    const MIN_ITENS_VOLUME = 15;
    const DESCONTO_VOLUME_PERC = 0.10;

    // ---------------------------------------------------------
    // UTILITÁRIOS SEGUROS
    // ---------------------------------------------------------
    function lerJSON(chave, fallback = null) {
        try {
            const raw = localStorage.getItem(chave);
            if (raw === null || raw === undefined || raw === '') return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    function salvarJSON(chave, valor) {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
            return true;
        } catch {
            return false;
        }
    }

    function esc(texto) {
        return String(texto ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function fmtBRL(valor) {
        const num = Number(valor);
        const seguro = Number.isFinite(num) ? num : 0;
        return seguro.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function normalizarTexto(texto) {
        return String(texto || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function normalizarTimestamp(valor, fallbackSeq = 1) {
        if (typeof valor === 'number' && Number.isFinite(valor) && valor > 0) return valor;
        if (typeof valor === 'string' && valor.trim() !== '') {
            const num = Number(valor);
            if (Number.isFinite(num) && num > 0) return num;
            const matchBr = valor.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
            if (matchBr) {
                const dia = parseInt(matchBr[1], 10);
                const mes = parseInt(matchBr[2], 10) - 1;
                const ano = parseInt(matchBr[3], 10);
                const hora = parseInt(matchBr[4] || '12', 10);
                const min = parseInt(matchBr[5] || '0', 10);
                const seg = parseInt(matchBr[6] || '0', 10);
                const dt = new Date(ano, mes, dia, hora, min, seg);
                if (!Number.isNaN(dt.getTime())) return dt.getTime();
            }
            const parsed = Date.parse(valor);
            if (!Number.isNaN(parsed) && parsed > 0) return parsed;
        }
        return fallbackSeq * 1000;
    }

    function estaAutenticado() {
        if (localStorage.getItem(CHAVES.usuarioLogado) === 'true') return true;
        const cliente = lerJSON(CHAVES.clienteLogado, null);
        return Boolean(cliente && (cliente.email || cliente.nome));
    }

    function getUsuarioEmail() {
        const atual = (localStorage.getItem(CHAVES.usuarioAtual) || '').trim().toLowerCase();
        if (atual) return atual;
        const cliente = lerJSON(CHAVES.clienteLogado, null);
        if (cliente && cliente.email) return String(cliente.email).trim().toLowerCase();
        return 'visitante';
    }

    function getUsuarioNome() {
        const nome = (localStorage.getItem(CHAVES.usuarioNome) || '').trim();
        if (nome) return nome;
        const cliente = lerJSON(CHAVES.clienteLogado, null);
        if (cliente && cliente.nome) return String(cliente.nome).trim();
        const email = getUsuarioEmail();
        return email !== 'visitante' ? email.split('@')[0] : 'Visitante';
    }

    function getUsuarioCpf() {
        const cliente = lerJSON(CHAVES.clienteLogado, null);
        if (cliente && cliente.cpf) return String(cliente.cpf).replace(/\D/g, '');
        const email = getUsuarioEmail();
        const usuarios = lerJSON(CHAVES.usuarios, []);
        if (Array.isArray(usuarios)) {
            const achado = usuarios.find((u) => String(u.email || '').toLowerCase() === email);
            if (achado && achado.cpf) return String(achado.cpf).replace(/\D/g, '');
        }
        return '';
    }

    function fecharDialogSeguro(dlg) {
        if (!dlg) return;
        try {
            if (dlg.open) dlg.close();
        } catch {
            dlg.removeAttribute('open');
        }
    }

    function abrirDialogSeguro(dlg) {
        if (!dlg) return;
        try {
            if (!dlg.open) dlg.showModal();
        } catch {
            dlg.setAttribute('open', '');
        }
    }

    // Remove qualquer duplicata acidental de elementos injetados em execuções anteriores
    function limparDuplicatasInjetadas() {
        const idsUnicos = [
            'sr-notif-btn-turbo',
            'sr-notif-painel-turbo',
            'sr-dlg-historico-turbo',
            'sr-dlg-rastreio-turbo',
            'sr-dlg-reclamacao-turbo',
            'sr-bloco-logistica-checkout'
        ];
        idsUnicos.forEach((id) => {
            const nodes = document.querySelectorAll(`[id="${id}"]`);
            for (let i = 1; i < nodes.length; i++) {
                nodes[i].remove();
            }
        });
    }

    // ---------------------------------------------------------
    // RF06: NOTIFICAÇÕES EM TEMPO REAL (SEM DUPLICAR BOTÃO)
    // ---------------------------------------------------------
    window.srNotificar = function (titulo, mensagem, tipo = 'info') {
        const lista = lerJSON(CHAVES.notificacoes, []);
        const arr = Array.isArray(lista) ? lista : [];
        const agora = Date.now();
        const nova = {
            id: `notif_${agora}_${Math.random().toString(36).slice(2, 6)}`,
            usuarioEmail: getUsuarioEmail(),
            titulo: String(titulo || 'Notificação Shadow Realm'),
            mensagem: String(mensagem || ''),
            tipo,
            lida: false,
            timestamp: agora,
            dataHora: new Date(agora).toLocaleString('pt-BR')
        };
        arr.unshift(nova);
        salvarJSON(CHAVES.notificacoes, arr.slice(0, 80));
        atualizarBadgeNotificacoes();
        renderizarPainelNotificacoes();
        window.dispatchEvent(new CustomEvent('sr:notificacoes-atualizadas', { detail: nova }));
        return nova;
    };

    window.srListarNotificacoes = function () {
        const email = getUsuarioEmail();
        const lista = lerJSON(CHAVES.notificacoes, []);
        return (Array.isArray(lista) ? lista : []).filter((n) => {
            if (!n) return false;
            if (!n.usuarioEmail || email === 'visitante') return true;
            const nEmail = String(n.usuarioEmail).toLowerCase();
            return nEmail === email || nEmail === 'visitante' || nEmail === 'geral';
        });
    };

    function atualizarBadgeNotificacoes() {
        const badges = document.querySelectorAll('#sr-notif-count-turbo');
        if (!badges.length) return;
        const naoLidas = window.srListarNotificacoes().filter((n) => !n.lida).length;
        badges.forEach((badge) => {
            badge.textContent = String(naoLidas);
            badge.style.display = naoLidas > 0 ? 'inline-block' : 'none';
        });
    }

    function renderizarPainelNotificacoes() {
        const corpo = document.getElementById('sr-notif-lista-turbo');
        if (!corpo) return;
        const lista = window.srListarNotificacoes();
        if (!lista.length) {
            corpo.innerHTML = '<p style="font-size:12px; color:#aaaaaa; text-align:center; padding:12px 0;">Nenhuma notificação no momento.</p>';
            return;
        }
        corpo.innerHTML = lista.slice(0, 15).map((n) => `
            <div class="sr-notif-card ${n.lida ? 'lida' : ''}">
                <h4>${esc(n.titulo)}</h4>
                <p>${esc(n.mensagem)}</p>
                <small>${esc(n.dataHora || '')}</small>
            </div>
        `).join('');
    }

    function gerarAlertasContextuais() {
        const existentes = lerJSON(CHAVES.notificacoes, []);
        if (Array.isArray(existentes) && existentes.length > 0) return;

        const carrinho = lerJSON(CHAVES.carrinho, []);
        const favoritos = lerJSON(CHAVES.favoritos, []);

        if (Array.isArray(carrinho) && carrinho.length > 0) {
            window.srNotificar(
                'Seu carrinho tem itens em oferta',
                `Você possui ${carrinho.length} item(ns) no carrinho. Frete grátis acima de R$ ${fmtBRL(LIMITE_FRETE_GRATIS)} ou cupom SHADOW26 (15% na 1ª compra).`,
                'carrinho'
            );
        } else if (Array.isArray(favoritos) && favoritos.length > 0) {
            window.srNotificar(
                'Seus favoritos estão disponíveis',
                `Há ${favoritos.length} figure(s) nos seus favoritos com até 12x sem juros e cupom GEEK15.`,
                'favoritos'
            );
        } else {
            window.srNotificar(
                'Bem-vindo à Shadow Realm Store',
                `Cupom SHADOW26 garante 15% OFF na primeira compra e frete grátis acima de R$ ${fmtBRL(LIMITE_FRETE_GRATIS)}.`,
                'promo'
            );
        }
    }

    // ---------------------------------------------------------
    // RF04 / HU03: HISTÓRICO DE COMPRAS E PESQUISAS
    // ---------------------------------------------------------
    window.srRegistrarPesquisa = function (termo, meta = {}) {
        const limpo = String(termo || '').trim();
        const categoria = meta.categoria || 'Todos';
        const preco = meta.preco || 'todos';
        if (!limpo && categoria === 'Todos' && preco === 'todos') return;

        const lista = lerJSON(CHAVES.pesquisas, []);
        const arr = Array.isArray(lista) ? lista : [];
        const agora = Date.now();
        const rotulo = limpo || `Filtro: ${categoria}`;

        const ultimo = arr[arr.length - 1];
        if (ultimo && ultimo.termo === rotulo && ultimo.categoria === categoria && (agora - (ultimo.timestamp || 0)) < 1200) {
            return;
        }

        arr.push({
            id: `pesq_${agora}_${Math.random().toString(36).slice(2, 6)}`,
            usuarioEmail: getUsuarioEmail(),
            termo: rotulo,
            categoria,
            preco,
            timestamp: agora,
            dataHora: new Date(agora).toLocaleString('pt-BR')
        });
        salvarJSON(CHAVES.pesquisas, arr.slice(-150));
        window.dispatchEvent(new CustomEvent('sr:historico-atualizado', { detail: { tipo: 'pesquisa' } }));
    };

    window.srListarPesquisas = function (ordem = 'recentes') {
        const email = getUsuarioEmail();
        const raw = lerJSON(CHAVES.pesquisas, []);
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
        const cpf = getUsuarioCpf();
        const raw = lerJSON(CHAVES.pedidos, []);

        const pedidos = (Array.isArray(raw) ? raw : []).filter((p) => {
            if (!p) return false;
            if (!p.clienteEmail && !p.clienteCpf) return true;
            if (email === 'visitante') return true;
            const mesmoEmail = p.clienteEmail && String(p.clienteEmail).toLowerCase() === email;
            const mesmoCpf = cpf && p.clienteCpf && String(p.clienteCpf).replace(/\D/g, '') === cpf;
            return Boolean(mesmoEmail || mesmoCpf);
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
        const raw = lerJSON(CHAVES.reclamacoes, []);
        const lista = Array.isArray(raw) ? raw : [];
        const agora = Date.now();
        const ticket = {
            protocolo,
            usuarioEmail: getUsuarioEmail(),
            usuarioNome: getUsuarioNome(),
            pedidoNumero: String(pedidoNumero || '').trim(),
            categoria: String(categoria || 'Suporte').trim(),
            descricao: String(descricao || '').trim(),
            status: 'Aberto - Em análise',
            timestamp: agora,
            dataHora: new Date(agora).toLocaleString('pt-BR')
        };
        lista.unshift(ticket);
        salvarJSON(CHAVES.reclamacoes, lista);
        window.srNotificar(
            `Protocolo ${protocolo} registrado`,
            `Sua reclamação sobre "${ticket.categoria}" foi aberta e gerou o protocolo ${protocolo}.`,
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
        return ETAPAS_RASTREIO.map((etapa, idx) => ({
            indice: idx,
            titulo: etapa.titulo,
            detalhe: etapa.detalhe,
            concluida: idx <= atualIdx,
            atual: idx === atualIdx
        }));
    };

    window.srAvancarRastreioPedido = function (numeroPedido) {
        const raw = lerJSON(CHAVES.pedidos, []);
        const lista = Array.isArray(raw) ? raw : [];
        const idx = lista.findIndex((p) => String(p.numeroPedido) === String(numeroPedido));
        if (idx === -1) return null;

        const pedido = lista[idx];
        const proxEtapa = Math.min(ETAPAS_RASTREIO.length - 1, (Number(pedido.etapaRastreio ?? 0) + 1));
        pedido.etapaRastreio = proxEtapa;
        pedido.status = ETAPAS_RASTREIO[proxEtapa].titulo;
        pedido.ultimaAtualizacaoRastreio = new Date().toLocaleString('pt-BR');
        lista[idx] = pedido;
        salvarJSON(CHAVES.pedidos, lista);

        window.srNotificar(
            `Rastreamento Pedido #${pedido.numeroPedido}`,
            `Status atualizado para: ${pedido.status}.`,
            'rastreio'
        );
        window.dispatchEvent(new CustomEvent('sr:historico-atualizado', { detail: { tipo: 'rastreio', pedido } }));
        return pedido;
    };

    // ---------------------------------------------------------
    // RN02, RN03, RN04, RN06, RNF05: CEP, FRETE, VOLUME E CHECKOUT
    // ---------------------------------------------------------
    function avaliarCepLoja(cepBruto) {
        const digitos = String(cepBruto || '').replace(/\D/g, '');
        if (digitos.length !== 8) {
            return {
                valido: false,
                cepFormatado: '',
                elegivelRetirada: false,
                elegivelFreteGratis: false,
                prazoTexto: 'Informe o CEP (8 dígitos)'
            };
        }
        const prefixo = parseInt(digitos.slice(0, 2), 10);
        const elegivelRetirada = (prefixo >= 1 && prefixo <= 19) || prefixo === 88 || prefixo === 89;
        const elegivelFreteGratis = elegivelRetirada || (prefixo >= 20 && prefixo <= 39) || (prefixo >= 80 && prefixo <= 87);
        return {
            valido: true,
            cepFormatado: `${digitos.slice(0, 5)}-${digitos.slice(5)}`,
            elegivelRetirada,
            elegivelFreteGratis,
            prazoTexto: elegivelRetirada ? '2 a 4 dias úteis (Retirada até 15 km disponível)' : '4 a 7 dias úteis'
        };
    }

    function calcularResumoFinanceiro(itens, opcoes = {}) {
        const arr = Array.isArray(itens) ? itens : [];
        const descontoCupomPerc = Number(opcoes.descontoCupomPerc) || 0;
        const retiradaNaLoja = Boolean(opcoes.retiradaNaLoja);
        const elegivelFreteGratis = opcoes.elegivelFreteGratis !== undefined ? Boolean(opcoes.elegivelFreteGratis) : true;

        const totalUnidades = arr.reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0);
        const subtotalBruto = arr.reduce(
            (acc, item) => acc + ((Number(item.preco) || 0) * (Number(item.quantidade) || 0)),
            0
        );

        const maiorPrecoItem = arr.reduce((max, item) => {
            const p = Number(item.preco) || 0;
            return p > max ? p : max;
        }, 0);

        const descontoVolume = totalUnidades >= MIN_ITENS_VOLUME
            ? maiorPrecoItem * DESCONTO_VOLUME_PERC
            : 0;

        const baseAposVolume = Math.max(0, subtotalBruto - descontoVolume);
        const valorDescontoCupom = baseAposVolume * descontoCupomPerc;
        const subtotalLiquido = Math.max(0, baseAposVolume - valorDescontoCupom);

        const frete = subtotalBruto === 0
            ? 0
            : (retiradaNaLoja || (elegivelFreteGratis && subtotalLiquido >= LIMITE_FRETE_GRATIS)
                ? 0
                : VALOR_FRETE_PADRAO);

        const totalFinal = Math.max(0, subtotalLiquido + frete);
        const parcela12x = totalFinal / 12;

        return {
            totalUnidades,
            subtotalBruto,
            descontoVolume,
            valorDescontoCupom,
            subtotalLiquido,
            frete,
            totalFinal,
            parcela12x
        };
    }

    function clienteJaComprouAntes() {
        const email = getUsuarioEmail();
        const cpf = getUsuarioCpf();
        const pedidos = lerJSON(CHAVES.pedidos, []);
        const usados = lerJSON(CHAVES.cuponsUsados, []);

        const temPedido = Array.isArray(pedidos) && pedidos.some((p) => {
            const mEmail = email !== 'visitante' && p.clienteEmail && String(p.clienteEmail).toLowerCase() === email;
            const mCpf = cpf && p.clienteCpf && String(p.clienteCpf).replace(/\D/g, '') === cpf;
            return Boolean(mEmail || mCpf);
        });

        const usouCupom = Array.isArray(usados) && usados.some((u) => {
            const mEmail = email !== 'visitante' && u.email && String(u.email).toLowerCase() === email;
            const mCpf = cpf && u.cpf && String(u.cpf).replace(/\D/g, '') === cpf;
            return u.cupom === 'SHADOW26' && (mEmail || mCpf);
        });

        return Boolean(temPedido || usouCupom);
    }

    function turbinarCheckoutECarrinho() {
        const addressForm = document.querySelector('.address-column');
        const priceBreakdown = document.querySelector('.price-breakdown');
        const modalTotalValue = document.querySelector('.modal-total-value');
        const couponInput = document.getElementById('coupon-input');
        const btnCoupon = document.getElementById('btn-coupon');
        const btnCancelarCupom = document.getElementById('btn-cancelar');
        const couponMessage = document.getElementById('coupon-message');

        if (!addressForm && !priceBreakdown) return;

        let descontoCupomPerc = 0;
        let cupomAplicado = '';
        let retiradaAtiva = false;
        let elegivelFrete = true;

        const cepExistente = addressForm
            ? addressForm.querySelector('#input-cep, input[name*="cep"], input[id*="cep"]:not(#sr-cep-checkout)')
            : null;

        if (addressForm && !cepExistente && !document.getElementById('sr-bloco-logistica-checkout')) {
            const bloco = document.createElement('div');
            bloco.id = 'sr-bloco-logistica-checkout';
            bloco.style.cssText = 'display:flex; flex-direction:column; gap:8px; margin:6px 0;';
            bloco.innerHTML = `
                <div class="form-group">
                    <label for="sr-cep-checkout">CEP</label>
                    <input type="text" id="sr-cep-checkout" maxlength="9" placeholder="00000-000">
                </div>
                <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:#ffca28; cursor:pointer; text-align:left;">
                    <input type="checkbox" id="sr-retirada-loja" disabled>
                    <span>Retirar na Loja Física (raio de 15 km)</span>
                </label>
                <small id="sr-info-cep-checkout" style="color:#cccccc; font-size:12px; text-align:left;"></small>
                <small id="sr-info-parcelas-checkout" style="color:#00e676; font-size:12px; text-align:left;"></small>
            `;
            const btnConfirmar = addressForm.querySelector('.btn-confirm-payment');
            if (btnConfirmar) addressForm.insertBefore(bloco, btnConfirmar);
            else addressForm.appendChild(bloco);
        }

        const inputCep = document.getElementById('sr-cep-checkout') || cepExistente;
        const checkRetirada = document.getElementById('sr-retirada-loja');
        const infoCep = document.getElementById('sr-info-cep-checkout');
        const infoParcelas = document.getElementById('sr-info-parcelas-checkout');

        function atualizarResumoTurbo() {
            const carrinho = lerJSON(CHAVES.carrinho, []);
            const itens = Array.isArray(carrinho) ? carrinho : [];
            const calc = calcularResumoFinanceiro(itens, {
                descontoCupomPerc,
                retiradaNaLoja: retiradaAtiva,
                elegivelFreteGratis: elegivelFrete
            });

            if (priceBreakdown) {
                let html = '';
                if (itens.length === 0) {
                    html += '<p class="price-item">R$ 0,00</p>';
                } else {
                    itens.forEach((item, i) => {
                        const prefixo = i === 0 ? '' : '+ ';
                        const subItem = (Number(item.preco) || 0) * (Number(item.quantidade) || 0);
                        html += `<p class="price-item">${prefixo}R$ ${fmtBRL(subItem)}</p>`;
                    });
                }

                if (calc.descontoVolume > 0) {
                    html += `<p class="price-item" style="color:#ffca28;">- Desconto Volume (${calc.totalUnidades} itens): R$ ${fmtBRL(calc.descontoVolume)}</p>`;
                }
                if (calc.valorDescontoCupom > 0) {
                    html += `<p class="price-item" style="color:#00ff88;">- Cupom ${esc(cupomAplicado)} (${Math.round(descontoCupomPerc * 100)}%): R$ ${fmtBRL(calc.valorDescontoCupom)}</p>`;
                }
                if (itens.length > 0) {
                    if (calc.frete === 0) {
                        html += `<p class="price-item" style="color:#00e676;">${retiradaAtiva ? 'Retirada na Loja: GRÁTIS' : 'Frete: GRÁTIS'}</p>`;
                    } else {
                        html += `<p class="price-item" style="color:#ffca28;">Frete: + R$ ${fmtBRL(calc.frete)}</p>`;
                    }
                }
                html += '<hr class="summary-divider">';
                html += `<p class="total-final">Valor Total: <span>R$ ${fmtBRL(calc.totalFinal)}</span></p>`;
                html += `<p class="price-item" style="color:#ffca28; font-size:13px;">ou até 12x de R$ ${fmtBRL(calc.parcela12x)} sem juros</p>`;
                priceBreakdown.innerHTML = html;
            }

            if (modalTotalValue) {
                modalTotalValue.textContent = `Valor Total: R$ ${fmtBRL(calc.totalFinal)} • até 12x de R$ ${fmtBRL(calc.parcela12x)} sem juros`;
            }

            if (infoParcelas) {
                infoParcelas.textContent = `Cartão de Crédito em até 12x sem juros: 12x de R$ ${fmtBRL(calc.parcela12x)}.`;
            }
        }

        if (inputCep && !inputCep.dataset.srLigado) {
            inputCep.dataset.srLigado = '1';
            inputCep.addEventListener('input', (e) => {
                let digitos = e.target.value.replace(/\D/g, '').slice(0, 8);
                if (digitos.length > 5) digitos = `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
                e.target.value = digitos;

                const aval = avaliarCepLoja(digitos);
                if (!aval.valido) {
                    retiradaAtiva = false;
                    elegivelFrete = true;
                    if (checkRetirada) {
                        checkRetirada.checked = false;
                        checkRetirada.disabled = true;
                    }
                    if (infoCep) infoCep.textContent = digitos.length > 0 ? 'Digite os 8 dígitos do CEP.' : '';
                    atualizarResumoTurbo();
                    return;
                }

                elegivelFrete = aval.elegivelFreteGratis;
                if (checkRetirada) {
                    checkRetirada.disabled = !aval.elegivelRetirada;
                    if (!aval.elegivelRetirada) {
                        checkRetirada.checked = false;
                        retiradaAtiva = false;
                    }
                }
                if (infoCep) {
                    infoCep.textContent = `CEP ${aval.cepFormatado}: ${aval.prazoTexto}.`;
                }
                atualizarResumoTurbo();
            });
        }

        if (checkRetirada && !checkRetirada.dataset.srLigado) {
            checkRetirada.dataset.srLigado = '1';
            checkRetirada.addEventListener('change', () => {
                retiradaAtiva = Boolean(checkRetirada.checked);
                atualizarResumoTurbo();
            });
        }

        if (btnCoupon && couponInput && !btnCoupon.dataset.srLigado) {
            btnCoupon.dataset.srLigado = '1';
            btnCoupon.addEventListener('click', () => {
                const cod = couponInput.value.trim().toUpperCase();
                if (!cod) {
                    if (couponMessage) {
                        couponMessage.textContent = 'Digite um cupom válido.';
                        couponMessage.style.color = '#ffaa00';
                    }
                    return;
                }
                const regra = CUPONS[cod];
                if (!regra) {
                    descontoCupomPerc = 0;
                    cupomAplicado = '';
                    if (couponMessage) {
                        couponMessage.textContent = 'Cupom inválido!';
                        couponMessage.style.color = '#ff4444';
                    }
                    atualizarResumoTurbo();
                    return;
                }
                if (regra.apenasPrimeiraCompra && clienteJaComprouAntes()) {
                    descontoCupomPerc = 0;
                    cupomAplicado = '';
                    if (couponMessage) {
                        couponMessage.textContent = 'Cupom SHADOW26 disponível apenas para a 1ª compra.';
                        couponMessage.style.color = '#ff4444';
                    }
                    atualizarResumoTurbo();
                    return;
                }
                descontoCupomPerc = regra.desconto;
                cupomAplicado = cod;
                if (couponMessage) {
                    couponMessage.textContent = `Cupom ${cod} aplicado (${Math.round(regra.desconto * 100)}% OFF)!`;
                    couponMessage.style.color = '#00ff88';
                }
                atualizarResumoTurbo();
            });
        }

        if (btnCancelarCupom && !btnCancelarCupom.dataset.srLigado) {
            btnCancelarCupom.dataset.srLigado = '1';
            btnCancelarCupom.addEventListener('click', () => {
                descontoCupomPerc = 0;
                cupomAplicado = '';
                if (couponInput) couponInput.value = '';
                if (couponMessage) {
                    couponMessage.textContent = 'Cupom removido.';
                    couponMessage.style.color = '#ffaa00';
                }
                atualizarResumoTurbo();
            });
        }

        if (addressForm && !addressForm.dataset.srSubmitLigado) {
            addressForm.dataset.srSubmitLigado = '1';
            addressForm.addEventListener('submit', (e) => {
                const carrinho = lerJSON(CHAVES.carrinho, []);
                if (!Array.isArray(carrinho) || carrinho.length === 0) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    window.srNotificar('Carrinho vazio', 'Adicione produtos antes de confirmar o pagamento.', 'alerta');
                    return;
                }
                if (!estaAutenticado()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    window.location.href = 'cliente.html';
                    return;
                }

                addressForm.querySelectorAll('input').forEach((inp) => {
                    const idOrName = `${inp.id || ''} ${inp.name || ''} ${inp.placeholder || ''}`.toLowerCase();
                    if (idOrName.includes('cvv')) inp.value = '';
                });

                const calc = calcularResumoFinanceiro(carrinho, {
                    descontoCupomPerc,
                    retiradaNaLoja: retiradaAtiva,
                    elegivelFreteGratis: elegivelFrete
                });
                const rua = document.getElementById('input-rua')?.value.trim() || '';
                const cidade = document.getElementById('input-cidade')?.value.trim() || '';
                const estado = document.getElementById('input-estado')?.value.trim() || '';
                const cep = inputCep?.value.trim() || '';

                if (rua && cidade && estado && !addressForm.dataset.srJaProcessou) {
                    addressForm.dataset.srJaProcessou = '1';
                    const pedidosAntigos = lerJSON(CHAVES.pedidos, []);
                    const arrPedidos = Array.isArray(pedidosAntigos) ? pedidosAntigos : [];
                    const proxNum = arrPedidos.length > 0
                        ? Math.max(...arrPedidos.map((p) => Number(p.numeroPedido) || 1000)) + 1
                        : 1001;

                    setTimeout(() => {
                        const atual = lerJSON(CHAVES.pedidos, []);
                        const jaExisteNum = Array.isArray(atual) && atual.some((p) => Number(p.numeroPedido) === proxNum);
                        const carrinhoPos = lerJSON(CHAVES.carrinho, []);
                        if (!jaExisteNum && Array.isArray(carrinhoPos) && carrinhoPos.length > 0) {
                            const metodoRadio = document.querySelector('input[name="payment-group"]:checked');
                            const metodo = metodoRadio ? metodoRadio.value : 'pix';
                            const agora = Date.now();
                            atual.push({
                                numeroPedido: proxNum,
                                clienteEmail: getUsuarioEmail(),
                                clienteCpf: getUsuarioCpf(),
                                data: new Date(agora).toLocaleDateString('pt-BR'),
                                timestamp: agora,
                                etapaRastreio: 1,
                                status: retiradaAtiva ? 'Pronto para Retirada na Loja' : 'Em Separação & Embalagem Reforçada',
                                modalidadeEntrega: retiradaAtiva ? 'Retirada na Loja (até 15 km)' : 'Entrega Padrão',
                                cep,
                                enderecoEntrega: `${rua} - ${cidade}/${estado}`,
                                cartaoUsado: metodo === 'pix' ? 'Pix' : metodo === 'debito' ? 'Débito' : 'Cartão de Crédito (até 12x sem juros)',
                                cupom: cupomAplicado || null,
                                total: Number(calc.totalFinal.toFixed(2)),
                                itens: carrinhoPos
                            });
                            salvarJSON(CHAVES.pedidos, atual);
                            salvarJSON(CHAVES.carrinho, []);
                            if (cupomAplicado === 'SHADOW26') {
                                const usados = lerJSON(CHAVES.cuponsUsados, []);
                                const arrUsados = Array.isArray(usados) ? usados : [];
                                arrUsados.push({
                                    cupom: 'SHADOW26',
                                    email: getUsuarioEmail(),
                                    cpf: getUsuarioCpf(),
                                    data: new Date(agora).toLocaleDateString('pt-BR')
                                });
                                salvarJSON(CHAVES.cuponsUsados, arrUsados);
                            }
                            window.srNotificar(
                                `Pedido #${proxNum} confirmado`,
                                `Total: R$ ${fmtBRL(calc.totalFinal)}. Acompanhe o rastreamento em Meus Pedidos.`,
                                'pedido'
                            );
                            window.location.href = 'pedidos.html';
                        }
                        delete addressForm.dataset.srJaProcessou;
                    }, 120);
                }
            }, true);
        }

        atualizarResumoTurbo();
    }

    // ---------------------------------------------------------
    // TURBO VITRINE: FILTRO INSTANTÂNEO + ORDENAÇÃO + PARCELAMENTO
    // ---------------------------------------------------------
    function turbinarVitrineAoVivo() {
        const secao = document.querySelector('.destaques');
        if (!secao) return;

        const inputBusca = document.getElementById('barraPesquisa');
        const btnBusca = document.getElementById('enviarPesquisa');
        const selCat = document.getElementById('filtroCategoria');
        const selPreco = document.getElementById('filtroPreco');
        const selOrdem = document.getElementById('ordenarPreco');
        const btnLimpar = document.getElementById('btnLimparFiltros');

        function extrairPrecoCard(card) {
            const h3 = card.querySelector('h3');
            if (!h3) return 0;
            const limpo = h3.textContent.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
            const val = parseFloat(limpo);
            return Number.isFinite(val) ? val : 0;
        }

        function aplicarFiltroTurbo(salvarHistorico = false) {
            const termo = normalizarTexto(inputBusca ? inputBusca.value : '');
            const cat = selCat ? selCat.value : 'Todos';
            const faixa = selPreco ? selPreco.value : 'todos';
            const ordem = selOrdem ? selOrdem.value : 'padrao';

            if (salvarHistorico) {
                window.srRegistrarPesquisa(inputBusca ? inputBusca.value.trim() : '', {
                    categoria: cat,
                    preco: faixa
                });
            }

            const cards = Array.from(secao.querySelectorAll(':scope > div'));
            let visiveis = 0;

            cards.forEach((card) => {
                const titulo = card.querySelector('p')?.textContent || '';
                const preco = extrairPrecoCard(card);
                const textoCard = normalizarTexto(card.textContent);

                // Garante selo de parcelamento 12x sem juros no card sem duplicar
                if (preco > 0 && !card.querySelector('.sr-parcela-turbo-card')) {
                    const h3 = card.querySelector('h3');
                    if (h3) {
                        const pParc = document.createElement('small');
                        pParc.className = 'sr-parcela-turbo-card';
                        pParc.style.cssText = 'display:block; color:#00e676; font-size:12px; font-weight:700; margin-top:2px;';
                        pParc.textContent = `12x de R$ ${fmtBRL(preco / 12)} sem juros`;
                        h3.insertAdjacentElement('afterend', pParc);
                    }
                }

                const matchBusca = !termo || textoCard.includes(termo);
                const matchCat = cat === 'Todos' || normalizarTexto(textoCard).includes(normalizarTexto(cat));

                let matchPreco = true;
                if (preco > 0) {
                    if (faixa === 'ate300') matchPreco = preco <= 300;
                    else if (faixa === '300a400') matchPreco = preco > 300 && preco <= 400;
                    else if (faixa === 'acima400') matchPreco = preco > 400;
                }

                if (matchBusca && matchCat && matchPreco) {
                    card.style.display = '';
                    visiveis++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (ordem === 'menor' || ordem === 'maior') {
                const ordenados = [...cards].sort((a, b) => {
                    const pa = extrairPrecoCard(a);
                    const pb = extrairPrecoCard(b);
                    return ordem === 'menor' ? pa - pb : pb - pa;
                });
                ordenados.forEach((c, idx) => {
                    c.style.order = String(idx + 1);
                });
            } else {
                cards.forEach((c) => {
                    c.style.order = '';
                });
            }

            let msgVazio = document.getElementById('sr-vitrine-vazio-turbo');
            if (!msgVazio) {
                msgVazio = document.createElement('p');
                msgVazio.id = 'sr-vitrine-vazio-turbo';
                msgVazio.style.cssText = 'width:100%; text-align:center; color:#ffca28; font-weight:700; padding:18px; order:9999;';
                secao.appendChild(msgVazio);
            }
            msgVazio.textContent = visiveis === 0 ? 'Nenhum colecionável encontrado com os filtros atuais.' : '';
        }

        if (inputBusca && !inputBusca.dataset.srTurboFiltroVivo) {
            inputBusca.dataset.srTurboFiltroVivo = '1';
            inputBusca.addEventListener('input', () => aplicarFiltroTurbo(false));
        }
        [selCat, selPreco, selOrdem].forEach((sel) => {
            if (sel && !sel.dataset.srTurboFiltroVivo) {
                sel.dataset.srTurboFiltroVivo = '1';
                sel.addEventListener('change', () => aplicarFiltroTurbo(true));
            }
        });
        if (btnBusca && !btnBusca.dataset.srTurboFiltroVivo) {
            btnBusca.dataset.srTurboFiltroVivo = '1';
            btnBusca.addEventListener('click', () => aplicarFiltroTurbo(true));
        }
        if (btnLimpar && !btnLimpar.dataset.srTurboFiltroVivo) {
            btnLimpar.dataset.srTurboFiltroVivo = '1';
            btnLimpar.addEventListener('click', () => {
                setTimeout(() => aplicarFiltroTurbo(false), 30);
            });
        }

        aplicarFiltroTurbo(false);
    }

    // ---------------------------------------------------------
    // CAPTURA DE PESQUISAS, FILTROS E CADASTRO
    // ---------------------------------------------------------
    function conectarEventosGlobais() {
        const inputBusca = document.getElementById('barraPesquisa');
        const btnBusca = document.getElementById('enviarPesquisa');
        const selCat = document.getElementById('filtroCategoria');
        const selPreco = document.getElementById('filtroPreco');

        let timerBusca = null;

        if (inputBusca && !inputBusca.dataset.srTurboBusca) {
            inputBusca.dataset.srTurboBusca = '1';
            inputBusca.addEventListener('input', () => {
                clearTimeout(timerBusca);
                timerBusca = setTimeout(() => {
                    const val = inputBusca.value.trim();
                    if (val.length >= 2) {
                        window.srRegistrarPesquisa(val, {
                            categoria: selCat ? selCat.value : 'Todos',
                            preco: selPreco ? selPreco.value : 'todos'
                        });
                    }
                }, 450);
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

        if (btnBusca && !btnBusca.dataset.srTurboBusca) {
            btnBusca.dataset.srTurboBusca = '1';
            btnBusca.addEventListener('click', () => {
                const val = inputBusca ? inputBusca.value.trim() : '';
                window.srRegistrarPesquisa(val || 'Busca na vitrine', {
                    categoria: selCat ? selCat.value : 'Todos',
                    preco: selPreco ? selPreco.value : 'todos'
                });
            });
        }

        [selCat, selPreco].forEach((sel) => {
            if (sel && !sel.dataset.srTurboFiltro) {
                sel.dataset.srTurboFiltro = '1';
                sel.addEventListener('change', () => {
                    window.srRegistrarPesquisa(inputBusca ? inputBusca.value.trim() : '', {
                        categoria: selCat ? selCat.value : 'Todos',
                        preco: selPreco ? selPreco.value : 'todos'
                    });
                });
            }
        });
    }

    // ---------------------------------------------------------
    // INTERFACE DE NOTIFICAÇÕES, HISTÓRICO, RASTREAMENTO E RECLAMAÇÕES
    // ---------------------------------------------------------
    function injetarEstilosEComponentes() {
        limparDuplicatasInjetadas();

        if (!document.getElementById('sr-turbo-estilos')) {
            const style = document.createElement('style');
            style.id = 'sr-turbo-estilos';
            style.textContent = `
                html, body {
                    max-width: 100%;
                    overflow-x: hidden;
                }
                .sr-notif-btn-turbo {
                    background: #151515;
                    color: #ffca28;
                    border: 1px solid #ffca28;
                    border-radius: 20px;
                    padding: 4px 11px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                }
                .sr-notif-count-turbo {
                    background: #ff3d00;
                    color: #ffffff;
                    border-radius: 999px;
                    padding: 1px 6px;
                    font-size: 11px;
                    font-weight: 900;
                }
                .sr-notif-painel-turbo {
                    display: none;
                    position: fixed;
                    top: 138px;
                    right: 16px;
                    width: 340px;
                    max-width: calc(100vw - 24px);
                    max-height: 410px;
                    overflow-y: auto;
                    background: #141414;
                    color: #ffffff;
                    border: 2px solid #C62828;
                    border-radius: 16px;
                    padding: 14px;
                    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.88);
                    z-index: 100001;
                    text-align: left;
                }
                .sr-notif-painel-turbo.aberto {
                    display: block;
                }
                .sr-notif-card {
                    background: #222222;
                    border-left: 3px solid #ffca28;
                    border-radius: 10px;
                    padding: 9px 11px;
                    margin-bottom: 8px;
                }
                .sr-notif-card.lida {
                    opacity: 0.72;
                    border-left-color: #666666;
                }
                .sr-notif-card h4 {
                    font-size: 13px;
                    margin: 0 0 3px 0;
                    color: #ffffff;
                }
                .sr-notif-card p {
                    font-size: 12px;
                    margin: 0 0 4px 0;
                    color: #dddddd;
                }
                .sr-notif-card small {
                    font-size: 10px;
                    color: #999999;
                }
                .sr-dialog-turbo[open] {
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
                    z-index: 100002;
                    text-align: left;
                }
                .sr-dialog-turbo::backdrop {
                    background: rgba(0, 0, 0, 0.78);
                    backdrop-filter: blur(4px);
                }
                .sr-tab-turbo {
                    padding: 8px 16px;
                    border-radius: 14px;
                    border: 1px solid #C62828;
                    background: #252525;
                    color: #ffffff;
                    font-weight: 700;
                    cursor: pointer;
                }
                .sr-tab-turbo.ativo {
                    background: #C62828;
                    color: #ffffff;
                }
                .sr-item-turbo {
                    background: #222222;
                    border: 1px solid #444444;
                    border-radius: 12px;
                    padding: 12px 14px;
                    margin-bottom: 10px;
                }
                .sr-etapa-turbo {
                    padding: 9px 12px;
                    border-radius: 10px;
                    background: #202020;
                    border: 1px solid #3a3a3a;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                .sr-etapa-turbo.concluida {
                    border-color: #00e676;
                }
                .sr-etapa-turbo.atual {
                    border-color: #ffca28;
                    background: #2b230d;
                }
                .sr-btn-turbo {
                    background: #C62828;
                    color: #ffffff;
                    border: 1px solid #C62828;
                    border-radius: 14px;
                    padding: 9px 18px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .sr-btn-turbo.sec {
                    background: #262626;
                    border-color: #ffca28;
                    color: #ffca28;
                }
                .sr-form-turbo {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-top: 10px;
                }
                .sr-form-turbo input,
                .sr-form-turbo select,
                .sr-form-turbo textarea {
                    width: 100% !important;
                    margin: 0 !important;
                    background: #121212 !important;
                    color: #ffffff !important;
                    border: 1px solid #C62828 !important;
                    border-radius: 12px !important;
                    padding: 10px 14px !important;
                    text-align: left !important;
                }
                @media (max-width: 600px) {
                    header {
                        height: auto !important;
                        min-height: 88px;
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
                        width: 54px !important;
                        height: 54px !important;
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

        const jaTemNotifShopee = Boolean(
            document.querySelector('.shopee-topbar button[id*="notif"], .shopee-topbar button[aria-label*="notifica"]')
        );
        const topBar = document.querySelector('.shopee-topbar');
        if (topBar && !jaTemNotifShopee && !document.getElementById('sr-notif-btn-turbo')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'sr-notif-btn-turbo';
            btn.className = 'sr-notif-btn-turbo';
            btn.setAttribute('aria-label', 'Abrir central de notificações');
            btn.innerHTML = '🔔 Avisos <span class="sr-notif-count-turbo" id="sr-notif-count-turbo">0</span>';
            topBar.appendChild(btn);
        }

        if (!document.getElementById('sr-notif-painel-turbo')) {
            const painel = document.createElement('div');
            painel.id = 'sr-notif-painel-turbo';
            painel.className = 'sr-notif-painel-turbo';
            painel.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:8px; margin-bottom:10px;">
                    <strong style="color:#ffca28; font-size:15px;">🔔 Central de Notificações</strong>
                    <button type="button" id="sr-notif-limpar-turbo" style="background:transparent; color:#ff6b6b; border:1px solid #ff6b6b; border-radius:10px; padding:3px 8px; font-size:11px; cursor:pointer;">Limpar</button>
                </div>
                <div id="sr-notif-lista-turbo"></div>
            `;
            document.body.appendChild(painel);

            document.getElementById('sr-notif-btn-turbo')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const abrir = !painel.classList.contains('aberto');
                painel.classList.toggle('aberto', abrir);
                if (abrir) {
                    const todas = lerJSON(CHAVES.notificacoes, []);
                    if (Array.isArray(todas)) {
                        salvarJSON(CHAVES.notificacoes, todas.map((n) => ({ ...n, lida: true })));
                    }
                    atualizarBadgeNotificacoes();
                    renderizarPainelNotificacoes();
                }
            });

            document.getElementById('sr-notif-limpar-turbo')?.addEventListener('click', (e) => {
                e.stopPropagation();
                salvarJSON(CHAVES.notificacoes, []);
                atualizarBadgeNotificacoes();
                renderizarPainelNotificacoes();
            });

            document.addEventListener('click', (e) => {
                const btn = document.getElementById('sr-notif-btn-turbo');
                if (painel.classList.contains('aberto') && !painel.contains(e.target) && e.target !== btn) {
                    painel.classList.remove('aberto');
                }
            });
        }

        if (!document.getElementById('sr-dlg-historico-turbo')) {
            const dlgHist = document.createElement('dialog');
            dlgHist.id = 'sr-dlg-historico-turbo';
            dlgHist.className = 'sr-dialog-turbo';
            dlgHist.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; border-bottom:1px solid #C62828; padding-bottom:10px;">
                    <h2 style="margin:0; font-size:22px;">🕒 Histórico de Compras e Pesquisas</h2>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <label for="sr-sel-ordem-turbo" style="font-size:13px; color:#ddd;">Ordenar:</label>
                        <select id="sr-sel-ordem-turbo" style="width:auto; margin:0; padding:6px 12px; border-radius:10px; background:#222; color:#ffca28; border:1px solid #C62828; cursor:pointer;">
                            <option value="recentes">Mais recentes</option>
                            <option value="antigas">Mais antigas</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin:14px 0;">
                    <button type="button" id="sr-aba-compras-turbo" class="sr-tab-turbo ativo">🛍️ Compras</button>
                    <button type="button" id="sr-aba-pesquisas-turbo" class="sr-tab-turbo">🔎 Pesquisas</button>
                </div>
                <div id="sr-corpo-historico-turbo"></div>
                <div style="display:flex; justify-content:flex-end; margin-top:16px;">
                    <button type="button" id="sr-fechar-historico-turbo" class="sr-btn-turbo">Fechar</button>
                </div>
            `;
            document.body.appendChild(dlgHist);

            let abaAtual = 'compras';

            function renderHistorico() {
                const ordem = document.getElementById('sr-sel-ordem-turbo')?.value || 'recentes';
                const corpo = document.getElementById('sr-corpo-historico-turbo');
                if (!corpo) return;

                if (abaAtual === 'compras') {
                    const compras = window.srListarCompras(ordem);
                    if (!compras.length) {
                        corpo.innerHTML = '<p style="color:#bbb; padding:10px 0;">Nenhuma compra registrada para este usuário.</p>';
                        return;
                    }
                    corpo.innerHTML = compras.map((c) => {
                        const num = c.numeroPedido ?? '-';
                        const itensTxt = (c.itens || []).map((i) => `${i.nome} (${i.quantidade}x)`).join(', ') || 'Itens do pedido';
                        return `
                            <div class="sr-item-turbo">
                                <div style="display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;">
                                    <strong>Pedido #${esc(num)}</strong>
                                    <span style="color:#ffca28; font-size:13px;">${esc(c.status || 'Confirmado')}</span>
                                </div>
                                <p style="margin:6px 0; font-size:14px;">Data: ${esc(c.data || c.dataHora || '-')} • Total: <strong>R$ ${fmtBRL(c.total)}</strong></p>
                                <small style="color:#aaa; display:block; margin-bottom:8px;">Itens: ${esc(itensTxt)}</small>
                                <button type="button" class="sr-btn-turbo sec sr-acao-rastrear-hist" data-num-pedido="${esc(num)}" style="padding:6px 12px; font-size:12px;">
                                    📍 Rastrear Pedido
                                </button>
                            </div>
                        `;
                    }).join('');

                    corpo.querySelectorAll('.sr-acao-rastrear-hist').forEach((btn) => {
                        btn.addEventListener('click', () => {
                            window.srAbrirModalRastreio(btn.getAttribute('data-num-pedido'));
                        });
                    });
                } else {
                    const buscas = window.srListarPesquisas(ordem);
                    if (!buscas.length) {
                        corpo.innerHTML = '<p style="color:#bbb; padding:10px 0;">Nenhuma pesquisa registrada ainda. Pesquise ou aplique filtros na vitrine.</p>';
                        return;
                    }
                    corpo.innerHTML = buscas.map((b) => `
                        <div class="sr-item-turbo">
                            <div style="display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap;">
                                <strong>"${esc(b.termo)}"</strong>
                                <small style="color:#ffca28;">${esc(b.dataHora || '-')}</small>
                            </div>
                            <p style="margin:5px 0 0 0; font-size:13px; color:#ddd;">Categoria: ${esc(b.categoria || 'Todos')} • Preço: ${esc(b.preco || 'todos')}</p>
                        </div>
                    `).join('');
                }
            }

            const btnCompras = document.getElementById('sr-aba-compras-turbo');
            const btnPesquisas = document.getElementById('sr-aba-pesquisas-turbo');
            const selOrdem = document.getElementById('sr-sel-ordem-turbo');
            const btnFechar = document.getElementById('sr-fechar-historico-turbo');

            btnCompras?.addEventListener('click', () => {
                abaAtual = 'compras';
                btnCompras.classList.add('ativo');
                btnPesquisas?.classList.remove('ativo');
                renderHistorico();
            });

            btnPesquisas?.addEventListener('click', () => {
                abaAtual = 'pesquisas';
                btnPesquisas.classList.add('ativo');
                btnCompras?.classList.remove('ativo');
                renderHistorico();
            });

            selOrdem?.addEventListener('change', renderHistorico);
            btnFechar?.addEventListener('click', () => fecharDialogSeguro(dlgHist));
            dlgHist.addEventListener('click', (e) => {
                if (e.target === dlgHist) fecharDialogSeguro(dlgHist);
            });

            window.addEventListener('sr:historico-atualizado', () => {
                if (dlgHist.open) renderHistorico();
            });

            window.srAbrirModalHistorico = function (abaInicial = 'compras') {
                abaAtual = abaInicial === 'pesquisas' ? 'pesquisas' : 'compras';
                if (abaAtual === 'pesquisas') {
                    btnPesquisas?.classList.add('ativo');
                    btnCompras?.classList.remove('ativo');
                } else {
                    btnCompras?.classList.add('ativo');
                    btnPesquisas?.classList.remove('ativo');
                }
                renderHistorico();
                abrirDialogSeguro(dlgHist);
            };
        }

        if (!document.getElementById('sr-dlg-rastreio-turbo')) {
            const dlgRast = document.createElement('dialog');
            dlgRast.id = 'sr-dlg-rastreio-turbo';
            dlgRast.className = 'sr-dialog-turbo';
            dlgRast.innerHTML = `
                <h2 style="margin:0 0 12px 0; font-size:22px; border-bottom:1px solid #C62828; padding-bottom:10px;">📍 Rastreamento de Compra</h2>
                <div id="sr-corpo-rastreio-turbo"></div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                    <button type="button" id="sr-fechar-rastreio-turbo" class="sr-btn-turbo">Fechar</button>
                </div>
            `;
            document.body.appendChild(dlgRast);

            let pedidoSelecionado = null;

            function renderRastreio() {
                const corpo = document.getElementById('sr-corpo-rastreio-turbo');
                if (!corpo) return;
                const pedidos = window.srListarCompras('recentes');
                const pedido = pedidos.find((p) => String(p.numeroPedido) === String(pedidoSelecionado)) || pedidos[0];

                if (!pedido) {
                    corpo.innerHTML = '<p style="color:#bbb;">Nenhum pedido encontrado para rastreamento.</p>';
                    return;
                }

                pedidoSelecionado = pedido.numeroPedido;
                const etapas = window.srObterEtapasRastreio(pedido);
                const concluido = etapas[etapas.length - 1]?.concluida;

                corpo.innerHTML = `
                    <div class="sr-item-turbo">
                        <strong>Pedido #${esc(pedido.numeroPedido)}</strong> • Status: <span style="color:#ffca28;">${esc(pedido.status || 'Em processamento')}</span>
                        <p style="margin:4px 0 0 0; font-size:13px; color:#ccc;">Endereço: ${esc(pedido.enderecoEntrega || 'Endereço não informado')} ${pedido.cep ? `(${esc(pedido.cep)})` : ''}</p>
                        ${pedido.ultimaAtualizacaoRastreio ? `<small style="color:#999;">Última atualização: ${esc(pedido.ultimaAtualizacaoRastreio)}</small>` : ''}
                    </div>
                    <div style="margin:12px 0;">
                        ${etapas.map((et) => `
                            <div class="sr-etapa-turbo ${et.concluida ? 'concluida' : ''} ${et.atual ? 'atual' : ''}">
                                <div><strong>${et.concluida ? '✔' : '○'} ${esc(et.titulo)}</strong></div>
                                <small style="color:#cccccc; display:block; margin-top:2px;">${esc(et.detalhe)}</small>
                            </div>
                        `).join('')}
                    </div>
                    <div style="display:flex; justify-content:flex-end;">
                        <button type="button" id="sr-avancar-etapa-turbo" class="sr-btn-turbo sec" ${concluido ? 'disabled style="opacity:0.45; cursor:not-allowed;"' : ''}>
                            ${concluido ? 'Pedido Entregue' : 'Avançar Etapa & Notificar Cliente'}
                        </button>
                    </div>
                `;

                document.getElementById('sr-avancar-etapa-turbo')?.addEventListener('click', () => {
                    window.srAvancarRastreioPedido(pedidoSelecionado);
                    renderRastreio();
                });
            }

            document.getElementById('sr-fechar-rastreio-turbo')?.addEventListener('click', () => fecharDialogSeguro(dlgRast));
            dlgRast.addEventListener('click', (e) => {
                if (e.target === dlgRast) fecharDialogSeguro(dlgRast);
            });

            window.srAbrirModalRastreio = function (numeroPedido = null) {
                pedidoSelecionado = numeroPedido;
                renderRastreio();
                abrirDialogSeguro(dlgRast);
            };
        }

        if (!document.getElementById('sr-dlg-reclamacao-turbo')) {
            const dlgRec = document.createElement('dialog');
            dlgRec.id = 'sr-dlg-reclamacao-turbo';
            dlgRec.className = 'sr-dialog-turbo';
            dlgRec.innerHTML = `
                <h2 style="margin:0 0 12px 0; font-size:22px; border-bottom:1px solid #C62828; padding-bottom:10px;">🛠️ Canal de Reclamações e Suporte</h2>
                <form id="sr-form-reclamacao-turbo" class="sr-form-turbo">
                    <label>Número do Pedido (opcional):
                        <input type="text" id="sr-rec-pedido-turbo" placeholder="Ex.: 1001">
                    </label>
                    <label>Categoria:
                        <select id="sr-rec-categoria-turbo">
                            <option value="Pedido / Entrega">Pedido / Entrega</option>
                            <option value="Caixa ou Figure Danificada">Caixa ou Figure Danificada</option>
                            <option value="Originalidade / Autenticidade">Originalidade / Autenticidade</option>
                            <option value="Erro ou Bug no Site">Erro ou Bug no Site</option>
                            <option value="Pagamento, Cupom ou Frete">Pagamento, Cupom ou Frete</option>
                        </select>
                    </label>
                    <label>Descrição do problema ou bug:
                        <textarea id="sr-rec-descricao-turbo" rows="4" required placeholder="Descreva o que aconteceu para gerarmos seu protocolo..."></textarea>
                    </label>
                    <div id="sr-rec-feedback-turbo"></div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:6px;">
                        <button type="button" id="sr-fechar-reclamacao-turbo" class="sr-btn-turbo" style="background:#262626;">Fechar</button>
                        <button type="submit" class="sr-btn-turbo">Gerar Protocolo</button>
                    </div>
                </form>
                <div id="sr-lista-reclamacoes-turbo" style="margin-top:16px;"></div>
            `;
            document.body.appendChild(dlgRec);

            function renderReclamacoes() {
                const email = getUsuarioEmail();
                const raw = lerJSON(CHAVES.reclamacoes, []);
                const lista = (Array.isArray(raw) ? raw : []).filter(
                    (t) => !t.usuarioEmail || email === 'visitante' || String(t.usuarioEmail).toLowerCase() === email
                );
                const alvo = document.getElementById('sr-lista-reclamacoes-turbo');
                if (!alvo) return;
                if (!lista.length) {
                    alvo.innerHTML = '';
                    return;
                }
                alvo.innerHTML = '<h3 style="font-size:15px; color:#ffca28; margin-bottom:8px;">Protocolos Registrados</h3>' +
                    lista.slice(0, 6).map((t) => `
                        <div class="sr-item-turbo">
                            <strong>Protocolo: ${esc(t.protocolo)}</strong> • <span style="color:#00e676;">${esc(t.status)}</span>
                            <p style="margin:4px 0; font-size:13px;">Categoria: ${esc(t.categoria)} ${t.pedidoNumero ? `• Pedido #${esc(t.pedidoNumero)}` : ''}</p>
                            <p style="margin:4px 0; font-size:13px; color:#ddd;">${esc(t.descricao)}</p>
                            <small style="color:#999;">${esc(t.dataHora)}</small>
                        </div>
                    `).join('');
            }

            document.getElementById('sr-form-reclamacao-turbo')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const pedidoNumero = document.getElementById('sr-rec-pedido-turbo')?.value || '';
                const categoria = document.getElementById('sr-rec-categoria-turbo')?.value || 'Suporte';
                const descricao = document.getElementById('sr-rec-descricao-turbo')?.value || '';
                if (!descricao.trim()) return;

                const criado = window.srCriarReclamacao({ pedidoNumero, categoria, descricao });
                const fb = document.getElementById('sr-rec-feedback-turbo');
                if (fb) {
                    fb.innerHTML = `<div style="background:#10291a; border:1px solid #00e676; color:#b9f6ca; padding:10px 14px; border-radius:10px; font-size:13px;">
                        Protocolo gerado: <strong>${esc(criado.protocolo)}</strong>
                    </div>`;
                }
                e.target.reset();
                renderReclamacoes();
            });

            document.getElementById('sr-fechar-reclamacao-turbo')?.addEventListener('click', () => {
                const fb = document.getElementById('sr-rec-feedback-turbo');
                if (fb) fb.innerHTML = '';
                fecharDialogSeguro(dlgRec);
            });

            dlgRec.addEventListener('click', (e) => {
                if (e.target === dlgRec) fecharDialogSeguro(dlgRec);
            });

            window.srAbrirModalReclamacao = function (pedidoInicial = '') {
                const inp = document.getElementById('sr-rec-pedido-turbo');
                if (inp) inp.value = pedidoInicial;
                renderReclamacoes();
                abrirDialogSeguro(dlgRec);
            };
        }

        const navUsuario = document.querySelector('#modalCliente .nav-usuario');
        if (navUsuario) {
            if (!document.getElementById('sr-link-historico-turbo')) {
                const aHist = document.createElement('a');
                aHist.href = '#';
                aHist.id = 'sr-link-historico-turbo';
                aHist.textContent = '🕒 Histórico';
                aHist.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (typeof window.fechaModalCliente === 'function') window.fechaModalCliente();
                    window.srAbrirModalHistorico('compras');
                });
                navUsuario.appendChild(aHist);
            }
            if (!document.getElementById('sr-link-reclamacao-turbo')) {
                const aRec = document.createElement('a');
                aRec.href = '#';
                aRec.id = 'sr-link-reclamacao-turbo';
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

    window.srSincronizarTudo = function () {
        injetarEstilosEComponentes();
        conectarEventosGlobais();
        turbinarVitrineAoVivo();
        turbinarCheckoutECarrinho();
        gerarAlertasContextuais();
        atualizarBadgeNotificacoes();
        renderizarPainelNotificacoes();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.srSincronizarTudo);
    } else {
        window.srSincronizarTudo();
    }

    setTimeout(window.srSincronizarTudo, 300);
    setTimeout(window.srSincronizarTudo, 1000);
})();