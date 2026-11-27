/* modais-globais.js */
(function () {
    function garantirEstilosModalGlobal() {
        if (document.getElementById('estilos-sr-modal-global')) return;

        const style = document.createElement('style');
        style.id = 'estilos-sr-modal-global';
        style.textContent = `
            dialog#sr-modal-global {
                background: #141414;
                color: #ffffff;
                border: 2px solid #C62828;
                border-radius: 16px;
                padding: 24px 28px;
                max-width: 430px;
                width: 90%;
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.85);
                text-align: center;
            }
            dialog#sr-modal-global::backdrop {
                background: rgba(0, 0, 0, 0.78);
                backdrop-filter: blur(2px);
            }
            #sr-modal-titulo {
                margin: 0 0 10px 0;
                font-size: 22px;
                color: #ffca28;
            }
            #sr-modal-mensagem {
                margin: 0 0 20px 0;
                font-size: 15px;
                line-height: 1.45;
                color: #f0f0f0;
            }
            .sr-modal-acoes {
                display: flex;
                justify-content: center;
                gap: 12px;
                flex-wrap: wrap;
            }
            #sr-modal-global button {
                padding: 9px 20px;
                border-radius: 10px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.15s ease, background-color 0.2s ease, opacity 0.2s ease;
            }
            #sr-modal-global button:hover {
                transform: translateY(-1px);
            }
            #sr-btn-ok,
            #sr-btn-confirmar {
                background: #C62828;
                color: #ffffff;
                border: 1px solid #C62828;
            }
            #sr-btn-ok:hover,
            #sr-btn-confirmar:hover {
                background: #9e1e1e;
            }
            #sr-btn-cancelar {
                background: #242424;
                color: #e0e0e0;
                border: 1px solid #555555;
            }
            #sr-btn-cancelar:hover {
                background: #333333;
            }
            #sr-toast-global {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%) translateY(16px);
                background: #1a1a1a;
                color: #ffffff;
                border: 1px solid #C62828;
                border-radius: 14px;
                padding: 10px 20px;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.75);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.25s ease, transform 0.25s ease;
                z-index: 1000000;
            }
            #sr-toast-global.visivel {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    function garantirModalGlobal() {
        garantirEstilosModalGlobal();

        let dialog = document.getElementById('sr-modal-global');
        if (dialog) return dialog;

        dialog = document.createElement('dialog');
        dialog.id = 'sr-modal-global';
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'sr-modal-titulo');

        dialog.innerHTML = `
            <h2 id="sr-modal-titulo">- Shadow Realm Store -</h2>
            <p id="sr-modal-mensagem"></p>
            <div class="sr-modal-acoes" id="sr-modal-acoes"></div>
        `;

        document.body.appendChild(dialog);

        dialog.addEventListener('cancel', (e) => {
            e.preventDefault();
            dialog.close();
        });

        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.close();
            }
        });

        return dialog;
    }

    function escapeHTMLModalGlobal(texto) {
        return String(texto ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function abrirAlerta(mensagem, titulo = '- Shadow Realm Store -', isHTML = false, aoFechar = null) {
        const dialog = garantirModalGlobal();
        const tituloEl = document.getElementById('sr-modal-titulo');
        const msgEl = document.getElementById('sr-modal-mensagem');
        const acoesEl = document.getElementById('sr-modal-acoes');

        if (tituloEl) tituloEl.textContent = titulo;
        if (msgEl) {
            if (isHTML) {
                msgEl.innerHTML = mensagem;
            } else {
                msgEl.textContent = mensagem;
            }
        }

        if (acoesEl) {
            acoesEl.innerHTML = '';
            const btnOk = document.createElement('button');
            btnOk.type = 'button';
            btnOk.id = 'sr-btn-ok';
            btnOk.textContent = 'OK';

            let disparado = false;
            const finalizar = () => {
                if (disparado) return;
                disparado = true;
                if (dialog.open) dialog.close();
                if (typeof aoFechar === 'function') aoFechar();
            };

            btnOk.addEventListener('click', finalizar);
            dialog.addEventListener('close', finalizar, { once: true });
            acoesEl.appendChild(btnOk);
        }

        if (dialog.open) {
            dialog.close();
        }
        dialog.showModal();
    }

    function abrirConfirmacao(mensagem, aoConfirmar, titulo = '- Confirmação -', isHTML = false) {
        const dialog = garantirModalGlobal();
        const tituloEl = document.getElementById('sr-modal-titulo');
        const msgEl = document.getElementById('sr-modal-mensagem');
        const acoesEl = document.getElementById('sr-modal-acoes');

        if (tituloEl) tituloEl.textContent = titulo;
        if (msgEl) {
            if (isHTML) {
                msgEl.innerHTML = mensagem;
            } else {
                msgEl.textContent = mensagem;
            }
        }

        if (acoesEl) {
            acoesEl.innerHTML = '';

            const btnCancelar = document.createElement('button');
            btnCancelar.type = 'button';
            btnCancelar.id = 'sr-btn-cancelar';
            btnCancelar.className = 'sr-btn-cancelar';
            btnCancelar.textContent = 'Cancelar';
            btnCancelar.addEventListener('click', () => {
                dialog.close();
            });

            const btnConfirmar = document.createElement('button');
            btnConfirmar.type = 'button';
            btnConfirmar.id = 'sr-btn-confirmar';
            btnConfirmar.textContent = 'Confirmar';
            btnConfirmar.addEventListener('click', () => {
                dialog.close();
                if (typeof aoConfirmar === 'function') {
                    aoConfirmar();
                }
            });

            acoesEl.appendChild(btnCancelar);
            acoesEl.appendChild(btnConfirmar);
        }

        if (dialog.open) {
            dialog.close();
        }
        dialog.showModal();
    }

    function mostrarToast(mensagem) {
        garantirEstilosModalGlobal();
        let toast = document.getElementById('sr-toast-global');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'sr-toast-global';
            document.body.appendChild(toast);
        }
        toast.textContent = escapeHTMLModalGlobal(mensagem);
        toast.classList.add('visivel');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('visivel'), 2800);
    }

    window.srModal = {
        alerta: abrirAlerta,
        confirmar: abrirConfirmacao,
        toast: mostrarToast
    };
})();