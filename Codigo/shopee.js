// =========================================================
// VITRINE TURBO, OFERTAS & NOTIFICAÇÕES - SHADOW REALM STORE
// =========================================================

const CONFIG_SHOPEE_SR = {
    chaveFimOferta: 'fimOfertaShopee',
    chaveCarrinho: 'carrinhoShadowRealm',
    chaveFavoritos: 'favoritosShadowRealm',
    chaveVip: 'vipShadowRealm',
    chaveNotificacoes: 'notificacoesShadowRealm',
    duracaoPadraoMs: (2 * 3600 + 45 * 60 + 19) * 1000,
    duracaoRenovacaoMs: 3 * 3600 * 1000,
    limiteFreteGratis: 150,
    cupomDestaque: 'SHADOW26',
    descontosCard: ['15%', '20%', '25%', '30%', '10%'],
    vendidosCard: ['420', '1,1 mil', '890', '2,3 mil', '650', '980', '1,5 mil', '3,1 mil', '510', '1,8 mil']
};

let intervaloCronometroSR = null;

document.addEventListener('DOMContentLoaded', () => {
    injetarEstilosTurboShopeeSR();
    injetarBarraTopo();
    injetarBotaoNotificacoesSR();
    injetarElementosHome();
    turbinarCardsProdutos();
    atualizarBadgeCarrinho();
    gerarAlertasInteligentesVitrineSR();
});

function lerJsonShopeeSR(chave, fallback) {
    try {
        const bruto = localStorage.getItem(chave);
        if (bruto === null || bruto === '') return fallback;
        return JSON.parse(bruto);
    } catch {
        return fallback;
    }
}

function salvarJsonShopeeSR(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
        // Ignora falhas de quota/storage privado
    }
}

function escShopeeSR(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function injetarEstilosTurboShopeeSR() {
    if (document.getElementById('estilos-turbo-shopee-sr')) return;
    const style = document.createElement('style');
    style.id = 'estilos-turbo-shopee-sr';
    style.textContent = `
        .sr-notif-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
        }
        .sr-btn-notif {
            background: #151515;
            color: #ffca28;
            border: 1px solid #ffca28;
            border-radius: 20px;
            padding: 6px 12px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: transform 0.2s, background-color 0.2s;
        }
        .sr-btn-notif:hover {
            transform: scale(1.05);
            background: #262626;
        }
        .sr-notif-count {
            background: #ff3d00;
            color: #ffffff;
            border-radius: 999px;
            padding: 1px 6px;
            font-size: 11px;
            font-weight: 900;
        }
        .sr-notif-painel {
            display: none;
            position: fixed;
            top: 138px;
            right: 20px;
            width: 340px;
            max-width: calc(100vw - 24px);
            max-height: 420px;
            overflow-y: auto;
            background: #141414;
            color: #ffffff;
            border: 2px solid #C62828;
            border-radius: 16px;
            padding: 14px;
            box-shadow: 0 14px 35px rgba(0, 0, 0, 0.85);
            z-index: 99999;
            text-align: left;
        }
        .sr-notif-painel.aberto {
            display: block;
        }
        .sr-notif-topo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }
        .sr-notif-topo strong {
            color: #ffca28;
            font-size: 15px;
        }
        .sr-notif-limpar {
            background: transparent;
            color: #ff6b6b;
            border: 1px solid #ff6b6b;
            border-radius: 10px;
            padding: 3px 8px;
            font-size: 11px;
            cursor: pointer;
        }
        .sr-notif-item {
            background: #222222;
            border-left: 3px solid #ffca28;
            border-radius: 10px;
            padding: 9px 11px;
            margin-bottom: 8px;
        }
        .sr-notif-item.lida {
            opacity: 0.72;
            border-left-color: #666;
        }
        .sr-notif-item h4 {
            font-size: 13px;
            color: #ffffff;
            margin-bottom: 3px;
        }
        .sr-notif-item p {
            font-size: 12px;
            color: #dddddd;
            margin-bottom: 4px;
        }
        .sr-notif-item small {
            font-size: 10px;
            color: #999999;
        }
        .sr-beneficios-strip {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 12px;
            margin-top: 18px;
        }
        .sr-beneficio-card {
            background: #181818;
            border: 1px solid #444;
            border-radius: 14px;
            padding: 12px 14px;
            text-align: left;
        }
        .sr-beneficio-card strong {
            display: block;
            color: #ffca28;
            font-size: 14px;
            margin-bottom: 3px;
        }
        .sr-beneficio-card span {
            color: #cccccc;
            font-size: 12px;
        }
    `;
    document.head.appendChild(style);
}

function copiarTextoSeguroSR(texto) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        return navigator.clipboard.writeText(texto).catch(() => copiarPorExecCommandSR(texto));
    }
    return Promise.resolve(copiarPorExecCommandSR(texto));
}

function copiarPorExecCommandSR(texto) {
    try {
        const temp = document.createElement('textarea');
        temp.value = texto;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        return true;
    } catch {
        return false;
    }
}

function injetarBarraTopo() {
    const header = document.querySelector('header');
    if (!header || document.querySelector('.shopee-topbar')) return;

    const topBar = document.createElement('div');
    topBar.className = 'shopee-topbar';
    topBar.innerHTML = `
        <span>⚡ <strong>OFERTA RELÂMPAGO SHADOW REALM</strong> • Frete Grátis acima de R$ ${CONFIG_SHOPEE_SR.limiteFreteGratis} •</span>
        <span class="shopee-timer">Termina em: <b id="cronometro-shopee">02:45:19</b></span>
        <span>• Use o cupom <strong>${CONFIG_SHOPEE_SR.cupomDestaque}</strong> (15% 1ª compra)</span>
    `;
    document.body.insertBefore(topBar, header);

    let fimOferta = parseInt(localStorage.getItem(CONFIG_SHOPEE_SR.chaveFimOferta), 10);

    if (!fimOferta || Number.isNaN(fimOferta) || fimOferta <= Date.now()) {
        fimOferta = Date.now() + CONFIG_SHOPEE_SR.duracaoPadraoMs;
        try {
            localStorage.setItem(CONFIG_SHOPEE_SR.chaveFimOferta, String(fimOferta));
        } catch {
            // Ignora falha de escrita
        }
    }

    function atualizarCronometro() {
        let restanteMs = fimOferta - Date.now();

        if (restanteMs <= 0) {
            fimOferta = Date.now() + CONFIG_SHOPEE_SR.duracaoRenovacaoMs;
            try {
                localStorage.setItem(CONFIG_SHOPEE_SR.chaveFimOferta, String(fimOferta));
            } catch {
                // Ignora falha de escrita
            }
            restanteMs = fimOferta - Date.now();
        }

        const segundosTotais = Math.max(0, Math.floor(restanteMs / 1000));
        const h = String(Math.floor(segundosTotais / 3600)).padStart(2, '0');
        const m = String(Math.floor((segundosTotais % 3600) / 60)).padStart(2, '0');
        const s = String(segundosTotais % 60).padStart(2, '0');

        const el = document.getElementById('cronometro-shopee');
        if (el) el.textContent = `${h}:${m}:${s}`;
    }

    atualizarCronometro();
    if (intervaloCronometroSR) clearInterval(intervaloCronometroSR);
    intervaloCronometroSR = setInterval(atualizarCronometro, 1000);
}

function obterNotificacoesShopeeSR() {
    const lista = lerJsonShopeeSR(CONFIG_SHOPEE_SR.chaveNotificacoes, []);
    return Array.isArray(lista) ? lista : [];
}

function registrarNotificacaoShopeeSR(titulo, mensagem, tipo = 'promo') {
    if (typeof window.adicionarNotificacaoSR === 'function') {
        window.adicionarNotificacaoSR(titulo, mensagem, tipo);
    } else {
        const atual = obterNotificacoesShopeeSR();
        atual.unshift({
            id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            titulo,
            mensagem,
            tipo,
            lida: false,
            dataHora: new Date().toLocaleString('pt-BR')
        });
        salvarJsonShopeeSR(CONFIG_SHOPEE_SR.chaveNotificacoes, atual.slice(0, 50));
    }
    atualizarBadgeNotificacoesSR();
}

function atualizarBadgeNotificacoesSR() {
    const badge = document.getElementById('sr-notif-count');
    if (!badge) return;
    const naoLidas = obterNotificacoesShopeeSR().filter((n) => !n.lida).length;
    badge.textContent = String(naoLidas);
    badge.style.display = naoLidas > 0 ? 'inline-block' : 'none';
}

function renderizarPainelNotificacoesSR() {
    const listaEl = document.getElementById('sr-notif-lista');
    if (!listaEl) return;

    const notificacoes = obterNotificacoesShopeeSR();
    if (notificacoes.length === 0) {
        listaEl.innerHTML = '<p style="font-size:12px; color:#aaaaaa; text-align:center; padding:12px 0;">Nenhuma notificação no momento.</p>';
        return;
    }

    listaEl.innerHTML = notificacoes.slice(0, 12).map((n) => `
        <div class="sr-notif-item ${n.lida ? 'lida' : ''}">
            <h4>${escShopeeSR(n.titulo)}</h4>
            <p>${escShopeeSR(n.mensagem)}</p>
            <small>${escShopeeSR(n.dataHora || '')}</small>
        </div>
    `).join('');
}

function injetarBotaoNotificacoesSR() {
    const topBar = document.querySelector('.shopee-topbar');
    if (!topBar || document.querySelector('.sr-notif-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'sr-notif-wrapper';
    wrapper.innerHTML = `
        <button type="button" class="sr-btn-notif" id="sr-btn-notif" aria-label="Abrir notificações">
            🔔 Avisos <span class="sr-notif-count" id="sr-notif-count">0</span>
        </button>
    `;
    topBar.appendChild(wrapper);

    let painel = document.getElementById('sr-notif-painel');
    if (!painel) {
        painel = document.createElement('div');
        painel.id = 'sr-notif-painel';
        painel.className = 'sr-notif-painel';
        painel.innerHTML = `
            <div class="sr-notif-topo">
                <strong>🔔 Notificações</strong>
                <button type="button" class="sr-notif-limpar" id="sr-notif-limpar">Limpar</button>
            </div>
            <div id="sr-notif-lista"></div>
        `;
        document.body.appendChild(painel);
    }

    const btn = document.getElementById('sr-btn-notif');
    const btnLimpar = document.getElementById('sr-notif-limpar');

    btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        const vaiAbrir = !painel.classList.contains('aberto');
        painel.classList.toggle('aberto', vaiAbrir);
        if (vaiAbrir) {
            const atual = obterNotificacoesShopeeSR().map((item) => ({ ...item, lida: true }));
            salvarJsonShopeeSR(CONFIG_SHOPEE_SR.chaveNotificacoes, atual);
            atualizarBadgeNotificacoesSR();
            renderizarPainelNotificacoesSR();
        }
    });

    btnLimpar?.addEventListener('click', (e) => {
        e.stopPropagation();
        salvarJsonShopeeSR(CONFIG_SHOPEE_SR.chaveNotificacoes, []);
        atualizarBadgeNotificacoesSR();
        renderizarPainelNotificacoesSR();
    });

    document.addEventListener('click', (e) => {
        if (painel.classList.contains('aberto') && !painel.contains(e.target) && e.target !== btn) {
            painel.classList.remove('aberto');
        }
    });

    atualizarBadgeNotificacoesSR();
}

function gerarAlertasInteligentesVitrineSR() {
    const carrinho = lerJsonShopeeSR(CONFIG_SHOPEE_SR.chaveCarrinho, []);
    const favoritos = lerJsonShopeeSR(CONFIG_SHOPEE_SR.chaveFavoritos, []);
    const existentes = obterNotificacoesShopeeSR();
    if (existentes.length > 0) return;

    if (Array.isArray(carrinho) && carrinho.length > 0) {
        registrarNotificacaoShopeeSR(
            'Itens aguardando no carrinho',
            `Você tem ${carrinho.length} item(ns) no carrinho. Use SHADOW26 (15% na 1ª compra) ou aproveite frete grátis acima de R$ ${CONFIG_SHOPEE_SR.limiteFreteGratis}!`,
            'carrinho'
        );
    } else if (Array.isArray(favoritos) && favoritos.length > 0) {
        registrarNotificacaoShopeeSR(
            'Oferta para seus favoritos',
            `Seus favoritos estão em destaque na Shadow Realm Store com parcelamento em até 12x sem juros!`,
            'favoritos'
        );
    } else {
        registrarNotificacaoShopeeSR(
            'Festival Geek Shadow Realm',
            `Cupom SHADOW26 garante 15% OFF na primeira compra e frete grátis acima de R$ ${CONFIG_SHOPEE_SR.limiteFreteGratis}.`,
            'promo'
        );
    }
}

function injetarElementosHome() {
    const secaoDestaques = document.querySelector('.destaques');
    const paginaAtual = window.location.pathname.split('/').pop().toLowerCase();
    const isHome = paginaAtual === '' || paginaAtual === 'index.html';

    if (!secaoDestaques || !isHome || document.querySelector('.shopee-vitrine-extras')) return;

    const isVip = localStorage.getItem(CONFIG_SHOPEE_SR.chaveVip) === 'true';

    const vitrineShopee = document.createElement('section');
    vitrineShopee.className = 'shopee-vitrine-extras';
    vitrineShopee.innerHTML = `
        <div class="shopee-hero-banner">
            <div class="hero-texto">
                <span class="tag-destaque">🔥 FESTIVAL GEEK 2026</span>
                <h2>AS MELHORES FIGURES COM ATÉ <span class="destaque-amarelo">50% OFF</span></h2>
                <p>Parcelamento em até 12x sem juros no cartão ou desconto no Pix • Frete grátis acima de R$ ${CONFIG_SHOPEE_SR.limiteFreteGratis}!</p>
                <a href="produtos.html" class="btn-hero-shopee">VER CATÁLOGO COMPLETO ➔</a>
            </div>
            <div class="hero-cupons">
                <div class="cupom-ticket">
                    <div>
                        <strong>15% OFF</strong>
                        <small>1ª compra no site</small>
                    </div>
                    <button type="button" onclick="copiarCupomShopee('SHADOW26', this)">SHADOW26 📋</button>
                </div>
                <div class="cupom-ticket">
                    <div>
                        <strong>15% OFF</strong>
                        <small>Fãs de Anime</small>
                    </div>
                    <button type="button" onclick="copiarCupomShopee('GEEK15', this)">GEEK15 📋</button>
                </div>
                ${isVip ? `
                <div class="cupom-ticket" id="ticket-vip-home" style="border-color: #ffca28;">
                    <div>
                        <strong>50% OFF 🔓</strong>
                        <small>Cupom VIP: SHADOW50</small>
                    </div>
                    <button type="button" onclick="copiarCupomShopee('SHADOW50', this)">COPIAR</button>
                </div>
                ` : `
                <div class="cupom-ticket" id="ticket-vip-home" style="border-color: #C62828;">
                    <div>
                        <strong>50% OFF 🔒</strong>
                        <small>Exclusivo Clube VIP</small>
                    </div>
                    <button type="button" onclick="document.querySelector('.sr-newsletter')?.scrollIntoView({ behavior: 'smooth' })">
                        DESBLOQUEAR ↓
                    </button>
                </div>
                `}
            </div>
        </div>

        <div class="sr-beneficios-strip">
            <div class="sr-beneficio-card">
                <strong>🛡️ Originalidade Garantida</strong>
                <span>Figures colecionáveis com embalagem reforçada para unboxing seguro.</span>
            </div>
            <div class="sr-beneficio-card">
                <strong>🚚 Frete Grátis R$ ${CONFIG_SHOPEE_SR.limiteFreteGratis}+</strong>
                <span>Concedido automaticamente para regiões elegíveis e retirada em até 15 km.</span>
            </div>
            <div class="sr-beneficio-card">
                <strong>🎁 Desconto por Volume</strong>
                <span>A partir de 15 itens no carrinho, ganhe desconto progressivo especial.</span>
            </div>
            <div class="sr-beneficio-card">
                <strong>✨ Brindes & Adesivos</strong>
                <span>Mimos temáticos da comunidade Shadow Realm nas compras elegíveis.</span>
            </div>
        </div>

        <div class="shopee-categorias">
            <a href="produtos.html?busca=Bleach" class="cat-item">⚔️<span>Bleach</span></a>
            <a href="produtos.html?busca=Attack%20on%20Titan" class="cat-item">🛡️<span>Attack on Titan</span></a>
            <a href="produtos.html?busca=Jujutsu%20Kaisen" class="cat-item">👁️<span>Jujutsu Kaisen</span></a>
            <a href="produtos.html?busca=Pok%C3%A9mon" class="cat-item">⚡<span>Pokémon</span></a>
            <a href="produtos.html?busca=Apotec%C3%A1ria" class="cat-item">🧪<span>Apotecária</span></a>
            <a href="produtos.html" class="cat-item">🔥<span>Ver Tudo</span></a>
        </div>
    `;

    secaoDestaques.parentNode.insertBefore(vitrineShopee, secaoDestaques);
}

window.copiarCupomShopee = function (codigo, botao) {
    copiarTextoSeguroSR(codigo);
    registrarNotificacaoShopeeSR(
        `Cupom ${codigo} copiado`,
        `Cole ${codigo} no carrinho para aplicar seu desconto na Shadow Realm Store.`,
        'cupom'
    );
    if (!botao) return;

    const original = botao.textContent;
    botao.textContent = 'COPIADO! ✔';
    botao.style.backgroundColor = '#28a745';
    mostrarToastShopee(`Cupom ${codigo} copiado! Cole no carrinho.`);
    setTimeout(() => {
        botao.textContent = original;
        botao.style.backgroundColor = '';
    }, 2000);
};

window.copiarCupom = window.copiarCupomShopee;

function turbinarCardsProdutos() {
    const cards = document.querySelectorAll('.destaques > div');
    const descontos = CONFIG_SHOPEE_SR.descontosCard;
    const vendidos = CONFIG_SHOPEE_SR.vendidosCard;

    cards.forEach((card, index) => {
        card.classList.add('card-shopee-style');

        if (!card.querySelector('.shopee-badge-off')) {
            const badgeOff = document.createElement('span');
            badgeOff.className = 'shopee-badge-off';
            badgeOff.innerHTML = `${descontos[index % descontos.length]}<br><small>OFF</small>`;
            card.appendChild(badgeOff);
        }

        const precoEl = card.querySelector('h3');
        if (precoEl && !card.querySelector('.shopee-card-meta')) {
            const valorNumerico = parseFloat(precoEl.innerText.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
            const parcela = (valorNumerico / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            const parcelamento = document.createElement('p');
            parcelamento.className = 'shopee-parcelamento';
            parcelamento.textContent = `ou 12x de R$ ${parcela} sem juros`;
            precoEl.insertAdjacentElement('afterend', parcelamento);

            const estoque = document.createElement('div');
            estoque.className = 'shopee-estoque';
            estoque.innerHTML = `
                <div class="shopee-estoque-texto">🔥 85% vendido</div>
                <div class="shopee-estoque-fundo">
                    <div class="shopee-estoque-progresso"></div>
                </div>
            `;
            parcelamento.insertAdjacentElement('afterend', estoque);

            const metaInfo = document.createElement('div');
            metaInfo.className = 'shopee-card-meta';
            metaInfo.innerHTML = `
                <span class="tag-frete">🚚 Frete Grátis</span>
                <span class="rating-vendidos">⭐ 4.9 | ${vendidos[index % vendidos.length]} vendidos</span>
            `;
            estoque.insertAdjacentElement('afterend', metaInfo);
        }
    });
}

window.atualizarBadgeCarrinho = function () {
    const linkCarrinho = document.querySelector('header nav a[href="carrinho.html"]');
    if (!linkCarrinho) return;

    const carrinho = lerJsonShopeeSR(CONFIG_SHOPEE_SR.chaveCarrinho, []);
    const totalItens = Array.isArray(carrinho)
        ? carrinho.reduce((acc, item) => acc + (Number(item.quantidade) || 1), 0)
        : 0;

    linkCarrinho.style.position = 'relative';
    let badge = linkCarrinho.querySelector('.shopee-cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'shopee-cart-badge';
        linkCarrinho.appendChild(badge);
    }
    badge.textContent = String(totalItens);
    badge.style.display = totalItens > 0 ? 'flex' : 'none';
};

function mostrarToastShopee(mensagem) {
    let toast = document.getElementById('shopee-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'shopee-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensagem;
    toast.classList.add('visivel');
    clearTimeout(toast._timerToast);
    toast._timerToast = setTimeout(() => toast.classList.remove('visivel'), 3000);
}

window.addEventListener('storage', (e) => {
    if (e.key === CONFIG_SHOPEE_SR.chaveCarrinho) {
        atualizarBadgeCarrinho();
    }
    if (e.key === CONFIG_SHOPEE_SR.chaveNotificacoes) {
        atualizarBadgeNotificacoesSR();
        renderizarPainelNotificacoesSR();
    }
});

window.addEventListener('sr:carrinho-atualizado', () => {
    atualizarBadgeCarrinho();
    gerarAlertasInteligentesVitrineSR();
});