class Carros {
    constructor(id_carr, nome, modelo, ano, posicaoNaLista) {
        this.id_carr = id_carr;
        this.nome = nome;
        this.modelo = modelo;
        this.ano = ano;


        this.posicaoNaLista = posicaoNaLista; //atributo para facilitar a alteração e exclusão 
    }
}