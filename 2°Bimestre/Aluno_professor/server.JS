const express = require('express');
const os = require('os');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS para permitir qualquer origem
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // '*' permite qualquer origem
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
//se vier uma requisição POST para a rota /enviar-mensagem, o servidor irá processar a mensagem recebida, convertê-la para maiúsculas e enviar uma resposta de volta ao cliente.
app.post('/enviar-mensagem', (req, res) => {

    // usar "destructuring" do JavaScript (mais elegante):
    // const { mensagem, x, y } = req.body; //cria 3 variáveis: mensagem, x e y, e atribui os valores correspondentes do objeto req.body a elas.

    //modo tradicional: capturar os dados do corpo da requisição (req.body) e armazená-los em variáveis separadas para uso posterior.

    let mensagem = req.body.mensagem;
    let Nome = req.body.Nome;
    let Nota = req.body.Nota;

    console.log(`A mensagem recebida foi: ${mensagem}`);
    console.log(`Os dados recebidos foram: (${Nome}, ${Nota})`);

    // 2. Realiza o cálculo de pitágoras usando os valores de x e y recebidos do cliente. O resultado é armazenado na variável h.


    let m = ""

    if(Nota>=7){
         m = "Parabéns " + Nome + " Você foi aprovado!"
    }else{
        m =  "Olá"+ Nome + ", você precisará de recuperação"

    }

    //  Enviar um objeto (pacotinho) de volta para o cliente, contendo a mensagem e o resultado do cálculo.
    
    res.json({        
        Valor: m
    });
});

const obterIP = () => {
    const interfaces = os.networkInterfaces();
    for (let nomeInterface in interfaces) {
        for (let info of interfaces[nomeInterface]) {
            if (info.family === 'IPv4' && !info.internal) return info.address;
        }
    }
    return 'localhost';
};

const ip = obterIP()

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://${ip}:${port}`)
})