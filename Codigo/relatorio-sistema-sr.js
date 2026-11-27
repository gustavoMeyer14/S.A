// relatorio-sistema-sr.js
// =========================================================
// DIAGNÓSTICO & REVISÃO DO SISTEMA - SHADOW REALM STORE
// Gera um relatório limpo no console (sem alterar o DOM nem o layout)
// =========================================================

(function () {
    'use strict';

    function lerSeguro(chave, fallback) {
        try {
            const raw = localStorage.getItem(chave);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function resumirEstadoLoja() {
        const carrinho = lerSeguro('carrinhoShadowRealm', []);
        const pedidos = lerSeguro('pedidosShadowRealm', []);
        const notificacoes = lerSeguro('notificacoesShadowRealm', []);
        const pesquisas = lerSeguro('historicoPesquisasShadowRealm', []);
        const reclamacoes = lerSeguro('reclamacoesShadowRealm', []);

        const totalItensCarrinho = Array.isArray(carrinho)
            ? carrinho.reduce((acc, item) => acc + (Number(item.quantidade) || 1), 0)
            : 0;

        const resumo = {
            logado: localStorage.getItem('usuarioLogado') === 'true',
            usuario: localStorage.getItem('usuarioAtual') || localStorage.getItem('usuarioNome') || 'visitante',
            carrinho: {
                linhas: Array.isArray(carrinho) ? carrinho.length : 0,
                unidades: totalItensCarrinho
            },
            pedidosCount: Array.isArray(pedidos) ? pedidos.length : 0,
            notificacoesCount: Array.isArray(notificacoes) ? notificacoes.length : 0,
            pesquisasCount: Array.isArray(pesquisas) ? pesquisas.length : 0,
            reclamacoesCount: Array.isArray(reclamacoes) ? reclamacoes.length : 0
        };

        console.group('[Shadow Realm Store] Diagnóstico de Estado');
        console.table({
            Logado: resumo.logado,
            Usuario: resumo.usuario,
            ItensCarrinho: resumo.carrinho.unidades,
            Pedidos: resumo.pedidosCount,
            Notificacoes: resumo.notificacoesCount,
            Pesquisas: resumo.pesquisasCount,
            Reclamacoes: resumo.reclamacoesCount
        });
        console.groupEnd();

        return resumo;
    }

    window.srDiagnosticoEstado = resumirEstadoLoja;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resumirEstadoLoja);
    } else {
        resumirEstadoLoja();
    }
})();