var administradorEncontrado = null;

// ==========================================
// Auxiliar de Modal (Sem alert() nativo)
// ==========================================

function exibirAvisoAdmin(mensagem, titulo = '- Shadow Realm Admin -', aoFechar = null, isHTML = false) {
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

    // Fallback caso modais-globais.js ainda não tenha carregado
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

// ==========================================
// Guarda de Rota e Menu Dinâmico de Admin
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const caminhoAtual = window.location.pathname.toLowerCase();
    const ehPaginaCadastroAdmin = caminhoAtual.includes("cadastroadmin.html");
    const usuarioLogado = localStorage.getItem("usuarioLogado") === "true";
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    // 1. Bloqueia qualquer pessoa que não esteja logada como administrador
    if (ehPaginaCadastroAdmin && (!usuarioLogado || tipoUsuario !== "admin")) {
        exibirAvisoAdmin(
            "Acesso negado! Apenas administradores logados podem cadastrar novos administradores.",
            "- Acesso Restrito -",
            function () {
                window.location.replace("index.html");
            }
        );
        return;
    }

    // 2. Injeta links exclusivos no menu do usuário apenas se estiver logado como admin
    const navUsuario = document.querySelector("#modalCliente .nav-usuario");
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
    }

    // 3. Formatação automática do CPF
    var inputCpf = document.getElementById("cpfAdmin");
    if (inputCpf) {
        inputCpf.addEventListener("input", function (e) {
            var v = e.target.value.replace(/\D/g, "").slice(0, 11);

            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            e.target.value = v;
        });
    }

    // 4. Suporte para formulário de loginAdmin.html caso seja submetido diretamente
    var formLoginAdmin = document.getElementById("form-login-admin");
    if (formLoginAdmin && !document.frmLoginAdmin) {
        formLoginAdmin.addEventListener("submit", function (e) {
            e.preventDefault();
            var userInput = document.getElementById("admin-user");
            var passInput = document.getElementById("admin-pass");
            validaLoginAdmin({
                email: userInput ? userInput.value : "",
                senha: passInput ? passInput.value : "",
                focoEmail: userInput,
                focoSenha: passInput
            });
        });
    }
});

// ==========================================
// Cadastro do Administrador
// ==========================================

function lerAdministradores() {
    try {
        var administradores = JSON.parse(
            localStorage.getItem('administradoresShadowRealm')
        );

        return Array.isArray(administradores) ? administradores : [];

    } catch (e) {
        return [];
    }
}

async function obterTodosAdministradores() {
    var administradoresLocais = lerAdministradores();
    var administradoresJSON = [];

    try {
        var resp = await fetch('admin.json');
        if (resp.ok) {
            administradoresJSON = await resp.json();
        }
    } catch (e) {
        console.error("Erro ao ler admin.json:", e);
    }

    if (!Array.isArray(administradoresJSON) || administradoresJSON.length === 0) {
        administradoresJSON = [
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

    return administradoresLocais.concat(administradoresJSON);
}

async function validaCadastroAdmin() {
    var f = document.frmCadastroAdmin;
    if (!f) return false;

    var nome = f.txtnome.value.trim();
    var expRegnome = /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/i;

    if (!expRegnome.test(nome)) {
        exibirAvisoAdmin("Preencha o Campo Nome completo (nome e sobrenome)!", "- Validação -", function () {
            f.txtnome.focus();
        });
        return false;
    }

    var email = f.txtemail.value.trim().toLowerCase();
    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!expRegemail.test(email)) {
        exibirAvisoAdmin("Preencha o Campo Email ou formato inválido!", "- Validação -", function () {
            f.txtemail.focus();
        });
        return false;
    }

    var cpf = f.txtcpf.value.trim();

    if (cpf === "" || (typeof cpfInvalido === "function" && cpfInvalido(cpf))) {
        exibirAvisoAdmin("CPF inválido! Verifique os números digitados.", "- Validação -", function () {
            f.txtcpf.focus();
        });
        return false;
    }

    var senha = f.txtsenha.value;
    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        exibirAvisoAdmin("A senha deve ter no mínimo 8 caracteres, contendo letras e números.", "- Validação -", function () {
            f.txtsenha.focus();
        });
        return false;
    }

    var todosAdmins = await obterTodosAdministradores();

    var jaExiste = todosAdmins.some(function (a) {
        var emailAdmin = (a.email || "").trim().toLowerCase();
        var cpfAdmin = (a.cpf || "").trim();
        return (emailAdmin && emailAdmin === email) || (cpfAdmin && cpfAdmin === cpf);
    });

    if (jaExiste) {
        exibirAvisoAdmin("Este e-mail ou CPF já está cadastrado como administrador!", "- Cadastro Duplicado -");
        return false;
    }

    var dados = [
        ["Nome", nome],
        ["Email", email],
        ["CPF", cpf],
        ["Senha", "•".repeat(senha.length)]
    ];

    renderizarDadosAdmin(dados);

    var modal = document.getElementById("modalCadastroAdmin");
    if (modal) modal.classList.add("aberto");

    return false;
}

function renderizarDadosAdmin(dados) {
    var lista = document.getElementById("listaDadosAdmin");
    if (!lista) return;

    lista.innerHTML = "";

    dados.forEach(function (item) {
        var li = document.createElement("li");
        li.innerHTML = "<strong>" + item[0] + ":</strong> " + item[1];
        lista.appendChild(li);
    });
}

function fechaModalAdmin() {
    var modal = document.getElementById("modalCadastroAdmin");
    if (modal) modal.classList.remove("aberto");
}

async function confirmaCadastroAdmin() {
    var f = document.frmCadastroAdmin;
    if (!f) return;

    var novoAdmin = {
        nome: f.txtnome.value.trim(),
        email: f.txtemail.value.trim().toLowerCase(),
        cpf: f.txtcpf.value.trim(),
        senha: f.txtsenha.value,
        admin: true,
        tipo: "admin"
    };

    var administradores = lerAdministradores();
    var todosAdmins = await obterTodosAdministradores();

    var jaExiste = todosAdmins.some(function (a) {
        var emailAdmin = (a.email || "").trim().toLowerCase();
        var cpfAdmin = (a.cpf || "").trim();
        return (emailAdmin && emailAdmin === novoAdmin.email) || (novoAdmin.cpf && cpfAdmin === novoAdmin.cpf);
    });

    if (jaExiste) {
        fechaModalAdmin();
        exibirAvisoAdmin("Este e-mail ou CPF já está cadastrado!", "- Cadastro Duplicado -");
        return;
    }

    administradores.push(novoAdmin);

    localStorage.setItem(
        'administradoresShadowRealm',
        JSON.stringify(administradores)
    );

    fechaModalAdmin();
    f.reset();

    exibirAvisoAdmin("Cadastro de administrador realizado com sucesso!", "- Sucesso -", function () {
        window.location.href = "cliente.html";
    });
}

// ==========================================
// Login do Administrador (com admin.json)
// ==========================================

async function validaLoginAdmin(dadosAlternativos) {
    var f = document.frmLoginAdmin;
    var email = dadosAlternativos
        ? (dadosAlternativos.email || "").trim().toLowerCase()
        : (f && f.txtemail ? f.txtemail.value.trim().toLowerCase() : "");
    var senha = dadosAlternativos
        ? (dadosAlternativos.senha || "")
        : (f && f.txtsenha ? f.txtsenha.value : "");

    var campoEmail = dadosAlternativos ? dadosAlternativos.focoEmail : (f && f.txtemail);
    var campoSenha = dadosAlternativos ? dadosAlternativos.focoSenha : (f && f.txtsenha);

    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!expRegemail.test(email)) {
        exibirAvisoAdmin("Preencha o Campo Email ou formato inválido!", "- Login Admin -", function () {
            if (campoEmail && typeof campoEmail.focus === "function") campoEmail.focus();
        });
        return false;
    }

    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        exibirAvisoAdmin("Preencha o Campo Senha corretamente!", "- Login Admin -", function () {
            if (campoSenha && typeof campoSenha.focus === "function") campoSenha.focus();
        });
        return false;
    }

    var todosAdmins = await obterTodosAdministradores();

    administradorEncontrado = todosAdmins.find(function (a) {
        return a.email && a.email.trim().toLowerCase() === email && a.senha === senha;
    });

    if (!administradorEncontrado) {
        exibirAvisoAdmin("E-mail ou senha de administrador incorretos!", "- Credenciais Inválidas -");
        return false;
    }

    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioAtual', administradorEncontrado.email.trim().toLowerCase());
    localStorage.setItem('usuarioNome', administradorEncontrado.nome);
    localStorage.setItem('tipoUsuario', 'admin');

    localStorage.setItem('clienteLogado', JSON.stringify({
        nome: administradorEncontrado.nome,
        email: administradorEncontrado.email.trim().toLowerCase(),
        cpf: administradorEncontrado.cpf || '',
        admin: true,
        tipo: 'admin'
    }));

    exibirAvisoAdmin("Login de administrador realizado com sucesso!", "- Bem-vindo, Admin -", function () {
        window.location.href = "index.html";
    });

    return false;
}