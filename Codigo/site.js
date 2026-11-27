/* site.js */
// =========================================================
// BASE GLOBAL TURBINADA - SHADOW REALM STORE (site.js)
// =========================================================

const CONFIG_SITE_SR = {
    chaves: {
        usuarioLogado: 'usuarioLogado',
        usuarioAtual: 'usuarioAtual',
        usuarioNome: 'usuarioNome',
        tipoUsuario: 'tipoUsuario',
        clienteLogado: 'clienteLogado',
        admins: 'administradoresShadowRealm',
        usuarios: 'usuariosShadowRealm',
        carrinho: 'carrinhoShadowRealm',
        estoque: 'estoqueShadowRealm',
        pedidos: 'pedidosShadowRealm',
        cartoesBase: 'cartoesShadowRealm',
        produtosCustom: 'produtosCustomShadowRealm',
        historicoPesquisas: 'historicoPesquisasShadowRealm',
        notificacoes: 'notificacoesShadowRealm',
        reclamacoes: 'reclamacoesShadowRealm',
        cuponsUsados: 'cuponsUsadosShadowRealm'
    },
    cupons: {
        'SHADOW26': { desconto: 0.15, apenasPrimeiraCompra: true },
        'GEEK15': { desconto: 0.15, apenasPrimeiraCompra: false },
        'SHADOW50': { desconto: 0.50, apenasPrimeiraCompra: false }
    },
    limiteFreteGratis: 150,
    valorFretePadrao: 25,
    minItensDescontoVolume: 15,
    descontoVolumePercentual: 0.10,
    adminFallback: [
        {
            id: '1',
            nome: 'Pedro Carvalho',
            cpf: '',
            email: 'pedro_carvalho@gmail.com',
            senha: 'Pedro@1983',
            admin: true,
            tipo: 'admin'
        }
    ],
    catalogoFallback: [
        {
            id: '1',
            nome: 'Ichigo Kurosaki',
            preco: 340.00,
            estoque: 5,
            categoria: 'Bleach',
            pagina: 'produtos.html',
            descricao: 'Escala: 1/6 (~32 cm), em resina de alto padrão. Pose e Expressão: Avançando em meio a ondas de energia espiritual com olhar determinado e máscara Hollow parcial opcional. Vestes e Armas: Shihakusho preto rasgado em movimento dinâmico, empunhando a Tensa Zangetsu com efeito translúcido de Getsuga Tensho negro e vermelho. Base Diorama: Solo rachado da Soul Society com destroços flutuantes.',
            destaque: true,
            imagem: 'imagens/bleach.png'
        },
        {
            id: '2',
            nome: 'Kisuke Urahara',
            preco: 460.00,
            estoque: 3,
            categoria: 'Bleach',
            pagina: 'produtos.html',
            descricao: 'Escala: 1/6 (~30 cm), em resina de alto padrão. Pose e Expressão: Pousando em um pé só sobre um telhado japonês, com sorriso enigmático sob a sombra do chapéu listrado (inclui cabeça extra com expressão séria). Vestes e Armas: Haori verde esvoaçante com texturas desgastadas e sandálias geta, acompanhado da bengala no ombro ou braço extra empunhando a Benihime com efeito translúcido de Reiatsu vermelha. Base Diorama: Telhas de Karakura com lanterna apagada, Yoruichi em forma de gato preto na ponta e um frasco de Mod-Soul escondido.',
            destaque: true,
            imagem: 'imagens/kisuke.png'
        },
        {
            id: '3',
            nome: 'Renji Abarai',
            preco: 400.00,
            estoque: 4,
            categoria: 'Bleach',
            pagina: 'produtos.html',
            descricao: 'Escala: 1/6 (~31 cm), em resina de alto padrão. Pose e Expressão: Em postura de ataque intenso com expressão feroz e sobrancelhas tatuadas em destaque. Vestes e Armas: Uniforme de Tenente da 6ª Divisão com faixa branca na testa e a Zabimaru em sua forma Shikai segmentada estendendo-se ao redor da figure. Base Diorama: Rocha esculpida com marcas de impacto e poeira levantada.',
            destaque: true,
            imagem: 'imagens/renje.png'
        },
        {
            id: '4',
            nome: 'Rukia Kuchiki',
            preco: 430.00,
            estoque: 6,
            categoria: 'Bleach',
            pagina: 'produtos.html',
            descricao: 'Escala: 1/6 (~28 cm), em resina de alto padrão. Pose e Expressão: Postura elegante e serena executando uma dança de gelo. Vestes e Armas: Shihakusho tradicional e a Sode no Shirayuki totalmente branca com fita esvoaçante e cristais de gelo translúcidos em espiral. Base Diorama: Lago congelado com flores de gelo esculpidas e névoa fria ao redor.',
            destaque: true,
            imagem: 'imagens/rukia.png'
        },
        {
            id: '5',
            nome: 'Toshiro Hitsugaya',
            preco: 200.00,
            estoque: 2,
            categoria: 'Bleach',
            pagina: 'produtos.html',
            descricao: 'Escala: 1/6 (~26 cm), em resina de alto padrão. Pose e Expressão: Flutuando em combate com olhar frio e focado de Capitão da 10ª Divisão. Vestes e Armas: Haori branco de Capitão esvoaçante, empunhando a Hyorinmaru envolta por um dragão de gelo translúcido com detalhes em azul cristalino. Base Diorama: Pilar de gelo pontiagudo emergindo do chão.',
            destaque: true,
            imagem: 'imagens/toshiro.png'
        },
        {
            id: '6',
            nome: 'Levi Ackerman',
            preco: 250.00,
            estoque: 5,
            categoria: 'Attack on Titan',
            pagina: 'index.html',
            descricao: 'Escala: 1/6 (~29 cm), em resina de alto padrão. Pose e Expressão: No ar em pleno giro de ataque com expressão fria e olhar cortante de Capitão da Tropa de Exploração. Vestes e Armas: Capa verde com o brasão das Asas da Liberdade em movimento, equipamento DMT detalhado com cabos metálicos e lâminas duplas empunhadas em pegada invertida. Base Diorama: Telhado europeu quebrado com fumaça de propulsão translúcida.',
            destaque: false,
            imagem: 'imagens/Levi.png'
        },
        {
            id: '7',
            nome: 'Maomao',
            preco: 300.00,
            estoque: 4,
            categoria: 'Diário de uma Apotecária',
            pagina: 'index.html',
            descricao: 'Escala: 1/6 (~25 cm), em resina de alto padrão. Pose e Expressão: Examinando atentamente um frasco de ervas com sorriso curioso e sardas delicadas (inclui rosto extra empolgado ao encontrar veneno). Vestes e Acessórios: Traje tradicional do Palácio Interno em tons de verde e rosa com acabamento texturizado, acompanhada de pilão, almofariz e caderno de anotações. Base Diorama: Mesa de boticário em madeira esculpida com potes de ervas e flores medicinais.',
            destaque: false,
            imagem: 'imagens/Maomao.png'
        },
        {
            id: '8',
            nome: 'Satoru Gojo',
            preco: 350.00,
            estoque: 3,
            categoria: 'Jujutsu Kaisen',
            pagina: 'index.html',
            descricao: 'Escala: 1/6 (~33 cm), em resina de alto padrão. Pose e Expressão: Flutuando de forma relaxada e confiante, puxando a venda preta para revelar o brilho intenso dos Seis Olhos azuis. Vestes e Poderes: Uniforme escuro da Escola Jujutsu com textura fosca e esfera translúcida de Energia Amaldiçoada Vazio Roxo flutuando na ponta dos dedos. Base Diorama: Escombros urbanos suspensos no ar por distorção espacial.',
            destaque: false,
            imagem: 'imagens/Canva - download.png'
        },
        {
            id: '9',
            nome: 'Greninja',
            preco: 400.00,
            estoque: 2,
            categoria: 'Pokémon',
            pagina: 'index.html',
            descricao: 'Escala: 1/6 (~27 cm), em resina de alto padrão. Pose e Expressão: Agachado sobre a superfície da água em postura ágil de ninja, pronto para o bote com olhar focado. Vestes e Poderes: Cachecol longo e fluido esculpido com movimento dinâmico e duas Water Shurikens gigantes em resina azul translúcida com efeito de respingos. Base Diorama: Onda cristalina quebrando sobre rochas submersas.',
            destaque: false,
            imagem: 'imagens/Canva - download (1).png'
        },
        {
            id: '10',
            nome: 'Snorlax',
            preco: 450.00,
            estoque: 1,
            categoria: 'Pokémon',
            pagina: 'index.html',
            descricao: 'Escala: 1/6 (~28 cm de altura e largura), em resina maciça de alto padrão. Pose e Expressão: Tirando um cochilo profundo de barriga para cima após um banquete, com expressão tranquila e feliz. Detalhes e Acessórios: Pintura fosca com sombreamento suave na pelagem azul-petróleo e creme, acompanhado de uma Poké Flauta dourada e várias Berries espalhadas ao redor. Base Diorama: Gramado florido da Rota 12 com placa de madeira.',
            destaque: false,
            imagem: 'imagens/Snorlax.png'
        }
    ]
};

function lerJsonSeguroSR(chave, fallback = null) {
    try {
        const bruto = localStorage.getItem(chave);
        if (bruto === null || bruto === '') return fallback;
        return JSON.parse(bruto);
    } catch {
        return fallback;
    }
}

function formatarBRLSiteSR(valor) {
    return (Number(valor) || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function escaparTextoSiteSR(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// =========================================================
// HISTÓRICO DE PESQUISAS, NOTIFICAÇÕES E RECLAMAÇÕES
// =========================================================

window.registrarPesquisaSR = function (termo, filtros = {}) {
    const limpo = String(termo || '').trim();
    const usuarioEmail = (localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioAtual) || 'visitante').trim().toLowerCase();
    if (!limpo && !filtros.categoria && !filtros.preco) return;

    const lista = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.historicoPesquisas, []);
    const arr = Array.isArray(lista) ? lista : [];
    arr.push({
        id: `pesq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        usuarioEmail,
        termo: limpo || '(Filtro aplicado)',
        categoria: filtros.categoria || 'Todos',
        preco: filtros.preco || 'todos',
        timestamp: Date.now(),
        dataHora: new Date().toLocaleString('pt-BR')
    });
    localStorage.setItem(CONFIG_SITE_SR.chaves.historicoPesquisas, JSON.stringify(arr.slice(-100)));
};

window.obterHistoricoPesquisasSR = function (ordem = 'recentes') {
    const usuarioEmail = (localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioAtual) || '').trim().toLowerCase();
    const lista = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.historicoPesquisas, []);
    const filtrada = (Array.isArray(lista) ? lista : []).filter((item) => {
        if (!usuarioEmail) return true;
        return item.usuarioEmail === usuarioEmail || item.usuarioEmail === 'visitante';
    });

    return filtrada.sort((a, b) => ordem === 'antigas'
        ? (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0)
        : (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
};

window.obterHistoricoPedidosSR = function (ordem = 'recentes') {
    const usuarioEmail = (localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioAtual) || '').trim().toLowerCase();
    const pedidos = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.pedidos, []);
    const lista = (Array.isArray(pedidos) ? pedidos : []).filter((p) => {
        if (!usuarioEmail) return true;
        return !p.clienteEmail || String(p.clienteEmail).toLowerCase() === usuarioEmail;
    });

    return lista.map((p, idx) => ({
        ...p,
        _ordemTs: Number(p.timestamp) || (Number(p.numeroPedido) || (idx + 1)) * 1000
    })).sort((a, b) => ordem === 'antigas'
        ? a._ordemTs - b._ordemTs
        : b._ordemTs - a._ordemTs);
};

window.adicionarNotificacaoSR = function (titulo, mensagem, tipo = 'promo') {
    const usuarioEmail = (localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioAtual) || 'geral').trim().toLowerCase();
    const lista = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.notificacoes, []);
    const arr = Array.isArray(lista) ? lista : [];
    arr.unshift({
        id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        usuarioEmail,
        titulo,
        mensagem,
        tipo,
        lida: false,
        dataHora: new Date().toLocaleString('pt-BR')
    });
    localStorage.setItem(CONFIG_SITE_SR.chaves.notificacoes, JSON.stringify(arr.slice(0, 50)));
};

window.registrarReclamacaoSR = function ({ pedidoNumero = '', categoria = 'Pedido / Entrega', descricao = '' }) {
    const usuarioEmail = (localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioAtual) || 'visitante').trim().toLowerCase();
    const usuarioNome = localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioNome) || 'Cliente';
    const protocolo = `SR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const lista = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.reclamacoes, []);
    const arr = Array.isArray(lista) ? lista : [];
    const registro = {
        protocolo,
        usuarioEmail,
        usuarioNome,
        pedidoNumero: String(pedidoNumero || '').trim(),
        categoria,
        descricao: String(descricao || '').trim(),
        status: 'Aberto - Em análise',
        dataHora: new Date().toLocaleString('pt-BR')
    };
    arr.unshift(registro);
    localStorage.setItem(CONFIG_SITE_SR.chaves.reclamacoes, JSON.stringify(arr));

    window.adicionarNotificacaoSR(
        `Protocolo ${protocolo} aberto`,
        `Sua reclamação sobre "${categoria}" foi registrada com sucesso.`,
        'suporte'
    );

    return registro;
};

// =========================================================
// CATÁLOGO DE PRODUTOS
// =========================================================

async function carregarProdutosSR() {
    let baseProdutos = CONFIG_SITE_SR.catalogoFallback.slice();

    try {
        const resp = await fetch('produtos.json');
        if (resp.ok) {
            const listaJson = await resp.json();
            if (Array.isArray(listaJson) && listaJson.length > 0) {
                baseProdutos = listaJson;
            }
        }
    } catch {}

    const customSalvos = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.produtosCustom, []);
    const custom = Array.isArray(customSalvos) ? customSalvos : [];

    const mapa = new Map();
    baseProdutos.forEach((item, idx) => {
        if (!item || !item.nome) return;
        const chave = String(item.nome).trim().toLowerCase();
        mapa.set(chave, {
            id: item.id || String(idx + 1),
            nome: String(item.nome).trim(),
            preco: Number(item.preco) || 0,
            estoque: Number(item.estoque) >= 0 ? Number(item.estoque) : 5,
            categoria: String(item.categoria || 'Colecionável').trim(),
            pagina: item.pagina || 'produtos.html',
            descricao: String(item.descricao || '').trim(),
            destaque: Boolean(item.destaque),
            imagem: String(item.imagem || 'imagens/produto.png').trim()
        });
    });

    custom.forEach((item, idx) => {
        if (!item || !item.nome) return;
        const chave = String(item.nome).trim().toLowerCase();
        const anterior = mapa.get(chave) || {};
        mapa.set(chave, {
            id: item.id || anterior.id || `custom_${idx + 1}`,
            nome: String(item.nome).trim(),
            preco: Number(item.preco) || Number(anterior.preco) || 0,
            estoque: Number(item.estoque) >= 0 ? Number(item.estoque) : (Number(anterior.estoque) || 5),
            categoria: String(item.categoria || anterior.categoria || 'Colecionável').trim(),
            pagina: item.pagina || anterior.pagina || 'produtos.html',
            descricao: String(item.descricao || anterior.descricao || '').trim(),
            destaque: Boolean(item.destaque ?? anterior.destaque),
            imagem: String(item.imagem || anterior.imagem || 'imagens/produto.png').trim()
        });
    });

    return Array.from(mapa.values());
}

window.carregarProdutosSR = carregarProdutosSR;

function abreModalCliente() {
    const modal = document.getElementById('modalCliente');
    if (modal) modal.classList.add('aberto');
}

function fechaModalCliente() {
    const modal = document.getElementById('modalCliente');
    if (modal) modal.classList.remove('aberto');
}

function toggleSenha(inputId, btnElement) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        if (btnElement) btnElement.textContent = '🙈';
    } else {
        input.type = 'password';
        if (btnElement) btnElement.textContent = '👁️';
    }
}

function exibirAvisoSite(mensagem, titulo = '- Shadow Realm Store -', aoFechar = null, isHTML = false) {
    if (window.srModal && typeof window.srModal.alerta === 'function') {
        window.srModal.alerta(mensagem, titulo, isHTML, aoFechar);
        return;
    }

    const tentar = () => {
        if (window.srModal && typeof window.srModal.alerta === 'function') {
            window.srModal.alerta(mensagem, titulo, isHTML, aoFechar);
        } else if (typeof aoFechar === 'function') {
            aoFechar();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tentar, { once: true });
    } else {
        setTimeout(tentar, 50);
    }
}

function exibirConfirmacaoSite(mensagem, aoConfirmar, titulo = '- Confirmação -', isHTML = false) {
    if (window.srModal && typeof window.srModal.confirmar === 'function') {
        window.srModal.confirmar(mensagem, aoConfirmar, titulo, isHTML);
        return;
    }

    const tentar = () => {
        if (window.srModal && typeof window.srModal.confirmar === 'function') {
            window.srModal.confirmar(mensagem, aoConfirmar, titulo, isHTML);
        } else if (typeof aoConfirmar === 'function') {
            aoConfirmar();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tentar, { once: true });
    } else {
        setTimeout(tentar, 50);
    }
}

function sairConta() {
    localStorage.removeItem(CONFIG_SITE_SR.chaves.usuarioLogado);
    localStorage.removeItem(CONFIG_SITE_SR.chaves.usuarioAtual);
    localStorage.removeItem(CONFIG_SITE_SR.chaves.usuarioNome);
    localStorage.removeItem(CONFIG_SITE_SR.chaves.tipoUsuario);
    localStorage.removeItem(CONFIG_SITE_SR.chaves.clienteLogado);

    exibirAvisoSite('Você saiu da sua conta.', '- Até logo! -', () => {
        window.location.href = 'index.html';
    });
}

function obterChaveCartoesUsuario() {
    const usuarioAtual = (localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioAtual) || '').trim().toLowerCase();
    return usuarioAtual ? `${CONFIG_SITE_SR.chaves.cartoesBase}_${usuarioAtual}` : CONFIG_SITE_SR.chaves.cartoesBase;
}

function lerCartoesUsuario() {
    const chave = obterChaveCartoesUsuario();
    const dados = lerJsonSeguroSR(chave, null);
    if (Array.isArray(dados)) return dados;

    const legado = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.cartoesBase, []);
    return Array.isArray(legado) ? legado : [];
}

function salvarCartoesUsuario(lista) {
    const chave = obterChaveCartoesUsuario();
    localStorage.setItem(chave, JSON.stringify(Array.isArray(lista) ? lista : []));
}

window.addEventListener('DOMContentLoaded', () => {
    const paginaAtual = window.location.pathname.split('/').pop().toLowerCase();
    const estaLogado = localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioLogado) === 'true';

    if (estaLogado && paginaAtual === 'cliente.html') {
        exibirAvisoSite('Você já está logado em uma conta!', '- Conta Ativa -', () => {
            window.location.href = 'index.html';
        });
        return;
    }

    const modalConteudo = document.querySelector('.modalCliente-conteudo');
    const navUsuario = document.querySelector('.nav-usuario');

    if (navUsuario && estaLogado) {
        const nomeSalvo = localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioNome) || 'Cliente';
        const primeiroNome = nomeSalvo.split(' ')[0];

        if (modalConteudo) {
            const tituloModal = modalConteudo.querySelector('h2');
            if (tituloModal) {
                tituloModal.textContent = `Olá, ${primeiroNome}!`;
            }
        }

        const linkCadastro = navUsuario.querySelector('a[href="cadastro.html"]');
        const linkLogin = navUsuario.querySelector('a[href="cliente.html"]');
        if (linkCadastro) linkCadastro.style.display = 'none';
        if (linkLogin) linkLogin.style.display = 'none';

        if (!document.getElementById('link-sair-conta')) {
            const linkSair = document.createElement('a');
            linkSair.href = '#';
            linkSair.id = 'link-sair-conta';
            linkSair.textContent = 'Sair';
            linkSair.addEventListener('click', (e) => {
                e.preventDefault();
                sairConta();
            });
            navUsuario.appendChild(linkSair);
        }
    }

    const inputCpf = document.getElementById('cpf');
    if (inputCpf) {
        inputCpf.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = v;
        });
    }

    const modalCliente = document.getElementById('modalCliente');
    if (modalCliente) {
        modalCliente.addEventListener('click', (e) => {
            if (e.target === modalCliente) fechaModalCliente();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalCliente && modalCliente.classList.contains('aberto')) {
            fechaModalCliente();
        }
    });

    document.querySelectorAll('.nav .link, .nav .botaoUsuario').forEach((el) => {
        const img = el.querySelector('img');
        const textoTooltip = el.getAttribute('data-tooltip') ||
            (img && img.getAttribute('alt')) ||
            el.getAttribute('aria-label') ||
            el.getAttribute('title');

        if (textoTooltip) {
            el.setAttribute('data-tooltip', textoTooltip);
            el.removeAttribute('title');
        }
    });
});

function cpfInvalido(rawCpf) {
    const cpf = String(rawCpf || '').replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return true;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i), 10) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    const digito1 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito1 !== parseInt(cpf.charAt(9), 10)) return true;

    soma = 0;
    for (let j = 0; j < 10; j++) {
        soma += parseInt(cpf.charAt(j), 10) * (11 - j);
    }
    resto = 11 - (soma % 11);
    const digito2 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito2 !== parseInt(cpf.charAt(10), 10)) return true;

    return false;
}

function verificarMaioridadeCadastro(f) {
    if (!f) return { ok: true };

    const campoNasc = f.querySelector('input[type="date"], input[name*="nasc"], input[id*="nasc"]');
    if (campoNasc && campoNasc.value) {
        const dataNasc = new Date(`${campoNasc.value}T00:00:00`);
        if (!Number.isNaN(dataNasc.getTime())) {
            const hoje = new Date();
            let idade = hoje.getFullYear() - dataNasc.getFullYear();
            const m = hoje.getMonth() - dataNasc.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < dataNasc.getDate())) {
                idade--;
            }
            if (idade < 18) {
                return { ok: false, motivo: 'Cadastro restrito a maiores de 18 anos (RN05).' };
            }
        }
    }

    const campoMenor = f.querySelector('input[name*="menor"], input[id*="menor"]');
    if (campoMenor && campoMenor.checked) {
        return { ok: false, motivo: 'Cadastro restrito a maiores de 18 anos (RN05).' };
    }

    return { ok: true };
}

var usuarioEncontradoLogin = null;

async function validaLogin() {
    const f = document.frmlogin;
    if (!f) return false;

    const email = f.txtemail.value.trim().toLowerCase();
    const senha = f.txtsenha.value;

    const expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!expRegemail.test(email)) {
        exibirAvisoSite('Preencha o Campo Email ou formato inválido!', '- Login -', () => {
            f.txtemail.focus();
        });
        return false;
    }

    if (senha.trim() === '') {
        exibirAvisoSite('Preencha o Campo Senha corretamente!', '- Login -', () => {
            f.txtsenha.focus();
        });
        return false;
    }

    const usuariosLocais = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.usuarios, []);
    let clientesJSON = [];
    try {
        const respClientes = await fetch('clientes.json');
        if (respClientes.ok) clientesJSON = await respClientes.json();
    } catch {}

    const todosClientes = (Array.isArray(usuariosLocais) ? usuariosLocais : [])
        .concat(Array.isArray(clientesJSON) ? clientesJSON : []);

    usuarioEncontradoLogin = todosClientes.find((u) =>
        u.email && u.email.trim().toLowerCase() === email && u.senha === senha
    );

    if (!usuarioEncontradoLogin) {
        exibirAvisoSite('E-mail ou senha incorretos! Verifique seus dados ou cadastre-se.', '- Credenciais Inválidas -');
        return false;
    }

    abreModalLogin();
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    const navUsuario = document.querySelector('#modalCliente .nav-usuario');
    const usuarioLogado = localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioLogado) === 'true';
    const tipoUsuario = localStorage.getItem(CONFIG_SITE_SR.chaves.tipoUsuario);

    if (navUsuario && usuarioLogado && tipoUsuario === 'admin') {
        if (!navUsuario.querySelector('a[href="estoque.html"]')) {
            const linkEstoque = document.createElement('a');
            linkEstoque.href = 'estoque.html';
            linkEstoque.textContent = '📦 Gerenciar Estoque';
            navUsuario.prepend(linkEstoque);
        }

        if (!navUsuario.querySelector('a[href="cadastroAdmin.html"]')) {
            const linkNovoAdmin = document.createElement('a');
            linkNovoAdmin.href = 'cadastroAdmin.html';
            linkNovoAdmin.textContent = '🛡️ Cadastrar Novo Admin';
            navUsuario.prepend(linkNovoAdmin);
        }
    }
});

function abreModalLogin() {
    const f = document.frmlogin;
    if (!f) return;
    const dados = [
        ['Email', f.txtemail.value.trim()],
        ['Senha', '•'.repeat(f.txtsenha.value.length)]
    ];
    renderizarListaModal('listaDadosLogin', dados);
    const modal = document.getElementById('modalDadosLogin');
    if (modal) modal.classList.add('aberto');
}

function renderizarListaModal(idElemento, dados) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    elemento.innerHTML = '';
    dados.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${escaparTextoSiteSR(item[0])}:</strong> ${escaparTextoSiteSR(item[1])}`;
        elemento.appendChild(li);
    });
}

function fechaModalLogin() {
    const modal = document.getElementById('modalDadosLogin');
    if (modal) modal.classList.remove('aberto');
}

function confirmaLogin() {
    const f = document.frmlogin;
    const email = f ? f.txtemail.value.trim().toLowerCase() : ((usuarioEncontradoLogin && usuarioEncontradoLogin.email) || '');
    const nomeUsuario = (usuarioEncontradoLogin && usuarioEncontradoLogin.nome) ? usuarioEncontradoLogin.nome : email.split('@')[0];

    localStorage.setItem(CONFIG_SITE_SR.chaves.usuarioLogado, 'true');
    localStorage.setItem(CONFIG_SITE_SR.chaves.usuarioAtual, email);
    localStorage.setItem(CONFIG_SITE_SR.chaves.usuarioNome, nomeUsuario);
    localStorage.setItem(CONFIG_SITE_SR.chaves.tipoUsuario, 'cliente');
    localStorage.setItem(CONFIG_SITE_SR.chaves.clienteLogado, JSON.stringify({
        nome: nomeUsuario,
        email,
        cpf: (usuarioEncontradoLogin && usuarioEncontradoLogin.cpf) || '',
        tipo: 'cliente'
    }));

    fechaModalLogin();
    if (f) f.reset();

    exibirAvisoSite('Login realizado com sucesso!', '- Bem-vindo -', () => {
        window.location.href = 'index.html';
    });
}

function verificaMotivo() {
    const barraFill = document.querySelector('.forca-senha-barra-fill');
    const barraTexto = document.querySelector('.forca-senha-texto');
    if (barraFill) barraFill.style.width = '0%';
    if (barraTexto) {
        barraTexto.style.color = '#888';
        barraTexto.textContent = 'Força da senha';
    }
}

function validaCadastro() {
    const f = document.frmcadastro;
    if (!f) return false;

    const nome = f.txtnome.value;
    const expRegnome = /^[A-ZÀ-Ú][a-zà-ú]+(\s+[A-ZÀ-Ú][a-zà-ú]+)+$/i;
    if (!expRegnome.test(nome.trim())) {
        exibirAvisoSite('Preencha o Campo Nome completo (nome e sobrenome)!', '- Cadastro -', () => {
            f.txtnome.focus();
        });
        return false;
    }

    const email = f.txtemail.value;
    const expRegemail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!expRegemail.test(email.trim())) {
        exibirAvisoSite('Preencha o Campo Email ou formato inválido!', '- Cadastro -', () => {
            f.txtemail.focus();
        });
        return false;
    }

    const cpf = f.txtcpf.value.trim();
    if (cpf === '' || cpfInvalido(cpf)) {
        exibirAvisoSite('CPF inválido! Verifique os números digitados.', '- Cadastro -', () => {
            f.txtcpf.focus();
        });
        return false;
    }

    const checagemIdade = verificarMaioridadeCadastro(f);
    if (!checagemIdade.ok) {
        exibirAvisoSite(checagemIdade.motivo, '- Restrição de Idade (18+) -', () => {
            f.txtcpf.focus();
        });
        return false;
    }

    const senha = f.txtsenha.value;
    const expRegsenha = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (senha.trim() === '' || !expRegsenha.test(senha)) {
        exibirAvisoSite('Preencha o Campo Senha corretamente! Ela deve ter no mínimo 8 caracteres, contendo letras e números.', '- Cadastro -', () => {
            f.txtsenha.focus();
        });
        return false;
    }

    abreModalCadastro();
    return false;
}

function abreModalCadastro() {
    const f = document.frmcadastro;
    if (!f) return;
    const dados = [
        ['Nome Completo', f.txtnome.value.trim()],
        ['Email', f.txtemail.value.trim()],
        ['Senha', '•'.repeat(f.txtsenha.value.length)],
        ['CPF', f.txtcpf.value.trim()]
    ];
    renderizarListaModal('listaDadosCadastro', dados);
    const modal = document.getElementById('modalDadosCadastro');
    if (modal) modal.classList.add('aberto');
}

function fechaModalCadastro() {
    const modal = document.getElementById('modalDadosCadastro');
    if (modal) modal.classList.remove('aberto');
}

function confirmaCadastro() {
    const f = document.frmcadastro;
    if (!f) return;

    const novoUsuario = {
        nome: f.txtnome.value.trim(),
        email: f.txtemail.value.trim().toLowerCase(),
        cpf: f.txtcpf.value.trim(),
        senha: f.txtsenha.value
    };

    const usuariosLocais = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.usuarios, []);
    const listaUsuarios = Array.isArray(usuariosLocais) ? usuariosLocais : [];

    const jaExiste = listaUsuarios.some((u) =>
        (u.email && u.email.toLowerCase() === novoUsuario.email) || (u.cpf && u.cpf === novoUsuario.cpf)
    );

    if (jaExiste) {
        fechaModalCadastro();
        exibirAvisoSite('Este e-mail ou CPF já está cadastrado!', '- Cadastro Duplicado -');
        return;
    }

    listaUsuarios.push(novoUsuario);
    localStorage.setItem(CONFIG_SITE_SR.chaves.usuarios, JSON.stringify(listaUsuarios));
    localStorage.setItem(CONFIG_SITE_SR.chaves.usuarioLogado, 'true');
    localStorage.setItem(CONFIG_SITE_SR.chaves.usuarioAtual, novoUsuario.email);
    localStorage.setItem(CONFIG_SITE_SR.chaves.usuarioNome, novoUsuario.nome);
    localStorage.setItem(CONFIG_SITE_SR.chaves.tipoUsuario, 'cliente');
    localStorage.setItem(CONFIG_SITE_SR.chaves.clienteLogado, JSON.stringify({
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        cpf: novoUsuario.cpf,
        tipo: 'cliente'
    }));

    fechaModalCadastro();
    f.reset();

    exibirAvisoSite('Cadastro realizado com sucesso!', '- Bem-vindo à Shadow Realm -', () => {
        window.location.href = 'index.html';
    });
}

// =========================================================
// CARRINHO, CUPONS, FRETE, RETIRADA NA LOJA E CHECKOUT
// =========================================================

function validarCepERaioLojaSR(cepBruto) {
    const digitos = String(cepBruto || '').replace(/\D/g, '');
    if (digitos.length !== 8) {
        return { valido: false, mensagem: 'Informe um CEP válido com 8 dígitos.' };
    }
    const prefixo = parseInt(digitos.slice(0, 2), 10);
    // Prefixos 01-19 (Grande SP / região sede de referência) ou 88-89 (Joinville/SC) simulam raio elegível de 15 km
    const elegivelRetirada = (prefixo >= 1 && prefixo <= 19) || prefixo === 89;
    return {
        valido: true,
        cepFormatado: `${digitos.slice(0, 5)}-${digitos.slice(5)}`,
        elegivelRetirada,
        prazoDias: elegivelRetirada ? '2 a 4 dias úteis' : '4 a 8 dias úteis'
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('products-list');
    const priceBreakdown = document.querySelector('.price-breakdown');
    const modalTotalValue = document.querySelector('.modal-total-value');
    const addressForm = document.querySelector('.address-column');
    const btnBuy = document.querySelector('.btn-buy');

    const couponInput = document.getElementById('coupon-input');
    const btnCoupon = document.getElementById('btn-coupon');
    const couponMessage = document.getElementById('coupon-message');
    const btncancelar = document.getElementById('btn-cancelar');

    let descontoCupomPerc = 0;
    let cupomAtivo = '';
    let retiradaNaLojaAtiva = false;

    function obterCarrinho() {
        const dados = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.carrinho, []);
        return Array.isArray(dados) ? dados : [];
    }

    function clienteJaFezCompra() {
        const emailAtual = (localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioAtual) || '').trim().toLowerCase();
        const clienteObj = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.clienteLogado, {});
        const cpfAtual = String(clienteObj?.cpf || '').replace(/\D/g, '');
        const pedidos = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.pedidos, []);
        const usados = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.cuponsUsados, []);

        const temPedidoAnterior = Array.isArray(pedidos) && pedidos.some((p) => {
            const mesmoEmail = emailAtual && String(p.clienteEmail || '').toLowerCase() === emailAtual;
            const mesmoCpf = cpfAtual && String(p.clienteCpf || '').replace(/\D/g, '') === cpfAtual;
            return mesmoEmail || mesmoCpf;
        });

        const usouShadow26 = Array.isArray(usados) && usados.some((u) => {
            const mesmoEmail = emailAtual && String(u.email || '').toLowerCase() === emailAtual;
            const mesmoCpf = cpfAtual && String(u.cpf || '').replace(/\D/g, '') === cpfAtual;
            return u.cupom === 'SHADOW26' && (mesmoEmail || mesmoCpf);
        });

        return temPedidoAnterior || usouShadow26;
    }

    function injetarControlesEntregaNoCheckout() {
        if (!addressForm || document.getElementById('grupo-cep-retirada-sr')) return;

        const containerExtra = document.createElement('div');
        containerExtra.id = 'grupo-cep-retirada-sr';
        containerExtra.style.cssText = 'display:flex; flex-direction:column; gap:8px; margin-top:6px;';
        containerExtra.innerHTML = `
            <div class="form-group">
                <label for="input-cep-sr">CEP</label>
                <input type="text" id="input-cep-sr" maxlength="9" placeholder="00000-000">
            </div>
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color:#ffca28; cursor:pointer;">
                <input type="checkbox" id="check-retirada-loja-sr" disabled>
                <span>Retirar na Loja Física (raio de 15 km)</span>
            </label>
            <small id="status-cep-sr" style="color:#cccccc; font-size:12px; text-align:left;"></small>
        `;

        const btnConfirmarPag = addressForm.querySelector('.btn-confirm-payment');
        if (btnConfirmarPag) {
            addressForm.insertBefore(containerExtra, btnConfirmarPag);
        } else {
            addressForm.appendChild(containerExtra);
        }

        const inputCep = document.getElementById('input-cep-sr');
        const checkRetirada = document.getElementById('check-retirada-loja-sr');
        const statusCep = document.getElementById('status-cep-sr');

        if (inputCep) {
            inputCep.addEventListener('input', (e) => {
                let v = e.target.value.replace(/\D/g, '').slice(0, 8);
                if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
                e.target.value = v;

                const info = validarCepERaioLojaSR(v);
                if (!info.valido) {
                    retiradaNaLojaAtiva = false;
                    if (checkRetirada) {
                        checkRetirada.checked = false;
                        checkRetirada.disabled = true;
                    }
                    if (statusCep) statusCep.textContent = v.length > 0 ? 'Digite os 8 dígitos do CEP para calcular entrega e retirada.' : '';
                    renderizarCarrinho();
                    return;
                }

                if (checkRetirada) {
                    checkRetirada.disabled = !info.elegivelRetirada;
                    if (!info.elegivelRetirada) {
                        checkRetirada.checked = false;
                        retiradaNaLojaAtiva = false;
                    }
                }

                if (statusCep) {
                    statusCep.textContent = info.elegivelRetirada
                        ? `CEP ${info.cepFormatado} elegível para Retirada na Loja (até 15 km) • Prazo: ${info.prazoDias}.`
                        : `CEP ${info.cepFormatado} fora do raio de 15 km para retirada local • Prazo entrega: ${info.prazoDias}.`;
                }
                renderizarCarrinho();
            });
        }

        if (checkRetirada) {
            checkRetirada.addEventListener('change', () => {
                retiradaNaLojaAtiva = Boolean(checkRetirada.checked);
                renderizarCarrinho();
            });
        }
    }

    injetarControlesEntregaNoCheckout();

    if (btnBuy) {
        btnBuy.onclick = (e) => {
            const carrinho = obterCarrinho();
            if (carrinho.length === 0) {
                e.preventDefault();
                exibirAvisoSite('Seu carrinho está vazio! Adicione produtos antes de prosseguir.', '- Carrinho Vazio -');
                return;
            }
            const estaLogado = localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioLogado) === 'true';
            if (!estaLogado) {
                e.preventDefault();
                exibirAvisoSite('Você precisa estar logado para finalizar a compra!', '- Login Necessário -', () => {
                    window.location.href = 'cliente.html';
                });
            }
        };
    }

    if (btnCoupon && couponInput) {
        btnCoupon.onclick = () => {
            const codigoDigitado = couponInput.value.trim().toUpperCase();

            if (codigoDigitado === '') {
                exibirMensagemCupom('Digite um cupom.', '#ffaa00');
                return;
            }

            const regraCupom = CONFIG_SITE_SR.cupons[codigoDigitado];
            if (regraCupom) {
                if (regraCupom.apenasPrimeiraCompra && clienteJaFezCompra()) {
                    descontoCupomPerc = 0;
                    cupomAtivo = '';
                    exibirMensagemCupom('Cupom SHADOW26 é exclusivo para a primeira compra!', '#ff4444');
                    renderizarCarrinho();
                    return;
                }

                descontoCupomPerc = regraCupom.desconto;
                cupomAtivo = codigoDigitado;
                const porcText = Math.round(descontoCupomPerc * 100) + '%';
                exibirMensagemCupom(`Cupom ${codigoDigitado} aplicado! (-${porcText})`, '#00ff88');
                renderizarCarrinho();
            } else {
                descontoCupomPerc = 0;
                cupomAtivo = '';
                exibirMensagemCupom('Cupom inválido!', '#ff4444');
                renderizarCarrinho();
            }
        };
    }

    if (btncancelar) {
        btncancelar.onclick = () => {
            if (descontoCupomPerc === 0 && cupomAtivo === '') {
                exibirMensagemCupom('Nenhum cupom aplicado no momento.', '#ffaa00');
                return;
            }
            descontoCupomPerc = 0;
            cupomAtivo = '';
            if (couponInput) couponInput.value = '';
            exibirMensagemCupom('Cupom cancelado.', '#ffaa00');
            renderizarCarrinho();
        };
    }

    function exibirMensagemCupom(texto, cor) {
        if (couponMessage) {
            couponMessage.textContent = texto;
            couponMessage.style.color = cor;
        }
    }

    function calcularTotaisCarrinho(itens) {
        const totalUnidades = itens.reduce((acc, item) => acc + (Number(item.quantidade) || 0), 0);
        const subtotalBruto = itens.reduce((acc, item) => acc + ((Number(item.preco) || 0) * (Number(item.quantidade) || 0)), 0);

        const maiorItem = itens.reduce((max, item) => {
            const p = Number(item.preco) || 0;
            return p > max ? p : max;
        }, 0);

        const descontoVolume = totalUnidades >= CONFIG_SITE_SR.minItensDescontoVolume
            ? maiorItem * CONFIG_SITE_SR.descontoVolumePercentual
            : 0;

        const subtotalAposVolume = Math.max(0, subtotalBruto - descontoVolume);
        const valorDescontoCupom = subtotalAposVolume * descontoCupomPerc;
        const subtotalLiquido = Math.max(0, subtotalAposVolume - valorDescontoCupom);

        const frete = subtotalBruto === 0
            ? 0
            : (retiradaNaLojaAtiva || subtotalLiquido >= CONFIG_SITE_SR.limiteFreteGratis ? 0 : CONFIG_SITE_SR.valorFretePadrao);

        const totalFinal = subtotalLiquido + frete;
        return {
            totalUnidades,
            subtotal: subtotalBruto,
            descontoVolume,
            valorDesconto: valorDescontoCupom,
            subtotalComDesconto: subtotalLiquido,
            frete,
            totalFinal
        };
    }

    function obterEstoqueCarrinho(nomeProduto) {
        if (typeof window.obterEstoque === 'function') {
            return window.obterEstoque(nomeProduto);
        }
        const est = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.estoque, null);
        if (est && est[nomeProduto] !== undefined) {
            return Number(est[nomeProduto]);
        }
        return 0;
    }

    function renderizarCarrinho() {
        const carrinho = obterCarrinho();

        if (productsList && typeof window.reRenderizarCarrinhoSemReload !== 'function') {
            if (carrinho.length === 0) {
                productsList.innerHTML = '<p class="empty-cart-msg" style="color: #ffffff; text-align: center;">Seu carrinho está vazio. <a href="produtos.html" style="color:#ffca28; text-decoration:underline;">Ir para a vitrine</a></p>';
            } else {
                productsList.innerHTML = '';

                carrinho.forEach((item, index) => {
                    const disponivel = obterEstoqueCarrinho(item.nome);
                    const atingiuLimite = item.quantidade >= disponivel;

                    const card = document.createElement('article');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <div class="product-thumb">
                            <img src="${escaparTextoSiteSR(item.imagem || 'imagens/logo.png')}" alt="${escaparTextoSiteSR(item.nome)}">
                        </div>
                        <div style="flex:1; margin-left: 20px;">
                            <h3 class="product-name" style="margin-left:0;">${escaparTextoSiteSR(item.nome)}</h3>
                            <small style="color:#ffca28;">R$ ${formatarBRLSiteSR(item.preco * item.quantidade)}</small>
                            <small style="display:block; margin-top:4px; font-size:12px; color:${atingiuLimite ? '#ff4d4d' : '#aaa'};">
                                Disponível em estoque: ${disponivel} un.
                            </small>
                        </div>
                        <div class="quantity-controls">
                            <button type="button" class="btn-plus" onclick="alterarQuantidade(${index}, 1)"
                                ${atingiuLimite ? 'disabled style="opacity:0.35; cursor:not-allowed;" title="Limite máximo de estoque atingido"' : ''}>+</button>
                            <span class="qty-value">${item.quantidade}</span>
                            <button type="button" class="btn-minus" onclick="alterarQuantidade(${index}, -1)">-</button>
                        </div>
                        <button type="button" class="btn-remove" onclick="removerProduto(${index})" title="Remover item" aria-label="Remover ${escaparTextoSiteSR(item.nome)}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    `;
                    productsList.appendChild(card);
                });
            }
        }

        atualizarResumo(carrinho);
    }

    if (typeof window.alterarQuantidade !== 'function') {
        window.alterarQuantidade = function (index, delta) {
            const carrinho = obterCarrinho();
            if (!carrinho[index]) return;

            if (delta > 0) {
                const disponivel = obterEstoqueCarrinho(carrinho[index].nome);
                if (carrinho[index].quantidade + delta > disponivel) {
                    exibirAvisoSite(`Limite de estoque atingido! Temos apenas <strong>${disponivel}</strong> unidade(s) de <strong>${escaparTextoSiteSR(carrinho[index].nome)}</strong>.`, '- Estoque Máximo -', null, true);
                    renderizarCarrinho();
                    return;
                }
            }

            carrinho[index].quantidade += delta;
            if (carrinho[index].quantidade <= 0) {
                carrinho.splice(index, 1);
            }

            localStorage.setItem(CONFIG_SITE_SR.chaves.carrinho, JSON.stringify(carrinho));
            renderizarCarrinho();
            if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
        };
    }

    if (typeof window.removerProduto !== 'function') {
        window.removerProduto = function (index) {
            const carrinho = obterCarrinho();
            carrinho.splice(index, 1);
            localStorage.setItem(CONFIG_SITE_SR.chaves.carrinho, JSON.stringify(carrinho));
            renderizarCarrinho();
            if (typeof atualizarBadgeCarrinho === 'function') atualizarBadgeCarrinho();
        };
    }

    function atualizarResumo(itens) {
        if (!priceBreakdown) return;

        const {
            totalUnidades,
            subtotal,
            descontoVolume,
            valorDesconto,
            subtotalComDesconto,
            frete,
            totalFinal
        } = calcularTotaisCarrinho(itens);

        let breakdownHTML = '';

        if (itens.length === 0) {
            breakdownHTML = '<p class="price-item">R$ 0,00</p>';
        } else {
            itens.forEach((item, index) => {
                const mathPrefix = index === 0 ? '' : '+ ';
                const itemSub = item.preco * item.quantidade;
                breakdownHTML += `<p class="price-item">${mathPrefix}R$ ${formatarBRLSiteSR(itemSub)}</p>`;
            });
        }

        if (descontoVolume > 0) {
            breakdownHTML += `<p class="price-item" style="color: #ffca28;">- Desconto Volume (${totalUnidades} itens): R$ ${formatarBRLSiteSR(descontoVolume)}</p>`;
        }

        if (descontoCupomPerc > 0 && subtotal > 0) {
            breakdownHTML += `<p class="price-item" style="color: #00ff88;">- Desconto (${Math.round(descontoCupomPerc * 100)}%): R$ ${formatarBRLSiteSR(valorDesconto)}</p>`;
        }

        if (itens.length > 0) {
            if (retiradaNaLojaAtiva) {
                breakdownHTML += `<p class="price-item" style="color: #00e676;">Retirada na Loja: GRÁTIS (R$ 0,00)</p>`;
            } else if (frete === 0) {
                breakdownHTML += `<p class="price-item" style="color: #00e676;">Frete: GRÁTIS (R$ 0,00)</p>`;
            } else {
                breakdownHTML += `<p class="price-item" style="color: #ffca28;">Frete: + R$ ${formatarBRLSiteSR(CONFIG_SITE_SR.valorFretePadrao)}</p>`;
            }
        }

        breakdownHTML += `<hr class="summary-divider">`;
        breakdownHTML += `<p class="total-final">Valor Total: <span>R$ ${formatarBRLSiteSR(totalFinal)}</span></p>`;

        priceBreakdown.innerHTML = breakdownHTML;

        if (modalTotalValue) {
            modalTotalValue.textContent = `Valor Total: R$ ${formatarBRLSiteSR(totalFinal)}`;
        }

        const avisoFrete = document.getElementById('aviso-frete-gratis');
        if (avisoFrete) {
            if (subtotal === 0) {
                avisoFrete.style.display = 'none';
            } else if (retiradaNaLojaAtiva) {
                avisoFrete.style.display = 'block';
                avisoFrete.style.color = '#00e676';
                avisoFrete.innerHTML = '🏬 Retirada na Loja selecionada — <strong>Frete Grátis</strong>!';
            } else if (subtotalComDesconto >= CONFIG_SITE_SR.limiteFreteGratis) {
                avisoFrete.style.display = 'block';
                avisoFrete.style.color = '#00e676';
                avisoFrete.innerHTML = '🚚 Parabéns! Você ganhou <strong>Frete Grátis</strong> (acima de R$ 150,00)!';
            } else {
                const falta = formatarBRLSiteSR(CONFIG_SITE_SR.limiteFreteGratis - subtotalComDesconto);
                avisoFrete.style.display = 'block';
                avisoFrete.style.color = '#ffca28';
                avisoFrete.innerHTML = `🚚 Adicione mais <strong>R$ ${falta}</strong> para ganhar Frete Grátis!`;
            }
        }
    }

    if (addressForm) {
        addressForm.onsubmit = (e) => {
            e.preventDefault();

            const carrinho = obterCarrinho();
            if (carrinho.length === 0) {
                exibirAvisoSite('Seu carrinho está vazio!', '- Carrinho Vazio -');
                return;
            }

            const estaLogado = localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioLogado) === 'true';
            const usuarioAtual = (localStorage.getItem(CONFIG_SITE_SR.chaves.usuarioAtual) || '').trim().toLowerCase();
            if (!estaLogado || !usuarioAtual) {
                exibirAvisoSite('Faça login para confirmar seu pedido!', '- Login Necessário -', () => {
                    window.location.href = 'cliente.html';
                });
                return;
            }

            const rua = document.getElementById('input-rua')?.value.trim() || '';
            const cidade = document.getElementById('input-cidade')?.value.trim() || '';
            const estado = document.getElementById('input-estado')?.value.trim() || '';
            if (!rua || !cidade || !estado) {
                exibirAvisoSite('Preencha o endereço completo de entrega antes de confirmar.', '- Endereço Incompleto -');
                return;
            }

            const metodoRadio = document.querySelector('input[name="payment-group"]:checked');
            const metodo = metodoRadio ? metodoRadio.value : 'pix';
            const cartoesSalvos = lerCartoesUsuario();

            let descricaoPagamento = 'Pix';
            if (metodo === 'debito' || metodo === 'parcelado') {
                if (cartoesSalvos.length === 0) {
                    exibirAvisoSite('Você não possui cartão cadastrado! Cadastre um cartão ou selecione Pix.', '- Cartão Necessário -');
                    return;
                }
                const selectCartao = document.getElementById('select-cartao-uso');
                const idx = selectCartao ? parseInt(selectCartao.value, 10) : 0;
                const cartaoEscolhido = cartoesSalvos[idx] || cartoesSalvos[0];
                const labelTipo = metodo === 'debito' ? 'Débito' : 'Crédito em até 12x sem juros';
                descricaoPagamento = `${labelTipo} (${cartaoEscolhido.numeroMascarado})`;
            }

            const { totalFinal } = calcularTotaisCarrinho(carrinho);

            if (typeof window.darBaixaNoEstoque === 'function') {
                const resultadoEstoque = window.darBaixaNoEstoque(carrinho);
                if (!resultadoEstoque.sucesso) {
                    exibirAvisoSite(resultadoEstoque.mensagem, '- Estoque Insuficiente -');
                    return;
                }
            }

            const clienteObj = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.clienteLogado, {});
            const cpfAtual = String(clienteObj?.cpf || '').replace(/\D/g, '');
            const pedidosSalvos = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.pedidos, []);
            const pedidos = Array.isArray(pedidosSalvos) ? pedidosSalvos : [];
            const proximoNumero = pedidos.length > 0
                ? Math.max(...pedidos.map((p) => Number(p.numeroPedido) || 1000)) + 1
                : 1001;

            const cepDigitado = document.getElementById('input-cep-sr')?.value.trim() || '';

            pedidos.push({
                numeroPedido: proximoNumero,
                clienteEmail: usuarioAtual,
                clienteCpf: cpfAtual,
                data: new Date().toLocaleDateString('pt-BR'),
                timestamp: Date.now(),
                status: retiradaNaLojaAtiva ? 'Pronto para Retirada na Loja' : 'Pedido Confirmado',
                modalidadeEntrega: retiradaNaLojaAtiva ? 'Retirada na Loja (até 15 km)' : 'Entrega Padrão',
                cep: cepDigitado,
                cartaoUsado: descricaoPagamento,
                enderecoEntrega: `${rua} - ${cidade}/${estado}`,
                cupom: cupomAtivo || null,
                total: Number(totalFinal.toFixed(2)),
                itens: carrinho
            });

            if (cupomAtivo === 'SHADOW26') {
                const usados = lerJsonSeguroSR(CONFIG_SITE_SR.chaves.cuponsUsados, []);
                const listaUsados = Array.isArray(usados) ? usados : [];
                listaUsados.push({ cupom: 'SHADOW26', email: usuarioAtual, cpf: cpfAtual, data: new Date().toLocaleDateString('pt-BR') });
                localStorage.setItem(CONFIG_SITE_SR.chaves.cuponsUsados, JSON.stringify(listaUsados));
            }

            localStorage.setItem(CONFIG_SITE_SR.chaves.pedidos, JSON.stringify(pedidos));
            localStorage.removeItem(CONFIG_SITE_SR.chaves.carrinho);

            window.adicionarNotificacaoSR(
                `Pedido #${proximoNumero} confirmado`,
                `Seu pedido no valor de R$ ${formatarBRLSiteSR(totalFinal)} foi registrado com sucesso.`,
                'pedido'
            );

            exibirAvisoSite(
                `Pagamento confirmado com sucesso! Pedido <strong>#${proximoNumero}</strong> registrado.`,
                '- Pedido Confirmado -',
                () => {
                    window.location.href = 'pedidos.html';
                },
                true
            );
        };
    }

    renderizarCarrinho();
    if (window.promessaEstoqueSR) {
        window.promessaEstoqueSR.then(() => renderizarCarrinho());
    }
});

// =========================================================
// CADASTRO E GERENCIAMENTO DE CARTÕES
// =========================================================

const inputNumero = document.getElementById('numero');
const inputTitular = document.getElementById('titular');
const inputValidade = document.getElementById('validade');
const inputCvv = document.getElementById('cvv');
const inputEndereco = document.getElementById('endereco');
const form = document.getElementById('formCartao');

const modal = document.getElementById('modalDados');
const btnCorrigir = document.getElementById('btnCorrigir');
const btnConfirmar = document.getElementById('btnConfirmar');
const resNumero = document.getElementById('resNumero');
const resTitular = document.getElementById('resTitular');
const resValidade = document.getElementById('resValidade');
const resCvv = document.getElementById('resCvv');
const resEndereco = document.getElementById('resEndereco');

if (inputNumero) {
    inputNumero.addEventListener('input', (e) => {
        const valor = e.target.value.replace(/\D/g, '').substring(0, 16);
        e.target.value = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
}

if (inputTitular) {
    inputTitular.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
}

if (inputValidade) {
    inputValidade.addEventListener('input', (e) => {
        const valor = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (valor.length >= 3) {
            e.target.value = valor.slice(0, 2) + '/' + valor.slice(2);
        } else {
            e.target.value = valor;
        }
    });
}

if (inputCvv) {
    inputCvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
}

function validarValidadeCartao(validade) {
    if (!/^\d{2}\/\d{2}$/.test(validade)) return false;

    const [mesStr, anoStr] = validade.split('/');
    const mes = parseInt(mesStr, 10);
    const ano = 2000 + parseInt(anoStr, 10);

    if (mes < 1 || mes > 12) return false;

    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth() + 1;

    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
        return false;
    }
    return true;
}

function renderizarCartoesSalvos() {
    const container = document.getElementById('listaCartoesSalvos');
    if (!container) return;

    const cartoes = lerCartoesUsuario();

    if (cartoes.length === 0) {
        container.innerHTML = '<p style="color: #aaa; font-size: 18px;">Nenhum cartão cadastrado ainda.</p>';
        return;
    }

    container.innerHTML = '';
    cartoes.forEach((cartao, index) => {
        const tipo = index === 0 ? 'Cartão Principal' : 'Cartão Secundário';
        const botaoPrincipal = index === 1
            ? `<button type="button" class="btn-secundario-cartao" onclick="definirCartaoPrincipal(${index})">Tornar Principal</button>`
            : '';

        const div = document.createElement('div');
        div.className = 'card-cartao-salvo';
        div.innerHTML = `
            <span class="badge-cartao">${tipo}</span>
            <p class="numero-mascarado">${escaparTextoSiteSR(cartao.numeroMascarado)}</p>
            <p><strong>Titular:</strong> ${escaparTextoSiteSR(cartao.titular)}</p>
            <p><strong>Validade:</strong> ${escaparTextoSiteSR(cartao.validade)}</p>
            <div class="acoes-cartao">
                ${botaoPrincipal}
                <button type="button" class="btn-remover-cartao" onclick="removerCartao(${index})">Remover</button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.removerCartao = function (index) {
    exibirConfirmacaoSite('Deseja realmente remover este cartão?', () => {
        const cartoes = lerCartoesUsuario();
        cartoes.splice(index, 1);
        salvarCartoesUsuario(cartoes);
        renderizarCartoesSalvos();
    }, '- Remover Cartão -');
};

window.definirCartaoPrincipal = function (index) {
    const cartoes = lerCartoesUsuario();
    if (index === 1 && cartoes.length === 2) {
        [cartoes[0], cartoes[1]] = [cartoes[1], cartoes[0]];
        salvarCartoesUsuario(cartoes);
        renderizarCartoesSalvos();
    }
};

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cartoes = lerCartoesUsuario();
        if (cartoes.length >= 2) {
            exibirAvisoSite('Você já atingiu o limite de 2 cartões (Principal e Secundário). Remova um para cadastrar outro.', '- Limite de Cartões -');
            return;
        }

        const numeroLimpo = inputNumero.value.replace(/\s/g, '');
        if (numeroLimpo.length !== 16) {
            exibirAvisoSite('Por favor, insira os 16 dígitos do cartão.', '- Cartão Inválido -', () => {
                inputNumero.focus();
            });
            return;
        }

        const numeroMascarado = '**** **** **** ' + numeroLimpo.slice(-4);
        const jaCadastrado = cartoes.some((c) => c.numeroMascarado === numeroMascarado && c.validade === inputValidade.value);
        if (jaCadastrado) {
            exibirAvisoSite('Este cartão já está cadastrado!', '- Cartão Duplicado -');
            return;
        }

        if (!validarValidadeCartao(inputValidade.value)) {
            exibirAvisoSite('Data de validade inválida ou cartão vencido! Use o formato MM/AA.', '- Validade Inválida -', () => {
                inputValidade.focus();
            });
            return;
        }

        if (inputCvv.value.length !== 3) {
            exibirAvisoSite('O CVV deve conter exatamente 3 dígitos.', '- CVV Inválido -', () => {
                inputCvv.focus();
            });
            return;
        }

        resNumero.textContent = inputNumero.value;
        resTitular.textContent = inputTitular.value;
        resValidade.textContent = inputValidade.value;
        resCvv.textContent = '•••';
        resEndereco.textContent = inputEndereco.value;

        if (modal) modal.showModal();
    });
}

if (btnCorrigir) {
    btnCorrigir.addEventListener('click', () => {
        if (modal) modal.close();
    });
}

if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
        const cartoes = lerCartoesUsuario();
        const numeroLimpo = inputNumero.value.replace(/\s/g, '');
        const tipoCartaoTexto = cartoes.length === 0 ? 'Cartão Principal' : 'Cartão Secundário';

        // RNF05: não persiste número completo do cartão nem CVV
        cartoes.push({
            numeroMascarado: '**** **** **** ' + numeroLimpo.slice(-4),
            final: numeroLimpo.slice(-4),
            titular: inputTitular.value.trim(),
            validade: inputValidade.value,
            endereco: inputEndereco.value.trim()
        });

        salvarCartoesUsuario(cartoes);

        if (modal) modal.close();
        form.reset();
        renderizarCartoesSalvos();

        exibirAvisoSite(`${tipoCartaoTexto} cadastrado com sucesso!`, '- Cartão Salvo -');
    });
}

renderizarCartoesSalvos();