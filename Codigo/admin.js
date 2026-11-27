/* admin.js */
var administradorEncontrado = null;

function escAdminSR(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function avisoAdminSR(mensagem, titulo = '- Administração -') {
    if (window.srModal && typeof window.srModal.alerta === 'function') {
        window.srModal.alerta(mensagem, titulo);
    } else {
        alert(mensagem);
    }
function exibirModalAdmin(titulo, mensagem, aoFechar) {
    let modal = document.getElementById("modalAvisoAdmin");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modalAvisoAdmin";
        modal.className = "modalAdminEdicao";
        modal.innerHTML = `
            <div class="modalAdminEdicaoConteudo" style="text-align: center; max-width: 430px;">
                <h2 id="modalAvisoAdminTitulo"></h2>
                <p id="modalAvisoAdminMsg" style="font-size: 18px; color: #ffffff; margin: 20px 0 25px 0; line-height: 1.5;"></p>
                <div class="botoesAdminEdicao">
                    <button type="button" id="btnFecharAvisoAdmin" style="background-color: #C62828; width: 200px;">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById("modalAvisoAdminTitulo").textContent = titulo;
    document.getElementById("modalAvisoAdminMsg").textContent = mensagem;
    modal.classList.add("aberto");

    const btnOk = document.getElementById("btnFecharAvisoAdmin");
    const fechar = () => {
        modal.classList.remove("aberto");
        if (typeof aoFechar === "function") aoFechar();
    };

    btnOk.onclick = fechar;
    modal.onclick = (e) => {
        if (e.target === modal) fechar();
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const nomePagina = window.location.pathname.split("/").pop().toLowerCase();
    const ehPaginaCadastroAdmin = nomePagina === "cadastroadmin.html";

    const usuarioLogado = localStorage.getItem("usuarioLogado") === "true";
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    // Bloqueia o cadastro de administrador para quem não é administrador
    if (ehPaginaCadastroAdmin && (!usuarioLogado || tipoUsuario !== "admin")) {
        avisoAdminSR("Acesso negado! Apenas administradores logados podem cadastrar novos administradores.");
        window.location.replace("loginAdmin.html");
        return;
    }

    // Adiciona links exclusivos no menu quando um administrador está logado
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

        if (!navUsuario.querySelector('a[href="admin.html"]')) {
            const linkPainelAdmin = document.createElement("a");
            linkPainelAdmin.href = "admin.html";
            linkPainelAdmin.textContent = "⚙️ Painel de Admin";
            navUsuario.prepend(linkPainelAdmin);
        }
    }

    // Formatação automática do CPF
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

    // Renderiza a lista de administradores cadastrados (CRUD) no painel admin
    renderizarPainelAdminsCadastrados();
});

// ==========================================
// Cadastro do Administrador
// ==========================================

function lerAdministradores() {
    try {
        var administradores = JSON.parse(
            localStorage.getItem("administradoresShadowRealm")
        );

        return Array.isArray(administradores) ? administradores : [];

    } catch (e) {
        return [];
    }
}

async function validaCadastroAdmin() {
    var f = document.frmCadastroAdmin;
    if (!f) return false;

    var nome = f.txtnome.value.trim();
    var expRegnome = /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/i;

    if (!expRegnome.test(nome)) {
        avisoAdminSR("Preencha o Campo Nome completo (nome e sobrenome)!!!");
        f.txtnome.focus();
        return false;
    }

    var email = f.txtemail.value.trim();
    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!expRegemail.test(email)) {
        avisoAdminSR("Preencha o Campo Email ou formato inválido !!!");
        f.txtemail.focus();
        return false;
    }

    var cpf = f.txtcpf.value;

    if (cpf.trim() === "" || (typeof cpfInvalido === "function" && cpfInvalido(cpf))) {
        avisoAdminSR("CPF inválido! Verifique os números digitados.");
        f.txtcpf.focus();
        return false;
    }

    var senha = f.txtsenha.value;
    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        avisoAdminSR("A senha deve ter no mínimo 8 caracteres, contendo letras e números.");
        f.txtsenha.focus();
        return false;
    }

    // Verifica duplicidade no localStorage e no admin.json
    var todosAdmins = await obterTodosAdministradores();

    var jaExiste = todosAdmins.some(function (a) {
        return (a.email && a.email.toLowerCase() === email.toLowerCase()) ||
            (cpf && a.cpf === cpf);
    });

    if (jaExiste) {
        avisoAdminSR("Este e-mail ou CPF já está cadastrado como administrador!");
        return false;
    }

    var dados = [
        ["Nome", nome],
        ["Email", email],
        ["CPF", cpf],
        ["Senha", "•".repeat(senha.length)]
    ];

    renderizarDadosAdmin(dados);

    var modalCadastro = document.getElementById("modalCadastroAdmin");
    if (modalCadastro) {
        modalCadastro.classList.add("aberto");
    }

    return false;
}

function renderizarDadosAdmin(dados) {
    var lista = document.getElementById("listaDadosAdmin");
    if (!lista) return;

    lista.innerHTML = "";

    dados.forEach(function (item) {
        var li = document.createElement("li");
        li.innerHTML = "<strong>" + escAdminSR(item[0]) + ":</strong> " + escAdminSR(item[1]);
        lista.appendChild(li);
    });
}

function fechaModalAdmin() {
    var modalCadastro = document.getElementById("modalCadastroAdmin");
    if (modalCadastro) {
        modalCadastro.classList.remove("aberto");
    }
}

function confirmaCadastroAdmin() {
    var f = document.frmCadastroAdmin;
    if (!f) return;

    var novoAdmin = {
        nome: f.txtnome.value.trim(),
        email: f.txtemail.value.trim().toLowerCase(),
        cpf: f.txtcpf.value.trim(),
        senha: f.txtsenha.value,
        tipo: "admin"
    };

    var administradores = lerAdministradores();

    var jaExiste = administradores.some(function (a) {
        return a.email === novoAdmin.email || a.cpf === novoAdmin.cpf;
    });

    if (jaExiste) {
        avisoAdminSR("Este e-mail ou CPF já está cadastrado!");
        fechaModalAdmin();
        return;
    }

    administradores.push(novoAdmin);

    localStorage.setItem(
        "administradoresShadowRealm",
        JSON.stringify(administradores)
    );

    fechaModalAdmin();
    f.reset();

    if (window.srModal && typeof window.srModal.alerta === "function") {
        window.srModal.alerta(
            "Cadastro de administrador realizado com sucesso!",
            "- Cadastro Concluído -",
            false,
            function () {
                window.location.href = "admin.html";
            }
        );
    } else {
        alert("Cadastro de administrador realizado com sucesso!");
        window.location.href = "admin.html";
    }
}

// ==========================================
// Login do Administrador
// ==========================================

async function validaLoginAdmin() {
    var f = document.frmLoginAdmin;
    if (!f) return false;

    var email = f.txtemail.value.trim().toLowerCase();
    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!expRegemail.test(email)) {
        avisoAdminSR("Preencha o Campo Email ou formato inválido !!!");
        f.txtemail.focus();
        return false;
    }

    var senha = f.txtsenha.value;
    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        avisoAdminSR("Preencha o Campo Senha corretamente!");
        f.txtsenha.focus();
        return false;
    }

    // Junta os administradores do JSON (incluindo edições salvas) com os do localStorage
    var todosAdmins = await obterTodosAdministradores();

    administradorEncontrado = todosAdmins.find(function (a) {
        return a.email &&
            a.email.toLowerCase() === email &&
            a.senha === senha;
    });

    if (!administradorEncontrado) {
        avisoAdminSR("E-mail ou senha de administrador incorretos!");
        return false;
    }

    // Salva a sessão do administrador
    localStorage.setItem("usuarioLogado", "true");
    localStorage.setItem("usuarioAtual", administradorEncontrado.email.toLowerCase());
    localStorage.setItem("usuarioNome", administradorEncontrado.nome);
    localStorage.setItem("tipoUsuario", "admin");

    localStorage.setItem("clienteLogado", JSON.stringify({
        nome: administradorEncontrado.nome,
        email: administradorEncontrado.email.toLowerCase(),
        cpf: administradorEncontrado.cpf || "",
        tipo: "admin"
    }));

    if (window.srModal && typeof window.srModal.alerta === "function") {
        window.srModal.alerta(
            "Login de administrador realizado com sucesso!",
            "- Acesso Permitido -",
            false,
            function () {
                window.location.href = "admin.html";
            }
        );
    } else {
        alert("Login de administrador realizado com sucesso!");
        window.location.href = "admin.html";
    }
    exibirModalAdmin(
        "- Bem-vindo, Admin! -",
        `Login de administrador (${administradorEncontrado.nome}) realizado com sucesso!`,
        () => {
            window.location.href = "admin.html";
        }
    );

    return false;
}

// ==========================================
// CRUD de Administradores no Painel (admin.html)
// ==========================================

async function obterTodosAdministradores() {
    var administradoresJSON = [];
    try {
        var resp = await fetch("admin.json");
        if (resp.ok) {
            administradoresJSON = await resp.json();
        }
    } catch (e) {}

    if (!Array.isArray(administradoresJSON) || administradoresJSON.length === 0) {
        administradoresJSON = [
            {
                id: "1",
                nome: "Pedro Carvalho",
                cpf: "",
                email: "pedro_carvalho@gmail.com",
                senha: "Pedro@1983",
                admin: true
            }
        ];
    }

    var locais = lerAdministradores();
    var listaFinal = [];

    administradoresJSON.forEach(function (jsonAdmin) {
        var versaoEditada = locais.find(function (l) {
            return (jsonAdmin.id && l.idOrigin === jsonAdmin.id) ||
                (jsonAdmin.email && l.email && l.email.toLowerCase() === jsonAdmin.email.toLowerCase());
        });

        if (versaoEditada) {
            listaFinal.push(Object.assign({}, versaoEditada, { sistema: true }));
        } else {
            listaFinal.push(Object.assign({}, jsonAdmin, { sistema: true }));
        }
    });

    locais.forEach(function (localAdmin) {
        var jaAdicionado = listaFinal.some(function (item) {
            return item.email && localAdmin.email &&
                item.email.toLowerCase() === localAdmin.email.toLowerCase();
        });
        if (!jaAdicionado) {
            listaFinal.push(Object.assign({}, localAdmin, { sistema: false }));
        }
    });

    return listaFinal;
}

async function renderizarPainelAdminsCadastrados(filtroTexto) {
    var container = document.querySelector(".PainelAdminCadastrados");
    if (!container) return;

    if (!document.getElementById("listaAdminsCrud")) {
        container.innerHTML = `
            <div class="adminCrudTopo">
                <h2>Administradores Cadastrados</h2>
                <input type="text" id="buscaAdminCrud" class="adminCrudBusca" placeholder="Buscar por nome ou e-mail...">
            </div>
            <div id="listaAdminsCrud" class="adminCrudLista"></div>
            <div class="adminCrudRodape">
                <button type="button" class="btnAdminCadastrarNovo" onclick="window.location.href='cadastroAdmin.html'">
                    + Cadastrar Novo Administrador
                </button>
            </div>
        `;

        var buscaInput = document.getElementById("buscaAdminCrud");
        if (buscaInput) {
            buscaInput.addEventListener("input", function (e) {
                renderizarPainelAdminsCadastrados(e.target.value);
            });
        }
    }

    var listaEl = document.getElementById("listaAdminsCrud");
    if (!listaEl) return;

    var termo = (filtroTexto || "").trim().toLowerCase();
    var usuarioAtual = (localStorage.getItem("usuarioAtual") || "").toLowerCase();

    var todos = await obterTodosAdministradores();
    var filtrados = todos.filter(function (a) {
        if (!termo) return true;
        return (a.nome && a.nome.toLowerCase().includes(termo)) ||
               (a.email && a.email.toLowerCase().includes(termo)) ||
               (a.cpf && a.cpf.includes(termo));
    });

    if (filtrados.length === 0) {
        listaEl.innerHTML = '<p class="adminCrudVazio">Nenhum administrador encontrado.</p>';
        return;
    }

    listaEl.innerHTML = "";

    filtrados.forEach(function (admin) {
        var emailAdmin = String(admin.email || "");
        var ehUsuarioLogado = emailAdmin.toLowerCase() === usuarioAtual;
        var badgeTexto = admin.sistema ? "Principal" : (ehUsuarioLogado ? "Admin Atual" : "Administrador");

        var botaoRemoverHTML = admin.sistema
            ? ""
            : '<button type="button" class="btnAdminRemover" data-email-remover="' + escAdminSR(emailAdmin) + '">Remover</button>';

        var card = document.createElement("div");
        card.className = "adminCrudCard";
        card.innerHTML = `
            <div class="adminCrudInfo">
                <span class="adminCrudBadge">${escAdminSR(badgeTexto)}</span>
                <h3>${escAdminSR(admin.nome)}</h3>
                <p><strong>E-mail:</strong> ${escAdminSR(emailAdmin)}</p>
                <p><strong>CPF:</strong> ${escAdminSR(admin.cpf || "Não informado")}</p>
            </div>
            <div class="adminCrudAcoes">
                <button type="button" class="btnAdminEditar" data-email-editar="${escAdminSR(emailAdmin)}">Editar</button>
                ${botaoRemoverHTML}
            </div>
        `;

        var btnEditar = card.querySelector(".btnAdminEditar");
        if (btnEditar) {
            btnEditar.addEventListener("click", function () {
                abrirModalEditarAdmin(emailAdmin);
            });
        }

        var btnRemover = card.querySelector(".btnAdminRemover");
        if (btnRemover) {
            btnRemover.addEventListener("click", function () {
                excluirAdminCrud(emailAdmin);
            });
        }

        listaEl.appendChild(card);
    });
}

async function abrirModalEditarAdmin(email) {
    var todos = await obterTodosAdministradores();
    var admin = todos.find(function (a) {
        return a.email && a.email.toLowerCase() === String(email || "").toLowerCase();
    });

    if (!admin) {
        avisoAdminSR("Administrador não encontrado para edição.");
        return;
    }

    document.getElementById("editAdminEmailOriginal").value = admin.email;
    document.getElementById("editAdminNome").value = admin.nome;
    document.getElementById("editAdminEmail").value = admin.email;
    document.getElementById("editAdminCpf").value = admin.cpf || "";
    document.getElementById("editAdminSenha").value = "";

    var inputCpfEdit = document.getElementById("editAdminCpf");
    if (inputCpfEdit) {
        inputCpfEdit.oninput = function (e) {
            var v = e.target.value.replace(/\D/g, "").slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        };
    }

    var modalEditar = document.getElementById("modalEditarAdmin");
    if (modalEditar) {
        modalEditar.classList.add("aberto");
    }
}

function fecharModalEditarAdmin() {
    var modalEditar = document.getElementById("modalEditarAdmin");
    if (modalEditar) {
        modalEditar.classList.remove("aberto");
    }
}

async function salvarEdicaoAdmin() {
    var emailOriginal = document.getElementById("editAdminEmailOriginal").value.toLowerCase();
    var novoNome = document.getElementById("editAdminNome").value.trim();
    var novoEmail = document.getElementById("editAdminEmail").value.trim().toLowerCase();
    var novoCpf = document.getElementById("editAdminCpf").value.trim();
    var novaSenha = document.getElementById("editAdminSenha").value;

    var expRegnome = /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/i;
    if (!expRegnome.test(novoNome)) {
        avisoAdminSR("Informe o nome completo (nome e sobrenome).");
        return;
    }

    if (novoCpf !== "" && typeof cpfInvalido === "function" && cpfInvalido(novoCpf)) {
        avisoAdminSR("CPF inválido!");
        return;
    }

    if (novaSenha !== "") {
        var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!expRegsenha.test(novaSenha)) {
            avisoAdminSR("A nova senha deve ter no mínimo 8 caracteres, com letras e números.");
            return;
        }
    }

    var todos = await obterTodosAdministradores();
    var adminAlvo = todos.find(function (a) {
        return a.email && a.email.toLowerCase() === emailOriginal;
    });

    if (!adminAlvo) return;

    var duplicado = todos.some(function (a) {
        return a.email && a.email.toLowerCase() !== emailOriginal &&
               (a.email.toLowerCase() === novoEmail || (novoCpf && a.cpf === novoCpf));
    });

    if (duplicado) {
        avisoAdminSR("Já existe outro administrador com este e-mail ou CPF!");
        return;
    }

    var locais = lerAdministradores();
    var indiceLocal = locais.findIndex(function (a) {
        return (a.email && a.email.toLowerCase() === emailOriginal) ||
               (adminAlvo.id && a.idOrigin === adminAlvo.id);
    });

    var registroAtualizado = {
        idOrigin: adminAlvo.id || adminAlvo.idOrigin || null,
        nome: novoNome,
        email: novoEmail,
        cpf: novoCpf,
        senha: novaSenha !== "" ? novaSenha : adminAlvo.senha,
        tipo: "admin"
    };

    if (indiceLocal !== -1) {
        locais[indiceLocal] = registroAtualizado;
    } else {
        locais.push(registroAtualizado);
    }

    localStorage.setItem("administradoresShadowRealm", JSON.stringify(locais));

    if ((localStorage.getItem("usuarioAtual") || "").toLowerCase() === emailOriginal) {
        localStorage.setItem("usuarioAtual", novoEmail);
        localStorage.setItem("usuarioNome", novoNome);
    }

    fecharModalEditarAdmin();
    await renderizarPainelAdminsCadastrados();
    avisoAdminSR("Dados do administrador atualizados com sucesso!");
}

function excluirAdminCrud(email) {
    var emailAlvo = String(email || "").toLowerCase();
    var usuarioAtual = (localStorage.getItem("usuarioAtual") || "").toLowerCase();

    if (emailAlvo === usuarioAtual) {
        avisoAdminSR("Você não pode remover a sua própria conta enquanto está logado nela!");
        return;
    }

    var executarRemocao = function () {
        var locais = lerAdministradores();
        var filtrados = locais.filter(function (a) {
            return !a.email || a.email.toLowerCase() !== emailAlvo;
        });

        localStorage.setItem("administradoresShadowRealm", JSON.stringify(filtrados));
        renderizarPainelAdminsCadastrados();
        avisoAdminSR("Administrador removido com sucesso!");
    };

    if (window.srModal && typeof window.srModal.confirmar === "function") {
        window.srModal.confirmar(
            "Tem certeza que deseja remover este administrador?",
            executarRemocao,
            "- Remover Administrador -"
        );
    } else if (confirm("Tem certeza que deseja remover este administrador?")) {
        executarRemocao();
    }
}}