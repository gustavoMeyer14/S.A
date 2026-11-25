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

function confirmaCadastroAdmin() {

    var f = document.frmCadastroAdmin;

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
        alert("Este e-mail ou CPF já está cadastrado!");
        fechaModalAdmin();
        return;
    }

    administradores.push(novoAdmin);

    localStorage.setItem(
        'administradoresShadowRealm',
        JSON.stringify(administradores)
    );

    alert("Cadastro de administrador realizado com sucesso!");

    fechaModalAdmin();

    f.reset();

    window.location.href = "loginAdmin.html";
}


// ==========================================
// Aqui comiensa el login
// ==========================================

function validaLoginAdmin() {

    var f = document.frmLoginAdmin;

    var email = f.txtemail.value.trim().toLowerCase();

    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //No me acuerdo de donde saque esto..creo que era de geminis nose

    if (!expRegemail.test(email)) {
        alert("Preencha o Campo Email ou formato inválido !!!");
        f.txtemail.focus();
        return false;
    }

    var senha = f.txtsenha.value;

    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;// aka es la misma wea del comentario anterior se lo pedi al google xD

    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        alert("Preencha o Campo Senha corretamente!");
        f.txtsenha.focus();
        return false;
    }

    var administradores = lerAdministradores();

    administradorEncontrado = administradores.find(function (a) {

        return a.email === email && a.senha === senha;

    });

    if (!administradorEncontrado) {
        alert("E-mail ou senha de administrador incorretos!");
        return false;
    }
// esta wea de abajo sirve para obviamente guardar las informaciones del administrador
    localStorage.setItem('usuarioLogado', 'true');// che cada linea guarda alguna informacion recordar esso ..porque? porque si conchale vale
    localStorage.setItem('usuarioAtual', administradorEncontrado.email);
    localStorage.setItem('usuarioNome', administradorEncontrado.nome);
    localStorage.setItem('tipoUsuario', 'admin');

    localStorage.setItem('clienteLogado', JSON.stringify({
        nome: administradorEncontrado.nome,
        email: administradorEncontrado.email,
        cpf: administradorEncontrado.cpf,
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