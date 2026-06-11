const express = require('express');
const os = require('os');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = 3000;

// Configuração do diretório onde as imagens serão salvas
const pastaImagens = './imagens/';

// Garante que a pasta existe, se não existir, cria ela
if (!fs.existsSync(pastaImagens)){
    fs.mkdirSync(pastaImagens, { recursive: true });
}

// Configuração de armazenamento do Multer
const armazenamento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pastaImagens); // Define a pasta de destino
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo: timestamp atual + nome original do arquivo para evitar duplicatas
        const nomeUnico = Date.now() + '-' + file.originalname;
        cb(null, nomeUnico);
    }
});

// Inicializa o middleware do multer com a configuração de armazenamento
const upload = multer({ storage: armazenamento });

// Middlewares padrão
app.use(express.json());

// Middleware CORS adaptado para suportar o FormData e métodos necessários
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// --- ROTA ANTERIOR (Mantida para exemplo) ---
app.post('/enviar-mensagem', (req, res) => {
    let x = req.body.x;
    let y = req.body.y;
    console.log(`As coordenadas recebidas foram: (${x}, ${y})`);
    let h = Math.hypot(x, y);
    res.json({ hipotenusa: h });
});

// --- NOVA ROTA: Enviar Imagem ---
// 'foto' é o nome do campo (input) que virá do HTML
app.post('/enviar-imagem', upload.single('foto'), (req, res) => {
    try {
        // Se nenhum arquivo foi enviado
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo foi enviado.');
        }

        console.log(`Imagem recebida com sucesso: ${req.file.filename}`);
        
        // Resposta enviada de volta ao cliente
        res.json({ 
            mensagem: 'Imagem salva com sucesso!',
            nomeArquivo: req.file.filename,
            caminho: req.file.path
        });

    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).send('Erro interno ao salvar a imagem.');
    }
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

const ip = obterIP();

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://${ip}:${port}`);
});