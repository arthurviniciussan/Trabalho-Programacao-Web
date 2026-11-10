
const CHAVE_CARRINHO = 'carrinho';

const areaItens = document.querySelector('#cart-items');
const resumoTipos = document.querySelector('#resumo-tipos');
const resumoUnidades = document.querySelector('#resumo-unidades');
const resumoTotal = document.querySelector('#resumo-total');
const corpoRelatorio = document.querySelector('#report-body');
const botaoFinalizar = document.querySelector('#btn-finalizar');
const botaoEsvaziar = document.querySelector('#btn-esvaziar');
const mensagem = document.querySelector('#cart-mensagem');


function lerCarrinho() {
	try {
		const dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
		return Array.isArray(dados) ? dados : [];
	} catch (erro) {
		console.error('Carrinho inválido no localStorage:', erro);
		return [];
	}
}

function salvarCarrinho(carrinho) {
	localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}


function formatarPreco(valor) {
	return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarMensagem(texto) {
	mensagem.textContent = texto;
}


function alterarQuantidade(id, delta) {
	const carrinho = lerCarrinho();
	const item = carrinho.find((livro) => livro.id === id);
	if (!item) return;

	item.quantidade += delta;

	// Se chegou a zero, remove o item
	const novoCarrinho = item.quantidade <= 0
		? carrinho.filter((livro) => livro.id !== id)
		: carrinho;

	salvarCarrinho(novoCarrinho);
	mostrarMensagem('');
	renderizar();
}

function removerItem(id) {
	salvarCarrinho(lerCarrinho().filter((livro) => livro.id !== id));
	mostrarMensagem('');
	renderizar();
}

function esvaziarCarrinho() {
	if (lerCarrinho().length === 0) return;
	if (!confirm('Deseja remover todos os livros do carrinho?')) return;

	localStorage.removeItem(CHAVE_CARRINHO);
	mostrarMensagem('');
	renderizar();
}

function finalizarCompra() {
	const carrinho = lerCarrinho();
	if (carrinho.length === 0) return;

	const total = carrinho.reduce((soma, livro) => soma + livro.valor * livro.quantidade, 0);
	localStorage.removeItem(CHAVE_CARRINHO);
	renderizar();
	mostrarMensagem(`Compra finalizada! Total: ${formatarPreco(total)}. Obrigado!`);
}


function criarBotao(texto, classe, aoClicar, rotulo) {
	const botao = document.createElement('button');
	botao.type = 'button';
	botao.className = classe;
	botao.textContent = texto;
	if (rotulo) botao.setAttribute('aria-label', rotulo);
	botao.addEventListener('click', aoClicar);
	return botao;
}

function criarItem(livro) {
	const item = document.createElement('article');
	item.className = 'cart-item';

	const imagem = document.createElement('img');
	imagem.src = livro.imagem || '';
	imagem.alt = `Capa de ${livro.titulo}`;

	const info = document.createElement('div');

	const titulo = document.createElement('h2');
	titulo.textContent = livro.titulo;

	const autor = document.createElement('p');
	autor.className = 'cart-item-autor';
	autor.textContent = livro.autor;

	const preco = document.createElement('p');
	preco.className = 'cart-item-preco';
	preco.textContent = `${formatarPreco(livro.valor)} cada`;

	info.append(titulo, autor, preco);

	const acoes = document.createElement('div');
	acoes.className = 'cart-item-acoes';

	const quantidade = document.createElement('div');
	quantidade.className = 'cart-qtd';

	const numero = document.createElement('span');
	numero.textContent = livro.quantidade;
	numero.setAttribute('aria-label', `Quantidade: ${livro.quantidade}`);

	quantidade.append(
		criarBotao('−', '', () => alterarQuantidade(livro.id, -1), `Diminuir quantidade de ${livro.titulo}`),
		numero,
		criarBotao('+', '', () => alterarQuantidade(livro.id, 1), `Aumentar quantidade de ${livro.titulo}`)
	);

	const subtotal = document.createElement('p');
	subtotal.className = 'cart-item-preco';
	subtotal.textContent = formatarPreco(livro.valor * livro.quantidade);

	acoes.append(
		quantidade,
		subtotal,
		criarBotao('Remover', 'cart-remover', () => removerItem(livro.id), `Remover ${livro.titulo} do carrinho`)
	);

	item.append(imagem, info, acoes);
	return item;
}

function criarCarrinhoVazio() {
	const vazio = document.createElement('div');
	vazio.className = 'cart-vazio';

	const texto = document.createElement('p');
	texto.textContent = 'Seu carrinho está vazio.';

	const link = document.createElement('a');
	link.href = 'home.html';
	link.textContent = 'Ver o catálogo';

	vazio.append(texto, link);
	return vazio;
}

function criarLinhaRelatorio(livro) {
	const linha = document.createElement('tr');
	const colunas = [
		livro.titulo,
		String(livro.quantidade),
		formatarPreco(livro.valor),
		formatarPreco(livro.valor * livro.quantidade)
	];

	colunas.forEach((texto) => {
		const celula = document.createElement('td');
		celula.textContent = texto;
		linha.append(celula);
	});

	return linha;
}

function renderizar() {
	const carrinho = lerCarrinho();

	// Itens
	areaItens.replaceChildren();
	if (carrinho.length === 0) {
		areaItens.append(criarCarrinhoVazio());
	} else {
		const fragmento = document.createDocumentFragment();
		carrinho.forEach((livro) => fragmento.append(criarItem(livro)));
		areaItens.append(fragmento);
	}

	// Resumo
	const unidades = carrinho.reduce((soma, livro) => soma + livro.quantidade, 0);
	const total = carrinho.reduce((soma, livro) => soma + livro.valor * livro.quantidade, 0);
	resumoTipos.textContent = carrinho.length;
	resumoUnidades.textContent = unidades;
	resumoTotal.textContent = formatarPreco(total);

	// Relatório
	corpoRelatorio.replaceChildren();
	if (carrinho.length === 0) {
		const linha = document.createElement('tr');
		const celula = document.createElement('td');
		celula.colSpan = 4;
		celula.textContent = 'Nenhum item armazenado.';
		linha.append(celula);
		corpoRelatorio.append(linha);
	} else {
		carrinho.forEach((livro) => corpoRelatorio.append(criarLinhaRelatorio(livro)));
	}

	// Botões ficam desativados se não há itens
	botaoFinalizar.disabled = carrinho.length === 0;
	botaoEsvaziar.disabled = carrinho.length === 0;
}

botaoFinalizar.addEventListener('click', finalizarCompra);
botaoEsvaziar.addEventListener('click', esvaziarCarrinho);

renderizar();