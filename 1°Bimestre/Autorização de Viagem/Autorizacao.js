function validarFormulario() {

    let cpf = document.getElementById("cpf").value;
    let nomeAtleta = document.getElementById("nomeAtleta").value;
    let idade = parseInt(document.getElementById("idade").value);
    let nomeResponsavel = document.getElementById("nomeResponsavel").value;
    let cidadeOrigem = document.getElementById("cidadeOrigem").value;
    let cidadeDestino = document.getElementById("cidadeDestino").value;
    let modalidade = document.getElementById("modalidade").value;

    if (cpf.length != 11 || isNaN(cpf)) {
        alert("CPF inválido (digite 11 números)");
        return false;
    }

    if (nomeAtleta.length < 3 || nomeAtleta.trim().split(" ").length < 2) {
        alert("Digite nome e sobrenome do atleta");
        return false;
    }

    if (idade < 7 || idade > 18 || isNaN(idade)) {
        alert("Idade deve ser entre 7 e 18 anos");
        return false;
    }

    if (nomeResponsavel.length < 3 || nomeResponsavel.trim().split(" ").length < 2) {
        alert("Digite nome e sobrenome do responsável");
        return false;
    }

    if (cidadeOrigem.length < 4) {
        alert("Cidade de origem inválida");
        return false;
    }

    if (cidadeDestino.length < 4) {
        alert("Cidade de destino inválida");
        return false;
    }

    if (modalidade === "") {
        alert("Selecione uma modalidade");
        return false;
    }

    return true;
}


// ================= CARREGAR DADOS NA PÁGINA DESTINO =================
function carregarDados() {
    const params = new URLSearchParams(window.location.search);

    // Preencher os campos
    document.getElementById("saidaCpf").textContent = params.get("cpf");
    document.getElementById("saidaAtleta").textContent = params.get("nomeAtleta");
    document.getElementById("saidaResponsavel").textContent = params.get("nomeResponsavel");
    document.getElementById("saidaOrigem").textContent = params.get("cidadeOrigem");
    document.getElementById("saidaDestino").textContent = params.get("cidadeDestino");
    document.getElementById("saidaModalidade").textContent = params.get("modalidade");

    // Categoria pela idade
    let idade = parseInt(params.get("idade"));
    let categoria = "";

    if (idade <= 10) {
        categoria = "Infantil";
    } else if (idade <= 14) {
        categoria = "Juvenil";
    } else {
        categoria = "Júnior";
    }

    document.getElementById("saidaCategoria").textContent = categoria;
}


// ================= BOTÕES =================
function imprimir() {
    window.print();
}

function voltar() {
    window.location.href = "Autorizacao.html";
}