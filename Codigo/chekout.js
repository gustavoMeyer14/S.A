document.addEventListener('DOMContentLoaded', () => {
    const formEndereco = document.querySelector('.address-column');
    if (!formEndereco) return;

    const usuarioAtual = (localStorage.getItem('usuarioAtual') || '').trim().toLowerCase();
    const chaveUsuario = usuarioAtual ? `cartoesShadowRealm_${usuarioAtual}` : 'cartoesShadowRealm';
    const cartoesSalvos = JSON.parse(localStorage.getItem(chaveUsuario))
        || JSON.parse(localStorage.getItem('cartoesShadowRealm'))
        || [];

    injetarSelecaoCartoes(cartoesSalvos);
    injetarEnderecoAutomatico(formEndereco, cartoesSalvos);
    configurarFechamentoModalPagamento();
});

function injetarSelecaoCartoes(cartoesSalvos) {
    const radiosPagamento = document.querySelectorAll('input[name="payment-group"]');
    const fieldsetPagamento = document.querySelector('.payment-methods');
    if (!fieldsetPagamento || document.getElementById('selecao-cartao-checkout')) return;

    const boxCartao = document.createElement('div');
    boxCartao.id = 'selecao-cartao-checkout';
    boxCartao.style.cssText = 'display: none; width: 100%; max-width: 350px; margin-top: 6px; padding: 10px; background: #151515; border: 1px solid #C62828; border-radius: 10px; text-align: left; font-size: 14px;';

    if (cartoesSalvos.length > 0) {
        const opcoes = cartoesSalvos.map((c, idx) =>
            `<option value="${idx}">${idx === 0 ? 'Principal' : 'Secundário'} - ${c.numeroMascarado} (${c.titular})</option>`
        ).join('');

        boxCartao.innerHTML = `
            <label for="select-cartao-uso" style="display:block; margin-bottom:5px; color:#ffca28; font-weight:bold;">Escolha o cartão:</label>
            <select id="select-cartao-uso" style="width:100%; height:36px; margin:0; padding:4px 8px; font-size:14px; border-radius:8px; background:#222; color:#fff; border:1px solid #C62828;">
                ${opcoes}
            </select>
        `;
    } else {
        boxCartao.innerHTML = `
            <p style="color:#ffaa00; margin-bottom:6px;">Nenhum cartão cadastrado.</p>
            <a href="cadastrocartao.html" style="color:#ff4d4d; font-weight:bold; text-decoration:underline;">+ Cadastrar cartão agora</a>
        `;
    }

    fieldsetPagamento.appendChild(boxCartao);

    radiosPagamento.forEach(radio => {
        radio.addEventListener('change', () => {
            boxCartao.style.display = (radio.value === 'debito' || radio.value === 'parcelado')
                ? 'block'
                : 'none';
        });
    });
}

function injetarEnderecoAutomatico(formEndereco, cartoesSalvos) {
    const inputRua = document.getElementById('input-rua');
    const inputEstado = document.getElementById('input-estado');
    const inputCidade = document.getElementById('input-cidade');
    const primeiroGrupo = formEndereco.querySelector('.form-group');
    if (!inputRua || !primeiroGrupo || document.getElementById('input-cep')) return;

    const cartaoComEndereco = cartoesSalvos.find(c => c.endereco && c.endereco.trim() !== '');
    if (cartaoComEndereco) {
        const btnEndereco = document.createElement('button');
        btnEndereco.type = 'button';
        btnEndereco.id = 'btn-usar-endereco-cartao';
        btnEndereco.textContent = '📍 Usar endereço do cartão cadastrado';
        btnEndereco.style.cssText = 'width: 100%; margin-bottom: 10px; padding: 8px; background-color: #1e1e1e; color: #ffca28; border: 1px solid #ffca28; border-radius: 10px; font-weight: bold; cursor: pointer;';

        btnEndereco.addEventListener('click', () => {
            const selectCartao = document.getElementById('select-cartao-uso');
            const idx = selectCartao ? parseInt(selectCartao.value, 10) : 0;
            const cartaoAlvo = cartoesSalvos[idx] || cartaoComEndereco;

            if (cartaoAlvo && cartaoAlvo.endereco) {
                const partes = cartaoAlvo.endereco.split(',').map(p => p.trim());
                inputRua.value = partes[0] || cartaoAlvo.endereco;
                if (partes[1] && inputCidade) inputCidade.value = partes[1];
                if (partes[2] && inputEstado) inputEstado.value = partes[2];
                const statusEl = document.getElementById('status-cep');
                if (statusEl) {
                    statusEl.style.color = '#00e676';
                    statusEl.textContent = '✔ Endereço importado do cartão!';
                }
            }
        });

        formEndereco.insertBefore(btnEndereco, primeiroGrupo);
    }

    const grupoCep = document.createElement('div');
    grupoCep.className = 'form-group';
    grupoCep.innerHTML = `
        <label for="input-cep">CEP:</label>
        <div>
            <input type="text" id="input-cep" maxlength="9" placeholder="Ex: 89201-000">
            <small id="status-cep" style="display:block; font-size:12px; margin-top:3px; color:#bbb;"></small>
        </div>
    `;
    formEndereco.insertBefore(grupoCep, primeiroGrupo);

    const inputCep = document.getElementById('input-cep');
    const statusCep = document.getElementById('status-cep');

    inputCep.addEventListener('input', async (e) => {
        let cepLimpo = e.target.value.replace(/\D/g, '');
        e.target.value = cepLimpo.length > 5
            ? `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5, 8)}`
            : cepLimpo;

        if (cepLimpo.length === 8) {
            statusCep.style.color = '#ffca28';
            statusCep.textContent = 'Buscando CEP...';
            try {
                const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                const dados = await resp.json();
                if (dados.erro) {
                    statusCep.style.color = '#ff4d4d';
                    statusCep.textContent = 'CEP não encontrado.';
                } else {
                    inputRua.value = dados.logradouro ? `${dados.logradouro}, ` : '';
                    if (inputCidade) inputCidade.value = dados.localidade || '';
                    if (inputEstado) inputEstado.value = dados.uf || '';
                    statusCep.style.color = '#00e676';
                    statusCep.textContent = '✔ Endereço encontrado! Informe o número.';
                    inputRua.focus();
                }
            } catch {
                statusCep.style.color = '#ff4d4d';
                statusCep.textContent = 'Erro ao consultar o CEP.';
            }
        }
    });
}

function configurarFechamentoModalPagamento() {
    const telaPagamento = document.getElementById('tela-pagamento');
    if (!telaPagamento) return;

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