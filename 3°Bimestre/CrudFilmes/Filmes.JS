class Filmes {
    constructor(id_filme, nome, ano, genero, duracao, posicaoNaLista) {
        this.id_filme = id_filme;
        this.nome = nome;
        this.ano = ano;
        this.genero = genero;
        this.duracao = duracao;

        this.posicaoNaLista = posicaoNaLista; //atributo para facilitar a alteração e exclusão 
    }
}