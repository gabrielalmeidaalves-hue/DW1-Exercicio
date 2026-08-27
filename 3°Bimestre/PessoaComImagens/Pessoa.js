const URL_API = 'http://localhost:3001';
const SILHUETA_URL = `${URL_API}/imagens/silhueta.png`;

let oQueEstaFazendo = '';
let pessoa = null;
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
        const resposta = await fetch(`${URL_API}/pessoa/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.pessoa : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_pessoa = document.getElementById("id_pessoa").value;
    if (isNaN(id_pessoa) || !Number.isInteger(Number(id_pessoa)) || id_pessoa === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    pessoa = await procurePorChavePrimaria(id_pessoa);
    oQueEstaFazendo = ''; // Reseta o estado
    
    if (pessoa) {
        mostrarDadospessoa(pessoa);
        carregarImagem(id_pessoa);
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
    let id_pessoa = document.getElementById("id_pessoa").value;
    const nome = document.getElementById("nome").value;
    const datanascimento = document.getElementById("datanascimento").value;
    const nomedamae  = document.getElementById("nomedamae").value;

    const dadospessoa = { id_pessoa, nome, datanascimento, nomedamae };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/pessoa`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadospessoa) });
            await uploadImagemParaServidor(id_pessoa); // Salva a imagem após o texto
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/pessoa/${id_pessoa}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadospessoa) });
            await uploadImagemParaServidor(id_pessoa); // Atualiza a imagem após o texto
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/pessoa/${id_pessoa}`, { method: 'DELETE' });
            carregarImagem(null);
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("id_pessoa").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/pessoas`);
        const data = await resposta.json();
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.pessoas) {
                let dataFormatada = linha.datanascimento ? linha.datanascimento.split('T')[0] : '';
                texto += `${linha.id_pessoa} - ${linha.nome} - ${dataFormatada} - ${linha.nomedamae} <br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum pessoa cadastrado.";
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

function mostrarDadospessoa(f) {
    document.getElementById("id_pessoa").value = f.id_pessoa;
    document.getElementById("nome").value = f.nome;
    document.getElementById("datanascimento").value = f.datanascimento ? f.datanascimento.split('T')[0] : "";
    document.getElementById("nomedamae").value = f.nomedamae ;
    bloquearAtributos(true);
}

function limparAtributos() {
    pessoa = null;
    oQueEstaFazendo = ''; // Limpa a ação atual
    document.getElementById("nome").value = "";
    document.getElementById("datanascimento").value = "";
    document.getElementById("nomedamae").value = "";
    document.getElementById("inputImagem").value = ""; 
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("id_pessoa").readOnly = !soLeitura;
    document.getElementById("nome").readOnly = soLeitura;
    document.getElementById("datanascimento").readOnly = soLeitura;
    document.getElementById("nomedamae").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}