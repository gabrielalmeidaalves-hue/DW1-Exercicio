const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let aluno = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/aluno/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.aluno;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const RA_aluno = document.getElementById("RA_aluno").value;
    if (isNaN(RA_aluno) || !Number.isInteger(Number(RA_aluno)) || RA_aluno === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("RA_aluno").focus();
        return;
    }

    aluno = await procurePorChavePrimaria(RA_aluno);
    if (aluno) {
        mostrarDadosaluno(aluno);
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
    document.getElementById("nome_completo").focus();
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
    let RA_aluno = aluno ? aluno.RA_aluno : parseInt(document.getElementById("RA_aluno").value);
    const nome_completo = document.getElementById("nome_completo").value.trim();
    const data_nascimento= document.getElementById("data_nascimento").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const curso = document.getElementById("curso").value;

    if (!RA_aluno || !nome_completo || !data_nascimento|| !email || !telefone || !curso) {
        alert("Erro nos dados digitados");
        return;
    }

    const dadosaluno = { RA_aluno, nome_completo, data_nascimento, email, telefone, curso };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/aluno`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosaluno)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/aluno/${RA_aluno}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosaluno)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/aluno/${RA_aluno}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("RA_aluno").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/alunos`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.alunos);
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
        const data = linha.data_nascimento? new Date(linha.data_nascimento).toISOString().substring(0, 10) : '';
        texto += `${linha.RA_aluno} - ${linha.nome_completo} - ${data} - ${linha.email} - ${linha.telefone} - ${linha.curso}<br>`;
    }
    return texto || "Nenhum aluno cadastrado.";
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

function mostrarDadosaluno(aluno) {
    document.getElementById("RA_aluno").value = aluno.RA_aluno;
    document.getElementById("nome_completo").value = aluno.nome_completo;
    document.getElementById("data_nascimento").value = aluno.data_nascimento;
    document.getElementById("email").value = aluno.email;
    document.getElementById("telefone").value = aluno.telefone;
    document.getElementById("curso").value = aluno.curso;
    bloquearAtributos(true);
}

function limparAtributos() {
    aluno = null;
    document.getElementById("nome_completo").value = "";
    document.getElementById("data_nascimento").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("curso").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("RA_aluno").readOnly = !soLeitura;
    document.getElementById("nome_completo").readOnly = soLeitura;
    document.getElementById("data_nascimento").readOnly = soLeitura;
    document.getElementById("email").readOnly = soLeitura;
    document.getElementById("telefone").readOnly = soLeitura;
    document.getElementById("curso").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("RA_aluno").focus();
}