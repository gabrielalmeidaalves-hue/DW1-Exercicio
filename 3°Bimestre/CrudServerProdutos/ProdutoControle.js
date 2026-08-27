const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let produto = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/produto/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.produto;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const id_produto = document.getElementById("id_produto").value;
    if (isNaN(id_produto) || !Number.isInteger(Number(id_produto)) || id_produto === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("id_produto").focus();
        return;
    }



    produto = await procurePorChavePrimaria(id_produto);
    if (produto) {
        mostrarDadosproduto(produto);
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
    document.getElementById("nome_produto").focus();
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
    let id_produto = produto ? produto.id_produto : parseInt(document.getElementById("id_produto").value);
    const nome_produto = document.getElementById("nome_produto").value;
    const quantidade_estoque = parseInt(document.getElementById("quantidade_estoque").value);
    const preco_unitario = parseFloat(document.getElementById("preco_unitario").value);

    if (!id_produto || !nome_produto || !quantidade_estoque || !preco_unitario) {
        alert("Erro nos dados digitados");
        return;
    }

    if(nome_produto.length<3 || nome_produto.length>50){
        mostrarAviso("O nome precisa estar entre 3-50 letras");
        document.getElementById("nome_produto").focus();
        return;
    }

    if(quantidade_estoque<0){
        mostrarAviso("A quantidade deve ser um valor positivo");
        document.getElementById("quantidade_estoque").focus();
        return;
    }

    if(preco_unitario<0){
        mostrarAviso("O preço deve ser um valor positivo");
        document.getElementById("preco_unitario").focus();
        return;
    }
    const dadosproduto = { id_produto, nome_produto, quantidade_estoque, preco_unitario };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/produto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosproduto)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/produto/${id_produto}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosproduto)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/produto/${id_produto}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("id_produto").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/produtos`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.produtos);
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
        texto += `${linha.id_produto} - ${linha.nome_produto} - ${linha.quantidade_estoque} - ${linha.preco_unitario}<br>`;
    }
    return texto || "Nenhum produto cadastrado.";
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

function mostrarDadosproduto(produto) {
    document.getElementById("id_produto").value = produto.id_produto;
    document.getElementById("nome_produto").value = produto.nome_produto;
    document.getElementById("quantidade_estoque").value = produto.quantidade_estoque;
    document.getElementById("preco_unitario").value = produto.preco_unitario;
    bloquearAtributos(true);
}

function limparAtributos() {
    produto = null;
    document.getElementById("nome_produto").value = "";
    document.getElementById("quantidade_estoque").value = "";
    document.getElementById("preco_unitario").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("id_produto").readOnly = !soLeitura;
    document.getElementById("nome_produto").readOnly = soLeitura;
    document.getElementById("quantidade_estoque").readOnly = soLeitura;
    document.getElementById("preco_unitario").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("id_produto").focus();
}