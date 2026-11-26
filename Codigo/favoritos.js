// =========================================================
// SISTEMA DE FAVORITOS (INTEGRADO COM VITRINI.JS)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const CHAVE_FAV = 'favoritosShadowRealm';

    function lerFavoritos() {
        try {
            return JSON.parse(localStorage.getItem(CHAVE_FAV)) || [];
        } catch {
            return [];
        }
    }

    function salvarFavoritos(lista) {
        localStorage.setItem(CHAVE_FAV, JSON.stringify(lista));
        atualizarContadorFavoritos();
    }

    function atualizarContadorFavoritos() {
        const badge = document.getElementById('sr-badge-fav');
        if (!badge) return;
        const total = lerFavoritos().length;
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }

    function montarConteudoFavoritosHTML() {
        const lista = lerFavoritos();
        if (lista.length === 0) {
            return '<p id="sr-fav-vazio" style="color:#bbb; margin: 15px 0;">Você ainda não favoritou nenhuma figure. Clique no 🤍 nos cards para salvar!</p>';
        }

        return '<div class="sr-lista-fav" id="sr-lista-fav-itens">' + lista.map((item) => `
            <div class="sr-item-fav" data-fav-nome="${item.nome}">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div>
                        <strong>${item.nome}</strong><br>
                        <small style="color:#ffca28;">R$ ${Number(item.preco).toFixed(2).replace('.', ',')}</small>
                    </div>
                </div>
                <button type="button" class="sr-btn-secundario btn-rem-fav-sr" data-nome="${item.nome}" style="padding:6px 12px; font-size:12px;">Remover</button>
            </div>
        `).join('') + '</div>';
    }

    function ligarBotoesRemoverFavoritos() {
        document.querySelectorAll('.btn-rem-fav-sr').forEach((btn) => {
            btn.addEventListener('click', () => {
                const nome = btn.getAttribute('data-nome');
                const novaLista = lerFavoritos().filter((f) => f.nome !== nome);
                salvarFavoritos(novaLista);

                document.querySelectorAll('.btn-favorito-card').forEach((cardBtn) => {
                    if (cardBtn.getAttribute('data-nome') === nome) {
                        cardBtn.textContent = '🤍';
                        cardBtn.classList.remove('ativo');
                    }
                });

                const msgEl = document.getElementById('sr-modal-mensagem');
                if (msgEl) {
                    msgEl.innerHTML = montarConteudoFavoritosHTML();
                    ligarBotoesRemoverFavoritos();
                }
            });
        });
    }

    // Sincroniza o contador sempre que clicar em qualquer coração dos cards
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-favorito-card')) {
            setTimeout(atualizarContadorFavoritos, 30);
        }
    });

    window.abrirModalFavoritos = function () {
        const html = montarConteudoFavoritosHTML();

        if (window.srModal) {
            window.srModal.alerta(html, '- Meus Favoritos ❤️ -', true);
            ligarBotoesRemoverFavoritos();
        }
    };

    setTimeout(atualizarContadorFavoritos, 120);
});