const listaLivros = document.querySelector('#book-list');
const statusCatalogo = document.querySelector('#catalog-status');
const formatoMoeda = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL'
});

function criarCard(livro) {
	const card = document.createElement('article');
	card.className = 'book-card';

	if (livro.imagem) {
		const imagem = document.createElement('img');
		imagem.className = 'book-card';
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
	preco.textContent = formatoMoeda.format(livro.valor);
	preco.setAttribute('aria-label', `Preço: ${preco.textContent}`);

	card.append(titulo, autor, descricao, preco);
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
		statusCatalogo.textContent = '';
	} catch (erro) {
		console.error('Não foi possível carregar os livros:', erro);
		statusCatalogo.classList.add('catalog-status--error');
		statusCatalogo.textContent =
			'Não foi possível carregar o catálogo. Verifique sua conexão e tente novamente.';
	} finally {
		listaLivros.setAttribute('aria-busy', 'false');
	}
}

carregarLivros();