const parametros = new URLSearchParams(window.location.search);
const idDoLivro = Number(parametros.get('id'));

async function carregarDescricao() {
	try {
		const resposta = await fetch('../data/produtos.json');
		const livros = await resposta.json();

		const livro = livros.find((item) => item.id === idDoLivro);

		if (!livro) {
			document.querySelector('#titulo').textContent = 'Livro não encontrado';
			document.querySelector('#imagem').style.display = 'none';
			return;
		}

		document.querySelector('#imagem').src = livro.imagem;
		document.querySelector('#imagem').alt = 'Capa de ' + livro.titulo;
		document.querySelector('#titulo').textContent = livro.titulo;
		document.querySelector('#autor').textContent = livro.autor;
		document.querySelector('#descricao').textContent = livro.descricao;
		document.querySelector('#preco').textContent = 'R$ ' + livro.valor.toFixed(2).replace('.', ',');
	} catch (erro) {
		document.querySelector('#titulo').textContent = 'Erro ao carregar o livro. Abra o site pelo Live Server.';
		document.querySelector('#imagem').style.display = 'none';
	}
}

carregarDescricao();
