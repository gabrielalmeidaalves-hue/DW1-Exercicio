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

// Middleware cidadeS habilitando os métodos GET, POST, PUT e DELETE
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

// --- ROTAS DO CRUD DE clienteS ---

// 1. Listar todos os clientes
app.get('/clientes', async (req, res) => {
    try {
        // Alias entre aspas força o retorno da chave "id_cliente" (senão viria como id_cliente em minúsculo)
        const query = 'SELECT id_cliente, nome, cpf, endereco, cidade, uf, telefone FROM public.cliente ORDER BY id_cliente';
        const result = await pool.query(query);
        res.json({ sucesso: true, clientes: result.rows });
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 2. Buscar cliente por ID (PK)
app.get('/cliente/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id_cliente, nome, cpf, endereco, cidade, uf, telefone FROM public.cliente WHERE id_cliente = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'cliente não encontrado com este ID' });
        }
        res.json({ sucesso: true, cliente: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 3. Inserir cliente
app.post('/cliente', async (req, res) => {
    try {
        const { id_cliente, nome, cpf, endereco, cidade, uf, telefone } = req.body;
        const query = 'INSERT INTO public.cliente (id_cliente, nome, cpf, endereco, cidade, uf, telefone) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        await pool.query(query, [id_cliente, nome, cpf, endereco, cidade, uf, telefone]);
        res.json({ sucesso: true, mensagem: 'cliente inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir cliente:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir cliente' });
    }
});

// 4. Alterar cliente
app.put('/cliente/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, endereco, cidade, uf, telefone } = req.body;
        const query = 'UPDATE public.cliente SET nome = $1, cpf = $2, endereco = $3, cidade = $4, uf = $5, telefone = $6 WHERE id_cliente = $7';
        await pool.query(query, [nome, cpf, endereco, cidade, uf, telefone, id]);
        res.json({ sucesso: true, mensagem: 'cliente atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar cliente' });
    }
});

// 5. Excluir cliente
app.delete('/cliente/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM public.cliente WHERE id_cliente = $1';
        await pool.query(query, [id]);
        res.json({ sucesso: true, mensagem: 'cliente excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir cliente' });
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
    console.log(`  GET    http://${ip}:${port}/clientes - Listar todos os clientes`);
    console.log(`  GET    http://${ip}:${port}/cliente/:id - Buscar cliente por ID`);
    console.log(`  POST   http://${ip}:${port}/cliente - Inserir novo cliente`);
    console.log(`  PUT    http://${ip}:${port}/cliente/:id - Alterar cliente`);
    console.log(`  DELETE http://${ip}:${port}/cliente/:id - Excluir cliente`);
});