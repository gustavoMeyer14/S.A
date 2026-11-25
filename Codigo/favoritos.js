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

    // Sincroniza o contador sempre que clicar em qualquer coração dos cards
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-favorito-card')) {
            setTimeout(atualizarContadorFavoritos, 30);
        }
    });

    window.abrirModalFavoritos = function () {
        const lista = lerFavoritos();
        let html = '';

        if (lista.length === 0) {
            html = '<p style="color:#bbb; margin: 15px 0;">Você ainda não favoritou nenhuma figure. Clique no 🤍 nos cards para salvar!</p>';
        } else {
            html = '<div class="sr-lista-fav">' + lista.map((item) => `
                <div class="sr-item-fav">
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

        if (window.srModal) {
            window.srModal.alerta(html, '- Meus Favoritos ❤️ -', true);

            // Liga os botões de remover sem usar onclick no HTML
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

                    window.abrirModalFavoritos();
                });
            });
        }
    };

    setTimeout(atualizarContadorFavoritos, 120);
});