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

// --- ROTAS DO CRUD DE pessoaS ---

// 1. Listar todos os pessoas
app.get('/pessoas', async (req, res) => {
    try {
        const query = 'SELECT cpf, nome, data_nascimento, nome_mae, altura FROM public.pessoa ORDER BY cpf';
        const result = await pool.query(query);
        res.json({ sucesso: true, pessoas: result.rows });
    } catch (error) {
        console.error('Erro ao listar pessoas:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 2. Buscar pessoa por ID (PK)
app.get('/pessoa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT cpf, nome, data_nascimento, nome_mae, altura FROM public.pessoa WHERE cpf = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'pessoa não encontrado com este ID' });
        }
        res.json({ sucesso: true, pessoa: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar pessoa:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 3. Inserir pessoa
app.post('/pessoa', async (req, res) => {
    try {
        const { cpf, nome, data_nascimento, nome_mae, altura } = req.body;
        const query = 'INSERT INTO public.pessoa (cpf, nome, data_nascimento, nome_mae, altura) VALUES ($1, $2, $3, $4, $5)';
        await pool.query(query, [cpf, nome, data_nascimento, nome_mae, altura]);
        res.json({ sucesso: true, mensagem: 'pessoa inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir pessoa:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir pessoa' });
    }
});

// 4. Alterar pessoa
app.put('/pessoa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, data_nascimento, nome_mae, altura } = req.body;
        const query = 'UPDATE public.pessoa SET nome = $1, data_nascimento= $2, nome_mae = $3, altura = $4 WHERE cpf = $5';
        await pool.query(query, [nome, data_nascimento, nome_mae, altura, id]);
        res.json({ sucesso: true, mensagem: 'pessoa atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar pessoa:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar pessoa' });
    }
});

// 5. Excluir pessoa
app.delete('/pessoa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM public.pessoa WHERE cpf = $1';
        await pool.query(query, [id]);
        res.json({ sucesso: true, mensagem: 'pessoa excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir pessoa:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir pessoa' });
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
    console.log(`  GET    http://${ip}:${port}/pessoas - Listar todos os pessoas`);
    console.log(`  GET    http://${ip}:${port}/pessoa/:id - Buscar pessoa por ID`);
    console.log(`  POST   http://${ip}:${port}/pessoa - Inserir novo pessoa`);
    console.log(`  PUT    http://${ip}:${port}/pessoa/:id - Alterar pessoa`);
    console.log(`  DELETE http://${ip}:${port}/pessoa/:id - Excluir pessoa`);
});