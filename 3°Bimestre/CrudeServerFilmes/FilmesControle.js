const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let filme = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/filme/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.filme;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const id_filme = document.getElementById("inputId_filme").value;
    if (isNaN(id_filme) || !Number.isInteger(Number(id_filme)) || id_filme === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("inputId_filme").focus();
        return;
    }

    filme = await procurePorChavePrimaria(id_filme);
    if (filme) {
        mostrarDadosfilme(filme);
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
    document.getElementById("inputNome_filme").focus();
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
    let id_filme = filme ? filme.id_filme : parseInt(document.getElementById("inputId_filme").value);
    const nome_filme = document.getElementById("inputNome_filme").value;
    const diretor_filme = document.getElementById("inputdiretor_filme").value;
    const data_lancamento = document.getElementById("data_lancamento").value; 
    const duracao_minutos = parseInt(document.getElementById("duracao_minutos").value);

    if (!id_filme || !nome_filme || !diretor_filme || !data_lancamento || !duracao_minutos) {
        alert("Erro nos dados digitados");
        return;
    }

    const dadosfilme = { id_filme, nome_filme, diretor_filme, data_lancamento, duracao_minutos };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/filme`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosfilme)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/filme/${id_filme}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosfilme)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/filme/${id_filme}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_filme").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/filmes`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.filmes);
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
         const data = linha.data_lancamento ? linha.data_lancamento.substring(0, 10) : '';
        texto += `${linha.id_filme} - ${linha.nome_filme} - ${linha.diretor_filme} - ${data} - ${linha.duracao_minutos} <br>`;
    }
    return texto || "Nenhum filme cadastrado.";
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

function mostrarDadosfilme(filme) {
    document.getElementById("inputId_filme").value = filme.id_filme;
    document.getElementById("inputNome_filme").value = filme.nome_filme;
    document.getElementById("inputdiretor_filme").value = filme.diretor_filme;
    document.getElementById("data_lancamento").value = filme.data_lancamento;
    document.getElementById("duracao_minutos").value = filme.duracao_minutos;
    bloquearAtributos(true);
}

function limparAtributos() {
    filme = null;
    document.getElementById("inputNome_filme").value = "";
    document.getElementById("inputdiretor_filme").value = "";
    document.getElementById("data_lancamento").value = "";
    document.getElementById("duracao_minutos").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_filme").readOnly = !soLeitura;
    document.getElementById("inputNome_filme").readOnly = soLeitura;
    document.getElementById("inputdiretor_filme").readOnly = soLeitura;
    document.getElementById("data_lancamento").readOnly = soLeitura;
    document.getElementById("duracao_minutos").readOnly = soLeitura;

}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("inputId_filme").focus();
}