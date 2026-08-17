const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let pessoa = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/pessoa/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.pessoa;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const cpf = document.getElementById("cpf").value;
    if (isNaN(cpf) || !Number.isInteger(Number(cpf)) || cpf === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("cpf").focus();
        return;
    }

    pessoa = await procurePorChavePrimaria(cpf);
    if (pessoa) {
        mostrarDadospessoa(pessoa);
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
    document.getElementById("nome").focus();
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
    let cpf = pessoa ? pessoa.cpf : parseInt(document.getElementById("cpf").value);
    const nome = document.getElementById("nome").value;
    const data_nascimento= document.getElementById("data_nascimento").value;
    const nome_mae = document.getElementById("nome_mae").value;7
    const altura = parseFloat(document.getElementById("altura").value);



    if (!cpf || !nome || !data_nascimento|| !nome_mae || !altura) {
        alert("Erro nos dados digitados");
        return;
    }

    const dadospessoa = { cpf, nome, data_nascimento, nome_mae, altura};

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/pessoa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadospessoa)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/pessoa/${cpf}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadospessoa)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/pessoa/${cpf}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("cpf").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/pessoas`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.pessoas);
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
        const data = linha.data_nascimento? new Date(linha.data_nascimento).toISOString().substring(0, 10) 
    : '';
        texto += `${linha.cpf} - ${linha.nome} - ${data} - ${linha.nome_mae} - ${linha.altura}<br>`;
    }
    return texto || "Nenhum pessoa cadastrado.";
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

function mostrarDadospessoa(pessoa) {
    document.getElementById("cpf").value = pessoa.cpf;
    document.getElementById("nome").value = pessoa.nome;
    document.getElementById("nome_mae").value = pessoa.nome_mae;
       document.getElementById("data_nascimento").value = pessoa.data_nascimento   ? new Date(pessoa.data_nascimento).toISOString().substring(0, 10) : '';
    document.getElementById("altura").value = pessoa.altura;
    bloquearAtributos(true);
}

function limparAtributos() {
    pessoa = null;
    document.getElementById("nome").value = "";
    document.getElementById("nome_mae").value = "";
    document.getElementById("data_nascimento").value = "";
    document.getElementById("altura").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("cpf").readOnly = !soLeitura;
    document.getElementById("nome").readOnly = soLeitura;
    document.getElementById("nome_mae").readOnly = soLeitura;
    document.getElementById("data_nascimento").readOnly = soLeitura;
    document.getElementById("altura").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("cpf").focus();
}