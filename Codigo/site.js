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


document.addEventListener('DOMContentLoaded', () => {
  // === MAPEAMENTO DOS COMPONENTES ===
  const productCards = document.querySelectorAll('.product-card');
  const priceBreakdown = document.querySelector('.price-breakdown');
  const modalTotalValue = document.querySelector('.modal-total-value');
  const addressForm = document.querySelector('.address-column');

  // Tabela de Preços Base das Figures (valores reais das imagens)
  const productPrices = {
      'Figure Renji': 287.99,
      'Figure Kisuke': 591.90,
      'Figure Maomao': 496.50
  };

  // === FUNÇÃO DE RECALCULAR TUDO ===
  function updateTotals() {
      let activeItems = [];
      let grandTotal = 0;

      // Vasculha cada produto na primeira tela
      productCards.forEach(card => {
          const productName = card.querySelector('.product-name').textContent.trim();
          const qtyValue = parseInt(card.querySelector('.qty-value').textContent);
          const unitPrice = productPrices[productName] || 0;
          
          // Só considera no cálculo se a quantidade for maior que zero
          if (qtyValue > 0) {
              const itemTotalPrice = unitPrice * qtyValue;
              activeItems.push({ name: productName, price: itemTotalPrice });
              grandTotal += itemTotalPrice;
          }
      });

      // 1. Atualiza o painel lateral com os novos valores baseados nas quantidades
      let breakdownHTML = '';
      activeItems.forEach((item, index) => {
          // Insere o sinal de "+" a partir da segunda linha conforme o print original
          const mathPrefix = index === 0 ? '  ' : '+ ';
          breakdownHTML += `<p class="price-item">${mathPrefix}R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
      });
      
      // Se o carrinho for zerado por completo
      if (activeItems.length === 0) {
          breakdownHTML = `<p class="price-item">R$ 0,00</p>`;
      }
      
      breakdownHTML += `<hr class="summary-divider">`;
      breakdownHTML += `<p class="total-final">Valor Total: <span>R$ ${grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>`;
      
      priceBreakdown.innerHTML = breakdownHTML;

      // 2. Sincroniza o valor final para dentro do texto dinâmico da segunda tela (Tela de Pagamento)
      if (modalTotalValue) {
          modalTotalValue.textContent = `Valor Total: R$ ${grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
  }

  // === OUVINTES DE CLIQUE (+ E -) ===
  productCards.forEach(card => {
      const btnPlus = card.querySelector('.btn-plus');
      const btnMinus = card.querySelector('.btn-minus');
      const qtyDisplay = card.querySelector('.qty-value');

      // Botão de Adicionar (+)
      btnPlus.addEventListener('click', () => {
          let currentQty = parseInt(qtyDisplay.textContent);
          qtyDisplay.textContent = currentQty + 1;
          updateTotals(); // Recalcula na hora
      });

      // Botão de Diminuir (-)
      btnMinus.addEventListener('click', () => {
          let currentQty = parseInt(qtyDisplay.textContent);
          if (currentQty > 0) {
              qtyDisplay.textContent = currentQty - 1;
              updateTotals(); // Recalcula na hora
          }
      });
  });

  // === DISPARO DO FORMULÁRIO DE PAGAMENTO ===
  if (addressForm) {
      addressForm.addEventListener('submit', (e) => {
          e.preventDefault(); // Impede o envio padrão da página
          
          alert('Pagamento confirmado com sucesso! Obrigado por comprar na Shadow Realm Store.');
          
          // Retorna para o carrinho e remove a tag da URL limpando o estado do CSS
          window.location.hash = 'tela-carrinho';
      });
  }
});
