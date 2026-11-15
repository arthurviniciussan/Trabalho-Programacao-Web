
const CHAVE_USUARIOS = 'usuarios';

const form = document.querySelector('#form-cadastro');
const mensagem = document.querySelector('#mensagem');
const campoCep = document.querySelector('#cep');

function lerUsuarios() {
	try {
		const dados = JSON.parse(localStorage.getItem(CHAVE_USUARIOS));
		return Array.isArray(dados) ? dados : [];
	} catch (erro) {
		return [];
	}
}

function mostrarMensagem(texto, ehErro, campo) {
	mensagem.textContent = texto;
	mensagem.className = ehErro ? 'cadastro-mensagem erro' : 'cadastro-mensagem';

	form.querySelectorAll('input').forEach((input) => input.classList.remove('erro'));
	if (campo) {
		campo.classList.add('erro');
		campo.focus();
	}
}

// Coloca o hífen do CEP enquanto a pessoa digita (00000-000)
campoCep.addEventListener('input', () => {
	const numeros = campoCep.value.replace(/\D/g, '').slice(0, 8);
	campoCep.value = numeros.length > 5 ? numeros.slice(0, 5) + '-' + numeros.slice(5) : numeros;
});

form.addEventListener('submit', (evento) => {
	evento.preventDefault();

	const usuario = form.querySelector('#usuario');
	const email = form.querySelector('#email');
	const email2 = form.querySelector('#email2');
	const senha = form.querySelector('#senha');
	const senha2 = form.querySelector('#senha2');
	const cep = form.querySelector('#cep');
	const endereco = form.querySelector('#endereco');

	const nomeUsuario = usuario.value.trim();
	const emailDigitado = email.value.trim().toLowerCase();

	if (nomeUsuario.length < 3) {
		return mostrarMensagem('O nome de usuário precisa ter pelo menos 3 letras.', true, usuario);
	}
	if (!email.checkValidity() || emailDigitado === '') {
		return mostrarMensagem('Digite um e-mail válido.', true, email);
	}
	if (emailDigitado !== email2.value.trim().toLowerCase()) {
		return mostrarMensagem('Os e-mails não são iguais.', true, email2);
	}
	if (senha.value.length < 6) {
		return mostrarMensagem('A senha precisa ter pelo menos 6 caracteres.', true, senha);
	}
	if (senha.value !== senha2.value) {
		return mostrarMensagem('As senhas não são iguais.', true, senha2);
	}
	if (cep.value.replace(/\D/g, '').length !== 8) {
		return mostrarMensagem('Digite um CEP com 8 números.', true, cep);
	}
	if (endereco.value.trim() === '') {
		return mostrarMensagem('Digite seu endereço.', true, endereco);
	}

	const usuarios = lerUsuarios();

	if (usuarios.some((u) => u.email === emailDigitado)) {
		return mostrarMensagem('Este e-mail já está cadastrado.', true, email);
	}
	if (usuarios.some((u) => u.usuario.toLowerCase() === nomeUsuario.toLowerCase())) {
		return mostrarMensagem('Este nome de usuário já existe.', true, usuario);
	}

	usuarios.push({
		usuario: nomeUsuario,
		email: emailDigitado,
		senha: senha.value,
		cep: cep.value,
		endereco: endereco.value.trim()
	});
	localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));

	form.reset();
	mostrarMensagem('Cadastro realizado com sucesso!', false);
});