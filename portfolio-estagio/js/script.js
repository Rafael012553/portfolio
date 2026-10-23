// Mostra ou esconde o menu em telas pequenas e atualiza os atributos acessíveis.
const botaoMenu = document.getElementById("botaoMenu");
const listaMenu = document.getElementById("listaMenu");

botaoMenu.addEventListener("click", () => {
    const menuAberto = listaMenu.classList.toggle("aberto");
    botaoMenu.setAttribute("aria-expanded", String(menuAberto));
    botaoMenu.setAttribute("aria-label", menuAberto ? "Fechar menu" : "Abrir menu");
});

// Fecha o menu móvel depois que uma seção é selecionada.
listaMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        listaMenu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute("aria-label", "Abrir menu");
    });
});

// Retorna uma saudação adequada para a hora recebida.
function obterSaudacao(hora) {
    if (hora < 12) {
        return "Bom dia!";
    } else if (hora < 18) {
        return "Boa tarde!";
    }
    return "Boa noite!";
}

const horaAtual = new Date().getHours();
document.getElementById("saudacao").textContent = obterSaudacao(horaAtual);

// Alterna entre os temas claro e escuro.
const botaoTema = document.getElementById("botaoTema");

botaoTema.addEventListener("click", () => {
    const temaEscuroAtivo = document.body.classList.toggle("tema-escuro");
    botaoTema.innerHTML = temaEscuroAtivo
        ? '<span aria-hidden="true">☀</span>'
        : '<span aria-hidden="true">☾</span>';
    botaoTema.setAttribute(
        "aria-label",
        temaEscuroAtivo ? "Ativar modo claro" : "Ativar modo escuro"
    );
});

// Confere os campos e mostra cada erro próximo ao campo correspondente.
function validarFormulario() {
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const mensagem = document.getElementById("mensagem");
    const consentimento = document.getElementById("consentimento");

    const campos = [
        { elemento: nome, erro: "erroNome", texto: "Informe seu nome." },
        { elemento: email, erro: "erroEmail", texto: "Informe um e-mail válido com @ e ." },
        { elemento: mensagem, erro: "erroMensagem", texto: "Escreva uma mensagem com pelo menos 20 caracteres." }
    ];

    let formularioValido = true;

    campos.forEach(({ elemento, erro, texto }) => {
        const localErro = document.getElementById(erro);
        let mensagemErro = "";

        if (elemento.value.trim() === "") {
            mensagemErro = elemento === nome ? texto :
                elemento === email ? "Informe seu e-mail." : "Escreva sua mensagem.";
        } else if (elemento === email) {
            const valorEmail = elemento.value.trim();
            if (!valorEmail.includes("@") || !valorEmail.includes(".")) {
                mensagemErro = texto;
            }
        } else if (elemento === mensagem && elemento.value.trim().length < 20) {
            mensagemErro = texto;
        }

        localErro.textContent = mensagemErro;
        elemento.classList.toggle("invalido", Boolean(mensagemErro));
        elemento.setAttribute("aria-invalid", String(Boolean(mensagemErro)));

        if (mensagemErro) {
            formularioValido = false;
        }
    });

    const erroConsentimento = document.getElementById("erroConsentimento");
    erroConsentimento.textContent = consentimento.checked
        ? ""
        : "Marque o consentimento para continuar.";

    if (!consentimento.checked) {
        formularioValido = false;
    }

    return formularioValido;
}

// Valida o formulário sem enviar nem armazenar os dados.
const formularioContato = document.getElementById("formularioContato");
const resultadoFormulario = document.getElementById("resultadoFormulario");

formularioContato.addEventListener("submit", (evento) => {
    evento.preventDefault();
    resultadoFormulario.textContent = "";

    if (validarFormulario()) {
        resultadoFormulario.textContent = "Tudo certo! A validação foi concluída. Nenhum dado foi enviado.";
        formularioContato.reset();

        document.querySelectorAll(".invalido").forEach((campo) => {
            campo.classList.remove("invalido");
            campo.removeAttribute("aria-invalid");
        });

        ["erroNome", "erroEmail", "erroMensagem", "erroConsentimento"].forEach((id) => {
            document.getElementById(id).textContent = "";
        });
    } else {
        resultadoFormulario.textContent = "Confira os campos destacados antes de continuar.";
        const primeiroInvalido = formularioContato.querySelector('[aria-invalid="true"]');
        if (primeiroInvalido) {
            primeiroInvalido.focus();
        } else {
            document.getElementById("consentimento").focus();
        }
    }
});

// Atualiza automaticamente o ano exibido no rodapé.
document.getElementById("anoAtual").textContent = new Date().getFullYear();

// Filtra os projetos conforme a tecnologia selecionada.
const botoesFiltro = document.querySelectorAll(".filtro");
const projetos = document.querySelectorAll(".projeto");
const mensagemFiltro = document.getElementById("mensagemFiltro");

botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
        const filtroSelecionado = botao.dataset.filtro;
        let quantidadeVisivel = 0;

        botoesFiltro.forEach((item) => {
            const selecionado = item === botao;
            item.classList.toggle("ativo", selecionado);
            item.setAttribute("aria-pressed", String(selecionado));
        });

        projetos.forEach((projeto) => {
            const tecnologias = projeto.dataset.tecnologias.split(" ");
            const mostrar = filtroSelecionado === "todos" ||
                tecnologias.includes(filtroSelecionado);
            projeto.hidden = !mostrar;
            if (mostrar) quantidadeVisivel += 1;
        });

        mensagemFiltro.textContent = `${quantidadeVisivel} projeto(s) exibido(s).`;
    });
});
