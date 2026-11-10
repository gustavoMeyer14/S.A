// ==================== CONFIGURAÇÃO DA MÁSCARA DO CPF ====================
window.addEventListener("DOMContentLoaded", function() {
    var inputCpf = document.getElementById('cpf');
    if (inputCpf) {
        inputCpf.addEventListener('input', function(e) {
            var v = e.target.value.replace(/\D/g, "").slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });
    }
});

// Algoritmo Oficial de Validação do CPF
function cpfInvalido(rawCpf) {
    var cpf = rawCpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return true;
    
    // Validação do primeiro dígito verificador
    var soma = 0;
    for (var i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var resto = 11 - (soma % 11);
    var digito1 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return true;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (var j = 0; j < 10; j++) {
        soma += parseInt(cpf.charAt(j)) * (11 - j);
    }
    resto = 11 - (soma % 11);
    var digito2 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito2 !== parseInt(cpf.charAt(10))) return true;
    
    return false;
}
// ========================================================================

function validaLogin() {
  var email = document.frmlogin.txtemail.value;
  var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  
  if (!expRegemail.test(email.trim())) {
      alert("Preencha o Campo Email ou formato inválido !!!"); 
      document.frmlogin.txtemail.focus();                
      return false;                                        
  }

  var senha = document.frmlogin.txtsenha.value;
  var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
  if (senha.trim() === "" || !expRegsenha.test(senha)) {
      alert("Preencha o Campo Senha corretamente! Ela deve ter no mínimo 8 caracteres, contendo letras e números.");
      document.frmlogin.txtsenha.focus();
      return false;
  }

  abreModalLogin();
  return false; 
}

function abreModalLogin() {
  var f = document.frmlogin;
  var dados = [
      ["Email", f.txtemail.value],
      ["Senha", f.txtsenha.value]
  ];
  renderizarListaModal("listaDadosLogin", dados);
  document.getElementById("modalDadosLogin").classList.add("aberto");
}

function renderizarListaModal(idElemento, dados) {
  var elemento = document.getElementById(idElemento);
  if (elemento) {
      elemento.innerHTML = ""; 
      dados.forEach(function(item) {
          var li = document.createElement("li");
          li.innerHTML = "<strong>" + item[0] + ":</strong> " + item[1];
          elemento.appendChild(li);
      });
  }
}

function fechaModalLogin() {
  document.getElementById("modalDadosLogin").classList.remove("aberto");
}

function confirmaLogin() {
  alert("Mensagem enviada com sucesso!");
  fechaModalLogin();                   
  document.frmlogin.reset(); 
}

function verificaMotivo(valor) {
  console.log("Formulário limpo");  
}

//---------------------- CADASTRO  -------------------------//

function validaCadastro() {
  var nome = document.frmcadastro.txtnome.value;
  var expRegnome = /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/i;
  if (!expRegnome.test(nome.trim())) {
    alert("Preencha o Campo Nome completo!!!"); 
    document.frmcadastro.txtnome.focus();    
    return false;                            
  }

  var email = document.frmcadastro.txtemail.value;
  var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  
  if (!expRegemail.test(email.trim())) {
      alert("Preencha o Campo Email ou formato inválido !!!"); 
      document.frmcadastro.txtemail.focus();                
      return false;                                        
  }

  // Validação do CPF corrigida
  var cpf = document.frmcadastro.txtcpf.value;
  if (cpf.trim() === "") {
      alert("Por favor, preencha o Campo CPF!");
      document.frmcadastro.txtcpf.focus();
      return false;
  }
  if (cpfInvalido(cpf)) {
      alert("CPF inválido! Verifique os números digitados.");
      document.frmcadastro.txtcpf.focus();
      return false;
  }

  var senha = document.frmcadastro.txtsenha.value;
  var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
  if (senha.trim() === "" || !expRegsenha.test(senha)) {
      alert("Preencha o Campo Senha corretamente! Ela deve ter no mínimo 8 caracteres, contendo letras e números.");
      document.frmcadastro.txtsenha.focus();
      return false;
  }

  abreModalCadastro();
  return false; 
}

function abreModalCadastro() {
  var f = document.frmcadastro;
  var dados = [
      ["Nome Completo", f.txtnome.value],
      ["Email", f.txtemail.value],
      ["Senha", f.txtsenha.value],
      ["CPF", f.txtcpf.value]
  ];
  renderizarListaModal("listaDadosCadastro", dados);
  document.getElementById("modalDadosCadastro").classList.add("aberto");
}

function fechaModalCadastro() {
  document.getElementById("modalDadosCadastro").classList.remove("aberto");
}

function confirmaCadastro() {
  alert("Mensagem enviada com sucesso!");
  fechaModalCadastro();                   
  document.frmcadastro.reset(); 
}
