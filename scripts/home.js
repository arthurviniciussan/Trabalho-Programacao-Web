const listaLivros = document.querySelector('#book-list');

function adicionarAoCarrinho(livro, botao) {
	let carrinho;
	try {
		carrinho = JSON.parse(localStorage.getItem('carrinho'));
		if (!Array.isArray(carrinho)) carrinho = [];
	} catch (erro) {
		carrinho = [];
	}

	const existente = carrinho.find((item) => item.id === livro.id);
	if (existente) {
		existente.quantidade += 1;
	} else {
		carrinho.push({
			id: livro.id,
			titulo: livro.titulo,
			autor: livro.autor,
			imagem: livro.imagem || '',
			valor: livro.valor,
			quantidade: 1
		});
	}

	localStorage.setItem('carrinho', JSON.stringify(carrinho));

	
	botao.textContent = 'Adicionado ✓';
	setTimeout(() => { botao.textContent = 'Adicionar ao carrinho'; }, 1200);
}

function criarCard(livro) {
	const card = document.createElement('article');
	card.className = 'book-card';

	if (livro.imagem) {
		const imagem = document.createElement('img');
		imagem.className = 'book-cover';
		imagem.src = livro.imagem;
		imagem.alt = `Capa de ${livro.titulo}`;
		imagem.loading = 'lazy';
		card.append(imagem);
	}

	const titulo = document.createElement('h2');
	titulo.textContent = livro.titulo;

	const autor = document.createElement('p');
	autor.className = 'book-author';
	autor.textContent = livro.autor;

	const descricao = document.createElement('p');
	descricao.className = 'book-description';
	descricao.textContent = livro.descricao;

	const preco = document.createElement('p');
	preco.className = 'book-price';
	preco.textContent = "R$" + livro.valor + "9";
	preco.setAttribute('aria-label', `Preço: ${preco.textContent}`);

	const botaoCarrinho = document.createElement('button');
	botaoCarrinho.type = 'button';
	botaoCarrinho.className = 'book-button';
	botaoCarrinho.textContent = 'Adicionar ao carrinho';
	botaoCarrinho.addEventListener('click', () => adicionarAoCarrinho(livro, botaoCarrinho));

	card.append(titulo, autor, descricao, preco, botaoCarrinho);
	return card;
}

async function carregarLivros() {
	try {
		const resposta = await fetch('../data/produtos.json');
		if (!resposta.ok) {
			throw new Error(`Falha ao carregar o catálogo (HTTP ${resposta.status}).`);
		}

		const livros = await resposta.json();
		if (!Array.isArray(livros)) {
			throw new Error('O arquivo do catálogo tem um formato inválido.');
		}

		const livrosValidos = livros.filter((livro) =>
			livro &&
			typeof livro.titulo === 'string' &&
			typeof livro.autor === 'string' &&
			typeof livro.descricao === 'string' &&
			typeof livro.valor === 'number' &&
			Number.isFinite(livro.valor)
		);

		if (livros.length != livrosValidos.length) {
			statusCatalogo.textContent = 'problemas ao validar os produtos adicionados';
			return;
		}

		if (livros.length === 0) {
			statusCatalogo.textContent = 'Nenhum livro disponível no momento.';
			return;
		}

		const fragmento = document.createDocumentFragment();

		livros.forEach((livro) => fragmento.append(criarCard(livro)));
		listaLivros.append(fragmento);
	} catch (erro) {
		console.error('Não foi possível carregar os livros:', erro);

	} finally {
		console.log("Tá carregando pai segura...");
	}
}

carregarLivros();