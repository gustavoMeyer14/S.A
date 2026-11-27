function escaparHtmlCheckoutSR(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', () => {
    const formEndereco = document.querySelector('.address-column');
    if (!formEndereco) return;

    const cartoesSalvos = lerCartoesCheckout();

    injetarSelecaoCartoes(cartoesSalvos);
    injetarEnderecoAutomatico(formEndereco, cartoesSalvos);
    configurarFechamentoModalPagamento();
    configurarSincronizacaoMetodosPagamento();
});

function obterChaveCartoesCheckout() {
    const usuarioAtual = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();
    return usuarioAtual ? `cartoesShadowRealm_${usuarioAtual}` : 'cartoesShadowRealm';
}

function lerCartoesCheckout() {
    if (typeof lerCartoesUsuario === 'function') {
        const viaSite = lerCartoesUsuario();
        if (Array.isArray(viaSite)) return viaSite;
    }

    const usuarioAtual = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();
    const chaveUsuario = obterChaveCartoesCheckout();

    try {
        const dadosUsuario = JSON.parse(localStorage.getItem(chaveUsuario));
        if (Array.isArray(dadosUsuario) && dadosUsuario.length > 0) return dadosUsuario;
    } catch {}

    try {
        const legado = JSON.parse(localStorage.getItem('cartoesShadowRealm'));
        if (!Array.isArray(legado)) return [];
        if (!usuarioAtual) return legado;
        return legado.filter((c) => !c.usuarioEmail || String(c.usuarioEmail).trim().toLowerCase() === usuarioAtual);
    } catch {
        return [];
    }
}

function montarHtmlOpcoesCartoes(cartoes) {
    return cartoes.map((c, idx) => {
        const rotulo = idx === 0 ? 'Principal' : 'Secundário';
        const numero = escaparHtmlCheckoutSR(
            c.numeroMascarado || (c.final ? `**** **** **** ${c.final}` : 'Cartão')
        );
        const titular = c.titular ? ` (${escaparHtmlCheckoutSR(c.titular)})` : '';
        return `<option value="${idx}">${rotulo} - ${numero}${titular}</option>`;
    }).join('');
}

function atualizarVisibilidadeCartaoCheckout() {
    const boxCartao = document.getElementById('selecao-cartao-checkout');
    if (!boxCartao) return;

    const metodoSelecionado = document.querySelector('input[name="payment-group"]:checked')?.value || 'pix';
    const precisaCartao = metodoSelecionado === 'debito' || metodoSelecionado === 'parcelado';
    boxCartao.style.display = precisaCartao ? 'block' : 'none';
}

function injetarSelecaoCartoes(cartoesSalvos) {
    const fieldsetPagamento = document.querySelector('.payment-methods');
    if (!fieldsetPagamento) return;

    let boxCartao = document.getElementById('selecao-cartao-checkout');
    if (!boxCartao) {
        boxCartao = document.createElement('div');
        boxCartao.id = 'selecao-cartao-checkout';
        boxCartao.style.cssText = 'display: none; width: 100%; max-width: 350px; margin-top: 8px; padding: 12px; background: #151515; border: 1px solid #C62828; border-radius: 12px; text-align: left; font-size: 14px;';
        fieldsetPagamento.appendChild(boxCartao);
    }

    if (cartoesSalvos.length > 0) {
        boxCartao.innerHTML = `
            <label for="select-cartao-uso" style="display:block; margin-bottom:6px; color:#ffca28; font-weight:bold;">Escolha o cartão:</label>
            <select id="select-cartao-uso" style="width:100%; height:38px; margin:0; padding:4px 10px; font-size:14px; border-radius:8px; background:#222; color:#fff; border:1px solid #C62828; cursor:pointer;">
                ${montarHtmlOpcoesCartoes(cartoesSalvos)}
            </select>
        `;
    } else {
        boxCartao.innerHTML = `
            <p style="color:#ffaa00; margin:0 0 8px 0;">Nenhum cartão cadastrado na sua conta.</p>
            <a href="cadastrocartao.html" style="color:#ff4d4d; font-weight:bold; text-decoration:underline;">+ Cadastrar cartão agora</a>
        `;
    }

    atualizarVisibilidadeCartaoCheckout();
}

function configurarSincronizacaoMetodosPagamento() {
    const radiosPagamento = document.querySelectorAll('input[name="payment-group"]');
    radiosPagamento.forEach((radio) => {
        if (radio.dataset.srCheckoutSync === 'true') return;
        radio.dataset.srCheckoutSync = 'true';
        radio.addEventListener('change', atualizarVisibilidadeCartaoCheckout);
    });
}

function injetarEnderecoAutomatico(formEndereco, cartoesSalvos) {
    const inputRua = document.getElementById('input-rua');
    const inputEstado = document.getElementById('input-estado');
    const inputCidade = document.getElementById('input-cidade');
    const primeiroGrupo = formEndereco.querySelector('.form-group');
    if (!inputRua || !primeiroGrupo) return;

    if (inputEstado && inputEstado.dataset.srUfBound !== 'true') {
        inputEstado.dataset.srUfBound = 'true';
        inputEstado.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 2);
        });
    }

    const cartaoComEndereco = cartoesSalvos.find((c) => c.endereco && c.endereco.trim() !== '');
    if (cartaoComEndereco && !document.getElementById('btn-usar-endereco-cartao')) {
        const btnEndereco = document.createElement('button');
        btnEndereco.type = 'button';
        btnEndereco.id = 'btn-usar-endereco-cartao';
        btnEndereco.textContent = '📍 Usar endereço do cartão cadastrado';
        btnEndereco.style.cssText = 'width: 100%; margin-bottom: 12px; padding: 9px 12px; background-color: #1e1e1e; color: #ffca28; border: 1px solid #ffca28; border-radius: 10px; font-weight: bold; cursor: pointer; transition: 0.2s;';

        btnEndereco.addEventListener('mouseenter', () => {
            btnEndereco.style.backgroundColor = '#2a2410';
        });
        btnEndereco.addEventListener('mouseleave', () => {
            btnEndereco.style.backgroundColor = '#1e1e1e';
        });

        btnEndereco.addEventListener('click', () => {
            const listaAtual = lerCartoesCheckout();
            const selectCartao = document.getElementById('select-cartao-uso');
            const idx = selectCartao ? parseInt(selectCartao.value, 10) : 0;
            const cartaoAlvo = listaAtual[idx] || listaAtual.find((c) => c.endereco && c.endereco.trim() !== '');

            if (cartaoAlvo && cartaoAlvo.endereco) {
                const partes = cartaoAlvo.endereco.split(',').map((p) => p.trim()).filter(Boolean);
                inputRua.value = partes[0] || cartaoAlvo.endereco;
                if (partes[1] && inputCidade) inputCidade.value = partes[1];
                if (partes[2] && inputEstado) inputEstado.value = partes[2].toUpperCase().slice(0, 2);

                const statusEl = document.getElementById('status-cep');
                if (statusEl) {
                    statusEl.style.color = '#00e676';
                    statusEl.textContent = '✔ Endereço importado do cartão!';
                }
            }
        });

        formEndereco.insertBefore(btnEndereco, primeiroGrupo);
    }

    if (!document.getElementById('input-cep')) {
        const grupoCep = document.createElement('div');
        grupoCep.className = 'form-group';
        grupoCep.innerHTML = `
            <label for="input-cep">CEP:</label>
            <div style="width: 100%;">
                <input type="text" id="input-cep" maxlength="9" inputmode="numeric" placeholder="Ex: 89201-000">
                <small id="status-cep" style="display:block; font-size:12px; margin-top:4px; color:#bbb;"></small>
            </div>
        `;
        formEndereco.insertBefore(grupoCep, primeiroGrupo);

        const inputCep = document.getElementById('input-cep');
        const statusCep = document.getElementById('status-cep');
        let ultimoCepConsultado = '';

        inputCep.addEventListener('input', async (e) => {
            const cepLimpo = e.target.value.replace(/\D/g, '').slice(0, 8);
            e.target.value = cepLimpo.length > 5
                ? `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`
                : cepLimpo;

            if (cepLimpo.length < 8) {
                statusCep.style.color = '#bbb';
                statusCep.textContent = cepLimpo.length > 0 ? 'Digite os 8 dígitos do CEP...' : '';
                return;
            }

            if (cepLimpo === ultimoCepConsultado) return;
            ultimoCepConsultado = cepLimpo;

            statusCep.style.color = '#ffca28';
            statusCep.textContent = 'Buscando CEP...';

            try {
                const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                if (!resp.ok) throw new Error('Falha na resposta do CEP');

                const dados = await resp.json();
                if (dados.erro) {
                    statusCep.style.color = '#ff4d4d';
                    statusCep.textContent = 'CEP não encontrado.';
                } else {
                    inputRua.value = dados.logradouro ? `${dados.logradouro}, ` : '';
                    if (inputCidade) inputCidade.value = dados.localidade || '';
                    if (inputEstado) inputEstado.value = (dados.uf || '').toUpperCase();
                    statusCep.style.color = '#00e676';
                    statusCep.textContent = '✔ Endereço encontrado! Informe o número.';
                    inputRua.focus();
                }
            } catch {
                statusCep.style.color = '#ff4d4d';
                statusCep.textContent = 'Erro ao consultar o CEP.';
            }
        });
    }
}

function configurarFechamentoModalPagamento() {
    const telaPagamento = document.getElementById('tela-pagamento');
    if (!telaPagamento || telaPagamento.dataset.srModalBound === 'true') return;
    telaPagamento.dataset.srModalBound = 'true';

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.location.hash === '#tela-pagamento') {
            window.location.hash = '';
        }
    });

    telaPagamento.addEventListener('click', (e) => {
        if (e.target === telaPagamento) {
            window.location.hash = '';
        }
    });
}

window.atualizarCartoesCheckoutSR = function () {
    const formEndereco = document.querySelector('.address-column');
    if (!formEndereco) return;
    const cartoes = lerCartoesCheckout();
    injetarSelecaoCartoes(cartoes);
    injetarEnderecoAutomatico(formEndereco, cartoes);
};