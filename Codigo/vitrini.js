function iniciarVitrineShadowRealm() {
    const produtosOriginais = [
        'ichigo kurosaki',
        'kisuke urahara',
        'levi ackerman',
        'maomao',
        'satoru gojo'
    ];

    injetarEstilosVitrine();
    configurarFavoritosGlobal();
    processarCardsEModais(produtosOriginais);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarVitrineShadowRealm);
} else {
    iniciarVitrineShadowRealm();
}

function obterUsuarioLogadoAvaliacao() {
    const logadoOficial = localStorage.getItem('usuarioLogado') === 'true';
    const emailOficial = localStorage.getItem('usuarioAtual');
    if (logadoOficial && emailOficial) {
        return {
            logado: true,
            id: emailOficial.trim().toLowerCase(),
            nomeExibicao: emailOficial.includes('@') ? emailOficial.split('@')[0] : emailOficial
        };
    }

    try {
        const clienteLocal = JSON.parse(localStorage.getItem('clienteLogado'));
        if (clienteLocal && (clienteLocal.email || clienteLocal.cpf || clienteLocal.nome)) {
            const id = (clienteLocal.email || clienteLocal.cpf || clienteLocal.nome).trim().toLowerCase();
            return {
                logado: true,
                id,
                nomeExibicao: clienteLocal.nome || id
            };
        }
    } catch {}

    return { logado: false, id: null, nomeExibicao: null };
}

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
        .form-avaliacao-sr, .aviso-login-avaliacao {
            background: #141414;
            border: 1px solid #b82929;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 12px;
            text-align: left;
        }
        .estrelas-seletor {
            display: flex;
            gap: 4px;
            font-size: 20px;
            cursor: pointer;
            margin: 4px 0;
        }
        .estrelas-seletor span { color: #555; transition: color 0.15s; }
        .estrelas-seletor span.ativa { color: #ffca28; }
        .btn-excluir-avaliacao {
            background: transparent;
            border: 1px solid #ff4d4d;
            color: #ff4d4d;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 6px;
            width: auto !important;
            height: auto !important;
        }
        .btn-excluir-avaliacao:hover { background: #ff4d4d; color: #fff; }
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
// 1. LISTA DE DESEJOS / FAVORITOS (❤️)
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
        const botaoFechar = navUsuario.querySelector('.botaoFecharCliente');
        if (botaoFechar) navUsuario.insertBefore(btnFavMenu, botaoFechar);
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

// ==========================================
// 2. SELO DE ORIGINALIDADE E COMENTÁRIOS EXISTENTES
// ==========================================
function processarCardsEModais(produtosOriginais) {
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

        // A) Botão Favorito ❤️ no card
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

        // B) Selo de Originalidade
        if (isOriginal && !card.querySelector('.selo-originalidade')) {
            const selo = document.createElement('span');
            selo.className = 'selo-originalidade';
            selo.innerHTML = '🛡️ Selo Original';
            nomeEl.insertAdjacentElement('afterend', selo);
        }

        // C) Conecta nos comentários já existentes dentro do modal
        if (btnVerMais) {
            const modal = document.getElementById(`modal-${btnVerMais.id}`);
            if (modal) {
                const tituloModal = modal.querySelector('h2');
                if (isOriginal && tituloModal && !modal.querySelector('.selo-originalidade')) {
                    const seloModal = document.createElement('span');
                    seloModal.className = 'selo-originalidade';
                    seloModal.innerHTML = '🛡️ Produto 100% Original Certificado';
                    tituloModal.insertAdjacentElement('afterend', seloModal);
                }

                integrarNosComentariosExistentes(modal, nomeProduto);
            }
        }
    });
}

// ==========================================
// 3. INTEGRAÇÃO COM .modalProduto-comentarios DO SITE
// ==========================================
function integrarNosComentariosExistentes(modal, nomeProduto) {
    if (modal.dataset.avaliacoesConectadas === 'true') return;
    modal.dataset.avaliacoesConectadas = 'true';

    let containerComentarios = modal.querySelector('.modalProduto-comentarios');
    if (!containerComentarios) {
        containerComentarios = document.createElement('div');
        containerComentarios.className = 'modalProduto-comentarios';
        const footerModal = modal.querySelector('.modal-footer');
        if (footerModal) modal.insertBefore(containerComentarios, footerModal);
        else modal.appendChild(containerComentarios);
    }

    const chaveStorage = `avaliacoesShadowRealm_${nomeProduto}`;
    const usuario = obterUsuarioLogadoAvaliacao();

    // Cria área do formulário no topo de .modalProduto-comentarios (sem apagar nenhum comentário existente)
    const areaTopo = document.createElement('div');
    areaTopo.className = 'avaliacao-topo-sr';
    areaTopo.innerHTML = usuario.logado
        ? `
            <div class="form-avaliacao-sr">
                <p style="font-size: 13px; color: #ccc; margin: 0;">Avaliando como <strong style="color:#ffca28;">${usuario.nomeExibicao}</strong>:</p>
                <div class="estrelas-seletor" data-nota="5">
                    <span data-val="1" class="ativa">★</span>
                    <span data-val="2" class="ativa">★</span>
                    <span data-val="3" class="ativa">★</span>
                    <span data-val="4" class="ativa">★</span>
                    <span data-val="5" class="ativa">★</span>
                </div>
                <textarea rows="2" placeholder="Escreva seu comentário sobre a figure..."
                    style="width:100%; box-sizing:border-box; background:#222; color:#fff; border:1px solid #444; border-radius:8px; padding:8px; margin-bottom:8px; resize:vertical;"></textarea>
                <button type="button" class="btn-enviar-avaliacao"
                    style="background:#b82929; color:#fff; border:none; padding:6px 14px; border-radius:8px; font-weight:bold; cursor:pointer; width:auto; height:auto;">
                    Comentar
                </button>
            </div>
          `
        : `
            <div class="aviso-login-avaliacao" style="text-align:center;">
                <p style="font-size: 13px; color: #ddd; margin: 0 0 8px 0;">🔒 Faça login para comentar e avaliar este produto.</p>
                <button type="button" onclick="window.location.href='cliente.html'"
                    style="background:#b82929; color:#fff; border:none; padding:6px 14px; border-radius:8px; font-weight:bold; cursor:pointer; width:auto; height:auto;">
                    Fazer Login
                </button>
            </div>
          `;

    containerComentarios.insertBefore(areaTopo, containerComentarios.firstChild);

    function lerAvaliacoes() {
        try { return JSON.parse(localStorage.getItem(chaveStorage)) || []; }
        catch { return []; }
    }

    function renderizarComentariosSalvos() {
        containerComentarios.querySelectorAll('.comentario-dinamico-sr').forEach(el => el.remove());

        const salvas = lerAvaliacoes();
        const userAtual = obterUsuarioLogadoAvaliacao();

        salvas.slice().reverse().forEach((av, idxReverso) => {
            const indiceReal = salvas.length - 1 - idxReverso;
            const podeExcluir = userAtual.logado && (
                av.autorId === userAtual.id ||
                (!av.autorId && av.autor?.toLowerCase() === userAtual.nomeExibicao?.toLowerCase())
            );

            const cardComentario = document.createElement('div');
            cardComentario.className = 'comentarios comentario-dinamico-sr';
            cardComentario.innerHTML = `
                <h2>${av.autor} <span style="color:#ffca28; font-size:14px;">${'★'.repeat(av.nota)}${'☆'.repeat(5 - av.nota)}</span></h2>
                <p>${av.texto}</p>
                <small style="font-size:11px; color:#888; display:block;">${av.data}</small>
                ${podeExcluir ? `<button type="button" class="btn-excluir-avaliacao" data-idx="${indiceReal}">🗑️ Excluir</button>` : ''}
            `;

            const btnExcluir = cardComentario.querySelector('.btn-excluir-avaliacao');
            if (btnExcluir) {
                btnExcluir.addEventListener('click', () => {
                    const listaAtual = lerAvaliacoes();
                    listaAtual.splice(indiceReal, 1);
                    localStorage.setItem(chaveStorage, JSON.stringify(listaAtual));
                    renderizarComentariosSalvos();
                });
            }

            areaTopo.insertAdjacentElement('afterend', cardComentario);
        });
    }

    if (usuario.logado) {
        const seletor = areaTopo.querySelector('.estrelas-seletor');
        const estrelas = seletor.querySelectorAll('span');
        const textarea = areaTopo.querySelector('textarea');
        const btnEnviar = areaTopo.querySelector('.btn-enviar-avaliacao');

        estrelas.forEach(star => {
            star.addEventListener('click', () => {
                const nota = parseInt(star.getAttribute('data-val'), 10);
                seletor.setAttribute('data-nota', nota);
                estrelas.forEach(s => {
                    s.classList.toggle('ativa', parseInt(s.getAttribute('data-val'), 10) <= nota);
                });
            });
        });

        btnEnviar.addEventListener('click', () => {
            const userCheck = obterUsuarioLogadoAvaliacao();
            if (!userCheck.logado) {
                alert('Você precisa estar logado para comentar!');
                return;
            }

            const texto = textarea.value.trim();
            if (!texto) {
                alert('Escreva um comentário antes de enviar.');
                return;
            }

            const nota = parseInt(seletor.getAttribute('data-nota'), 10) || 5;
            const salvas = lerAvaliacoes();

            salvas.push({
                id: Date.now(),
                autorId: userCheck.id,
                autor: userCheck.nomeExibicao,
                nota,
                texto,
                data: new Date().toLocaleDateString('pt-BR')
            });

            localStorage.setItem(chaveStorage, JSON.stringify(salvas));
            textarea.value = '';
            renderizarComentariosSalvos();
        });
    }

    renderizarComentariosSalvos();
}