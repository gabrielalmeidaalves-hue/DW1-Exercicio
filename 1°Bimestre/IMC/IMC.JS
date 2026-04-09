        function FuncaoImc(){
            let peso = parseFloat(document.getElementById("peso").value);
            let altura = parseFloat(document.getElementById("altura").value);

     let respostaEl = document.getElementById("resposta");

if (isNaN(peso) || peso < 5) {
    respostaEl.innerHTML = "Insira um peso maior que 5 Kg!";
    respostaEl.className = "erro";
    return;
}

if (isNaN(altura) || altura <= 0) {
    respostaEl.innerHTML = "Insira uma altura válida!";
    respostaEl.className = "erro";
    return;
}
            let imc = peso / (altura * altura)
            let resposta = ""
       if (imc < 18.5) {
        resposta = "Abaixo do peso";
    } else if (imc >= 18.5 && imc <= 24.9) {
        resposta = "Peso normal";
    } else if (imc >= 25 && imc <= 29.9) {
        resposta = "Sobrepeso";
    } else if (imc >= 30 && imc <= 34.9) {
        resposta = "Obesidade grau I";
    } else if (imc >= 35 && imc <= 39.9) {
        resposta = "Obesidade grau II";
    } else {
        resposta = "Obesidade grau III";
    }
            respostaEl.innerHTML = "Classificação: " + resposta + "<br>" + "IMC: " + imc.toFixed(2)
        }

        