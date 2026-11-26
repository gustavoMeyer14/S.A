// =========================================================
// VITRINE TURBO & OFERTAS - SHADOW REALM STORE
// =========================================================

const CONFIG_SHOPEE_SR = {
    chaveFimOferta: 'fimOfertaShopee',
    chaveCarrinho: 'carrinhoShadowRealm',
    chaveVip: 'vipShadowRealm',
    duracaoPadraoMs: (2 * 3600 + 45 * 60 + 19) * 1000,
    duracaoRenovacaoMs: 3 * 3600 * 1000,
    limiteFreteGratis: 250,
    cupomDestaque: 'SHADOW26',
    descontosCard: ['15%', '20%', '25%', '30%', '10%'],
    vendidosCard: ['420', '1,1 mil', '890', '2,3 mil', '650', '980', '1,5 mil', '3,1 mil', '510', '1,8 mil']
};

document.addEventListener('DOMContentLoaded', () => {
    injetarBarraTopo();
    injetarElementosHome();
    turbinarCardsProdutos();
    atualizarBadgeCarrinho();
});

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
        <span>• Use o cupom <strong>${CONFIG_SHOPEE_SR.cupomDestaque}</strong></span>
    `;
    document.body.insertBefore(topBar, header);

    let fimOferta = parseInt(localStorage.getItem(CONFIG_SHOPEE_SR.chaveFimOferta), 10);

    if (!fimOferta || Number.isNaN(fimOferta) || fimOferta <= Date.now()) {
        fimOferta = Date.now() + CONFIG_SHOPEE_SR.duracaoPadraoMs;
        localStorage.setItem(CONFIG_SHOPEE_SR.chaveFimOferta, String(fimOferta));
    }

    function atualizarCronometro() {
        let restanteMs = fimOferta - Date.now();

        if (restanteMs <= 0) {
            fimOferta = Date.now() + CONFIG_SHOPEE_SR.duracaoRenovacaoMs;
            localStorage.setItem(CONFIG_SHOPEE_SR.chaveFimOferta, String(fimOferta));
            restanteMs = fimOferta - Date.now();
        }

        const segundosTotais = Math.floor(restanteMs / 1000);
        const h = String(Math.floor(segundosTotais / 3600)).padStart(2, '0');
        const m = String(Math.floor((segundosTotais % 3600) / 60)).padStart(2, '0');
        const s = String(segundosTotais % 60).padStart(2, '0');

        const el = document.getElementById('cronometro-shopee');
        if (el) el.textContent = `${h}:${m}:${s}`;
    }

    atualizarCronometro();
    setInterval(atualizarCronometro, 1000);
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
                <p>Parcelamento em até 12x sem juros no cartão ou desconto instantâneo no Pix!</p>
                <a href="produtos.html" class="btn-hero-shopee">VER CATÁLOGO COMPLETO ➔</a>
            </div>
            <div class="hero-cupons">
                <div class="cupom-ticket">
                    <div>
                        <strong>10% OFF</strong>
                        <small>Toda a loja</small>
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

    let carrinho = [];
    try {
        carrinho = JSON.parse(localStorage.getItem(CONFIG_SHOPEE_SR.chaveCarrinho)) || [];
    } catch {
        carrinho = [];
    }

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
});