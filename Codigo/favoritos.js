/* favoritos.js */
// =========================================================
// FAVORITOS UNIFICADOS - SHADOW REALM STORE (favoritos.js)
// =========================================================

(function () {
    'use strict';

    const CHAVE_FAV_BASE = 'favoritosShadowRealm';

    function obterChaveFavoritos() {
        const logado = localStorage.getItem('usuarioLogado') === 'true';
        const usuario = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();
        return logado && usuario ? `${CHAVE_FAV_BASE}_${usuario}` : `${CHAVE_FAV_BASE}_visitante`;
    }

    function lerFavoritos() {
        try {
            const bruto = localStorage.getItem(obterChaveFavoritos());
            if (bruto) {
                const parsed = JSON.parse(bruto);
                if (Array.isArray(parsed)) return parsed;
            }
            const legado = JSON.parse(localStorage.getItem(CHAVE_FAV_BASE) || '[]');
            return Array.isArray(legado) ? legado : [];
        } catch {
            return [];
        }
    }

    function salvarFavoritos(lista) {
        const limpos = Array.isArray(lista) ? lista : [];
        try {
            localStorage.setItem(obterChaveFavoritos(), JSON.stringify(limpos));
            localStorage.setItem(CHAVE_FAV_BASE, JSON.stringify(limpos));
        } catch {}
    }

    function escaparTextoFav(texto) {
        return String(texto ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function ehFavorito(nomeProduto) {
        const alvo = String(nomeProduto ?? '').trim().toLowerCase();
        if (!alvo) return false;
        return lerFavoritos().some((item) => String(item.nome || '').trim().toLowerCase() === alvo);
    }

    function atualizarBadgeFavoritos() {
        const total = lerFavoritos().length;
        const badge = document.getElementById('sr-badge-fav');
        if (badge) {
            badge.textContent = String(total);
            badge.style.display = total > 0 ? 'flex' : 'none';
        }
    }

    function atualizarBotoesFavoritos() {
        document.querySelectorAll('.btn-favorito-sr').forEach((extra) => extra.remove());

        document.querySelectorAll('.destaques > div').forEach((card) => {
            const botoes = Array.from(card.querySelectorAll('.btn-favorito-card'));
            botoes.slice(1).forEach((dup) => dup.remove());
        });

        document.querySelectorAll('.btn-favorito-card').forEach((btn) => {
            const nome = btn.getAttribute('data-nome') || '';
            const ativo = ehFavorito(nome);
            btn.classList.toggle('ativo', ativo);
            btn.setAttribute('aria-pressed', ativo ? 'true' : 'false');
            btn.title = ativo ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos';
            btn.innerHTML = ativo ? '❤️' : '🤍';
        });

        atualizarBadgeFavoritos();
    }

    function alternarFavorito(produto) {
        if (!produto || !produto.nome) return false;

        const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
        if (!estaLogado) {
            if (window.srModal && typeof window.srModal.alerta === 'function') {
                window.srModal.alerta(
                    'Faça login na sua conta para salvar figures nos favoritos!',
                    '- Favoritos -'
                );
            }
            return false;
        }

        const nomeNorm = String(produto.nome).trim().toLowerCase();
        const lista = lerFavoritos();
        const idx = lista.findIndex((item) => String(item.nome || '').trim().toLowerCase() === nomeNorm);

        let adicionado = false;
        if (idx !== -1) {
            lista.splice(idx, 1);
            adicionado = false;
        } else {
            lista.push({
                nome: String(produto.nome).trim(),
                preco: Number(produto.preco) || 0,
                imagem: String(produto.imagem || 'imagens/produto.png').trim()
            });
            adicionado = true;
        }

        salvarFavoritos(lista);
        atualizarBotoesFavoritos();
        renderizarSecaoFavoritos();

        if (window.srModal && typeof window.srModal.toast === 'function') {
            window.srModal.toast(
                adicionado
                    ? `"${produto.nome}" adicionado aos favoritos!`
                    : `"${produto.nome}" removido dos favoritos.`
            );
        }

        return adicionado;
    }

    function renderizarSecaoFavoritos() {
        const secao = document.getElementById('secao-favoritos-sr');
        if (!secao) return;

        const lista = lerFavoritos();
        if (lista.length === 0) {
            secao.style.display = 'none';
            secao.innerHTML = '';
            return;
        }

        secao.style.display = 'block';
        secao.innerHTML = `
            <h3 style="margin:0 0 14px 0; color:#ffca28;">❤️ Seus Favoritos (${lista.length})</h3>
            <div style="display:flex; flex-wrap:wrap; gap:12px;">
                ${lista.map((item) => `
                    <div style="background:#1e1e1e; border:1px solid #333; border-radius:12px; padding:10px 14px; display:flex; align-items:center; gap:10px;">
                        <img src="${escaparTextoFav(item.imagem)}" alt="${escaparTextoFav(item.nome)}" style="width:42px; height:42px; object-fit:cover; border-radius:8px;">
                        <div>
                            <strong style="display:block; font-size:14px;">${escaparTextoFav(item.nome)}</strong>
                            <small style="color:#ffca28;">R$ ${(Number(item.preco) || 0).toFixed(2).replace('.', ',')}</small>
                        </div>
                        <button type="button" data-nome-remover="${escaparTextoFav(item.nome)}" style="background:#8e1616; color:#fff; border:none; border-radius:8px; padding:5px 10px; cursor:pointer; font-size:12px; font-weight:bold;">Remover</button>
                    </div>
                `).join('')}
            </div>
        `;

        secao.querySelectorAll('button[data-nome-remover]').forEach((btnRem) => {
            btnRem.addEventListener('click', () => {
                const nomeRem = btnRem.getAttribute('data-nome-remover');
                alternarFavorito({ nome: nomeRem });
            });
        });
    }

    window.lerFavoritosSR = lerFavoritos;
    window.salvarFavoritosSR = salvarFavoritos;
    window.alternarFavoritoSR = alternarFavorito;
    window.ehFavoritoSR = ehFavorito;
    window.atualizarBotoesFavoritosSR = atualizarBotoesFavoritos;

    document.addEventListener('DOMContentLoaded', () => {
        atualizarBotoesFavoritos();
        renderizarSecaoFavoritos();
    });
})();