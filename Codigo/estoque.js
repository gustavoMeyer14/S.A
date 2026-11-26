const CHAVE_ESTOQUE_SR = 'estoqueShadowRealm';
const CHAVE_CATALOGO_SR = 'catalogoShadowRealm';

// Lista base inicial
const PRODUTOS_PADRAO_SR = [
    {
        id: "1",
        nome: "Ichigo Kurosaki",
        preco: 340.00,
        estoque: 5,
        categoria: "Bleach",
        destaque: false,
        imagem: "imagens/bleach.png",
        descricao: "Escala: 1/6 (~32 cm), em resina de alto padrão. Pose e Expressão: Avançando em meio a ondas de energia espiritual com olhar determinado e máscara Hollow parcial opcional. Vestes e Armas: Shihakusho preto rasgado em movimento dinâmico, empunhando a Tensa Zangetsu com efeito translúcido de Getsuga Tensho negro e vermelho. Base Diorama: Solo rachado da Soul Society com destroços flutuantes."
    },
    {
        id: "2",
        nome: "Kisuke Urahara",
        preco: 460.00,
        estoque: 3,
        categoria: "Bleach",
        destaque: false,
        imagem: "imagens/kisuke.png",
        descricao: "Escala: 1/6 (~30 cm), em resina de alto padrão. Pose e Expressão: Pousando em um pé só sobre um telhado japonês, com sorriso enigmático sob a sombra do chapéu listrado. Vestes e Armas: Haori verde esvoaçante com texturas desgastadas e sandálias geta, acompanhado da bengala no ombro ou braço extra empunhando a Benihime. Base Diorama: Telhas de Karakura com lanterna apagada."
    },
    {
        id: "3",
        nome: "Renji Abarai",
        preco: 400.00,
        estoque: 4,
        categoria: "Bleach",
        destaque: false,
        imagem: "imagens/renje.png",
        descricao: "Escala: 1/6 (~31 cm), em resina de alto padrão. Pose e Expressão: Em postura de ataque intenso com expressão feroz e sobrancelhas tatuadas em destaque. Vestes e Armas: Uniforme de Tenente da 6ª Divisão com faixa branca na testa e a Zabimaru em sua forma Shikai segmentada. Base Diorama: Rocha esculpida com marcas de impacto."
    },
    {
        id: "4",
        nome: "Rukia Kuchiki",
        preco: 430.00,
        estoque: 6,
        categoria: "Bleach",
        destaque: false,
        imagem: "imagens/rukia.png",
        descricao: "Escala: 1/6 (~28 cm), em resina de alto padrão. Pose e Expressão: Postura elegante e serena executando uma dança de gelo. Vestes e Armas: Shihakusho tradicional e a Sode no Shirayuki totalmente branca com cristais de gelo translúcidos. Base Diorama: Lago congelado com flores de gelo esculpidas."
    },
    {
        id: "5",
        nome: "Toshiro Hitsugaya",
        preco: 200.00,
        estoque: 2,
        categoria: "Bleach",
        destaque: false,
        imagem: "imagens/toshiro.png",
        descricao: "Escala: 1/6 (~26 cm), em resina de alto padrão. Pose e Expressão: Flutuando em combate com olhar frio e focado de Capitão da 10ª Divisão. Vestes e Armas: Haori branco de Capitão esvoaçante, empunhando a Hyorinmaru envolta por um dragão de gelo translúcido. Base Diorama: Pilar de gelo pontiagudo emergindo do chão."
    },
    {
        id: "6",
        nome: "Levi Ackerman",
        preco: 250.00,
        estoque: 5,
        categoria: "Attack on Titan",
        destaque: true,
        imagem: "imagens/Levi.png",
        descricao: "Escala: 1/6 (~29 cm), em resina de alto padrão. Pose e Expressão: No ar em pleno giro de ataque com expressão fria e olhar cortante de Capitão da Tropa de Exploração. Vestes e Armas: Capa verde com o brasão das Asas da Liberdade e equipamento DMT detalhado. Base Diorama: Telhado europeu quebrado com fumaça de propulsão."
    },
    {
        id: "7",
        nome: "Maomao",
        preco: 300.00,
        estoque: 4,
        categoria: "Diário de uma Apotecária",
        destaque: true,
        imagem: "imagens/Maomao.png",
        descricao: "Escala: 1/6 (~25 cm), em resina de alto padrão. Pose e Expressão: Examinando atentamente um frasco de ervas com sorriso curioso. Vestes e Acessórios: Traje tradicional do Palácio Interno em tons de verde e rosa, acompanhada de pilão, almofariz e caderno de anotações. Base Diorama: Mesa de boticário em madeira esculpida."
    },
    {
        id: "8",
        nome: "Satoru Gojo",
        preco: 350.00,
        estoque: 3,
        categoria: "Jujutsu Kaisen",
        destaque: true,
        imagem: "imagens/Canva - download.png",
        descricao: "Escala: 1/6 (~33 cm), em resina de alto padrão. Pose e Expressão: Flutuando de forma relaxada e confiante, puxando a venda preta para revelar os Seis Olhos azuis. Vestes e Poderes: Uniforme escuro da Escola Jujutsu e esfera translúcida de Energia Amaldiçoada Vazio Roxo. Base Diorama: Escombros urbanos suspensos."
    },
    {
        id: "9",
        nome: "Greninja",
        preco: 400.00,
        estoque: 2,
        categoria: "Pokémon",
        destaque: true,
        imagem: "imagens/Canva - download (1).png",
        descricao: "Escala: 1/6 (~27 cm), em resina de alto padrão. Pose e Expressão: Agachado sobre a superfície da água em postura ágil de ninja. Vestes e Poderes: Cachecol longo esculpido com movimento dinâmico e duas Water Shurikens gigantes em resina azul translúcida. Base Diorama: Onda cristalina quebrando sobre rochas."
    },
    {
        id: "10",
        nome: "Snorlax",
        preco: 450.00,
        estoque: 1,
        categoria: "Pokémon",
        destaque: true,
        imagem: "imagens/Snorlax.png",
        descricao: "Escala: 1/6 (~28 cm), em resina maciça de alto padrão. Pose e Expressão: Tirando um cochilo profundo de barriga para cima após um banquete. Detalhes e Acessórios: Pintura fosca com sombreamento suave, Poké Flauta dourada e Berries espalhadas. Base Diorama: Gramado florido da Rota 12."
    }
];

function lerCatalogoLocalSR() {
    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_CATALOGO_SR));
        if (Array.isArray(dados) && dados.length > 0) return dados;
    } catch {}
    return null;
}

function salvarCatalogoLocalSR(lista) {
    localStorage.setItem(CHAVE_CATALOGO_SR, JSON.stringify(lista));
}

// Carrega os produtos do localStorage (ou inicializa com produtos.json / PRODUTOS_PADRAO_SR)
async function carregarProdutosSR() {
    const salvo = lerCatalogoLocalSR();
    if (salvo) return salvo;

    let listaInicial = [...PRODUTOS_PADRAO_SR];
    try {
        const resp = await fetch('produtos.json');
        if (resp.ok) {
            const dados = await resp.json();
            if (Array.isArray(dados) && dados.length > 0) {
                listaInicial = dados.map((p, idx) => ({
                    ...PRODUTOS_PADRAO_SR[idx],
                    ...p,
                    destaque: p.pagina === 'index.html' || Boolean(p.destaque)
                }));
            }
        }
    } catch {}

    salvarCatalogoLocalSR(listaInicial);
    return listaInicial;
}

// Adiciona um novo produto ao catálogo e ao estoque
async function adicionarProdutoSR(dados) {
    const lista = await carregarProdutosSR();
    const novoId = String(
        lista.reduce((max, item) => Math.max(max, parseInt(item.id, 10) || 0), 0) + 1
    );

    const novoProduto = {
        id: novoId,
        nome: dados.nome.trim(),
        preco: parseFloat(dados.preco) || 0,
        estoque: Math.max(0, parseInt(dados.estoque, 10) || 5),
        categoria: (dados.categoria || 'Outros').trim(),
        destaque: Boolean(dados.destaque),
        imagem: dados.imagem.trim() || 'imagens/produto.png',
        descricao: dados.descricao.trim()
    };

    lista.push(novoProduto);
    salvarCatalogoLocalSR(lista);
    definirEstoque(novoProduto.nome, novoProduto.estoque);
    return novoProduto;
}

// Atualiza nome, preço, descrição, imagem, categoria ou destaque de um produto existente
async function atualizarProdutoSR(id, dadosAtualizados) {
    const lista = await carregarProdutosSR();
    const idx = lista.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;

    const antigo = lista[idx];
    const nomeAntigo = antigo.nome;
    const novoNome = dadosAtualizados.nome.trim();

    const atualizado = {
        ...antigo,
        nome: novoNome,
        preco: parseFloat(dadosAtualizados.preco) || 0,
        descricao: dadosAtualizados.descricao.trim(),
        imagem: dadosAtualizados.imagem.trim() || antigo.imagem,
        categoria: (dadosAtualizados.categoria || antigo.categoria || 'Outros').trim(),
        destaque: dadosAtualizados.destaque !== undefined ? Boolean(dadosAtualizados.destaque) : antigo.destaque
    };

    lista[idx] = atualizado;
    salvarCatalogoLocalSR(lista);

    // Se o nome mudou, transfere a quantidade em estoque para o novo nome
    if (nomeAntigo !== novoNome) {
        const estoque = obterTodoEstoque();
        const qtdAtual = estoque[nomeAntigo] !== undefined ? estoque[nomeAntigo] : (antigo.estoque || 0);
        delete estoque[nomeAntigo];
        estoque[novoNome] = qtdAtual;
        localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
    }

    return atualizado;
}

// Remove um produto do catálogo e do estoque
async function removerProdutoSR(id) {
    const lista = await carregarProdutosSR();
    const alvo = lista.find(p => String(p.id) === String(id));
    if (!alvo) return;

    const filtrada = lista.filter(p => String(p.id) !== String(id));
    salvarCatalogoLocalSR(filtrada);

    const estoque = obterTodoEstoque();
    delete estoque[alvo.nome];
    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
}

window.promessaEstoqueSR = (async function inicializarEstoque() {
    let estoqueSalvo = null;
    try {
        estoqueSalvo = JSON.parse(localStorage.getItem(CHAVE_ESTOQUE_SR));
    } catch {
        estoqueSalvo = null;
    }

    const produtos = await carregarProdutosSR();
    const estoqueAtualizado = (estoqueSalvo && typeof estoqueSalvo === 'object') ? { ...estoqueSalvo } : {};
    let mudou = Object.keys(estoqueAtualizado).length === 0;

    produtos.forEach(prod => {
        if (estoqueAtualizado[prod.nome] === undefined) {
            estoqueAtualizado[prod.nome] = typeof prod.estoque === 'number' ? prod.estoque : 5;
            mudou = true;
        }
    });

    if (mudou) {
        localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoqueAtualizado));
    }

    return estoqueAtualizado;
})();

function obterTodoEstoque() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_ESTOQUE_SR)) || {};
    } catch {
        return {};
    }
}

function obterEstoque(nomeProduto) {
    const estoque = obterTodoEstoque();
    return estoque[nomeProduto] !== undefined ? Number(estoque[nomeProduto]) : 0;
}

function definirEstoque(nomeProduto, novaQtd) {
    const estoque = obterTodoEstoque();
    estoque[nomeProduto] = Math.max(0, parseInt(novaQtd, 10) || 0);
    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
    atualizarInterfaceEstoque();
}

function darBaixaNoEstoque(carrinho) {
    const estoque = obterTodoEstoque();

    for (const item of carrinho) {
        const disponivel = estoque[item.nome] ?? 0;
        if (item.quantidade > disponivel) {
            return {
                sucesso: false,
                mensagem: `Estoque insuficiente para "${item.nome}". Disponível no momento: ${disponivel} unidade(s).`
            };
        }
    }

    carrinho.forEach(item => {
        estoque[item.nome] = Math.max(0, (estoque[item.nome] ?? 0) - item.quantidade);
    });

    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
    return { sucesso: true };
}

function devolverAoEstoque(itens) {
    if (!Array.isArray(itens)) return;
    const estoque = obterTodoEstoque();

    itens.forEach(item => {
        estoque[item.nome] = (estoque[item.nome] ?? 0) + (item.quantidade || 1);
    });

    localStorage.setItem(CHAVE_ESTOQUE_SR, JSON.stringify(estoque));
}

function atualizarInterfaceEstoque() {
    document.querySelectorAll('.destaques > div').forEach(card => {
        const nomeEl = card.querySelector('p');
        if (!nomeEl) return;

        const nome = nomeEl.innerText.trim();
        const qtd = obterEstoque(nome);

        const textoShopee = card.querySelector('.shopee-estoque-texto');
        if (textoShopee) {
            if (qtd === 0) {
                textoShopee.textContent = '❌ Esgotado';
                textoShopee.style.color = '#ff4d4d';
            } else if (qtd <= 2) {
                textoShopee.textContent = `🔥 Últimas ${qtd} unidade(s)!`;
                textoShopee.style.color = '#ffca28';
            } else {
                textoShopee.textContent = `📦 Em estoque: ${qtd} un.`;
                textoShopee.style.color = '#00e676';
            }
        }

        card.style.opacity = qtd === 0 ? '0.7' : '1';
    });

    document.querySelectorAll('.modalProduto').forEach(modal => {
        const tituloEl = modal.querySelector('.modalProduto-conteudo h2');
        if (!tituloEl) return;

        const nome = tituloEl.innerText.replace(/^-\s*/, '').trim();
        const qtd = obterEstoque(nome);

        let infoModal = modal.querySelector('.info-estoque-modal');
        if (!infoModal) {
            infoModal = document.createElement('p');
            infoModal.className = 'info-estoque-modal';
            infoModal.style.cssText = 'font-weight:bold; font-size:18px; margin: 10px 20px;';
            modal.querySelector('.modalProduto-conteudo')?.appendChild(infoModal);
        }

        const btnCarrinho = modal.querySelector('.btn-carrinho');
        const btnComprar = modal.querySelector('.btn-comprar-agora');

        if (qtd === 0) {
            infoModal.textContent = '❌ Produto Esgotado no momento';
            infoModal.style.color = '#ff4d4d';
            [btnCarrinho, btnComprar].forEach(btn => {
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = 'Esgotado';
                    btn.style.backgroundColor = '#444';
                    btn.style.borderColor = '#555';
                    btn.style.cursor = 'not-allowed';
                }
            });
        } else {
            infoModal.textContent = `📦 Disponível em estoque: ${qtd} unidade(s)`;
            infoModal.style.color = qtd <= 2 ? '#ffca28' : '#00e676';
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await window.promessaEstoqueSR;
    setTimeout(atualizarInterfaceEstoque, 80);
});