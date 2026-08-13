const express = require('express');
const os = require('os');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configuração do pool de conexão com PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS habilitando os métodos GET, POST, PUT e DELETE
// Middleware CORS ajustado
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // Responde com sucesso direto para as chamadas de verificação (preflight)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// --- ROTAS DO CRUD DE CARROS ---

// 1. Listar todos os carros
app.get('/carros', async (req, res) => {
    try {
        const query = 'SELECT id_carro, nome_carro, modelo_carro, ano FROM public.carro ORDER BY id_carro';
        const result = await pool.query(query);
        res.json({ sucesso: true, carros: result.rows });
    } catch (error) {
        console.error('Erro ao listar carros:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 2. Buscar carro por ID (PK)
app.get('/carro/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id_carro, nome_carro, modelo_carro, ano FROM public.carro WHERE id_carro = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Carro não encontrado com este ID' });
        }
        res.json({ sucesso: true, carro: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar carro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 3. Inserir carro
app.post('/carro', async (req, res) => {
    try {
        const { id_carro, nome_carro, modelo_carro, ano } = req.body;
        const query = 'INSERT INTO public.carro (id_carro, nome_carro, modelo_carro, ano) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [id_carro, nome_carro, modelo_carro, ano]);
        res.json({ sucesso: true, mensagem: 'Carro inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir carro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir carro' });
    }
});

// 4. Alterar carro
app.put('/carro/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_carro, modelo_carro, ano } = req.body;
        const query = 'UPDATE public.carro SET nome_carro = $1, modelo_carro = $2, ano = $3 WHERE id_carro = $4';
        await pool.query(query, [nome_carro, modelo_carro, ano, id]);
        res.json({ sucesso: true, mensagem: 'Carro atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar carro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar carro' });
    }
});

// 5. Excluir carro
app.delete('/carro/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM public.carro WHERE id_carro = $1';
        await pool.query(query, [id]);
        res.json({ sucesso: true, mensagem: 'Carro excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir carro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir carro' });
    }
});

// Obter endereço IP da rede local
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
    console.log(`Rotas disponíveis:`);
    console.log(`  GET    http://${ip}:${port}/carros - Listar todos os carros`);
    console.log(`  GET    http://${ip}:${port}/carro/:id - Buscar carro por ID`);
    console.log(`  POST   http://${ip}:${port}/carro - Inserir novo carro`);
    console.log(`  PUT    http://${ip}:${port}/carro/:id - Alterar carro`);
    console.log(`  DELETE http://${ip}:${port}/carro/:id - Excluir carro`);
});