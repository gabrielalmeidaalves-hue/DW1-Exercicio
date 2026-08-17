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

// --- ROTAS DO CRUD DE produtoS ---

// 1. Listar todos os produtos
app.get('/produtos', async (req, res) => {
    try {
        const query = 'SELECT id_produto, nome_produto, quantidade_estoque, preco_unitario FROM public.produto ORDER BY id_produto';
        const result = await pool.query(query);
        res.json({ sucesso: true, produtos: result.rows });
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 2. Buscar produto por ID (PK)
app.get('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id_produto, nome_produto, quantidade_estoque, preco_unitario FROM public.produto WHERE id_produto = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'produto não encontrado com este ID' });
        }
        res.json({ sucesso: true, produto: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 3. Inserir produto
app.post('/produto', async (req, res) => {
    try {
        const { id_produto, nome_produto, quantidade_estoque, preco_unitario } = req.body;
        const query = 'INSERT INTO public.produto (id_produto, nome_produto, quantidade_estoque, preco_unitario) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [id_produto, nome_produto, quantidade_estoque, preco_unitario]);
        res.json({ sucesso: true, mensagem: 'produto inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir produto:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir produto' });
    }
});

// 4. Alterar produto
app.put('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_produto, quantidade_estoque, preco_unitario } = req.body;
        const query = 'UPDATE public.produto SET nome_produto = $1, quantidade_estoque = $2, preco_unitario = $3 WHERE id_produto = $4';
        await pool.query(query, [nome_produto, quantidade_estoque, preco_unitario, id]);
        res.json({ sucesso: true, mensagem: 'produto atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar produto' });
    }
});

// 5. Excluir produto
app.delete('/produto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM public.produto WHERE id_produto = $1';
        await pool.query(query, [id]);
        res.json({ sucesso: true, mensagem: 'produto excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir produto' });
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
    console.log(`  GET    http://${ip}:${port}/produtos - Listar todos os produtos`);
    console.log(`  GET    http://${ip}:${port}/produto/:id - Buscar produto por ID`);
    console.log(`  POST   http://${ip}:${port}/produto - Inserir novo produto`);
    console.log(`  PUT    http://${ip}:${port}/produto/:id - Alterar produto`);
    console.log(`  DELETE http://${ip}:${port}/produto/:id - Excluir produto`);
});