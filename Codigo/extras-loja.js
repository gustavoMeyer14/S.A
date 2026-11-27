/* extras-loja.js */
// =========================================================
// EXTRAS DA LOJA: FRETE, FAQ, NEWSLETTER INTELIGENTE E TOPO
// =========================================================

function escaparTextoExtraSR(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    const pagina = window.location.pathname.toLowerCase();
    const ehPaginaAdmin = pagina.includes('admin');
    const ehPaginaCarrinho = pagina.includes('carrinho');

    injetarBarraProgresso();

    // Nas páginas de Admin, não mostra frete, newsletter nem botões de cliente
    if (ehPaginaAdmin) return;

    injetarCalculadoraFrete();
    injetarBotoesFlutuantes();

    // Só mostra o Clube VIP se o usuário AINDA NÃO resgatou e não estiver no carrinho
    const jaEhVip = localStorage.getItem('vipShadowRealm') === 'true';
    if (!jaEhVip && !ehPaginaCarrinho) {
        injetarNewsletter();
    }
});

function injetarBarraProgresso() {
    if (document.getElementById('sr-barra-progresso')) return;
    const barra = document.createElement('div');
    barra.id = 'sr-barra-progresso';
    document.body.prepend(barra);

    window.addEventListener('scroll', () => {
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        const progresso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
        barra.style.width = `${progresso}%`;
    });
}

function injetarCalculadoraFrete() {
    document.querySelectorAll('.modalProduto').forEach((modal) => {
        const conteudo = modal.querySelector('.modalProduto-conteudo');
        const btnPreco = modal.querySelector('.btn-carrinho');
        if (!conteudo || modal.querySelector('.sr-frete-box')) return;

        const precoProduto = btnPreco ? parseFloat(btnPreco.getAttribute('data-preco')) || 0 : 0;

        const box = document.createElement('div');
        box.className = 'sr-frete-box';
        box.innerHTML = `
            <label>🚚 Calcular frete e prazo:</label>
            <div class="sr-frete-linha">
                <input type="text" maxlength="9" placeholder="Digite seu CEP (ex: 89201-000)">
                <button type="button" class="sr-btn-primario" style="padding:8px 16px; font-size:13px;">Calcular</button>
            </div>
            <div class="sr-frete-resultado"></div>
        `;

        const input = box.querySelector('input');
        const btn = box.querySelector('button');
        const res = box.querySelector('.sr-frete-resultado');

        input.addEventListener('input', () => {
            let v = input.value.replace(/\D/g, '');
            if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
            input.value = v;
        });

        btn.addEventListener('click', () => {
            const cepLimpo = input.value.replace(/\D/g, '');
            if (cepLimpo.length !== 8) {
                res.style.color = '#ff4d4d';
                res.textContent = 'Digite um CEP válido com 8 números.';
                return;
            }
            const cepSeguro = escaparTextoExtraSR(input.value);
            res.style.color = '#00e676';
            if (precoProduto >= 250) {
                res.textContent = `✔ Frete GRÁTIS para o CEP ${cepSeguro} • Entrega estimada em 3 a 5 dias úteis.`;
            } else {
                res.textContent = `📦 Frete Expresso: R$ 19,90 para ${cepSeguro} • Entrega em 3 a 5 dias úteis.`;
            }
        });

        conteudo.insertAdjacentElement('afterend', box);
    });
}

function injetarNewsletter() {
    const footer = document.querySelector('body > footer');
    if (!footer || document.querySelector('.sr-newsletter')) return;

    const secao = document.createElement('section');
    secao.className = 'sr-newsletter';
    secao.id = 'clube-vip-sr';
    secao.innerHTML = `
        <h3>🔥 Clube VIP Shadow Realm</h3>
        <p>Cadastre seu e-mail para desbloquear o cupom secreto de <strong>50% OFF</strong> e receber lançamentos exclusivos!</p>
        <form class="sr-newsletter-form" id="sr-form-news">
            <input type="email" id="sr-email-news" placeholder="Digite seu melhor e-mail..." required>
            <button type="submit" class="sr-btn-primario">Desbloquear 50% OFF</button>
        </form>
    `;

    footer.parentNode.insertBefore(secao, footer);

    document.getElementById('sr-form-news').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('sr-email-news').value.trim();
        if (!email) return;

        localStorage.setItem('vipShadowRealm', 'true');
        localStorage.setItem('vipEmailShadowRealm', email);

        // Remove o banner imediatamente da página
        secao.remove();

        // Atualiza o ticket da home se ele existir na página atual
        const ticketVip = document.getElementById('ticket-vip-home');
        if (ticketVip) {
            ticketVip.innerHTML = `
                <div>
                    <strong>50% OFF 🔓</strong>
                    <small>Cupom VIP: SHADOW50</small>
                </div>
                <button type="button" onclick="copiarCupom('SHADOW50', this)">COPIAR</button>
            `;
        }

        if (window.srModal) {
            const emailSeguro = escaparTextoExtraSR(email);
            const htmlVip = `
                <p>Bem-vindo ao Clube VIP, <strong>${emailSeguro}</strong>! 🎉</p>
                <p>Seu cupom exclusivo de <strong>50% OFF</strong> foi desbloqueado:</p>
                <div style="margin:15px auto; padding:12px; background:#0d0d0d; border:1px dashed #ffca28; border-radius:12px; display:flex; justify-content:center; align-items:center; gap:12px;">
                    <strong style="font-size:22px; color:#ffca28; letter-spacing:2px;">SHADOW50</strong>
                    <button type="button" class="sr-btn-primario" id="btn-copiar-vip" style="padding:6px 14px; font-size:13px;">Copiar 📋</button>
                </div>
                <small style="color:#bbb;">Cole este código no carrinho para aplicar metade do preço na hora!</small>
            `;
            window.srModal.alerta(htmlVip, '- Cupom VIP Desbloqueado 🔥 -', true);

            const btnCopiar = document.getElementById('btn-copiar-vip');
            if (btnCopiar) {
                btnCopiar.addEventListener('click', () => {
                    navigator.clipboard?.writeText('SHADOW50');
                    btnCopiar.textContent = 'Copiado! ✔';
                    btnCopiar.style.backgroundColor = '#28a745';
                });
            }
        }
    });
}

function injetarBotoesFlutuantes() {
    if (document.querySelector('.sr-botoes-flutuantes')) return;
    const container = document.createElement('div');
    container.className = 'sr-botoes-flutuantes';
    container.innerHTML = `
        <button type="button" class="sr-fab" id="sr-fab-fav" title="Meus Favoritos">
            ❤️<span class="sr-fab-badge" id="sr-badge-fav">0</span>
        </button>
        <button type="button" class="sr-fab" id="sr-fab-faq" title="Dúvidas Frequentes">❓</button>
        <button type="button" class="sr-fab" id="sr-fab-topo" title="Voltar ao Topo" style="display:none;">⬆️</button>
    `;
    document.body.appendChild(container);

    document.getElementById('sr-fab-fav').addEventListener('click', () => {
        if (typeof window.abrirModalFavoritos === 'function') {
            window.abrirModalFavoritos();
        }
    });

    document.getElementById('sr-fab-faq').addEventListener('click', () => {
        const faqHTML = `
            <details class="sr-faq-item" open>
                <summary>As figures são originais e em resina?</summary>
                <p>Sim! Todas as peças são escala 1/6 em resina de alto padrão com base diorama e embalagem reforçada.</p>
            </details>
            <details class="sr-faq-item">
                <summary>Como funciona o Frete Grátis?</summary>
                <p>Pedidos acima de R$ 250,00 têm frete grátis automático para todo o Brasil.</p>
            </details>
            <details class="sr-faq-item">
                <summary>Posso cancelar um pedido?</summary>
                <p>Sim, basta acessar "Meus Pedidos" no menu do usuário e clicar em Cancelar Pedido.</p>
            </details>
            <details class="sr-faq-item">
                <summary>Quais cupons estão ativos?</summary>
                <p>Use <strong>SHADOW26</strong> (10% OFF), <strong>GEEK15</strong> (15% OFF) ou cadastre-se no <strong>Clube VIP</strong> para desbloquear o cupom secreto de 50% OFF!</p>
            </details>
        `;
        if (window.srModal) {
            window.srModal.alerta(faqHTML, '- Central de Ajuda (FAQ) -', true);
        }
    });

    const btnTopo = document.getElementById('sr-fab-topo');
    window.addEventListener('scroll', () => {
        btnTopo.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    btnTopo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}