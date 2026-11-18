document.addEventListener('DOMContentLoaded', () => {
    injetarBarraTopo();
    injetarElementosHome();
    turbinarCardsProdutos();
    atualizarBadgeCarrinho();
});

// 1. Barra superior estilo Shopee com contagem regressiva
// 1. Barra superior estilo Shopee com contagem regressiva persistente entre páginas
function injetarBarraTopo() {
    const header = document.querySelector('header');
    if (!header) return;

    const topBar = document.createElement('div');
    topBar.className = 'shopee-topbar';
    topBar.innerHTML = `
        <span>⚡ <strong>OFERTA RELÂMPAGO SHADOW REALM</strong> • Frete Grátis acima de R$ 250 •</span>
        <span class="shopee-timer">Termina em: <b id="cronometro-shopee">02:45:19</b></span>
        <span>• Use o cupom <strong>SHADOW26</strong></span>
    `;
    document.body.insertBefore(topBar, header);

    const duracaoOfertaMs = (2 * 3600 + 45 * 60 + 19) * 1000;
    let fimOferta = parseInt(localStorage.getItem('fimOfertaShopee'), 10);

    // Se ainda não existe um fim salvo ou se o tempo já acabou, cria um novo
    if (!fimOferta || fimOferta <= Date.now()) {
        fimOferta = Date.now() + duracaoOfertaMs;
        localStorage.setItem('fimOfertaShopee', fimOferta);
    }

    function atualizarCronometro() {
        let restanteMs = fimOferta - Date.now();

        if (restanteMs <= 0) {
            fimOferta = Date.now() + (3 * 3600 * 1000);
            localStorage.setItem('fimOfertaShopee', fimOferta);
            restanteMs = fimOferta - Date.now();
        }

        const segundosTotais = Math.floor(restanteMs / 1000);
        const h = String(Math.floor(segundosTotais / 3600)).padStart(2, '0');
        const m = String(Math.floor((segundosTotais % 3600) / 60)).padStart(2, '0');
        const s = String(segundosTotais % 60).padStart(2, '0');

        const el = document.getElementById('cronometro-shopee');
        if (el) el.textContent = `${h}:${m}:${s}`;
    }

    atualizarCronometro(); // Atualiza imediatamente ao abrir a página (sem esperar 1s)
    setInterval(atualizarCronometro, 1000);
}

// 2. Banner de Cupons + Barra de Categorias na Home (index.html)
function injetarElementosHome() {
    const secaoDestaques = document.querySelector('.destaques');
    const paginaAtual = window.location.pathname.split('/').pop();
    const isHome = paginaAtual === '' || paginaAtual === 'index.html';

    if (!secaoDestaques || !isHome) return;

    const vitrineShopee = document.createElement('section');
    vitrineShopee.className = 'shopee-vitrine-extras';
    vitrineShopee.innerHTML = `
        <!-- Banner Principal Estilo Marketplace -->
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
                <div class="cupom-ticket">
                    <div>
                        <strong>50% OFF</strong>
                        <small>Super Oferta</small>
                    </div>
                    <button type="button" onclick="copiarCupomShopee('SHADOW50', this)">SHADOW50 📋</button>
                </div>
            </div>
        </div>

        <!-- Categorias Rápidas (Atalhos visuais) -->
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
    navigator.clipboard?.writeText(codigo);
    const original = botao.textContent;
    botao.textContent = 'COPIADO! ✔';
    botao.style.backgroundColor = '#28a745';
    mostrarToastShopee(`Cupom ${codigo} copiado! Cole no carrinho.`);
    setTimeout(() => {
        botao.textContent = original;
        botao.style.backgroundColor = '';
    }, 2000);
};

// 3. Adiciona selos de desconto, estrelas, vendidos e Frete Grátis nos cards existentes
function turbinarCardsProdutos() {
    const cards = document.querySelectorAll('.destaques > div');
    const descontos = ['15%', '20%', '25%', '30%', '10%'];
    const vendidos = ['420', '1,1 mil', '890', '2,3 mil', '650', '980', '1,5 mil', '3,1 mil', '510', '1,8 mil'];

    cards.forEach((card, index) => {
        card.classList.add('card-shopee-style');

        // Selo de desconto no canto superior direito
        const badgeOff = document.createElement('span');
        badgeOff.className = 'shopee-badge-off';
        badgeOff.innerHTML = `${descontos[index % descontos.length]}<br><small>OFF</small>`;
        card.appendChild(badgeOff);

        // Etiqueta de Frete Grátis e Avaliação logo abaixo do preço
        const precoEl = card.querySelector('h3');
        if (precoEl) {
            const metaInfo = document.createElement('div');
            metaInfo.className = 'shopee-card-meta';
            metaInfo.innerHTML = `
                <span class="tag-frete">🚚 Frete Grátis</span>
                <span class="rating-vendidos">⭐ 4.9 | ${vendidos[index % vendidos.length]} vendidos</span>
            `;
            precoEl.insertAdjacentElement('afterend', metaInfo);
        }
    });
}

// 4. Contador de itens no ícone do carrinho no header
function atualizarBadgeCarrinho() {
    const linkCarrinho = document.querySelector('header nav a[href="carrinho.html"]');
    if (!linkCarrinho) return;

    const carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];
    const totalItens = carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);

    linkCarrinho.style.position = 'relative';
    let badge = linkCarrinho.querySelector('.shopee-cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'shopee-cart-badge';
        linkCarrinho.appendChild(badge);
    }
    badge.textContent = totalItens;
    badge.style.display = totalItens > 0 ? 'flex' : 'none';
}

// 5. Toast flutuante bonito
function mostrarToastShopee(mensagem) {
    let toast = document.getElementById('shopee-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'shopee-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensagem;
    toast.classList.add('visivel');
    setTimeout(() => toast.classList.remove('visivel'), 3000);
}