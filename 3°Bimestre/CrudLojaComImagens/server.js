const express = require('express');
const os = require('os');
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// MIDDLEWARE DE CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Garante que a pasta imagens existe
const dirImagens = path.join(__dirname, 'imagens');
if (!fs.existsSync(dirImagens)) {
    fs.mkdirSync(dirImagens);
}

// Servir imagens estaticamente
app.use('/imagens', express.static(dirImagens));

// Configuração do Multer na MEMÓRIA 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- ROTAS DO CRUD DE doceS ---

app.get('/doces', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.produto ORDER BY id_doce');
        res.json({ sucesso: true, doces: result.rows });
    } catch (error) {
        res.status(500).json({ sucesso: false });
    }
});

app.get('/doce/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public.produto WHERE id_doce = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ sucesso: false });
        res.json({ sucesso: true, doce: result.rows[0] });
    } catch (error) {
        res.status(500).json({ sucesso: false });
    }
});

app.post('/doce', async (req, res) => {
    try {
        const { id_doce, nome, tamanho, peso} = req.body;
        const query = 'INSERT INTO public.produto (id_doce, nome, tamanho, peso) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [id_doce, nome, tamanho, peso]);
        res.json({ sucesso: true, mensagem: 'doce inserido!' });
    } catch (error) {
        res.status(500).json({ sucesso: false });
    }
});

app.put('/doce/:id', async (req, res) => {
    try {
        const { nome, tamanho, peso} = req.body;
        const query = 'UPDATE public.produto SET nome = $1, tamanho = $2, peso = $3 WHERE id_doce = $4';
        await pool.query(query, [nome, tamanho, peso, req.params.id]);
        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({ sucesso: false });
    }
});

app.delete('/doce/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM public.produto WHERE id_doce = $1', [req.params.id]);

        const imgPath = path.join(__dirname, 'imagens', `${req.params.id}.png`);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

        res.json({ sucesso: true });
    } catch (error) {
        res.status(500).json({ sucesso: false });
    }
});

// --- ROTA DE UPLOAD E CONVERSÃO COM SHARP ---
app.post('/upload/:id', upload.single('cartaz'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nenhuma imagem recebida.' });
        }

        const imgPath = path.join(dirImagens, `${req.params.id}.png`);

        await sharp(req.file.buffer)
            .png()
            .toFile(imgPath);

        res.json({ sucesso: true, mensagem: 'Imagem convertida e salva com sucesso!' });
    } catch (error) {
        console.error("Erro ao converter imagem:", error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar imagem.' });
    }
});

app.listen(port, '0.0.0.0', () => console.log(`Servidor rodando na porta ${port}`));