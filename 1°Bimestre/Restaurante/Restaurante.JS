function CalcularCompra() {
    let CachorroquenteB = parseFloat(document.getElementById("CachorroQ").value);
    if(isNaN(CachorroquenteB)){
        CachorroquenteB = 0
    }
    let CachorroquenteD = parseFloat(document.getElementById("CachorroQ2").value);
     if(isNaN(CachorroquenteD)){
        CachorroquenteD = 0
    }
    let X_salada = parseFloat(document.getElementById("X-salada").value);
     if(isNaN(X_salada)){
        X_salada = 0
    }
    let Refrigerante_350 = parseFloat(document.getElementById("Refrigerante_350").value);
     if(isNaN(Refrigerante_350)){
        Refrigerante_350 = 0
    }
    let Refrigerante_1 = parseFloat(document.getElementById("Refrigerante_1").value);
     if(isNaN(Refrigerante_1)){
        Refrigerante_1 = 0
    }


    let Cb = 22 * CachorroquenteB;
    let Cd = 26 * CachorroquenteD;
    let Sx = 29 * X_salada;
    let R_350 = 5 * Refrigerante_350;
    let R_1 = 8 * Refrigerante_1;

    let Valor = Cb + Cd + Sx + R_350 + R_1;


    document.getElementById("resultado").innerHTML =
        "O valor total da compra é R$ " + Valor.toFixed(2);
}
