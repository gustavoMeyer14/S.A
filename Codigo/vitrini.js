// ==========================================
// INICIALIZAÇÃO DA VITRINE SHADOW REALM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const produtosOriginais = [
        'ichigo kurosaki',
        'kisuke urahara',
        'renji abarai',
        'rukia kuchiki',
        'toshiro hitsugaya'
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
        .form-comentario-html {
            background: #1a1a1a;
            border: 1px solid #C62828;
            border-radius: 14px;
            padding: 15px;
            margin-bottom: 10px;
        }
        .form-comentario-html h3 {
            color: #ffca28;
            font-size: 18px;
            margin-bottom: 10px;
        }
        .form-comentario-linha {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            margin-bottom: 10px;
        }
        .form-comentario-html select {
            width: auto !important;
            height: 38px !important;
            margin: 0 !important;
            padding: 4px 12px !important;
            border-radius: 10px !important;
            background: #121212 !important;
            color: #ffca28 !important;
            border: 1px solid #C62828 !important;
            font-size: 14px !important;
        }
        .form-comentario-html textarea {
            width: 100% !important;
            min-height: 75px;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #C62828;
            background: #121212;
            color: #ffffff;
            font-family: inherit;
            font-size: 15px;
            resize: vertical;
            margin-bottom: 10px;
        }
        .btn-enviar-comentario {
            background: #C62828;
            color: #ffffff;
            border: 1px solid #C62828;
            border-radius: 12px;
            padding: 9px 18px;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.25s;
        }
        .btn-enviar-comentario:hover {
            background: #000000;
            box-shadow: 0 4px 14px rgba(198, 40, 40, 0.6);
        }
        .aviso-nao-logado {
            background: #1a1a1a;
            border: 1px dashed #ffca28;
            border-radius: 12px;
            padding: 12px 16px;
            color: #e0e0e0;
            font-size: 15px;
            text-align: center;
        }
        .aviso-nao-logado a {
            color: #ffca28;
            font-weight: bold;
            text-decoration: underline;
        }
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
// 2. SISTEMA COMPLETO DE COMENTÁRIOS E AVALIAÇÕES
// ==========================================
const comentariosIniciaisPadrao = [
    { autorId: 'seed1', autor: 'Lucas Kenji', nota: 5, texto: 'Acabamento absurdo! A pintura da resina e os efeitos translúcidos superaram todas as expectativas.', data: '12/10/2026' },
    { autorId: 'seed2', autor: 'Mariana Souza', nota: 5, texto: 'Chegou super bem embalado na caixa original e sem nenhum arranhão. Recomendo demais a loja!', data: '28/10/2026' },
    { autorId: 'seed3', autor: 'Rafael Costa', nota: 4, texto: 'Escultura muito fiel ao anime, base diorama bem pesada e firme na estante.', data: '05/11/2026' }
];

function inicializarComentariosHTML() {
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
    const usuarioAtual = (localStorage.getItem('usuarioAtual') || '').trim();
    const nomeSalvo = (localStorage.getItem('usuarioNome') || '').trim();
    const nomeUsuario = nomeSalvo || (usuarioAtual.includes('@') ? usuarioAtual.split('@')[0] : usuarioAtual);

    document.querySelectorAll('.modalProduto').forEach(modal => {
        const tituloEl = modal.querySelector('.modalProduto-conteudo h2');
        const container = modal.querySelector('.modalProduto-comentarios');
        if (!tituloEl || !container) return;

        const nomeProduto = tituloEl.innerText.replace(/^-\s*/, '').trim();
        const produtoSlug = nomeProduto.toLowerCase();
        container.setAttribute('data-produto', produtoSlug);

        if (!container.querySelector('.lista-novos-comentarios')) {
            container.innerHTML = `
                <h3 style="color:#ffffff; font-size:22px; border-bottom:1px solid #C62828; padding-bottom:8px;">
                    💬 Avaliações e Comentários (${nomeProduto})
                </h3>
                <form class="form-comentario-html">
                    <div class="form-comentario-linha">
                        <label style="font-size:15px; font-weight:bold; color:#eee;">Sua nota:</label>
                        <select aria-label="Nota da avaliação">
                            <option value="5">★★★★★ (5 - Excelente)</option>
                            <option value="4">★★★★☆ (4 - Muito bom)</option>
                            <option value="3">★★★☆☆ (3 - Bom)</option>
                            <option value="2">★★☆☆☆ (2 - Regular)</option>
                            <option value="1">★☆☆☆☆ (1 - Ruim)</option>
                        </select>
                        <span style="font-size:13px; color:#bbb;">Comentando como <strong style="color:#ffca28;">${nomeUsuario || 'Visitante'}</strong></span>
                    </div>
                    <textarea placeholder="Conte o que achou dos detalhes, pintura e acabamento desta figure..." required></textarea>
                    <button type="submit" class="btn-enviar-comentario">Publicar Avaliação</button>
                </form>
                <div class="aviso-nao-logado">
                    Quer avaliar esta figure? <a href="cliente.html">Faça login</a> ou <a href="cadastro.html">cadastre-se</a> para comentar!
                </div>
                <div class="lista-novos-comentarios"></div>
            `;
        }

        const chave = `comentarios_${produtoSlug}`;
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

        function obterListaComentarios() {
            let salvos = null;
            try { salvos = JSON.parse(localStorage.getItem(chave)); }
            catch { salvos = null; }

            if (!Array.isArray(salvos)) {
                salvos = [...comentariosIniciaisPadrao];
                localStorage.setItem(chave, JSON.stringify(salvos));
            }
            return salvos;
        }

       function renderizar() {
            if (!lista) return;
            const salvos = obterListaComentarios();
            lista.innerHTML = '';

            if (salvos.length === 0) {
                lista.innerHTML = '<p style="color:#aaa; font-size:15px;">Ainda não há avaliações para esta figure. Seja o primeiro a comentar!</p>';
                return;
            }

            salvos.slice().reverse().forEach((item, idxRev) => {
                const idxReal = salvos.length - 1 - idxRev;
                const dono = estaLogado && item.autorId === usuarioAtual.toLowerCase();
                const notaNum = Math.min(5, Math.max(1, Number(item.nota) || 5));

                const div = document.createElement('div');
                div.className = 'comentarios';

                div.innerHTML = `
                    <h2>
                        <span>${item.autor}</span>
                        <span style="color:#ffca28; font-size:15px;">${'★'.repeat(notaNum)}${'☆'.repeat(5 - notaNum)}</span>
                    </h2>
                    <p>${item.texto}</p>
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-top:10px;">
                        <small style="font-size:12px; color:#888;">${item.data || ''}</small>
                        ${dono ? `<button type="button" class="btn-del" style="width:auto; height:auto; padding:4px 10px; margin:0; font-size:12px; background:transparent; border:1px solid #C62828; color:#ff4d4d; border-radius:10px; cursor:pointer;">Excluir</button>` : ''}
                    </div>
                `;

                if (dono && div.querySelector('.btn-del')) {
                    div.querySelector('.btn-del').addEventListener('click', () => {
                        const atual = obterListaComentarios();
                        atual.splice(idxReal, 1);
                        localStorage.setItem(chave, JSON.stringify(atual));
                        renderizar();
                    });
                }

                lista.appendChild(div);
            });
        }

        if (form && estaLogado && usuarioAtual && form.dataset.listenerAtivo !== 'true') {
            form.dataset.listenerAtivo = 'true';
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const textarea = form.querySelector('textarea');
                const selectNota = form.querySelector('select');
                const texto = textarea.value.trim();
                const nota = parseInt(selectNota.value, 10) || 5;
                if (!texto) return;

                const salvos = obterListaComentarios();
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