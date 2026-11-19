function abreModalCliente() {
    document.getElementById('modalCliente').classList.add('aberto');
}

function fechaModalCliente() {
    document.getElementById('modalCliente').classList.remove('aberto');
}

function toggleSenha(inputId, btnElement) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        btnElement.textContent = '🙈';
    } else {
        input.type = 'password';
        btnElement.textContent = '👁️';
    }
}

function sairConta() {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioAtual');
    localStorage.removeItem('usuarioNome');
    alert("Você saiu da sua conta.");
    window.location.href = "index.html";
}

window.addEventListener("DOMContentLoaded", function () {
    const paginaAtual = window.location.pathname.split("/").pop();
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';

    if (estaLogado && paginaAtual === 'cliente.html') {
        alert("Você já está logado em uma conta!");
        window.location.href = "index.html";
        return;
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

        const linkPerfil = document.createElement('a');
        linkPerfil.href = "#";
        linkPerfil.textContent = "Meu Perfil";
        linkPerfil.onclick = function (e) {
            e.preventDefault();
            const emailAtual = localStorage.getItem('usuarioAtual') || '';
            alert(`Perfil do Cliente\nNome: ${nomeSalvo}\nE-mail: ${emailAtual}`);
        };

        const linkPedidos = document.createElement('a');
        linkPedidos.href = "#";
        linkPedidos.textContent = "Meus Pedidos";
        linkPedidos.onclick = function (e) {
            e.preventDefault();
            const pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];
            if (pedidos.length === 0) {
                alert("Você ainda não possui pedidos realizados.");
            } else {
                alert(`Você possui ${pedidos.length} pedido(s) registrado(s).`);
            }
        };

        const linkSair = document.createElement('a');
        linkSair.href = "#";
        linkSair.textContent = "Sair";
        linkSair.onclick = function (e) {
            e.preventDefault();
            sairConta();
        };

        navUsuario.insertBefore(linkPedidos, navUsuario.firstChild);
        navUsuario.insertBefore(linkPerfil, navUsuario.firstChild);
        navUsuario.appendChild(linkSair);
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
});

function cpfInvalido(rawCpf) {
    var cpf = rawCpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return true;

    var soma = 0;
    for (var i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var resto = 11 - (soma % 11);
    var digito1 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return true;

    soma = 0;
    for (var j = 0; j < 10; j++) {
        soma += parseInt(cpf.charAt(j)) * (11 - j);
    }
    resto = 11 - (soma % 11);
    var digito2 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito2 !== parseInt(cpf.charAt(10))) return true;

    return false;
}

var usuarioEncontradoLogin = null;

async function validaLogin() {
    var email = document.frmlogin.txtemail.value.trim();
    var expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!expRegemail.test(email)) {
        alert("Preencha o Campo Email ou formato inválido !!!");
        document.frmlogin.txtemail.focus();
        return false;
    }

    var senha = document.frmlogin.txtsenha.value;
    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (senha.trim() === "" || !expRegsenha.test(senha)) {
        alert("Preencha o Campo Senha corretamente! Ela deve ter no mínimo 8 caracteres, contendo letras e números.");
        document.frmlogin.txtsenha.focus();
        return false;
    }

    var usuariosJSON = [];
    var clientesJSON = [];

    try {
        var respUsuarios = await fetch('usuarios.json');
        if (respUsuarios.ok) usuariosJSON = await respUsuarios.json();
    } catch (e) {
        console.warn("Aviso: fetch de usuarios.json bloqueado (abra com Live Server).");
    }

    try {
        var respClientes = await fetch('clientes.json');
        if (respClientes.ok) clientesJSON = await respClientes.json();
    } catch (e) {
        console.warn("Aviso: fetch de clientes.json bloqueado (abra com Live Server).");
    }

    if (usuariosJSON.length === 0 && clientesJSON.length === 0) {
        usuariosJSON = [
            { nome: "Admin Shadow", email: "admin@shadowrealm.com", senha: "admin123", cpf: "111.111.111-11" },
            { nome: "Cliente Teste", email: "teste@gmail.com", senha: "teste123", cpf: "222.222.222-22" },
            { nome: "João da Silva", email: "joao.silva@example.com", senha: "senha123", cpf: "123.456.789-00" },
            { nome: "Maria Oliveira", email: "maria.oliveira@example.com", senha: "senha456", cpf: "987.654.321-00" }
        ];
    }

    var usuariosLocais = JSON.parse(localStorage.getItem('usuariosShadowRealm')) || [];
    var todosUsuarios = usuariosJSON.concat(clientesJSON, usuariosLocais);

    var usuarioValido = todosUsuarios.find(function (u) {
        return u.email.toLowerCase() === email.toLowerCase() && u.senha === senha;
    });

    if (!usuarioValido) {
        alert("E-mail ou senha incorretos, ou conta não encontrada!");
        return false;
    }

    usuarioEncontradoLogin = usuarioValido;
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
    var email = document.frmlogin.txtemail.value.trim();
    var nomeUsuario = (usuarioEncontradoLogin && usuarioEncontradoLogin.nome) ? usuarioEncontradoLogin.nome : email.split('@')[0];

    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioAtual', email);
    localStorage.setItem('usuarioNome', nomeUsuario);

    alert("Login realizado com sucesso!");
    fechaModalLogin();
    document.frmlogin.reset();
    window.location.href = "index.html";
}

function verificaMotivo(valor) {
    console.log("Formulário limpo");
}

function validaCadastro() {
    var nome = document.frmcadastro.txtnome.value;
    var expRegnome = /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/i;
    if (!expRegnome.test(nome.trim())) {
        alert("Preencha o Campo Nome completo (nome e sobrenome)!!!");
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

    var cpf = document.frmcadastro.txtcpf.value;
    if (cpf.trim() === "" || cpfInvalido(cpf)) {
        alert("CPF inválido! Verifique os números digitados.");
        document.frmcadastro.txtcpf.focus();
        return false;
    }

    var senha = document.frmcadastro.txtsenha.value;
    var expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
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
    var f = document.frmcadastro;
    var novoUsuario = {
        nome: f.txtnome.value.trim(),
        email: f.txtemail.value.trim().toLowerCase(),
        cpf: f.txtcpf.value.trim(),
        senha: f.txtsenha.value
    };

    var usuariosLocais = JSON.parse(localStorage.getItem('usuariosShadowRealm')) || [];

    var jaExiste = usuariosLocais.some(function (u) {
        return u.email === novoUsuario.email || u.cpf === novoUsuario.cpf;
    });

    if (jaExiste) {
        alert("Este e-mail ou CPF já está cadastrado!");
        fechaModalCadastro();
        return;
    }

    usuariosLocais.push(novoUsuario);
    localStorage.setItem('usuariosShadowRealm', JSON.stringify(usuariosLocais));
    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioAtual', novoUsuario.email);
    localStorage.setItem('usuarioNome', novoUsuario.nome);

    alert("Cadastro realizado com sucesso!");
    fechaModalCadastro();
    f.reset();
    window.location.href = "index.html";
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

    let carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];

    if (btnBuy) {
        btnBuy.onclick = (e) => {
            if (carrinho.length === 0) {
                e.preventDefault();
                alert('Seu carrinho está vazio! Adicione produtos antes de prosseguir.');
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

            if (cuponsValidos.hasOwnProperty(codigoDigitado)) {
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
            // Se não tiver cupom aplicado, avisa o usuário
            if (descontoAtual === 0 && cupomAtivo === '') {
                exibirMensagemCupom('Nenhum cupom aplicado no momento.', '#ffaa00');
                return;
            }

            // 1. Zera as variáveis de desconto
            descontoAtual = 0;
            cupomAtivo = '';

            // 2. Limpa o campo de texto do cupom
            if (couponInput) {
                couponInput.value = '';
            }

            // 3. Atualiza a mensagem na tela e recalcula o carrinho
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

    window.alterarQuantidade = function (index, delta) {
        carrinho[index].quantidade += delta;

        if (carrinho[index].quantidade <= 0) {
            carrinho.splice(index, 1);
        }

        localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
        renderizarCarrinho();
        if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
    };

    window.removerProduto = function (index) {
        carrinho.splice(index, 1);
        localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
        renderizarCarrinho();
        if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
    };
    
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

        let valorComDesconto = grandTotal;
        if (descontoAtual > 0 && grandTotal > 0) {
            const valorDesconto = grandTotal * descontoAtual;
            valorComDesconto = grandTotal - valorDesconto;

            breakdownHTML += `<p class="price-item" style="color: #00ff88;">- Desconto (${Math.round(descontoAtual * 100)}%): R$ ${valorDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
        }

        breakdownHTML += `<hr class="summary-divider">`;
        breakdownHTML += `<p class="total-final">Valor Total: <span>R$ ${valorComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>`;

        priceBreakdown.innerHTML = breakdownHTML;

        if (modalTotalValue) {
            modalTotalValue.textContent = `Valor Total: R$ ${valorComDesconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }

    if (addressForm) {
        addressForm.onsubmit = (e) => {
            e.preventDefault();

            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            const pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];
            pedidos.push({
                data: new Date().toLocaleDateString('pt-BR'),
                itens: carrinho
            });
            localStorage.setItem('pedidosShadowRealm', JSON.stringify(pedidos));

            alert('Pagamento confirmado com sucesso! Obrigado por comprar na Shadow Realm Store.');

            localStorage.removeItem('carrinhoShadowRealm');
            window.location.href = 'index.html';
        };
    }

    renderizarCarrinho();
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

    const cartoes = JSON.parse(localStorage.getItem('cartoesShadowRealm')) || [];

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
    if (!confirm('Deseja realmente remover este cartão?')) return;

    const cartoes = JSON.parse(localStorage.getItem('cartoesShadowRealm')) || [];
    cartoes.splice(index, 1);
    localStorage.setItem('cartoesShadowRealm', JSON.stringify(cartoes));
    renderizarCartoesSalvos();
};

window.definirCartaoPrincipal = function (index) {
    const cartoes = JSON.parse(localStorage.getItem('cartoesShadowRealm')) || [];
    if (index === 1 && cartoes.length === 2) {
        [cartoes[0], cartoes[1]] = [cartoes[1], cartoes[0]];
        localStorage.setItem('cartoesShadowRealm', JSON.stringify(cartoes));
        renderizarCartoesSalvos();
    }
};

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cartoes = JSON.parse(localStorage.getItem('cartoesShadowRealm')) || [];
        if (cartoes.length >= 2) {
            alert('Você já atingiu o limite de 2 cartões (Principal e Secundário). Remova um para cadastrar outro.');
            return;
        }

        const numeroLimpo = inputNumero.value.replace(/\s/g, '');
        if (numeroLimpo.length !== 16) {
            alert('Por favor, insira os 16 dígitos do cartão.');
            inputNumero.focus();
            return;
        }

        const numeroMascarado = '**** **** **** ' + numeroLimpo.slice(-4);
        const jaCadastrado = cartoes.some(c => c.numeroMascarado === numeroMascarado && c.validade === inputValidade.value);
        if (jaCadastrado) {
            alert('Este cartão já está cadastrado!');
            return;
        }

        if (!validarValidadeCartao(inputValidade.value)) {
            alert('Data de validade inválida ou cartão vencido! Use o formato MM/AA.');
            inputValidade.focus();
            return;
        }

        if (inputCvv.value.length !== 3) {
            alert('O CVV deve conter exatamente 3 dígitos.');
            inputCvv.focus();
            return;
        }

        resNumero.textContent = inputNumero.value;
        resTitular.textContent = inputTitular.value;
        resValidade.textContent = inputValidade.value;
        resCvv.textContent = inputCvv.value;
        resEndereco.textContent = inputEndereco.value;

        modal.showModal();
    });
}

if (btnCorrigir) {
    btnCorrigir.addEventListener('click', () => {
        modal.close();
    });
}

if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
        const cartoes = JSON.parse(localStorage.getItem('cartoesShadowRealm')) || [];
        const numeroLimpo = inputNumero.value.replace(/\s/g, '');

        cartoes.push({
            numeroMascarado: '**** **** **** ' + numeroLimpo.slice(-4),
            final: numeroLimpo.slice(-4),
            titular: inputTitular.value.trim(),
            validade: inputValidade.value,
            endereco: inputEndereco.value.trim()
        });

        localStorage.setItem('cartoesShadowRealm', JSON.stringify(cartoes));

        modal.close();
        alert(cartoes.length === 1 ? 'Cartão Principal cadastrado com sucesso!' : 'Cartão Secundário cadastrado com sucesso!');
        form.reset();
        renderizarCartoesSalvos();
    });
}

renderizarCartoesSalvos();