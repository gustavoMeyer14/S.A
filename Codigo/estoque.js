const CHAVE_ESTOQUE_SR = 'estoqueShadowRealm';

const PRODUTOS_PADRAO_SR = [
    { nome: 'Levi Ackerman', preco: 250.00, imagem: 'imagens/Levi.png', categoria: 'Attack on Titan', estoque: 5 },
    { nome: 'Maomao', preco: 300.00, imagem: 'imagens/Maomao.png', categoria: 'Diário de uma Apotecária', estoque: 4 },
    { nome: 'Satoru Gojo', preco: 350.00, imagem: 'imagens/Canva - download.png', categoria: 'Jujutsu Kaisen', estoque: 6 },
    { nome: 'Greninja', preco: 400.00, imagem: 'imagens/Canva - download (1).png', categoria: 'Pokémon', estoque: 3 },
    { nome: 'Snorlax', preco: 450.00, imagem: 'imagens/Snorlax.png', categoria: 'Pokémon', estoque: 4 },
    { nome: 'Ichigo Kurosaki', preco: 340.00, imagem: 'imagens/bleach.png', categoria: 'Bleach', estoque: 5 },
    { nome: 'Kisuke Urahara', preco: 460.00, imagem: 'imagens/kisuke.png', categoria: 'Bleach', estoque: 2 },
    { nome: 'Renji Abarai', preco: 400.00, imagem: 'imagens/renje.png', categoria: 'Bleach', estoque: 4 },
    { nome: 'Rukia Kuchiki', preco: 430.00, imagem: 'imagens/rukia.png', categoria: 'Bleach', estoque: 3 },
    { nome: 'Toshiro Hitsugaya', preco: 200.00, imagem: 'imagens/toshiro.png', categoria: 'Bleach', estoque: 6 }
];

async function carregarProdutosSR() {
    try {
        const resp = await fetch('produtos.json');
        if (resp.ok) {
            const lista = await resp.json();
            if (Array.isArray(lista) && lista.length > 0) {
                return lista;
            }
        }
    } catch (e) {
        // Fallback para catálogo padrão local
    }
    return PRODUTOS_PADRAO_SR;
}

function lerMapaEstoqueSR() {
    try {
        const bruto = JSON.parse(localStorage.getItem(CHAVE_ESTOQUE_SR));
        return bruto && typeof bruto === 'object' ? bruto : {};
    } catch (e) {
        return {};
    }
}

function salvarMapaEstoqueSR(mapa) {
    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(mapa));
}

async function inicializarEstoqueSR() {
    const produtos = await carregarProdutosSR();
    const mapaAtual = lerMapaEstoqueSR();
    let alterou = false;

    produtos.forEach((prod) => {
        if (!prod || !prod.nome) return;
        if (mapaAtual[prod.nome] === undefined) {
            const qtdPadrao = Number.isFinite(Number(prod.estoque)) ? Math.max(0, Math.floor(Number(prod.estoque))) : 5;
            mapaAtual[prod.nome] = qtdPadrao;
            alterou = true;
        }
    });

    if (alterou || !localStorage.getItem(CHAVE_ESTOQUE_SR)) {
        salvarMapaEstoqueSR(mapaAtual);
    }

    return mapaAtual;
}

function obterEstoque(nomeProduto) {
    if (!nomeProduto) return 0;
    const mapa = lerMapaEstoqueSR();
    if (mapa[nomeProduto] !== undefined) {
        return Math.max(0, Math.floor(Number(mapa[nomeProduto]) || 0));
    }
    const padrao = PRODUTOS_PADRAO_SR.find((p) => p.nome.toLowerCase() === String(nomeProduto).toLowerCase());
    return padrao ? padrao.estoque : 0;
}

function definirEstoque(nomeProduto, novaQuantidade) {
    if (!nomeProduto) return 0;
    const mapa = lerMapaEstoqueSR();
    const valorLimpo = Math.max(0, Math.floor(Number(novaQuantidade) || 0));
    mapa[nomeProduto] = valorLimpo;
    salvarMapaEstoqueSR(mapa);
    return valorLimpo;
}

function darBaixaNoEstoque(itensCarrinho) {
    if (!Array.isArray(itensCarrinho) || itensCarrinho.length === 0) {
        return { sucesso: false, mensagem: 'Nenhum item encontrado para dar baixa no estoque.' };
    }

    const mapa = lerMapaEstoqueSR();

    for (const item of itensCarrinho) {
        const qtdDesejada = Math.max(0, Math.floor(Number(item.quantidade) || 0));
        const disponivel = obterEstoque(item.nome);
        if (qtdDesejada > disponivel) {
            return {
                sucesso: false,
                mensagem: `Estoque insuficiente para <strong>${item.nome}</strong>. Disponível: <strong>${disponivel}</strong> unidade(s).`
            };
        }
    }

    for (const item of itensCarrinho) {
        const qtdDesejada = Math.max(0, Math.floor(Number(item.quantidade) || 0));
        const disponivel = obterEstoque(item.nome);
        mapa[item.nome] = Math.max(0, disponivel - qtdDesejada);
    }

    salvarMapaEstoqueSR(mapa);
    return { sucesso: true, mensagem: 'Estoque atualizado com sucesso.' };
}

window.promessaEstoqueSR = inicializarEstoqueSR();