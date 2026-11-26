(function () {
    // 1. Garante que o botão do cupom VIP em shopee.js funcione sem ReferenceError
    if (typeof window.copiarCupom !== 'function') {
        window.copiarCupom = function (codigo, botao) {
            if (typeof window.copiarCupomShopee === 'function') {
                return window.copiarCupomShopee(codigo, botao);
            }
            navigator.clipboard?.writeText(codigo);
            if (botao) {
                const textoOriginal = botao.textContent;
                botao.textContent = 'COPIADO! ✔';
                botao.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    botao.textContent = textoOriginal;
                    botao.style.backgroundColor = '';
                }, 2000);
            }
        };
    }

    // 2. Estende window.srModal para suportar callback aoFechar (4º argumento) e .toast()
    function estenderSrModal() {
        if (!window.srModal || window.srModal._estendidoSR) return;

        const alertaOriginal = window.srModal.alerta.bind(window.srModal);
        window.srModal.alerta = function (mensagem, titulo, isHTML, aoFechar) {
            alertaOriginal(mensagem, titulo, isHTML);
            if (typeof aoFechar === 'function') {
                const dialog = document.getElementById('sr-modal-global');
                if (dialog) {
                    dialog.addEventListener('close', aoFechar, { once: true });
                }
            }
        };

        if (typeof window.srModal.toast !== 'function') {
            window.srModal.toast = function (mensagem, duracaoMs = 3000) {
                let toast = document.getElementById('sr-toast-compat');
                if (!toast) {
                    toast = document.createElement('div');
                    toast.id = 'sr-toast-compat';
                    toast.style.cssText = `
                        position: fixed;
                        bottom: 24px;
                        left: 50%;
                        transform: translateX(-50%) translateY(15px);
                        background: #1a1a1a;
                        color: #ffffff;
                        border: 2px solid #ffca28;
                        padding: 12px 22px;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: bold;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.85);
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.25s ease, transform 0.25s ease;
                        z-index: 1000000;
                    `;
                    document.body.appendChild(toast);
                }
                toast.textContent = mensagem;
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(-50%) translateY(0)';
                clearTimeout(toast._timer);
                toast._timer = setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(-50%) translateY(15px)';
                }, duracaoMs);
            };
        }

        window.srModal._estendidoSR = true;
    }

    // 3. Garante a função devolverAoEstoque caso estoque.js não a tenha exposto
    if (typeof window.devolverAoEstoque !== 'function') {
        window.devolverAoEstoque = function (itensPedido) {
            if (!Array.isArray(itensPedido) || itensPedido.length === 0) return;
            const mapa = JSON.parse(localStorage.getItem('estoqueShadowRealm')) || {};
            itensPedido.forEach((item) => {
                if (!item || !item.nome) return;
                const qtd = Math.max(0, Math.floor(Number(item.quantidade) || 1));
                const atual = Number(mapa[item.nome]) || 0;
                mapa[item.nome] = atual + qtd;
            });
            localStorage.setItem('estoqueShadowRealm', JSON.stringify(mapa));
            if (typeof window.atualizarInterfaceEstoque === 'function') {
                window.atualizarInterfaceEstoque();
            }
        };
    }

    // 4. Sincroniza 'Pedido Cancelado' (painelAdmin) <-> 'Cancelado' (pedidos.html) e devolve estoque
    function sincronizarPedidosEStock() {
        let pedidos = [];
        try {
            pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];
        } catch {
            return;
        }

        let alterou = false;
        let devolvidos = [];
        try {
            devolvidos = JSON.parse(localStorage.getItem('pedidosEstoqueDevolvidoSR')) || [];
        } catch {
            devolvidos = [];
        }

        pedidos.forEach((p) => {
            if (p.status === 'Pedido Cancelado') {
                p.status = 'Cancelado';
                alterou = true;
            }
            if (p.status === 'Cancelado' && !devolvidos.includes(p.numeroPedido)) {
                window.devolverAoEstoque(p.itens || []);
                devolvidos.push(p.numeroPedido);
            }
        });

        if (alterou) {
            localStorage.setItem('pedidosShadowRealm', JSON.stringify(pedidos));
        }
        localStorage.setItem('pedidosEstoqueDevolvidoSR', JSON.stringify(devolvidos));
    }

    // 5. Injeta Comprovante Digital e Comprar Novamente nos cards reais de pedidos.html
    function ativarBotoesExtrasEmPedidos() {
        const lista = document.getElementById('listaPedidos');
        if (!lista) return;

        function aplicarNosCards() {
            const pedidos = JSON.parse(localStorage.getItem('pedidosShadowRealm')) || [];
            lista.querySelectorAll('.pedido-card').forEach((card) => {
                const acoes = card.querySelector('.pedido-acoes');
                if (!acoes || acoes.querySelector('.btn-comprovante-compat')) return;

                const numTxt = (card.querySelector('.pedido-numero')?.textContent || '').replace(/\D/g, '');
                const pedido = pedidos.find((p) => String(p.numeroPedido) === String(numTxt));
                if (!pedido) return;

                const btnComp = document.createElement('button');
                btnComp.type = 'button';
                btnComp.className = 'btn-rastrear btn-comprovante-compat';
                btnComp.textContent = '📄 Comprovante';
                btnComp.onclick = () => {
                    const itensHtml = (pedido.itens || []).map((i) =>
                        `<li>${i.quantidade}x <strong>${i.nome}</strong> — R$ ${(i.preco * i.quantidade).toFixed(2).replace('.', ',')}</li>`
                    ).join('');

                    window.srModal?.alerta(`
                        <div style="text-align:left; background:#121212; border:1px dashed #ffca28; border-radius:12px; padding:15px; font-size:14px;">
                            <p style="margin-bottom:6px;"><strong>Pedido:</strong> #${pedido.numeroPedido}</p>
                            <p style="margin-bottom:6px;"><strong>Data:</strong> ${pedido.data}</p>
                            <p style="margin-bottom:6px;"><strong>Status:</strong> ${pedido.status}</p>
                            <p style="margin-bottom:6px;"><strong>Pagamento:</strong> ${pedido.cartaoUsado || 'Pix'}</p>
                            <p style="margin-bottom:10px;"><strong>Entrega:</strong> ${pedido.enderecoEntrega || '-'}</p>
                            <hr style="border-color:#333; margin:8px 0;">
                            <ul style="padding-left:18px; margin-bottom:10px;">${itensHtml}</ul>
                            <p style="font-size:16px; color:#ffca28; text-align:right; margin:0;">
                                <strong>Total Pago: R$ ${Number(pedido.total || 0).toFixed(2).replace('.', ',')}</strong>
                            </p>
                        </div>
                    `, `- Comprovante Pedido #${pedido.numeroPedido} -`, true);
                };

                const btnRecomprar = document.createElement('button');
                btnRecomprar.type = 'button';
                btnRecomprar.className = 'btn-rastrear btn-recomprar-compat';
                btnRecomprar.textContent = '🔄 Comprar Novamente';
                btnRecomprar.onclick = () => {
                    const carrinho = JSON.parse(localStorage.getItem('carrinhoShadowRealm')) || [];
                    let adicionados = 0;

                    (pedido.itens || []).forEach((item) => {
                        const disp = typeof window.obterEstoque === 'function' ? window.obterEstoque(item.nome) : 99;
                        if (disp <= 0) return;

                        const existente = carrinho.find((c) => c.nome === item.nome);
                        const qtd = Math.min(disp, item.quantidade || 1);
                        if (existente) {
                            existente.quantidade = Math.min(disp, existente.quantidade + qtd);
                        } else {
                            carrinho.push({
                                nome: item.nome,
                                preco: item.preco,
                                imagem: item.imagem,
                                quantidade: qtd
                            });
                        }
                        adicionados++;
                    });

                    if (adicionados === 0) {
                        window.srModal?.alerta('Os itens deste pedido estão esgotados no momento.', '- Estoque Indisponível -');
                        return;
                    }

                    localStorage.setItem('carrinhoShadowRealm', JSON.stringify(carrinho));
                    window.location.href = 'carrinho.html';
                };

                acoes.appendChild(btnComp);
                acoes.appendChild(btnRecomprar);
            });
        }

        aplicarNosCards();
        new MutationObserver(aplicarNosCards).observe(lista, { childList: true });
    }

    // 6. Ativa o botão de pesquisa da Home (index.html) redirecionando para produtos.html?busca=...
    function ativarBuscaHome() {
        const pagina = window.location.pathname.toLowerCase();
        if (!pagina.endsWith('index.html') && pagina !== '/' && !pagina.endsWith('/')) return;

        const btn = document.getElementById('enviarPesquisa');
        const input = document.getElementById('barraPesquisa');
        if (!btn || !input || btn.dataset.buscaAtiva) return;

        btn.dataset.buscaAtiva = 'true';
        const redirecionarBusca = () => {
            const termo = input.value.trim();
            window.location.href = termo
                ? `produtos.html?busca=${encodeURIComponent(termo)}`
                : 'produtos.html';
        };

        btn.addEventListener('click', redirecionarBusca);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                redirecionarBusca();
            }
        });
    }

    // 7. Sincroniza a atualização de estoque visual quando produtos dinâmicos são carregados
    function observarVitrineDinamica() {
        const vitrine = document.querySelector('.destaques');
        if (!vitrine || typeof window.atualizarInterfaceEstoque !== 'function') return;

        new MutationObserver(() => {
            window.atualizarInterfaceEstoque();
        }).observe(vitrine, { childList: true });
    }

    // Execução imediata e após carregamento do DOM
    estenderSrModal();
    sincronizarPedidosEStock();

    window.addEventListener('storage', (e) => {
        if (e.key === 'pedidosShadowRealm') {
            sincronizarPedidosEStock();
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        estenderSrModal();
        sincronizarPedidosEStock();
        ativarBotoesExtrasEmPedidos();
        ativarBuscaHome();
        observarVitrineDinamica();
    });
})();