const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let livro = null;
bloquearAtributos(true);

// Busca no Banco de Dados via API
async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/livro/${chave}`);
        const data = await resposta.json();
        if (data.sucesso) {
            return data.livro;
        }
        return null;
    } catch (erro) {
        console.error('Erro na consulta:', erro);
        return null;
    }
}

// Procura por ID mantendo a dinâmica original de botões
async function procure() {
    const id_livro = document.getElementById("id_livro").value;
    if (isNaN(id_livro) || !Number.isInteger(Number(id_livro)) || id_livro === "") {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("id_livro").focus();
        return;
    }



    livro = await procurePorChavePrimaria(id_livro);
    if (livro) {
        mostrarDadoslivro(livro);
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
    document.getElementById("titulo").focus();
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
    let id_livro = livro ? livro.id_livro : parseInt(document.getElementById("id_livro").value);
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const ano_publicacao = parseInt(document.getElementById("ano_publicacao").value);
    const genero = document.getElementById("genero").value;
    const paginas = parseInt(document.getElementById("paginas").value);

    if (!id_livro || !titulo || !autor || !ano_publicacao || !genero || !paginas) {
        alert("Erro nos dados digitados");
        return;
    }

    if(titulo.length<1 || titulo.length>100 ||  titulo ==""){
        mostrarAviso("O nome precisa estar entre 1-100 letras");
        document.getElementById("titulo").focus();
        return;
    }

    if(autor == ""){
        mostrarAviso("A preencha o nome do autor");
        document.getElementById("autor").focus();
        return;
    }

    if(ano_publicacao<0){
        mostrarAviso("O preço deve ser um valor positivo");
        document.getElementById("ano_publicacao").focus();
        return;
    }
    const dadoslivro = { id_livro, titulo, autor, ano_publicacao, genero, paginas};

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/livro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadoslivro)
            });
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/livro/${id_livro}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadoslivro)
            });
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/livro/${id_livro}`, {
                method: 'DELETE'
            });
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("id_livro").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

// Busca a lista atualizada do backend
async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/livros`);
        const data = await resposta.json();
        if (data.sucesso) {
            document.getElementById("outputSaida").innerHTML = preparaListagem(data.livros);
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
        texto += `${linha.id_livro} - ${linha.titulo} - ${linha.autor} - ${linha.ano_publicacao} - ${linha.genero} - ${linha.paginas}<br>`;
    }
    return texto || "Nenhum livro cadastrado.";
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

function mostrarDadoslivro(livro) {
    document.getElementById("id_livro").value = livro.id_livro;
    document.getElementById("titulo").value = livro.titulo;
    document.getElementById("autor").value = livro.autor;
    document.getElementById("ano_publicacao").value = livro.ano_publicacao;
    document.getElementById("genero").value = livro.genero;
    document.getElementById("paginas").value = livro.paginas;
    bloquearAtributos(true);
}

function limparAtributos() {
    livro = null;
    document.getElementById("titulo").value = "";
    document.getElementById("autor").value = "";
    document.getElementById("ano_publicacao").value = "";
    document.getElementById("genero").value = "";
    document.getElementById("paginas").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("id_livro").readOnly = !soLeitura;
    document.getElementById("titulo").readOnly = soLeitura;
    document.getElementById("autor").readOnly = soLeitura;
    document.getElementById("ano_publicacao").readOnly = soLeitura;
    document.getElementById("genero").readOnly = soLeitura;
    document.getElementById("paginas").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar;
    document.getElementById("id_livro").focus();
}