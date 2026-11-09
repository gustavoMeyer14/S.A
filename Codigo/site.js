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

  // Se passou nas validações, abre o modal
  abreModalLogin();
  return false; // Impede o envio real para a página não recarregar antes do modal
}

// 2. Abre o Modal e puxa a função para desenhar os dados
function abreModalLogin() {
  var f = document.frmlogin;

  var dados = [
      ["Email", f.txtemail.value],
      ["Senha", f.txtsenha.value]
  ];

  renderizarListaModal("listaDadosLogin", dados);
  document.getElementById("modalDadosLogin").classList.add("aberto");
}

// 3. FUNÇÃO AUXILIAR: Desenha os dados corrigindo os índices [0] e [1]
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

// 4. Fecha o Modal
function fechaModalLogin() {
  document.getElementById("modalDadosLogin").classList.remove("aberto");
}

// 5. Confirmação Final dentro do Modal
function confirmaLogin() {
  alert("Mensagem enviada com sucesso!");
  fechaModalLogin();                   
  document.frmlogin.reset(); 
}

// 6. EVITA O ERRO DO BOTÃO LIMPAR: Criação da função que faltava
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

  var senha = document.frmcadastro.txtsenha.value;
  var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
  if (senha.trim() === "" || !expRegsenha.test(senha)) {
      alert("Preencha o Campo Senha corretamente! Ela deve ter no mínimo 8 caracteres, contendo letras e números.");
      document.frmcadastro.txtsenha.focus();
      return false;
  }

  // Se passou nas validações, abre o modal
  abreModalCadastro();
  return false; // Impede o envio real para a página não recarregar antes do modal
}

// 2. Abre o Modal e puxa a função para desenhar os dados
function abreModalCadastro() {
  var f = document.frmcadastro;

  var dados = [
      ["Nome Completo:", f.txtnome.value],
      ["Email", f.txtemail.value],
      ["Senha", f.txtsenha.value],
  ];

  renderizarListaModal("listaDadosCadastro", dados);
  document.getElementById("modalDadosCadastro").classList.add("aberto");
}

// 3. FUNÇÃO AUXILIAR: Desenha os dados corrigindo os índices [0] e [1]
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

// 4. Fecha o Modal
function fechaModalCadastro() {
  document.getElementById("modalDadosCadastro").classList.remove("aberto");
}

// 5. Confirmação Final dentro do Modal
function confirmaCadastro() {
  alert("Mensagem enviada com sucesso!");
  fechaModalCadastro();                   
  document.frmcadastro.reset(); 
}

// 6. EVITA O ERRO DO BOTÃO LIMPAR: Criação da função que faltava
function verificaMotivo(valor) {
  console.log("Formulário limpo");
}