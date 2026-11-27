/* integracao-segura.js */
// =========================================================
// INTEGRAÇÃO SEGURA - SHADOW REALM STORE (integracao-segura.js)
// =========================================================

(function () {
    function escIntegracaoSR(texto) {
        return String(texto ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function lerJsonIntegracaoSR(chave, fallback = null) {
        try {
            const bruto = localStorage.getItem(chave);
            if (bruto === null || bruto === '') return fallback;
            return JSON.parse(bruto);
        } catch {
            return fallback;
        }
    }

    function sincronizarEstadoGlobalSR() {
        if (typeof window.atualizarBadgeCarrinho === 'function') {
            window.atualizarBadgeCarrinho();
        }
        if (typeof window.atualizarBotoesFavoritosSR === 'function') {
            window.atualizarBotoesFavoritosSR();
        }
        if (typeof window.atualizarInterfaceEstoque === 'function') {
            window.atualizarInterfaceEstoque();
        }
    }

    function protegerModaisEFechamentoSR() {
        document.querySelectorAll('dialog').forEach((dialog) => {
            if (dialog.id === 'sr-modal-global' || dialog.getAttribute('data-sr-esc-bound') === '1') {
                return;
            }
            dialog.setAttribute('data-sr-esc-bound', '1');
            dialog.addEventListener('cancel', (e) => {
                e.preventDefault();
                if (dialog.open) dialog.close();
            });
        });
    }

    function garantirAtalhoMeusPedidosSR() {
        const navUsuario = document.querySelector('#modalCliente .nav-usuario');
        if (!navUsuario) return;

        if (!navUsuario.querySelector('a[href="pedidos.html"]')) {
            const linkPedidos = document.createElement('a');
            linkPedidos.href = 'pedidos.html';
            linkPedidos.textContent = 'Meus Pedidos';
            navUsuario.appendChild(linkPedidos);
        }
    }

    function exibirResumoSessaoSeguroSR() {
        const logado = localStorage.getItem('usuarioLogado') === 'true';
        const nome = localStorage.getItem('usuarioNome') || '';
        const email = localStorage.getItem('usuarioAtual') || '';

        if (!logado || (!nome && !email)) return;

        const header = document.querySelector('header#topo .nav') || document.querySelector('header .nav');
        if (!header || document.getElementById('sr-chip-usuario')) return;

        const rotulo = nome ? nome.split(' ')[0] : email.split('@')[0];
        const chip = document.createElement('span');
        chip.id = 'sr-chip-usuario';
        chip.title = email || nome;
        chip.style.cssText = 'display:inline-flex; align-items:center; gap:6px; background:#1b1b1b; color:#ffca28; border:1px solid #C62828; border-radius:999px; padding:4px 12px; font-size:12px; font-weight:bold; margin-left:10px; vertical-align:middle;';
        chip.innerHTML = `<span>⚡</span><span>${escIntegracaoSR(rotulo)}</span>`;

        header.appendChild(chip);
    }

    function observarMudancasDOMSR() {
        if (typeof MutationObserver === 'undefined' || !document.body) return;

        let agendado = false;
        const obs = new MutationObserver(() => {
            if (agendado) return;
            agendado = true;
            requestAnimationFrame(() => {
                agendado = false;
                protegerModaisEFechamentoSR();
                sincronizarEstadoGlobalSR();
            });
        });

        obs.observe(document.body, { childList: true, subtree: true });
    }

    function iniciarIntegracaoSeguraSR() {
        garantirAtalhoMeusPedidosSR();
        exibirResumoSessaoSeguroSR();
        protegerModaisEFechamentoSR();
        sincronizarEstadoGlobalSR();
        observarMudancasDOMSR();
    }

    window.escIntegracaoSR = escIntegracaoSR;
    window.lerJsonIntegracaoSR = lerJsonIntegracaoSR;
    window.sincronizarEstadoGlobalSR = sincronizarEstadoGlobalSR;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarIntegracaoSeguraSR);
    } else {
        iniciarIntegracaoSeguraSR();
    }

    if (window.promessaEstoqueSR && typeof window.promessaEstoqueSR.then === 'function') {
        window.promessaEstoqueSR.then(() => sincronizarEstadoGlobalSR());
    }

    window.addEventListener('storage', (e) => {
        const chavesMonitoradas = [
            'carrinhoShadowRealm',
            'pedidosShadowRealm',
            'usuarioLogado',
            'usuarioAtual',
            'usuarioNome'
        ];
        if (!e.key || chavesMonitoradas.includes(e.key)) {
            sincronizarEstadoGlobalSR();
        }
    });
})();