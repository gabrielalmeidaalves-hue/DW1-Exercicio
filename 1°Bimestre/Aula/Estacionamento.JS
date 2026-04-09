function calcularTarifa(){
    let horas = parseInt(document.getElementById("horas").value.replace(',', '.'));
    let comprimento = document.getElementById("comprimento").checked;
    let frequente = document.getElementById("frequente").checked;

    let Valorbase = 0;

if(horas==1){
    Valorbase = 5;
}else if(horas>1 && horas <24){
    
    Valorbase = (horas - 1)*2.5 + 5;
}

    if(horas>=24){
        let diarias = parseInt(horas/24);
          Valorbase = diarias*60;

          let execedentes = (horas % 24);

        Valorbase = diarias*60;
        
        if(execedentes>0){
            Valorbase = Valorbase + 5;

            if(execedentes>1){
                Valorbase = Valorbase + (execedentes-1)*2.5
            }

        }
        
    }

    
        if(comprimento){
            Valorbase = Valorbase*1.25;
        }

        if(frequente){
            Valorbase = Valorbase*0.95
        }
    
   document.getElementById("resultado").innerHTML = Valorbase
    //a
    
}