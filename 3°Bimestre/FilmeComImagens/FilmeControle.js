const URL_API = 'http://localhost:3001';
const SILHUETA_URL = `${URL_API}/imagens/silhueta.png`;

let oQueEstaFazendo = '';
let filme = null;
bloquearAtributos(true);

// Carrega a imagem do banco ou mostra a silhueta
function carregarImagem(id) {
    const img = document.getElementById('imgCartaz');
    if (!id) {
        img.src = SILHUETA_URL;
        return;
    }
    img.src = `${URL_API}/imagens/${id}.png?t=${new Date().getTime()}`;
    img.onerror = () => { img.src = SILHUETA_URL; };
}

// Aciona o clique no input hidden APENAS se estiver inserindo ou alterando
function acionarUpload() {
    if (oQueEstaFazendo !== 'inserindo' && oQueEstaFazendo !== 'alterando') {
        mostrarAviso("Clique em Inserir ou Alterar primeiro para poder escolher uma imagem.");
        return;
    }
    document.getElementById('inputImagem').click();
}

// Apenas mostra a imagem na tela localmente (sem enviar pro servidor ainda)
function previewImagem() {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length > 0) {
        // Cria uma URL temporária para visualização instantânea
        const url = URL.createObjectURL(inputFiles[0]);
        document.getElementById('imgCartaz').src = url;
        mostrarAviso("Imagem escolhida! Clique em Salvar para concluir.");
    }
}

// Função auxiliar para enviar a imagem para a API
async function uploadImagemParaServidor(id) {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length === 0) return; // Se não escolheu imagem, não faz nada

    const formData = new FormData();
    formData.append('cartaz', inputFiles[0]);

    try {
        await fetch(`${URL_API}/upload/${id}`, {
            method: 'POST',
            body: formData
        });
    } catch (erro) {
        console.error("Erro ao enviar imagem:", erro);
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/filme/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.filme : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_filme = document.getElementById("inputId_filme").value;
    if (isNaN(id_filme) || !Number.isInteger(Number(id_filme)) || id_filme === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    filme = await procurePorChavePrimaria(id_filme);
    oQueEstaFazendo = ''; // Reseta o estado
    
    if (filme) {
        mostrarDadosFilme(filme);
        carregarImagem(id_filme);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        carregarImagem(null);
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos, escolha a imagem e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos, mude a imagem (opcional) e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    let id_filme = document.getElementById("inputId_filme").value;
    const nome_filme = document.getElementById("inputNome_filme").value;
    const diretor_filme = document.getElementById("inputDiretor_filme").value;
    const data_lancamento = document.getElementById("inputData_lancamento").value;
    const duracao = parseInt(document.getElementById("inputDuracao").value);

    const dadosFilme = { id_filme, nome_filme, diretor_filme, data_lancamento, duracao };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/filme`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosFilme) });
            await uploadImagemParaServidor(id_filme); // Salva a imagem após o texto
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/filme/${id_filme}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosFilme) });
            await uploadImagemParaServidor(id_filme); // Atualiza a imagem após o texto
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/filme/${id_filme}`, { method: 'DELETE' });
            carregarImagem(null);
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

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/filmes`);
        const data = await resposta.json();
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.filmes) {
                let dataFormatada = linha.data_lancamento ? linha.data_lancamento.split('T')[0] : '';
                texto += `${linha.id_filme} - ${linha.nome_filme} - ${linha.diretor_filme} - ${dataFormatada} - ${linha.duracao} min<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum filme cadastrado.";
        }
    } catch (erro) {
        document.getElementById("outputSaida").innerHTML = "Servidor offline.";
    }
}

function cancelarOperacao() {
    limparAtributos();
    carregarImagem(null);
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosFilme(f) {
    document.getElementById("inputId_filme").value = f.id_filme;
    document.getElementById("inputNome_filme").value = f.nome_filme;
    document.getElementById("inputDiretor_filme").value = f.diretor_filme;
    document.getElementById("inputData_lancamento").value = f.data_lancamento ? f.data_lancamento.split('T')[0] : "";
    document.getElementById("inputDuracao").value = f.duracao;
    bloquearAtributos(true);
}

function limparAtributos() {
    filme = null;
    oQueEstaFazendo = ''; // Limpa a ação atual
    document.getElementById("inputNome_filme").value = "";
    document.getElementById("inputDiretor_filme").value = "";
    document.getElementById("inputData_lancamento").value = "";
    document.getElementById("inputDuracao").value = "";
    document.getElementById("inputImagem").value = ""; 
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_filme").readOnly = !soLeitura;
    document.getElementById("inputNome_filme").readOnly = soLeitura;
    document.getElementById("inputDiretor_filme").readOnly = soLeitura;
    document.getElementById("inputData_lancamento").readOnly = soLeitura;
    document.getElementById("inputDuracao").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}