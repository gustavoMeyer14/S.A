function iniciarContaShadowRealm() {
    injetarEstilosConta();
    injetarEditarPerfilNoMenu();
    injetarForcaSenhaCadastro();
    injetarEsqueciSenhaLogin();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarContaShadowRealm);
} else {
    iniciarContaShadowRealm();
}

function injetarEstilosConta() {
    if (document.getElementById('estilos-conta-sr')) return;
    const style = document.createElement('style');
    style.id = 'estilos-conta-sr';
    style.textContent = `
        .forca-senha-wrapper {
            width: 80%;
            margin: 3px auto 2px auto;
            text-align: left;
            line-height: 1.1;
        }
        .forca-senha-barra-bg {
            width: 100%;
            height: 4px;
            background: #2b2b2b;
            border-radius: 4px;
            overflow: hidden;
        }
        .forca-senha-barra-fill {
            height: 100%;
            width: 0%;
            transition: width 0.25s ease, background-color 0.25s ease;
        }
        .forca-senha-texto {
            display: block;
            font-size: 11px;
            margin-top: 2px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        form[name="frmcadastro"].formLogin {
            height: auto !important;
            min-height: 360px;
            padding-bottom: 15px;
        }
        dialog.modal-conta-sr[open] {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            margin: 0 !important;
            background: #1a1a1a;
            color: #fff;
            border: 2px solid #b82929;
            border-radius: 15px;
            padding: 25px;
            max-width: 440px;
            width: 92%;
            z-index: 9999;
        }
        dialog.modal-conta-sr::backdrop {
            background: rgba(0, 0, 0, 0.78);
        }
        .modal-conta-sr h2 {
            text-align: center;
            color: #ffca28;
            margin-bottom: 15px;
            font-size: 22px;
        }
        .modal-conta-sr label {
            display: block;
            text-align: left;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0 4px 0;
            color: #eee;
        }
        .modal-conta-sr input {
            width: 100% !important;
            box-sizing: border-box;
            padding: 10px !important;
            margin: 0 !important;
            border-radius: 8px !important;
            border: 1px solid #b82929 !important;
            background: #121212 !important;
            color: #fff !important;
        }
        .modal-conta-sr .forca-senha-wrapper {
            width: 100%;
            margin: 5px 0 6px 0;
        }
        .modal-conta-acoes {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 18px;
        }
        .btn-conta-primario {
            background: #b82929 !important;
            color: #fff !important;
            border: none !important;
            padding: 9px 16px !important;
            border-radius: 8px !important;
            font-weight: bold;
            cursor: pointer;
            width: auto !important;
            height: auto !important;
        }
        .btn-conta-secundario {
            background: #333 !important;
            color: #fff !important;
            border: 1px solid #555 !important;
            padding: 9px 16px !important;
            border-radius: 8px !important;
            cursor: pointer;
            width: auto !important;
            height: auto !important;
        }
    `;
    document.head.appendChild(style);
}

function lerUsuariosCadastrados() {
    const chavesPossiveis = ['usuariosShadowRealm', 'clientesShadowRealm', 'usuarios', 'clientes'];
    for (const chave of chavesPossiveis) {
        try {
            const dados = JSON.parse(localStorage.getItem(chave));
            if (Array.isArray(dados) && dados.length > 0) {
                return { chave, lista: dados };
            }
        } catch {}
    }
    return { chave: 'usuariosShadowRealm', lista: [] };
}

function obterPerfilLogado() {
    const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
    const emailAtual = (localStorage.getItem('usuarioAtual') || '').trim();
    if (!estaLogado && !emailAtual) return null;

    const { lista } = lerUsuariosCadastrados();
    const encontrado = lista.find(u =>
        u.email && u.email.toLowerCase() === emailAtual.toLowerCase()
    );

    let clienteObj = {};
    try {
        clienteObj = JSON.parse(localStorage.getItem('clienteLogado')) || {};
    } catch {}

    return {
        nome: encontrado?.nome || clienteObj.nome || localStorage.getItem('usuarioNome') || (emailAtual.includes('@') ? emailAtual.split('@')[0] : emailAtual),
        email: encontrado?.email || clienteObj.email || emailAtual,
        cpf: encontrado?.cpf || clienteObj.cpf || '',
        senha: encontrado?.senha || clienteObj.senha || ''
    };
}

function formatarCampoCpf(valor) {
    const v = String(valor || '').replace(/\D/g, '').slice(0, 11);
    return v
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function anexarMedidorForcaSenha(inputSenha) {
    if (!inputSenha || inputSenha.dataset.medidorAtivo === 'true') return;
    inputSenha.dataset.medidorAtivo = 'true';

    const wrapper = document.createElement('div');
    wrapper.className = 'forca-senha-wrapper';
    wrapper.innerHTML = `
        <div class="forca-senha-barra-bg">
            <div class="forca-senha-barra-fill"></div>
        </div>
        <small class="forca-senha-texto" style="color:#888;">Força da senha</small>
    `;

    const containerPai = inputSenha.parentElement;
    containerPai.insertAdjacentElement('afterend', wrapper);

    const fill = wrapper.querySelector('.forca-senha-barra-fill');
    const texto = wrapper.querySelector('.forca-senha-texto');

    inputSenha.addEventListener('input', () => {
        const val = inputSenha.value;
        if (!val) {
            fill.style.width = '0%';
            fill.style.backgroundColor = '';
            texto.style.color = '#888';
            texto.textContent = 'Força da senha';
            return;
        }

        let pontos = 0;
        if (val.length >= 8) pontos++;
        if (val.length >= 10) pontos++;
        if (/[A-Z]/.test(val)) pontos++;
        if (/[0-9]/.test(val)) pontos++;
        if (/[^A-Za-z0-9]/.test(val)) pontos++;

        if (pontos <= 2) {
            fill.style.width = '33%';
            fill.style.backgroundColor = '#ff4d4d';
            texto.style.color = '#ff4d4d';
            texto.textContent = 'Senha fraca (mín. 8 chars com letras e números)';
        } else if (pontos <= 4) {
            fill.style.width = '68%';
            fill.style.backgroundColor = '#ffca28';
            texto.style.color = '#ffca28';
            texto.textContent = 'Senha média';
        } else {
            fill.style.width = '100%';
            fill.style.backgroundColor = '#00e676';
            texto.style.color = '#00e676';
            texto.textContent = 'Senha forte ✔';
        }
    });
}

function injetarForcaSenhaCadastro() {
    const formCadastro = document.querySelector('form[name="frmcadastro"]');
    if (!formCadastro) return;
    const inputSenha = formCadastro.querySelector('#senha');
    anexarMedidorForcaSenha(inputSenha);
}

function injetarEsqueciSenhaLogin() {
    const formLogin = document.querySelector('form[name="frmlogin"]');
    if (!formLogin || document.getElementById('link-esqueci-senha')) return;

    const inputSenhaLogin = formLogin.querySelector('#senha');
    const containerSenha = inputSenhaLogin ? inputSenhaLogin.parentElement : null;

    const linkRecuperar = document.createElement('a');
    linkRecuperar.href = '#';
    linkRecuperar.id = 'link-esqueci-senha';
    linkRecuperar.textContent = 'Esqueci minha senha';
    linkRecuperar.style.cssText = 'display: inline-block; margin-top: 8px; color: #ffca28; font-size: 13px; text-decoration: underline; cursor: pointer;';

    if (containerSenha) {
        containerSenha.insertAdjacentElement('afterend', linkRecuperar);
    } else {
        formLogin.appendChild(linkRecuperar);
    }

    const dialogRec = document.createElement('dialog');
    dialogRec.id = 'modalEsqueciSenhaSR';
    dialogRec.className = 'modal-conta-sr';
    dialogRec.innerHTML = `
        <h2>🔑 Recuperar Senha</h2>
        <p style="font-size:13px; color:#ccc; text-align:center; margin-bottom:10px;">
            Informe o e-mail da sua conta para definir uma nova senha.
        </p>
        <form id="formRecuperarSenhaSR">
            <label for="rec-email">E-mail cadastrado:</label>
            <input type="email" id="rec-email" placeholder="seuemail@exemplo.com" required>

            <label for="rec-nova-senha">Nova senha (mín. 8 caracteres, letras e números):</label>
            <div style="position:relative;">
                <input type="password" id="rec-nova-senha" placeholder="Digite a nova senha" required>
            </div>

            <label for="rec-confirma-senha">Confirmar nova senha:</label>
            <input type="password" id="rec-confirma-senha" placeholder="Repita a nova senha" required>

            <small id="msg-recuperar-senha" style="display:block; margin-top:8px; font-weight:bold;"></small>

            <div class="modal-conta-acoes">
                <button type="button" class="btn-conta-secundario" id="btnFecharRecSenha">Cancelar</button>
                <button type="submit" class="btn-conta-primario">Salvar Nova Senha</button>
            </div>
        </form>
    `;
    document.body.appendChild(dialogRec);

    const inputNovaSenhaRec = dialogRec.querySelector('#rec-nova-senha');
    anexarMedidorForcaSenha(inputNovaSenhaRec);

    linkRecuperar.addEventListener('click', (e) => {
        e.preventDefault();
        const emailDigitado = formLogin.querySelector('#email')?.value.trim() || '';
        dialogRec.querySelector('#rec-email').value = emailDigitado;
        dialogRec.querySelector('#rec-nova-senha').value = '';
        dialogRec.querySelector('#rec-confirma-senha').value = '';
        dialogRec.querySelector('#msg-recuperar-senha').textContent = '';
        dialogRec.showModal();
    });

    dialogRec.querySelector('#btnFecharRecSenha').addEventListener('click', () => {
        dialogRec.close();
    });

    dialogRec.querySelector('#formRecuperarSenhaSR').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = dialogRec.querySelector('#rec-email').value.trim().toLowerCase();
        const novaSenha = dialogRec.querySelector('#rec-nova-senha').value;
        const confirmaSenha = dialogRec.querySelector('#rec-confirma-senha').value;
        const msgEl = dialogRec.querySelector('#msg-recuperar-senha');

        const expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!expRegsenha.test(novaSenha)) {
            msgEl.style.color = '#ff4d4d';
            msgEl.textContent = 'A nova senha deve ter no mínimo 8 caracteres, com letras e números.';
            return;
        }
        if (novaSenha !== confirmaSenha) {
            msgEl.style.color = '#ff4d4d';
            msgEl.textContent = 'As senhas não coincidem.';
            return;
        }

        const { chave, lista } = lerUsuariosCadastrados();
        let idx = lista.findIndex(u => u.email && u.email.toLowerCase() === email);

        if (idx === -1) {
            try {
                const resp = await fetch('clientes.json');
                if (resp.ok) {
                    const clientesJSON = await resp.json();
                    const clienteBase = Array.isArray(clientesJSON)
                        ? clientesJSON.find(u => u.email && u.email.toLowerCase() === email)
                        : null;
                    if (clienteBase) {
                        lista.push({ ...clienteBase, senha: novaSenha });
                        idx = lista.length - 1;
                    }
                }
            } catch {}
        }

        if (idx === -1) {
            msgEl.style.color = '#ff4d4d';
            msgEl.textContent = 'Nenhuma conta encontrada com este e-mail.';
            return;
        }

        lista[idx].senha = novaSenha;
        localStorage.setItem(chave, JSON.stringify(lista));

        msgEl.style.color = '#00e676';
        msgEl.textContent = '✔ Senha alterada com sucesso! Já pode fazer login.';

        setTimeout(() => {
            dialogRec.close();
            const campoEmailLogin = formLogin.querySelector('#email');
            const campoSenhaLogin = formLogin.querySelector('#senha');
            if (campoEmailLogin) campoEmailLogin.value = email;
            if (campoSenhaLogin) campoSenhaLogin.value = '';
        }, 1200);
    });
}

function injetarEditarPerfilNoMenu() {
    const navUsuario = document.querySelector('#modalCliente .nav-usuario');
    const perfil = obterPerfilLogado();
    if (!navUsuario || !perfil || document.getElementById('link-editar-perfil')) return;

    const linkEditar = document.createElement('a');
    linkEditar.href = '#';
    linkEditar.id = 'link-editar-perfil';
    linkEditar.textContent = '✏️ Editar Perfil';
    linkEditar.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof fechaModalCliente === 'function') fechaModalCliente();
        abrirModalEditarPerfil();
    });

    const linkSair = Array.from(navUsuario.querySelectorAll('a')).find(a => a.textContent.trim().toLowerCase() === 'sair');
    if (linkSair) navUsuario.insertBefore(linkEditar, linkSair);
    else navUsuario.appendChild(linkEditar);

    if (!document.getElementById('modalEditarPerfilSR')) {
        const dialogPerfil = document.createElement('dialog');
        dialogPerfil.id = 'modalEditarPerfilSR';
        dialogPerfil.className = 'modal-conta-sr';
        dialogPerfil.innerHTML = `
            <h2>✏️ Editar Meu Perfil</h2>
            <form id="formEditarPerfilSR">
                <label for="edit-perfil-nome">Nome Completo:</label>
                <input type="text" id="edit-perfil-nome" required>

                <label for="edit-perfil-email">E-mail:</label>
                <input type="email" id="edit-perfil-email" required>

                <label for="edit-perfil-cpf">CPF:</label>
                <input type="text" id="edit-perfil-cpf" maxlength="14" placeholder="000.000.000-00">

                <label for="edit-perfil-senha">Nova Senha (deixe em branco para manter a atual):</label>
                <div style="position:relative;">
                    <input type="password" id="edit-perfil-senha" placeholder="••••••••">
                </div>

                <small id="msg-editar-perfil" style="display:block; margin-top:8px; font-weight:bold;"></small>

                <div class="modal-conta-acoes">
                    <button type="button" class="btn-conta-secundario" id="btnFecharEditarPerfil">Cancelar</button>
                    <button type="submit" class="btn-conta-primario">Salvar Alterações</button>
                </div>
            </form>
        `;
        document.body.appendChild(dialogPerfil);

        const inputCpfEdit = dialogPerfil.querySelector('#edit-perfil-cpf');
        if (inputCpfEdit) {
            inputCpfEdit.addEventListener('input', (e) => {
                e.target.value = formatarCampoCpf(e.target.value);
            });
        }

        anexarMedidorForcaSenha(dialogPerfil.querySelector('#edit-perfil-senha'));

        dialogPerfil.querySelector('#btnFecharEditarPerfil').addEventListener('click', () => {
            dialogPerfil.close();
        });

        dialogPerfil.querySelector('#formEditarPerfilSR').addEventListener('submit', (e) => {
            e.preventDefault();
            const atual = obterPerfilLogado();
            if (!atual) return;

            const novoNome = dialogPerfil.querySelector('#edit-perfil-nome').value.trim();
            const novoEmail = dialogPerfil.querySelector('#edit-perfil-email').value.trim().toLowerCase();
            const novoCpf = formatarCampoCpf(dialogPerfil.querySelector('#edit-perfil-cpf').value.trim());
            const novaSenha = dialogPerfil.querySelector('#edit-perfil-senha').value;
            const msgEl = dialogPerfil.querySelector('#msg-editar-perfil');

            if (!novoNome || !/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/.test(novoEmail)) {
                msgEl.style.color = '#ff4d4d';
                msgEl.textContent = 'Preencha o nome e um e-mail válido.';
                return;
            }

            if (novaSenha && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(novaSenha)) {
                msgEl.style.color = '#ff4d4d';
                msgEl.textContent = 'A nova senha deve ter no mínimo 8 caracteres, com letras e números.';
                return;
            }

            const { chave, lista } = lerUsuariosCadastrados();
            const idx = lista.findIndex(u =>
                u.email && u.email.toLowerCase() === atual.email.toLowerCase()
            );

            const registroAtualizado = {
                ...(idx >= 0 ? lista[idx] : {}),
                nome: novoNome,
                email: novoEmail,
                cpf: novoCpf,
                senha: novaSenha ? novaSenha : (idx >= 0 ? lista[idx].senha : atual.senha)
            };

            if (idx >= 0) {
                lista[idx] = registroAtualizado;
            } else {
                lista.push(registroAtualizado);
            }

            localStorage.setItem(chave, JSON.stringify(lista));
            localStorage.setItem('usuarioAtual', novoEmail);
            localStorage.setItem('usuarioNome', novoNome);
            localStorage.setItem('clienteLogado', JSON.stringify(registroAtualizado));

            if (atual.email && atual.email.toLowerCase() !== novoEmail) {
                const cartoesAntigos = localStorage.getItem(`cartoesShadowRealm_${atual.email.toLowerCase()}`);
                if (cartoesAntigos) {
                    localStorage.setItem(`cartoesShadowRealm_${novoEmail}`, cartoesAntigos);
                }
            }

            msgEl.style.color = '#00e676';
            msgEl.textContent = '✔ Perfil atualizado com sucesso!';

            setTimeout(() => {
                dialogPerfil.close();
                window.location.reload();
            }, 900);
        });
    }
}

window.abrirModalEditarPerfil = function () {
    const dialog = document.getElementById('modalEditarPerfilSR');
    const perfil = obterPerfilLogado();
    if (!dialog || !perfil) return;

    dialog.querySelector('#edit-perfil-nome').value = perfil.nome || '';
    dialog.querySelector('#edit-perfil-email').value = perfil.email || '';
    dialog.querySelector('#edit-perfil-cpf').value = formatarCampoCpf(perfil.cpf || '');
    dialog.querySelector('#edit-perfil-senha').value = '';
    dialog.querySelector('#msg-editar-perfil').textContent = '';
    dialog.showModal();
};