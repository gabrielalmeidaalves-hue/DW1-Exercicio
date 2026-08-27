const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let cliente = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/cliente/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.cliente;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const id_cliente = document.getElementById("id_cliente").value;
    if (isNaN(id_cliente) || !Number.isInteger(Number(id_cliente)) || id_cliente === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("id_cliente").focus();
        return;
    }
    

    cliente = await procurePorChavePrimaria(id_cliente);
    if (cliente) {
        mostrarDadoscliente(cliente);
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

// Salva as alterações realizando a chamada HTTP cidadereta na API
async function salvar() {
    let id_cliente = cliente ? cliente.id_cliente : parseInt(document.getElementById("id_cliente").value);
    const nome = document.getElementById("nome").value.trim();
    const cpf= document.getElementById("cpf").value;
    const endereco = document.getElementById("endereco").value;
    const cidade = document.getElementById("cidade").value;
    const uf = document.getElementById("uf").value;
    const telefone = document.getElementById("telefone").value;

    if (!id_cliente || !nome || !cpf|| !endereco || !cidade || !uf || !telefone) {
        alert("Erro nos dados digitados");
        return;
    }

    if(cpf.length != 11){
        mostrarAviso("Precisa ter 14 digitos");
        document.getElementById("cpf").focus();
        return;
    }

    if(uf.length != 2){
        mostrarAviso("Precisa ter 2 digitos");
        document.getElementById("uf").focus();
        return;
    }

    if(telefone.length != 11){
        mostrarAviso("Precisa ter 11 digitos");
        document.getElementById("telefone").focus();
        return;
    }


    const dadoscliente = { id_cliente, nome, cpf, endereco, cidade, uf, telefone };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/cliente`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadoscliente)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/cliente/${id_cliente}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadoscliente)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/cliente/${id_cliente}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("id_cliente").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/clientes`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.clientes);
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
        texto += `${linha.id_cliente} - ${linha.nome} - ${linha.cpf} - ${linha.endereco} - ${linha.cidade} - ${linha.uf} - ${linha.telefone}<br>`;
    }
    return texto || "Nenhum cliente cadastrado.";
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

function mostrarDadoscliente(cliente) {
    document.getElementById("id_cliente").value = cliente.id_cliente;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("cpf").value = cliente.cpf;
    document.getElementById("endereco").value = cliente.endereco;
    document.getElementById("cidade").value = cliente.cidade;
    document.getElementById("uf").value = cliente.uf;
    document.getElementById("telefone").value = cliente.telefone;
    bloquearAtributos(true);
}

function limparAtributos() {
    cliente = null;
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("endereco").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("uf").value = "";
    document.getElementById("telefone").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("id_cliente").readOnly = !soLeitura;
    document.getElementById("nome").readOnly = soLeitura;
    document.getElementById("cpf").readOnly = soLeitura;
    document.getElementById("endereco").readOnly = soLeitura;
    document.getElementById("cidade").readOnly = soLeitura;
    document.getElementById("uf").readOnly = soLeitura;
    document.getElementById("telefone").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("id_cliente").focus();
}