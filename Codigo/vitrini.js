// ==========================================
// 0. REMOÇÃO GARANTIDA DO BOTÃO "MEUS PEDIDOS" DUPLICADO
// ==========================================
function removerPedidosDuplicados() {
    const navUsuario = document.querySelector('#modalCliente .nav-usuario');
    if (!navUsuario) return;

    const linksPedidos = Array.from(navUsuario.querySelectorAll('a')).filter(a =>
        a.textContent.trim().toLowerCase() === 'meus pedidos'
    );

    if (linksPedidos.length > 1) {
        // Remove o link extra com href="#" injetado pelo site.js e mantém o link oficial (pedidos.html)
        const extraSiteJs = linksPedidos.find(a => a.getAttribute('href') === '#');
        if (extraSiteJs) {
            extraSiteJs.remove();
        } else {
            linksPedidos[0].remove();
        }
    }
}

// Executa imediatamente (graças ao defer), no DOMContentLoaded e no load
removerPedidosDuplicados();
document.addEventListener('DOMContentLoaded', removerPedidosDuplicados);
window.addEventListener('load', removerPedidosDuplicados);

// ==========================================
// INICIALIZAÇÃO DA VITRINE SHADOW REALM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const produtosOriginais = [
        'ichigo kurosaki',
        'kisuke urahara',
        'levi ackerman',
        'maomao',
        'satoru gojo'
    ];

    injetarEstilosVitrine();
    configurarFavoritosGlobal();
    processarCardsVitrine(produtosOriginais);
    inicializarComentariosHTML();
});

function injetarEstilosVitrine() {
    if (document.getElementById('estilos-vitrine-sr')) return;
    const style = document.createElement('style');
    style.id = 'estilos-vitrine-sr';
    style.textContent = `
        .destaques > div { position: relative; }
        .btn-favorito-card {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 36px !important;
            height: 36px !important;
            border-radius: 50% !important;
            background: rgba(15, 15, 15, 0.85) !important;
            border: 1px solid #b82929 !important;
            color: #fff;
            font-size: 18px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 5;
            padding: 0 !important;
            margin: 0 !important;
            transition: transform 0.2s;
        }
        .btn-favorito-card:hover { transform: scale(1.12); }
        .selo-originalidade {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: linear-gradient(135deg, #d4af37, #f9e076);
            color: #111;
            font-weight: 800;
            font-size: 11px;
            padding: 3px 9px;
            border-radius: 20px;
            margin: 5px auto;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 6px rgba(212, 175, 55, 0.35);
        }
        /* Expansão automática do modal e da área de comentários */
        dialog.modalProduto[open] {
            height: auto !important;
            max-height: 88vh !important;
            overflow-y: auto !important;
        }
        .modalProduto-comentarios {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
        }
        .modalProduto-comentarios .comentarios {
            height: auto !important;
            word-wrap: break-word !important;
        }
        /* Modal de Favoritos */
        #modalFavoritosSR[open] {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            margin: 0 !important;
            background: #1a1a1a;
            color: #fff;
            border: 2px solid #b82929;
            border-radius: 15px;
            padding: 25px;
            max-width: 500px;
            width: 92%;
            max-height: 80vh;
            overflow-y: auto;
        }
        #modalFavoritosSR::backdrop { background: rgba(0, 0, 0, 0.75); }
        .item-fav-modal {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            background: #252525;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
            border: 1px solid #333;
        }
        .item-fav-modal img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 6px;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// 1. LISTA DE FAVORITOS (❤️) E SELO DE ORIGINALIDADE
// ==========================================
function obterFavoritos() {
    try { return JSON.parse(localStorage.getItem('favoritosShadowRealm')) || []; }
    catch { return []; }
}

function salvarFavoritos(lista) {
    localStorage.setItem('favoritosShadowRealm', JSON.stringify(lista));
}

function configurarFavoritosGlobal() {
    const navUsuario = document.querySelector('#modalCliente .nav-usuario');
    if (navUsuario && !document.getElementById('link-meus-favoritos')) {
        const btnFavMenu = document.createElement('a');
        btnFavMenu.href = '#';
        btnFavMenu.id = 'link-meus-favoritos';
        btnFavMenu.textContent = '❤️ Meus Favoritos';
        btnFavMenu.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof fechaModalCliente === 'function') fechaModalCliente();
            abrirModalFavoritos();
        });
        const linkSair = Array.from(navUsuario.querySelectorAll('a')).find(a => a.textContent.trim().toLowerCase() === 'sair');
        if (linkSair) navUsuario.insertBefore(btnFavMenu, linkSair);
        else navUsuario.appendChild(btnFavMenu);
    }

    if (!document.getElementById('modalFavoritosSR')) {
        const dialogFav = document.createElement('dialog');
        dialogFav.id = 'modalFavoritosSR';
        dialogFav.innerHTML = `
            <h2 style="text-align:center; margin-bottom:15px;">❤️ Meus Favoritos</h2>
            <div id="conteudoFavoritosSR"></div>
            <div style="text-align:right; margin-top:15px;">
                <button type="button" onclick="document.getElementById('modalFavoritosSR').close()"
                    style="background:#b82929; color:#fff; border:none; padding:8px 18px; border-radius:8px; cursor:pointer; font-weight:bold;">
                    Fechar
                </button>
            </div>
        `;
        document.body.appendChild(dialogFav);
    }
}

window.abrirModalFavoritos = function () {
    const modal = document.getElementById('modalFavoritosSR');
    const container = document.getElementById('conteudoFavoritosSR');
    const favoritos = obterFavoritos();

    if (favoritos.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#bbb;">Você ainda não favoritou nenhuma figure.</p>';
    } else {
        container.innerHTML = favoritos.map(item => `
            <div class="item-fav-modal">
                <img src="${item.imagem}" alt="${item.nome}">
                <div style="flex:1; text-align:left;">
                    <strong>${item.nome}</strong>
                    <p style="color:#ffca28; font-size:14px; margin:2px 0;">R$ ${Number(item.preco).toFixed(2).replace('.', ',')}</p>
                </div>
                <button type="button" onclick="removerFavoritoModal('${item.nome.replace(/'/g, "\\'")}')"
                    style="background:transparent; border:1px solid #ff4d4d; color:#ff4d4d; padding:5px 10px; border-radius:6px; cursor:pointer;">
                    Remover
                </button>
            </div>
        `).join('');
    }
    modal.showModal();
};

window.removerFavoritoModal = function (nome) {
    const atualizados = obterFavoritos().filter(f => f.nome !== nome);
    salvarFavoritos(atualizados);
    abrirModalFavoritos();
    document.querySelectorAll('.btn-favorito-card').forEach(btn => {
        if (btn.getAttribute('data-nome') === nome) btn.innerHTML = '🤍';
    });
};

function processarCardsVitrine(produtosOriginais) {
    const cards = document.querySelectorAll('.destaques > div');
    const favoritos = obterFavoritos();

    cards.forEach(card => {
        const nomeEl = card.querySelector('p');
        const precoEl = card.querySelector('h3');
        const imgEl = card.querySelector('img');
        const btnVerMais = card.querySelector('button[id^="card"]');
        if (!nomeEl || !precoEl) return;

        const nomeProduto = nomeEl.innerText.trim();
        const chave = nomeProduto.toLowerCase();
        const imagemProduto = imgEl ? imgEl.getAttribute('src') : 'imagens/produto.png';
        const precoNum = parseFloat(precoEl.innerText.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const isOriginal = produtosOriginais.includes(chave);

        if (!card.querySelector('.btn-favorito-card')) {
            const jaFavorito = favoritos.some(f => f.nome === nomeProduto);
            const btnFav = document.createElement('button');
            btnFav.type = 'button';
            btnFav.className = 'btn-favorito-card';
            btnFav.setAttribute('data-nome', nomeProduto);
            btnFav.title = 'Adicionar aos Favoritos';
            btnFav.innerHTML = jaFavorito ? '❤️' : '🤍';

            btnFav.addEventListener('click', (e) => {
                e.stopPropagation();
                let lista = obterFavoritos();
                const idx = lista.findIndex(f => f.nome === nomeProduto);
                if (idx >= 0) {
                    lista.splice(idx, 1);
                    btnFav.innerHTML = '🤍';
                } else {
                    lista.push({ nome: nomeProduto, preco: precoNum, imagem: imagemProduto });
                    btnFav.innerHTML = '❤️';
                }
                salvarFavoritos(lista);
            });
            card.appendChild(btnFav);
        }

        if (isOriginal && !card.querySelector('.selo-originalidade')) {
            const selo = document.createElement('span');
            selo.className = 'selo-originalidade';
            selo.innerHTML = '🛡️ Selo Original';
            nomeEl.insertAdjacentElement('afterend', selo);
        }

        if (btnVerMais) {
            const modal = document.getElementById(`modal-${btnVerMais.id}`);
            const tituloModal = modal?.querySelector('h2');
            if (isOriginal && tituloModal && !modal.querySelector('.selo-originalidade')) {
                const seloModal = document.createElement('span');
                seloModal.className = 'selo-originalidade';
                seloModal.innerHTML = '🛡️ Produto 100% Original Certificado';
                tituloModal.insertAdjacentElement('afterend', seloModal);
            }
        }
    });
}

// ==========================================
// 2. COMENTÁRIOS DIRETOS NO HTML (SALVAR + EXPANDIR + EXCLUIR)
// ==========================================
function inicializarComentariosHTML() {
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
    const usuarioAtual = (localStorage.getItem('usuarioAtual') || '').trim();
    const nomeSalvo = (localStorage.getItem('usuarioNome') || '').trim();
    const nomeUsuario = nomeSalvo || (usuarioAtual.includes('@') ? usuarioAtual.split('@')[0] : usuarioAtual);

    document.querySelectorAll('.modalProduto-comentarios[data-produto]').forEach(container => {
        const produto = container.getAttribute('data-produto').toLowerCase().trim();
        const chave = `comentarios_${produto}`;
        const form = container.querySelector('.form-comentario-html');
        const aviso = container.querySelector('.aviso-nao-logado');
        const lista = container.querySelector('.lista-novos-comentarios');

        if (!estaLogado || !usuarioAtual) {
            if (form) form.style.display = 'none';
            if (aviso) aviso.style.display = 'block';
        } else {
            if (form) form.style.display = 'block';
            if (aviso) aviso.style.display = 'none';
        }

        function renderizar() {
            if (!lista) return;
            let salvos = [];
            try { salvos = JSON.parse(localStorage.getItem(chave)) || []; }
            catch { salvos = []; }

            lista.innerHTML = '';

            salvos.slice().reverse().forEach((item, idxRev) => {
                const idxReal = salvos.length - 1 - idxRev;
                const dono = estaLogado && item.autorId === usuarioAtual.toLowerCase();

                const div = document.createElement('div');
                div.className = 'comentarios';
                div.style.height = 'auto';
                div.innerHTML = `
                    <h2>${item.autor} <span style="color:#ffca28; font-size:14px;">${'★'.repeat(item.nota)}${'☆'.repeat(5 - item.nota)}</span></h2>
                    <p>${item.texto}</p>
                    <small style="font-size:11px; color:#888; display:block;">${item.data || ''}</small>
                    ${dono ? `<button type="button" class="btn-del" style="width:auto; height:auto; padding:3px 10px; margin-top:6px; font-size:12px; background:transparent; border:1px solid #ff4d4d; color:#ff4d4d; border-radius:5px; cursor:pointer;">🗑️ Excluir</button>` : ''}
                `;

                if (dono) {
                    div.querySelector('.btn-del').addEventListener('click', () => {
                        const atual = JSON.parse(localStorage.getItem(chave)) || [];
                        atual.splice(idxReal, 1);
                        localStorage.setItem(chave, JSON.stringify(atual));
                        renderizar();
                    });
                }

                lista.appendChild(div);
            });
        }

        if (form && estaLogado && usuarioAtual) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const texto = form.querySelector('textarea').value.trim();
                const nota = parseInt(form.querySelector('select').value, 10) || 5;
                if (!texto) return;

                const salvos = JSON.parse(localStorage.getItem(chave)) || [];
                salvos.push({
                    autorId: usuarioAtual.toLowerCase(),
                    autor: nomeUsuario,
                    nota,
                    texto,
                    data: new Date().toLocaleDateString('pt-BR')
                });

                localStorage.setItem(chave, JSON.stringify(salvos));
                form.reset();
                renderizar();
            });
        }

        renderizar();
    });
}