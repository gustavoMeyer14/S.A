// ==================== CONFIGURAÇÃO DA MÁSCARA DO CPF ====================
window.addEventListener("DOMContentLoaded", function () {
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
        dados.forEach(function (item) {
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

// 6. EVITA O ERRO DO BOTÃO LIMPAR: Criação da função que faltava
function verificaMotivo(valor) {
    console.log("Formulário limpo");
}


/**=======================================   JAVASCRIPT CARRINHO   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const priceBreakdown = document.querySelector('.price-breakdown');
    const modalTotalValue = document.querySelector('.modal-total-value');
    const addressForm = document.querySelector('.address-column');
    const btnBuy = document.querySelector('.btn-buy');
    
    // Elementos do Cupom
    const couponInput = document.getElementById('coupon-input');
    const btnCoupon = document.getElementById('btn-coupon');
    const couponMessage = document.getElementById('coupon-message');

    // === TABELA DE CUPONS VÁLIDOS (Código : Porcentagem de Desconto) ===
    const cuponsValidos = {
        'SHADOW26': 0.10,  // 10% de desconto
        'GEEK15': 0.15,    // 15% de desconto
        'SHADOW50': 0.50   // 50% de desconto
    };

    let descontoAtual = 0; // Inicia em 0%
    let cupomAtivo = '';

    // 1. Busca os produtos salvos no localStorage (ou inicia lista vazia)
    let carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];

    // Bloqueio de Compra se o carrinho estiver vazio
    if (btnBuy) {
        btnBuy.onclick = (e) => {
            if (carrinho.length === 0) {
                e.preventDefault();
                alert('Seu carrinho está vazio! Adicione produtos antes de prosseguir.');
            }
        };
    }

    // === LÓGICA DE APLICAÇÃO DO CUPOM ===
    if (btnCoupon && couponInput) {
        btnCoupon.onclick = () => {
            const codigoDigitado = couponInput.value.trim().toUpperCase();

            if (codigoDigitado === '') {
                exibirMensagemCupom('Digite um cupom.', '#ffaa00');
                return;
            }

            if (cuponsValidos.hasOwnProperty(codigoDigitado)) {
                descontoAtual = cuponsValidos[codigoDigitado];
                cupomAtivo = codigoDigitado;
                const porcText = Math.round(descontoAtual * 100) + '%';
                exibirMensagemCupom(`Cupom ${codigoDigitado} aplicado! (-${porcText})`, '#00ff88');
                renderizarCarrinho(); // Recalcular com o novo desconto
            } else {
                descontoAtual = 0;
                cupomAtivo = '';
                exibirMensagemCupom('Cupom inválido!', '#ff4444');
                renderizarCarrinho();
            }
        };
    }

    function exibirMensagemCupom(texto, cor) {
        if (couponMessage) {
            couponMessage.textContent = texto;
            couponMessage.style.color = cor;
        }
    }

    // 2. Função para desenhar os produtos na tela e calcular totais
    function renderizarCarrinho() {
        if (!productsList) return;

        if (carrinho.length === 0) {
            productsList.innerHTML = '<p class="empty-cart-msg" style="color: #ffffff; text-align: center;">Seu carrinho está vazio.</p>';
            atualizarResumo(0, []);
            return;
        }

        productsList.innerHTML = '';
        let grandTotal = 0;

        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            grandTotal += subtotal;

            const card = document.createElement('article');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-thumb">
                    <img src="${item.imagem || 'imagens/logo.png'}" alt="${item.nome}">
                </div>
                <h3 class="product-name">${item.nome}</h3>
                <div class="quantity-controls">
                    <button type="button" class="btn-plus" onclick="alterarQuantidade(${index}, 1)">+</button>
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

        atualizarResumo(grandTotal, carrinho);
    }

    // 3. Altera a quantidade ou remove o item se chegar a zero
    window.alterarQuantidade = function(index, delta) {
        carrinho[index].quantidade += delta;

        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }

        localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
        renderizarCarrinho();
    };

    // 3.1. Remove o produto diretamente do carrinho
    window.removerProduto = function(index) {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
        renderizarCarrinho();
    };

    // 4. Atualiza os painéis de valor total (Com aplicação de Cupom)
    function atualizarResumo(grandTotal, itens) {
        if (!priceBreakdown) return;

        let breakdownHTML = '';

        if (itens.length === 0) {
            breakdownHTML = '<p class="price-item">R$ 0,00</p>';
        } else {
            itens.forEach((item, index) => {
                const mathPrefix = index === 0 ? '' : '+ ';
                const subtotal = item.preco * item.quantidade;
                breakdownHTML += `<p class="price-item">${mathPrefix}R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
            });
        }

        // Aplicação do Desconto do Cupom
        let valorComDesconto = grandTotal;
        if (descontoAtual > 0 && grandTotal > 0) {
            const valorDesconto = grandTotal * descontoAtual;
            valorComDesconto = grandTotal - valorDesconto;

            breakdownHTML += `<p class="price-item" style="color: #00ff88;">- Desconto (${Math.round(descontoAtual * 100)}%): R$ ${valorDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
        }

        breakdownHTML += `<hr class="summary-divider">`;
        breakdownHTML += `<p class="total-final">Valor Total: <span>R$ ${valorComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>`;

        priceBreakdown.innerHTML = breakdownHTML;

        // Atualiza o valor final no modal de pagamento
        if (modalTotalValue) {
            modalTotalValue.textContent = `Valor Total: R$ ${valorComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }

    // 5. Confirmação do Formulário de Pagamento
    if (addressForm) {
        addressForm.onsubmit = (e) => {
            e.preventDefault();

            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            alert('Pagamento confirmado com sucesso! Obrigado por comprar na Shadow Realm Store.');
            
            localStorage.removeItem('carrinhoShadowRealm');
            window.location.href = 'index.html';
        };
    }

    renderizarCarrinho();
});