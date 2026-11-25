// =========================================================
// SISTEMA GLOBAL DE MODAIS (SUBSTITUI TODOS OS ALERT() DO JS)
// =========================================================

(function () {
    function garantirModalGlobal() {
        let dialog = document.getElementById('sr-modal-global');
        if (!dialog) {
            dialog = document.createElement('dialog');
            dialog.id = 'sr-modal-global';
            dialog.innerHTML = `
                <h3 id="sr-modal-titulo">- Aviso -</h3>
                <div id="sr-modal-mensagem"></div>
                <div class="sr-modal-acoes" id="sr-modal-acoes"></div>
            `;
            document.body.appendChild(dialog);

            dialog.addEventListener('click', (e) => {
                const rect = dialog.getBoundingClientRect();
                const fora =
                    e.clientX < rect.left ||
                    e.clientX > rect.right ||
                    e.clientY < rect.top ||
                    e.clientY > rect.bottom;
                if (fora) dialog.close();
            });
        }
        return dialog;
    }

    function formatarConteudo(mensagem, isHTML) {
        const texto = String(mensagem);
        if (isHTML || /<[a-z][\s\S]*>/i.test(texto)) {
            return texto;
        }
        return texto.replace(/\n/g, '<br>');
    }

    function abrirAlerta(mensagem, titulo = '- Shadow Realm Store -', isHTML = false) {
        const dialog = garantirModalGlobal();
        document.getElementById('sr-modal-titulo').textContent = titulo;
        document.getElementById('sr-modal-mensagem').innerHTML = formatarConteudo(mensagem, isHTML);

        const acoes = document.getElementById('sr-modal-acoes');
        acoes.innerHTML = `<button type="button" class="sr-btn-primario" id="sr-btn-ok">Entendi</button>`;
        document.getElementById('sr-btn-ok').onclick = () => dialog.close();

        if (dialog.open) dialog.close();
        dialog.showModal();
    }

    function abrirConfirmacao(mensagem, aoConfirmar, titulo = '- Confirmação -', isHTML = false) {
        const dialog = garantirModalGlobal();
        document.getElementById('sr-modal-titulo').textContent = titulo;
        document.getElementById('sr-modal-mensagem').innerHTML = formatarConteudo(mensagem, isHTML);

        const acoes = document.getElementById('sr-modal-acoes');
        acoes.innerHTML = `
            <button type="button" class="sr-btn-secundario" id="sr-btn-cancelar">Cancelar</button>
            <button type="button" class="sr-btn-primario" id="sr-btn-confirmar">Confirmar</button>
        `;

        document.getElementById('sr-btn-cancelar').onclick = () => dialog.close();
        document.getElementById('sr-btn-confirmar').onclick = () => {
            dialog.close();
            if (typeof aoConfirmar === 'function') aoConfirmar();
        };

        if (dialog.open) dialog.close();
        dialog.showModal();
    }

    window.srModal = {
        alerta: abrirAlerta,
        confirmar: abrirConfirmacao
    };

    window.alert = function (msg) {
        if (document.body) {
            abrirAlerta(msg);
        } else {
            document.addEventListener('DOMContentLoaded', () => abrirAlerta(msg), { once: true });
        }
    };
})();