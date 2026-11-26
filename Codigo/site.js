
function abreModalCliente() {
    const modal = document.getElementById('modalCliente');
    if (modal) modal.classList.add('aberto');
}

function fechaModalCliente() {
    const modal = document.getElementById('modalCliente');
    if (modal) modal.classList.remove('aberto');
}

function toggleSenha(inputId, btnElement) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        if (btnElement) btnElement.textContent = '🙈';
    } else {
        input.type = 'password';
        if (btnElement) btnElement.textContent = '👁️';
    }
}

function exibirAvisoSite(mensagem, titulo = '- Shadow Realm Store -', aoFechar = null, isHTML = false) {
    if (window.srModal && typeof window.srModal.alerta === 'function') {
        window.srModal.alerta(mensagem, titulo, isHTML);
        if (typeof aoFechar === 'function') {
            const btnOk = document.getElementById('sr-btn-ok');
            const dialog = document.getElementById('sr-modal-global');
            if (btnOk) {
                const handler = () => {
                    btnOk.removeEventListener('click', handler);
                    aoFechar();
                };
                btnOk.addEventListener('click', handler);
            } else if (dialog) {
                dialog.addEventListener('close', aoFechar, { once: true });
            }
        }
        return;
    }

    const tentar = () => {
        if (window.srModal && typeof window.srModal.alerta === 'function') {
            window.srModal.alerta(mensagem, titulo, isHTML);
            if (typeof aoFechar === 'function') {
                const btnOk = document.getElementById('sr-btn-ok');
                if (btnOk) btnOk.addEventListener('click', aoFechar, { once: true });
            }
        } else if (typeof aoFechar === 'function') {
            aoFechar();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tentar, { once: true });
    } else {
        setTimeout(tentar, 50);
    }
}

function exibirConfirmacaoSite(mensagem, aoConfirmar, titulo = '- Confirmação -', isHTML = false) {
    if (window.srModal && typeof window.srModal.confirmar === 'function') {
        window.srModal.confirmar(mensagem, aoConfirmar, titulo, isHTML);
        return;
    }

    const tentar = () => {
        if (window.srModal && typeof window.srModal.confirmar === 'function') {
            window.srModal.confirmar(mensagem, aoConfirmar, titulo, isHTML);
        } else if (typeof aoConfirmar === 'function') {
            aoConfirmar();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tentar, { once: true });
    } else {
        setTimeout(tentar, 50);
    }
}

function sairConta() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioAtual');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('clienteLogado');
    localStorage.removeItem('tipoUsuario');
    alert("Você saiu da sua conta.");
    window.location.href = "index.html";
}

function obterChaveCartoesUsuario() {
    const usuarioAtual = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();
    return usuarioAtual ? `cartoesShadowRealm_${usuarioAtual}` : 'cartoesShadowRealm';
}

function lerCartoesUsuario() {
    const chave = obterChaveCartoesUsuario();
    try {
        const dados = JSON.parse(localStorage.getItem(chave));
        if (Array.isArray(dados)) return dados;
    } catch {}
    try {
        const legado = JSON.parse(localStorage.getItem('cartoesShadowRealm'));
        return Array.isArray(legado) ? legado : [];
    } catch {
        return [];
    }
}

function salvarCartoesUsuario(lista) {
    const chave = obterChaveCartoesUsuario();
    localStorage.setItem(chave, JSON.stringify(lista));
}

window.addEventListener("DOMContentLoaded", function () {
    const paginaAtual = window.location.pathname.split("/").pop().toLowerCase();
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';

    if (estaLogado && paginaAtual === 'cliente.html') {
        exibirAvisoSite("Você já está logado em uma conta!", "- Conta Ativa -", function () {
            window.location.href = "index.html";
        });
        return;
    }

    // Tooltips nos ícones do cabeçalho
    const tooltipsNav = {
        "index.html": "Início",
        "produtos.html": "Produtos",
        "contato.html": "Contato",
        "carrinho.html": "Carrinho"
    };

    document.querySelectorAll(".nav .link").forEach(function (link) {
        const href = link.getAttribute("href");
        const nomePagina = tooltipsNav[href] || link.querySelector("img")?.getAttribute("alt");
        if (nomePagina) {
            link.setAttribute("data-tooltip", nomePagina);
            link.setAttribute("title", nomePagina);
        }
    });

    const btnUsuarioNav = document.querySelector(".nav .botaoUsuario");
    if (btnUsuarioNav) {
        const estaLogadoNav = localStorage.getItem("usuarioLogado") === "true";
        const textoUsuario = estaLogadoNav ? "Minha Conta" : "Usuário";
        btnUsuarioNav.setAttribute("data-tooltip", textoUsuario);
        btnUsuarioNav.setAttribute("title", textoUsuario);
    }

    const modalConteudo = document.querySelector('.modalCliente-conteudo');
    const navUsuario = document.querySelector('.nav-usuario');

    if (navUsuario && estaLogado) {
        const nomeSalvo = localStorage.getItem('usuarioNome') || 'Cliente';
        const primeiroNome = nomeSalvo.split(' ')[0];

        if (modalConteudo) {
            const tituloModal = modalConteudo.querySelector('h2');
            if (tituloModal) {
                tituloModal.textContent = `Olá, ${primeiroNome}!`;
            }
        }

        const linkCadastro = navUsuario.querySelector('a[href="cadastro.html"]');
        const linkLogin = navUsuario.querySelector('a[href="cliente.html"]');
        if (linkCadastro) linkCadastro.style.display = 'none';
        if (linkLogin) linkLogin.style.display = 'none';

        if (!document.getElementById('link-sair-conta')) {
            const linkSair = document.createElement('a');
            linkSair.href = "#";
            linkSair.id = "link-sair-conta";
            linkSair.textContent = "Sair";
            linkSair.onclick = function (e) {
                e.preventDefault();
                sairConta();
            };
            navUsuario.appendChild(linkSair);
        }
    }

    var inputCpf = document.getElementById('cpf');
    if (inputCpf) {
        inputCpf.addEventListener('input', function (e) {
            var v = e.target.value.replace(/\D/g, "").slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });
    }

    const modalCliente = document.getElementById('modalCliente');
    if (modalCliente) {
        modalCliente.addEventListener('click', (e) => {
            if (e.target === modalCliente) fechaModalCliente();
        });
    }
});

function cpfInvalido(rawCpf) {
    var cpf = rawCpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return true;

    var soma = 0;
    for (var i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i), 10) * (10 - i);
    }
    var resto = 11 - (soma % 11);
    var digito1 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito1 !== parseInt(cpf.charAt(9), 10)) return true;

    soma = 0;
    for (var j = 0; j < 10; j++) {
        soma += parseInt(cpf.charAt(j), 10) * (11 - j);
    }
    resto = 11 - (soma % 11);
    var digito2 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito2 !== parseInt(cpf.charAt(10), 10)) return true;

    return false;
}

var usuarioEncontradoLogin = null;

async function validaLogin() {
    var f = document.frmlogin;
    if (!f) return false;

    var email = f.txtemail.value.trim().toLowerCase();
    var senha = f.txtsenha.value;

    var expRegemail = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!expRegemail.test(email)) {
        exibirAvisoSite("Preencha o Campo Email ou formato inválido!", "- Login -", function () {
            f.txtemail.focus();
        });
        return false;
    }

    if (senha.trim() === "") {
        exibirAvisoSite("Preencha o Campo Senha corretamente!", "- Login -", function () {
            f.txtsenha.focus();
        });
        return false;
    }

    // O LOGIN DO CLIENTE VERIFICA SOMENTE OS CADASTROS DE CLIENTES.
    // Os administradores são verificados exclusivamente em loginAdmin.html.

    var usuariosLocais = [];

    if (!Array.isArray(adminsJSON) || adminsJSON.length === 0) {
        adminsJSON = [
            {
                id: "1",
                nome: "Pedro Carvalho",
                cpf: "",
                email: "pedro_carvalho@gmail.com",
                senha: "Pedro@1983",
                admin: true,
                tipo: "admin"
            }
        ];
    }

    var todosAdmins = adminsLocais.concat(adminsJSON);
    var adminEncontrado = todosAdmins.find(function (a) {
        return a.email && a.email.trim().toLowerCase() === email && a.senha === senha;
    });

    if (adminEncontrado) {
        localStorage.setItem('usuarioLogado', 'true');
        localStorage.setItem('usuarioAtual', adminEncontrado.email.trim().toLowerCase());
        localStorage.setItem('usuarioNome', adminEncontrado.nome);
        localStorage.setItem('tipoUsuario', 'admin');

        localStorage.setItem('clienteLogado', JSON.stringify({
            nome: adminEncontrado.nome,
            email: adminEncontrado.email.trim().toLowerCase(),
            cpf: adminEncontrado.cpf || '',
            admin: true,
            tipo: 'admin'
        }));

        exibirAvisoSite("Login de administrador realizado com sucesso!", "- Bem-vindo, Admin -", function () {
            window.location.href = "index.html";
        });
        return false;
    }

    // 2. BUSCA CLIENTES CADASTRADOS NO LOCALSTORAGE E EM clientes.json
    var usuariosLocais = [];
    try {
        usuariosLocais = JSON.parse(localStorage.getItem('usuariosShadowRealm')) || [];
    } catch (e) {}

    var clientesJSON = [];
    try {
        var respClientes = await fetch('clientes.json');
        if (respClientes.ok) clientesJSON = await respClientes.json();
    } catch (e) {}

    var todosClientes = usuariosLocais.concat(Array.isArray(clientesJSON) ? clientesJSON : []);
    usuarioEncontradoLogin = todosClientes.find(function (u) {
        return u.email && u.email.trim().toLowerCase() === email && u.senha === senha;
    });

    if (!usuarioEncontradoLogin) {
        exibirAvisoSite("E-mail ou senha incorretos! Verifique seus dados ou cadastre-se.", "- Credenciais Inválidas -");
        return false;
    }

    abreModalLogin();
    return false;
}

document.addEventListener("DOMContentLoaded", function () {
    const navUsuario = document.querySelector("#modalCliente .nav-usuario");
    const usuarioLogado = localStorage.getItem("usuarioLogado") === "true";
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (navUsuario && usuarioLogado && tipoUsuario === "admin") {
        if (!navUsuario.querySelector('a[href="estoque.html"]')) {
            const linkEstoque = document.createElement("a");
            linkEstoque.href = "estoque.html";
            linkEstoque.textContent = "📦 Gerenciar Estoque";
            navUsuario.prepend(linkEstoque);
        }

        if (!navUsuario.querySelector('a[href="cadastroAdmin.html"]')) {
            const linkNovoAdmin = document.createElement("a");
            linkNovoAdmin.href = "cadastroAdmin.html";
            linkNovoAdmin.textContent = "🛡️ Cadastrar Novo Admin";
            navUsuario.prepend(linkNovoAdmin);
        }

        // Link para Painel Administrativo
        if (!navUsuario.querySelector('a[href="admin.html"]')) {
            const linkPainelAdmin = document.createElement("a");
            linkPainelAdmin.href = "admin.html";
            linkPainelAdmin.textContent = "⚙️ Painel de Admin";
            navUsuario.prepend(linkPainelAdmin);
        }
    }
});

function abreModalLogin() {
    var f = document.frmlogin;
    if (!f) return;
    var dados = [
        ["Email", f.txtemail.value.trim()],
        ["Senha", "•".repeat(f.txtsenha.value.length)]
    ];
    renderizarListaModal("listaDadosLogin", dados);
    var modal = document.getElementById("modalDadosLogin");
    if (modal) modal.classList.add("aberto");
}

function renderizarListaModal(idElemento, dados) {
    var elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.innerHTML = "";
        dados.forEach(function (item) {
            var li = document.createElement("li");
            li.innerHTML = "<strong>" + item[0] + ":</strong> " + item[1];
            elemento.appendChild(li);
        });
    }
}

function fechaModalLogin() {
    var modal = document.getElementById("modalDadosLogin");
    if (modal) modal.classList.remove("aberto");
}

function confirmaLogin() {
    var f = document.frmlogin;
    var email = f ? f.txtemail.value.trim().toLowerCase() : ((usuarioEncontradoLogin && usuarioEncontradoLogin.email) || "");
    var nomeUsuario = (usuarioEncontradoLogin && usuarioEncontradoLogin.nome) ? usuarioEncontradoLogin.nome : email.split('@')[0];

    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioAtual', email);
    localStorage.setItem('usuarioNome', nomeUsuario);
    localStorage.setItem('tipoUsuario', 'cliente');
    localStorage.setItem('clienteLogado', JSON.stringify({
        nome: nomeUsuario,
        email: email,
        cpf: (usuarioEncontradoLogin && usuarioEncontradoLogin.cpf) || '',
        tipo: 'cliente'
    }));

    fechaModalLogin();
    if (f) f.reset();

    exibirAvisoSite("Login realizado com sucesso!", "- Bem-vindo -", function () {
        window.location.href = "index.html";
    });
}

function verificaMotivo() {
    const barraFill = document.querySelector('.forca-senha-barra-fill');
    const barraTexto = document.querySelector('.forca-senha-texto');
    if (barraFill) barraFill.style.width = '0%';
    if (barraTexto) {
        barraTexto.style.color = '#888';
        barraTexto.textContent = 'Força da senha';
    }
}

function validaCadastro() {
    var f = document.frmcadastro;
    if (!f) return false;

    var nome = f.txtnome.value;
    var expRegnome = /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/i;
    if (!expRegnome.test(nome.trim())) {
        exibirAvisoSite("Preencha o Campo Nome completo (nome e sobrenome)!", "- Cadastro -", function () {
            f.txtnome.focus();
        });
        return false;
    }

    var email = f.txtemail.value;
    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!expRegemail.test(email.trim())) {
        exibirAvisoSite("Preencha o Campo Email ou formato inválido!", "- Cadastro -", function () {
            f.txtemail.focus();
        });
        return false;
    }

    var cpf = f.txtcpf.value.trim();
    if (cpf === "" || cpfInvalido(cpf)) {
        exibirAvisoSite("CPF inválido! Verifique os números digitados.", "- Cadastro -", function () {
            f.txtcpf.focus();
        });
        return false;
    }

    var senha = f.txtsenha.value;
    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        exibirAvisoSite("Preencha o Campo Senha corretamente! Ela deve ter no mínimo 8 caracteres, contendo letras e números.", "- Cadastro -", function () {
            f.txtsenha.focus();
        });
        return false;
    }

    abreModalCadastro();
    return false;
}

function abreModalCadastro() {
    var f = document.frmcadastro;
    if (!f) return;
    var dados = [
        ["Nome Completo", f.txtnome.value.trim()],
        ["Email", f.txtemail.value.trim()],
        ["Senha", "•".repeat(f.txtsenha.value.length)],
        ["CPF", f.txtcpf.value.trim()]
    ];
    renderizarListaModal("listaDadosCadastro", dados);
    var modal = document.getElementById("modalDadosCadastro");
    if (modal) modal.classList.add("aberto");
}

function fechaModalCadastro() {
    var modal = document.getElementById("modalDadosCadastro");
    if (modal) modal.classList.remove("aberto");
}

function confirmaCadastro() {
    var f = document.frmcadastro;
    if (!f) return;

    var novoUsuario = {
        nome: f.txtnome.value.trim(),
        email: f.txtemail.value.trim().toLowerCase(),
        cpf: f.txtcpf.value.trim(),
        senha: f.txtsenha.value
    };

    var usuariosLocais = [];
    try {
        usuariosLocais = JSON.parse(localStorage.getItem('usuariosShadowRealm')) || [];
    } catch (e) {}

    var jaExiste = usuariosLocais.some(function (u) {
        return (u.email && u.email.toLowerCase() === novoUsuario.email) || (u.cpf && u.cpf === novoUsuario.cpf);
    });

    if (jaExiste) {
        fechaModalCadastro();
        exibirAvisoSite("Este e-mail ou CPF já está cadastrado!", "- Cadastro Duplicado -");
        return;
    }

    usuariosLocais.push(novoUsuario);
    localStorage.setItem('usuariosShadowRealm', JSON.stringify(usuariosLocais));
    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioAtual', novoUsuario.email);
    localStorage.setItem('usuarioNome', novoUsuario.nome);
    localStorage.setItem('tipoUsuario', 'cliente');
    localStorage.setItem('clienteLogado', JSON.stringify({
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        cpf: novoUsuario.cpf,
        tipo: 'cliente'
    }));

    fechaModalCadastro();
    f.reset();

    exibirAvisoSite("Cadastro realizado com sucesso!", "- Bem-vindo à Shadow Realm -", function () {
        window.location.href = "index.html";
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const priceBreakdown = document.querySelector('.price-breakdown');
    const modalTotalValue = document.querySelector('.modal-total-value');
    const addressForm = document.querySelector('.address-column');
    const btnBuy = document.querySelector('.btn-buy');

    const couponInput = document.getElementById('coupon-input');
    const btnCoupon = document.getElementById('btn-coupon');
    const couponMessage = document.getElementById('coupon-message');
    const btncancelar = document.getElementById('btn-cancelar');

    const cuponsValidos = {
        'SHADOW26': 0.10,
        'GEEK15': 0.15,
        'SHADOW50': 0.50
    };

    let descontoAtual = 0;
    let cupomAtivo = '';

    function obterCarrinho() {
        try {
            const dados = JSON.parse(localStorage.getItem('carrinhoShadowRealm'));
            return Array.isArray(dados) ? dados : [];
        } catch {
            return [];
        }
    }

    if (btnBuy) {
        btnBuy.onclick = (e) => {
            const carrinho = obterCarrinho();
            if (carrinho.length === 0) {
                e.preventDefault();
                exibirAvisoSite('Seu carrinho está vazio! Adicione produtos antes de prosseguir.', '- Carrinho Vazio -');
                return;
            }
            const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
            if (!estaLogado) {
                e.preventDefault();
                exibirAvisoSite('Você precisa estar logado para finalizar a compra!', '- Login Necessário -', function () {
                    window.location.href = 'cliente.html';
                });
            }
        };
    }

    if (btnCoupon && couponInput) {
        btnCoupon.onclick = () => {
            const codigoDigitado = couponInput.value.trim().toUpperCase();

            if (codigoDigitado === '') {
                exibirMensagemCupom('Digite um cupom.', '#ffaa00');
                return;
            }

            if (Object.prototype.hasOwnProperty.call(cuponsValidos, codigoDigitado)) {
                descontoAtual = cuponsValidos[codigoDigitado];
                cupomAtivo = codigoDigitado;
                const porcText = Math.round(descontoAtual * 100) + '%';
                exibirMensagemCupom(`Cupom ${codigoDigitado} aplicado! (-${porcText})`, '#00ff88');
                renderizarCarrinho();
            } else {
                descontoAtual = 0;
                cupomAtivo = '';
                exibirMensagemCupom('Cupom inválido!', '#ff4444');
                renderizarCarrinho();
            }
        };
    }

    if (btncancelar) {
        btncancelar.onclick = () => {
            if (descontoAtual === 0 && cupomAtivo === '') {
                exibirMensagemCupom('Nenhum cupom aplicado no momento.', '#ffaa00');
                return;
            }
            descontoAtual = 0;
            cupomAtivo = '';
            if (couponInput) couponInput.value = '';
            exibirMensagemCupom('Cupom cancelado.', '#ffaa00');
            renderizarCarrinho();
        };
    }

    function exibirMensagemCupom(texto, cor) {
        if (couponMessage) {
            couponMessage.textContent = texto;
            couponMessage.style.color = cor;
        }
    }

    function calcularTotaisCarrinho(itens) {
        const subtotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        const valorDesconto = subtotal * descontoAtual;
        const subtotalComDesconto = Math.max(0, subtotal - valorDesconto);
        const frete = subtotal === 0 ? 0 : (subtotalComDesconto >= 250 ? 0 : 25);
        const totalFinal = subtotalComDesconto + frete;
        return { subtotal, valorDesconto, subtotalComDesconto, frete, totalFinal };
    }

    function obterEstoqueCarrinho(nomeProduto) {
        if (typeof obterEstoque === 'function') {
            return obterEstoque(nomeProduto);
        }
        try {
            const est = JSON.parse(localStorage.getItem('estoqueShadowRealm'));
            if (est && est[nomeProduto] !== undefined) {
                return Number(est[nomeProduto]);
            }
        } catch {}
        return 0;
    }

    function renderizarCarrinho() {
        if (!productsList) return;
        const carrinho = obterCarrinho();

        if (carrinho.length === 0) {
            productsList.innerHTML = '<p class="empty-cart-msg" style="color: #ffffff; text-align: center;">Seu carrinho está vazio.</p>';
            atualizarResumo([]);
            return;
        }

        productsList.innerHTML = '';

        carrinho.forEach((item, index) => {
            const disponivel = obterEstoqueCarrinho(item.nome);
            const atingiuLimite = item.quantidade >= disponivel;

            const card = document.createElement('article');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-thumb">
                    <img src="${item.imagem || 'imagens/logo.png'}" alt="${item.nome}">
                </div>
                <div style="flex:1; margin-left: 20px;">
                    <h3 class="product-name" style="margin-left:0;">${item.nome}</h3>
                    <small style="color:#ffca28;">R$ ${(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</small>
                    <small style="display:block; margin-top:4px; font-size:12px; color:${atingiuLimite ? '#ff4d4d' : '#aaa'};">
                        Disponível em estoque: ${disponivel} un.
                    </small>
                </div>
                <div class="quantity-controls">
                    <button type="button" class="btn-plus" onclick="alterarQuantidade(${index}, 1)"
                        ${atingiuLimite ? 'disabled style="opacity:0.35; cursor:not-allowed;" title="Limite máximo de estoque atingido"' : ''}>+</button>
                    <span class="qty-value">${item.quantidade}</span>
                    <button type="button" class="btn-minus" onclick="alterarQuantidade(${index}, -1)">-</button>
                </div>
                <button type="button" class="btn-remove" onclick="removerProduto(${index})" title="Remover item" aria-label="Remover ${item.nome}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            productsList.appendChild(card);
        });

        atualizarResumo(carrinho);
    }

    window.alterarQuantidade = function (index, delta) {
        const carrinho = obterCarrinho();
        if (!carrinho[index]) return;

        if (delta > 0) {
            const disponivel = obterEstoqueCarrinho(carrinho[index].nome);
            if (carrinho[index].quantidade + delta > disponivel) {
                exibirAvisoSite(`Limite de estoque atingido! Temos apenas <strong>${disponivel}</strong> unidade(s) de <strong>${carrinho[index].nome}</strong>.`, "- Estoque Máximo -", null, true);
                renderizarCarrinho();
                return;
            }
        }

        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }

        localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
        renderizarCarrinho();
        if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
    };

    window.removerProduto = function (index) {
        const carrinho = obterCarrinho();
        carrinho.splice(index, 1);
        localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
        renderizarCarrinho();
        if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
    };

    function atualizarResumo(itens) {
        if (!priceBreakdown) return;

        const { subtotal, valorDesconto, subtotalComDesconto, frete, totalFinal } = calcularTotaisCarrinho(itens);
        let breakdownHTML = '';

        if (itens.length === 0) {
            breakdownHTML = '<p class="price-item">R$ 0,00</p>';
        } else {
            itens.forEach((item, index) => {
                const mathPrefix = index === 0 ? '' : '+ ';
                const itemSub = item.preco * item.quantidade;
                breakdownHTML += `<p class="price-item">${mathPrefix}R$ ${itemSub.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
            });
        }

        if (descontoAtual > 0 && subtotal > 0) {
            breakdownHTML += `<p class="price-item" style="color: #00ff88;">- Desconto (${Math.round(descontoAtual * 100)}%): R$ ${valorDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
        }

        if (itens.length > 0) {
            if (frete === 0) {
                breakdownHTML += `<p class="price-item" style="color: #00e676;">Frete: GRÁTIS (R$ 0,00)</p>`;
            } else {
                breakdownHTML += `<p class="price-item" style="color: #ffca28;">Frete: + R$ 25,00</p>`;
            }
        }

        breakdownHTML += `<hr class="summary-divider">`;
        breakdownHTML += `<p class="total-final">Valor Total: <span>R$ ${totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>`;

        priceBreakdown.innerHTML = breakdownHTML;

        if (modalTotalValue) {
            modalTotalValue.textContent = `Valor Total: R$ ${totalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        const avisoFrete = document.getElementById('aviso-frete-gratis');
        if (avisoFrete) {
            if (subtotal === 0) {
                avisoFrete.style.display = 'none';
            } else if (subtotalComDesconto >= 250) {
                avisoFrete.style.display = 'block';
                avisoFrete.style.color = '#00e676';
                avisoFrete.innerHTML = '🚚 Parabéns! Você ganhou <strong>Frete Grátis</strong>!';
            } else {
                const falta = (250 - subtotalComDesconto).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                avisoFrete.style.display = 'block';
                avisoFrete.style.color = '#ffca28';
                avisoFrete.innerHTML = `🚚 Adicione mais <strong>R$ ${falta}</strong> para ganhar Frete Grátis!`;
            }
        }
    }

    if (addressForm) {
        addressForm.onsubmit = (e) => {
            e.preventDefault();

            const carrinho = obterCarrinho();
            if (carrinho.length === 0) {
                exibirAvisoSite('Seu carrinho está vazio!', '- Carrinho Vazio -');
                return;
            }

            const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
            const usuarioAtual = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();
            if (!estaLogado || !usuarioAtual) {
                exibirAvisoSite('Faça login para confirmar seu pedido!', '- Login Necessário -', function () {
                    window.location.href = 'cliente.html';
                });
                return;
            }

            const rua = document.getElementById('input-rua')?.value.trim() || '';
            const cidade = document.getElementById('input-cidade')?.value.trim() || '';
            const estado = document.getElementById('input-estado')?.value.trim() || '';
            if (!rua || !cidade || !estado) {
                exibirAvisoSite('Preencha o endereço completo de entrega antes de confirmar.', '- Endereço Incompleto -');
                return;
            }

            const metodoRadio = document.querySelector('input[name="payment-group"]:checked');
            const metodo = metodoRadio ? metodoRadio.value : 'pix';
            const cartoesSalvos = lerCartoesUsuario();

            let descricaoPagamento = 'Pix';
            if (metodo === 'debito' || metodo === 'parcelado') {
                if (cartoesSalvos.length === 0) {
                    exibirAvisoSite('Você não possui cartão cadastrado! Cadastre um cartão ou selecione Pix.', '- Cartão Necessário -');
                    return;
                }
                const selectCartao = document.getElementById('select-cartao-uso');
                const idx = selectCartao ? parseInt(selectCartao.value, 10) : 0;
                const cartaoEscolhido = cartoesSalvos[idx] || cartoesSalvos[0];
                const labelTipo = metodo === 'debito' ? 'Débito' : 'Crédito Parcelado';
                descricaoPagamento = `${labelTipo} (${cartaoEscolhido.numeroMascarado})`;
            }

            const { totalFinal } = calcularTotaisCarrinho(carrinho);

            if (typeof darBaixaNoEstoque === 'function') {
                const resultadoEstoque = darBaixaNoEstoque(carrinho);
                if (!resultadoEstoque.sucesso) {
                    exibirAvisoSite(resultadoEstoque.mensagem, '- Estoque Insuficiente -');
                    return;
                }
            }

            const pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];
            const proximoNumero = pedidos.length > 0
                ? Math.max(...pedidos.map(p => Number(p.numeroPedido) || 1000)) + 1
                : 1001;

            pedidos.push({
                numeroPedido: proximoNumero,
                clienteEmail: usuarioAtual,
                data: new Date().toLocaleDateString('pt-BR'),
                status: 'Pedido Confirmado',
                cartaoUsado: descricaoPagamento,
                enderecoEntrega: `${rua} - ${cidade}/${estado}`,
                cupom: cupomAtivo || null,
                total: Number(totalFinal.toFixed(2)),
                itens: carrinho
            });

            localStorage.setItem('pedidosShadowRealm', JSON.stringify(pedidos));
            localStorage.removeItem('carrinhoShadowRealm');

            exibirAvisoSite(
                `Pagamento confirmado com sucesso! Pedido <strong>#${proximoNumero}</strong> registrado.`,
                "- Pedido Confirmado -",
                function () {
                    window.location.href = 'pedidos.html';
                },
                true
            );
        };
    }

    renderizarCarrinho();
    if (window.promessaEstoqueSR) {
        window.promessaEstoqueSR.then(() => renderizarCarrinho());
    }
});

const inputNumero = document.getElementById('numero');
const inputTitular = document.getElementById('titular');
const inputValidade = document.getElementById('validade');
const inputCvv = document.getElementById('cvv');
const inputEndereco = document.getElementById('endereco');
const form = document.getElementById('formCartao');

const modal = document.getElementById('modalDados');
const btnCorrigir = document.getElementById('btnCorrigir');
const btnConfirmar = document.getElementById('btnConfirmar');
const resNumero = document.getElementById('resNumero');
const resTitular = document.getElementById('resTitular');
const resValidade = document.getElementById('resValidade');
const resCvv = document.getElementById('resCvv');
const resEndereco = document.getElementById('resEndereco');

if (inputNumero) {
    inputNumero.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '').substring(0, 16);
        e.target.value = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
}

if (inputTitular) {
    inputTitular.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
}

if (inputValidade) {
    inputValidade.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (valor.length >= 3) {
            e.target.value = valor.slice(0, 2) + '/' + valor.slice(2);
        } else {
            e.target.value = valor;
        }
    });
}

if (inputCvv) {
    inputCvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
}

function validarValidadeCartao(validade) {
    if (!/^\d{2}\/\d{2}$/.test(validade)) return false;

    const [mesStr, anoStr] = validade.split('/');
    const mes = parseInt(mesStr, 10);
    const ano = 2000 + parseInt(anoStr, 10);

    if (mes < 1 || mes > 12) return false;

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth() + 1;

    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
        return false;
    }
    return true;
}

function renderizarCartoesSalvos() {
    const container = document.getElementById('listaCartoesSalvos');
    if (!container) return;

    const cartoes = lerCartoesUsuario();

    if (cartoes.length === 0) {
        container.innerHTML = '<p style="color: #aaa; font-size: 18px;">Nenhum cartão cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = '';
    cartoes.forEach((cartao, index) => {
        const tipo = index === 0 ? 'Cartão Principal' : 'Cartão Secundário';
        const botaoPrincipal = index === 1
            ? `<button type="button" class="btn-secundario-cartao" onclick="definirCartaoPrincipal(${index})">Tornar Principal</button>`
            : '';

        const div = document.createElement('div');
        div.className = 'card-cartao-salvo';
        div.innerHTML = `
            <span class="badge-cartao">${tipo}</span>
            <p class="numero-mascarado">${cartao.numeroMascarado}</p>
            <p><strong>Titular:</strong> ${cartao.titular}</p>
            <p><strong>Validade:</strong> ${cartao.validade}</p>
            <div class="acoes-cartao">
                ${botaoPrincipal}
                <button type="button" class="btn-remover-cartao" onclick="removerCartao(${index})">Remover</button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.removerCartao = function (index) {
    exibirConfirmacaoSite('Deseja realmente remover este cartão?', function () {
        const cartoes = lerCartoesUsuario();
        cartoes.splice(index, 1);
        salvarCartoesUsuario(cartoes);
        renderizarCartoesSalvos();
    }, '- Remover Cartão -');
};

window.definirCartaoPrincipal = function (index) {
    const cartoes = lerCartoesUsuario();
    if (index === 1 && cartoes.length === 2) {
        [cartoes[0], cartoes[1]] = [cartoes[1], cartoes[0]];
        salvarCartoesUsuario(cartoes);
        renderizarCartoesSalvos();
    }
};

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cartoes = lerCartoesUsuario();
        if (cartoes.length >= 2) {
            exibirAvisoSite('Você já atingiu o limite de 2 cartões (Principal e Secundário). Remova um para cadastrar outro.', '- Limite de Cartões -');
            return;
        }

        const numeroLimpo = inputNumero.value.replace(/\s/g, '');
        if (numeroLimpo.length !== 16) {
            exibirAvisoSite('Por favor, insira os 16 dígitos do cartão.', '- Cartão Inválido -', function () {
                inputNumero.focus();
            });
            return;
        }

        const numeroMascarado = '**** **** **** ' + numeroLimpo.slice(-4);
        const jaCadastrado = cartoes.some(c => c.numeroMascarado === numeroMascarado && c.validade === inputValidade.value);
        if (jaCadastrado) {
            exibirAvisoSite('Este cartão já está cadastrado!', '- Cartão Duplicado -');
            return;
        }

        if (!validarValidadeCartao(inputValidade.value)) {
            exibirAvisoSite('Data de validade inválida ou cartão vencido! Use o formato MM/AA.', '- Validade Inválida -', function () {
                inputValidade.focus();
            });
            return;
        }

        if (inputCvv.value.length !== 3) {
            exibirAvisoSite('O CVV deve conter exatamente 3 dígitos.', '- CVV Inválido -', function () {
                inputCvv.focus();
            });
            return;
        }

        resNumero.textContent = inputNumero.value;
        resTitular.textContent = inputTitular.value;
        resValidade.textContent = inputValidade.value;
        resCvv.textContent = inputCvv.value;
        resEndereco.textContent = inputEndereco.value;

        if (modal) modal.showModal();
    });
}

if (btnCorrigir) {
    btnCorrigir.addEventListener('click', () => {
        if (modal) modal.close();
    });
}

if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
        const cartoes = lerCartoesUsuario();
        const numeroLimpo = inputNumero.value.replace(/\s/g, '');
        const tipoCartaoTexto = cartoes.length === 0 ? 'Cartão Principal' : 'Cartão Secundário';

        cartoes.push({
            numeroMascarado: '**** **** **** ' + numeroLimpo.slice(-4),
            final: numeroLimpo.slice(-4),
            titular: inputTitular.value.trim(),
            validade: inputValidade.value,
            endereco: inputEndereco.value.trim()
        });

        salvarCartoesUsuario(cartoes);

        if (modal) modal.close();
        form.reset();
        renderizarCartoesSalvos();

        exibirAvisoSite(`${tipoCartaoTexto} cadastrado com sucesso!`, '- Cartão Salvo -');
    });
}

renderizarCartoesSalvos();

//=========== ESTOQUE ===========//
window.alterarQuantidade = function (index, delta) {
    const carrinho = obterCarrinho();
    if (!carrinho[index]) return;

    if (delta > 0 && typeof obterEstoque === 'function') {
        const disponivel = obterEstoque(carrinho[index].nome);
        if (carrinho[index].quantidade + delta > disponivel) {
            alert(`Limite de estoque atingido! Temos apenas ${disponivel} unidade(s) de ${carrinho[index].nome}.`);
            return;
        }
    }

    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
    renderizarCarrinho();
    if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
};
