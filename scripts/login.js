function validarLogin() {
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (email == "" || senha == "") {
        alert("Preencha o e-mail e a senha!");
    } else {
        let dadosSalvos = localStorage.getItem("usuarios");

        if (dadosSalvos == null) {
            alert("Nenhum usuário cadastrado! Faça o seu cadastro.");
            window.location.href = "cadastro.html";
        } else {
            let listaUsuarios = JSON.parse(dadosSalvos);
            let encontrou = false;

            for (let i = 0; i < listaUsuarios.length; i++) {
                if (email == listaUsuarios[i].email && senha == listaUsuarios[i].senha) {
                    encontrou = true;
                    break;
                }
            }

            if (encontrou == true) {
                alert("Login autorizado!");
                window.location.href = "home.html";
            } else {
                alert("E-mail não cadastrado ou senha incorreta! Faça o seu cadastro.");
                window.location.href = "cadastro.html";
            }
        }
    }

    return false;
}