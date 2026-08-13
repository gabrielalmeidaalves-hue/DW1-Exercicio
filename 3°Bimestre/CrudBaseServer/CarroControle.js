const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let carro = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/carro/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.carro;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const id_carro = document.getElementById("inputId_carro").value;
    if (isNaN(id_carro) || !Number.isInteger(Number(id_carro)) || id_carro === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("inputId_carro").focus();
        return;
    }

    carro = await procurePorChavePrimaria(id_carro);
    if (carro) {
        mostrarDadosCarro(carro);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clique em salvar");
    document.getElementById("inputNome_carro").focus();
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clique em salvar");
}

function excluir() {
    bloquearAtributos(true); // Na exclusão não precisa liberar os inputs
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

// Salva as alterações realizando a chamada HTTP correta na API
async function salvar() {
    let id_carro = carro ? carro.id_carro : parseInt(document.getElementById("inputId_carro").value);
    const nome_carro = document.getElementById("inputNome_carro").value;
    const modelo_carro = document.getElementById("inputModelo_carro").value;
    const ano = parseInt(document.getElementById("inputAno").value);

    if (!id_carro || !nome_carro || !modelo_carro || !ano) {
        alert("Erro nos dados digitados");
        return;
    }

    const dadosCarro = { id_carro, nome_carro, modelo_carro, ano };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/carro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCarro)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/carro/${id_carro}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosCarro)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/carro/${id_carro}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_carro").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/carros`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.carros);
        } else {
            document.getElementById("outputSaida").innerHTML = "Erro ao carregar dados.";
        }
    } catch (erro) {
        document.getElementById("outputSaida").innerHTML = "Servidor offline.";
    }
}

function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto += `${linha.id_carro} - ${linha.nome_carro} - ${linha.modelo_carro} - ${linha.ano}<br>`;
    }
    return texto || "Nenhum carro cadastrado.";
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosCarro(carro) {
    document.getElementById("inputId_carro").value = carro.id_carro;
    document.getElementById("inputNome_carro").value = carro.nome_carro;
    document.getElementById("inputModelo_carro").value = carro.modelo_carro;
    document.getElementById("inputAno").value = carro.ano;
    bloquearAtributos(true);
}

function limparAtributos() {
    carro = null;
    document.getElementById("inputNome_carro").value = "";
    document.getElementById("inputModelo_carro").value = "";
    document.getElementById("inputAno").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_carro").readOnly = !soLeitura;
    document.getElementById("inputNome_carro").readOnly = soLeitura;
    document.getElementById("inputModelo_carro").readOnly = soLeitura;
    document.getElementById("inputAno").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("inputId_carro").focus();
}