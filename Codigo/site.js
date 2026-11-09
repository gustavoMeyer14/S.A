function validaLogin() {

  var email = document.frmlogin.txtemail.value;
  var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  
  if (!expRegemail.test(email.trim())) {
      alert("Preencha o Campo Email ou formato inválido !!!"); 
      document.frmlogin.txtemail.focus();                
      return false;                                        
  }

  var login = document.frmlogin.txtcidade.value;

  if (senha === "") {
      alert("Preencha o Campo Senha ou formato inválido !!!")
      document.frmlogin.txtsenha.focus();
      return false;
  }

  abreModalLogin();
  return false;
}

  function abreModalLogin() {
  var f = document.frmlogin;


  // Monta uma matriz/array com os dados a serem mostrados no resumo
  var dados = [
      ["Email", f.txtemail.value],
      ["Senha", f.txtsenha.value],
  ];


  // Chama a função auxiliar para desenhar/inserir esses dados na tela
  renderizarListaModal("listaDadosLogin", dados);
  // Adiciona a classe CSS "aberto" para exibir visualmente a caixa modal
  document.getElementById("modalDadosLogin").classList.add("aberto");
}

// Esconde o modal removendo a classe "aberto"
function fechaModalLogin() {
  document.getElementById("modalDadosLogin").classList.remove("aberto");
}

// Ação de confirmação e envio final do formulário
function confirmaLogin() {
  alert("Mensagem enviada com sucesso!");
  fechaModalLogin();                   // Fecha o modal
  document.frmlogin.reset(); // Limpa todos os campos do formulário
}