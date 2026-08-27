const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let veiculo = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/veiculo/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.veiculo;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const id_veiculo = document.getElementById("id_veiculo").value;
    if (isNaN(id_veiculo) || !Number.isInteger(Number(id_veiculo)) || id_veiculo === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("id_veiculo").focus();
        return;
    }

    veiculo = await procurePorChavePrimaria(id_veiculo);
    if (veiculo) {
        mostrarDadosveiculo(veiculo);
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
    document.getElementById("marca").focus();
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
    let id_veiculo = veiculo ? veiculo.id_veiculo : parseInt(document.getElementById("id_veiculo").value);
    const marca = document.getElementById("marca").value.trim();
    const modelo= document.getElementById("modelo").value;
    const ano_fabricacao = parseInt(document.getElementById("ano_fabricacao").value);
    const cor = document.getElementById("cor").value;
    const placa = document.getElementById("placa").value;

    if (!id_veiculo || !marca || !modelo|| !ano_fabricacao || !cor || !placa) {
        alert("Erro nos dados digitados");
        return;
    }

    const dadosveiculo = { id_veiculo, marca, modelo, ano_fabricacao, cor, placa };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/veiculo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosveiculo)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/veiculo/${id_veiculo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosveiculo)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/veiculo/${id_veiculo}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("id_veiculo").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/veiculos`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.veiculos);
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
        texto += `${linha.id_veiculo} - ${linha.marca} - ${linha.modelo} - ${linha.ano_fabricacao} - ${linha.cor} - ${linha.placa}<br>`;
    }
    return texto || "Nenhum veiculo cadastrado.";
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

function mostrarDadosveiculo(veiculo) {
    document.getElementById("id_veiculo").value = veiculo.id_veiculo;
    document.getElementById("marca").value = veiculo.marca;
    document.getElementById("modelo").value = veiculo.modelo;
    document.getElementById("ano_fabricacao").value = veiculo.ano_fabricacao;
    document.getElementById("cor").value = veiculo.cor;
    document.getElementById("placa").value = veiculo.placa;
    bloquearAtributos(true);
}

function limparAtributos() {
    veiculo = null;
    document.getElementById("marca").value = "";
    document.getElementById("modelo").value = "";
    document.getElementById("ano_fabricacao").value = "";
    document.getElementById("cor").value = "";
    document.getElementById("placa").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("id_veiculo").readOnly = !soLeitura;
    document.getElementById("marca").readOnly = soLeitura;
    document.getElementById("modelo").readOnly = soLeitura;
    document.getElementById("ano_fabricacao").readOnly = soLeitura;
    document.getElementById("cor").readOnly = soLeitura;
    document.getElementById("placa").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("id_veiculo").focus();
}