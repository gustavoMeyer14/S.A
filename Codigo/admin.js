var administradorEncontrado = null;

//y Aka es el cadastro del administrador
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

function validaCadastroAdmin() {

    var f = document.frmCadastroAdmin;

    var nome = f.txtnome.value.trim();
    var expRegnome = /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/i;

    if (!expRegnome.test(nome)) {
        alert("Preencha o Campo Nome completo (nome e sobrenome)!!!");
        f.txtnome.focus();
        return false;
    }

    var email = f.txtemail.value.trim();
    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!expRegemail.test(email)) {
        alert("Preencha o Campo Email ou formato inválido !!!");
        f.txtemail.focus();
        return false;
    }

    var cpf = f.txtcpf.value;

    if (cpf.trim() === "" || cpfInvalido(cpf)) {
        alert("CPF inválido! Verifique os números digitados.");
        f.txtcpf.focus();
        return false;
    }

    var senha = f.txtsenha.value;
    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        alert("A senha deve ter no mínimo 8 caracteres, contendo letras e números.");
        f.txtsenha.focus();
        return false;
    }

    var administradores = lerAdministradores();

    var jaExiste = administradores.some(function (a) {
        return a.email === email.toLowerCase() || a.cpf === cpf;
    });

    if (jaExiste) {
        alert("Este e-mail ou CPF já está cadastrado como administrador!");
        return false;
    }

    var dados = [
        ["Nome", nome],
        ["Email", email],
        ["CPF", cpf],
        ["Senha", "•".repeat(senha.length)]
    ];

    renderizarDadosAdmin(dados);

    document.getElementById("modalCadastroAdmin").classList.add("aberto");

    return false;
}

function renderizarDadosAdmin(dados) {

    var lista = document.getElementById("listaDadosAdmin");

    lista.innerHTML = "";

    dados.forEach(function (item) {

        var li = document.createElement("li");

        li.innerHTML = "<strong>" + item[0] + ":</strong> " + item[1];

        lista.appendChild(li);

    });
}

function fechaModalAdmin() {

    document.getElementById("modalCadastroAdmin").classList.remove("aberto");

}

async function validaCadastroAdmin() {
    var f = document.frmCadastroAdmin;
    // ... (suas validações de nome, email, cpf, senha e chave mestra continuam iguais) ...

    var administradoresLocais = lerAdministradores();
    var administradoresJSON = [];
    try {
        var resp = await fetch('admin.json');
        if (resp.ok) administradoresJSON = await resp.json();
    } catch (e) {}

    var todosAdmins = administradoresLocais.concat(administradoresJSON);

    var jaExiste = todosAdmins.some(function (a) {
        return (a.email && a.email.toLowerCase() === email.toLowerCase()) || (cpf && a.cpf === cpf);
    });

    if (jaExiste) {
        alert("Este e-mail ou CPF já está cadastrado como administrador!");
        return false;
    }

    // ... (restante da função que abre a modal continua igual) ...
}

// ==========================================
// Aqui comiensa el login
// ==========================================

async function validaLoginAdmin() {

    var f = document.frmLoginAdmin;

    var email = f.txtemail.value.trim().toLowerCase();
    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!expRegemail.test(email)) {
        alert("Preencha o Campo Email ou formato inválido !!!");
        f.txtemail.focus();
        return false;
    }

    var senha = f.txtsenha.value;
    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        alert("Preencha o Campo Senha corretamente!");
        f.txtsenha.focus();
        return false;
    }

    // 1. Busca os administradores do arquivo admin.json
    var administradoresJSON = [];
    try {
        var resposta = await fetch('admin.json');
        if (resposta.ok) {
            administradoresJSON = await resposta.json();
        }
    } catch (e) {
        console.error("Erro ao ler admin.json:", e);
    }

    // Fallback caso abra o HTML direto sem servidor local (file://)
    if (administradoresJSON.length === 0) {
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

    // 2. Junta os admins do admin.json com os salvos no localStorage
    var administradoresLocais = lerAdministradores();
    var todosAdmins = administradoresLocais.concat(administradoresJSON);

    administradorEncontrado = todosAdmins.find(function (a) {
        return a.email && a.email.toLowerCase() === email && a.senha === senha;
    });

    if (!administradorEncontrado) {
        alert("E-mail ou senha de administrador incorretos!");
        return false;
    }

    // 3. Salva a sessão do administrador logado
    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioAtual', administradorEncontrado.email.toLowerCase());
    localStorage.setItem('usuarioNome', administradorEncontrado.nome);
    localStorage.setItem('tipoUsuario', 'admin');

    localStorage.setItem('clienteLogado', JSON.stringify({
        nome: administradorEncontrado.nome,
        email: administradorEncontrado.email.toLowerCase(),
        cpf: administradorEncontrado.cpf || '',
        tipo: 'admin'
    }));

    alert("Login de administrador realizado com sucesso!");

    window.location.href = "index.html";

    return false;
}


// ==========================================
// A formatacção do CPF
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

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

});