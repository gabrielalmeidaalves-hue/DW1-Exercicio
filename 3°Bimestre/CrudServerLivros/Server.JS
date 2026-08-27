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

// --- ROTAS DO CRUD DE livroS ---

// 1. Listar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const query = 'SELECT id_livro, titulo, autor, ano_publicacao, genero, paginas FROM public.livro ORDER BY id_livro';
        const result = await pool.query(query);
        res.json({ sucesso: true, livros: result.rows });
    } catch (error) {
        console.error('Erro ao listar livros:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 2. Buscar livro por ID (PK)
app.get('/livro/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id_livro, titulo, autor, ano_publicacao, genero, paginas FROM public.livro WHERE id_livro = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'livro não encontrado com este ID' });
        }
        res.json({ sucesso: true, livro: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar livro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 3. Inserir livro
app.post('/livro', async (req, res) => {
    try {
        const { id_livro, titulo, autor, ano_publicacao, genero, paginas } = req.body;
        const query = 'INSERT INTO public.livro (id_livro, titulo, autor, ano_publicacao, genero, paginas) VALUES ($1, $2, $3, $4, $5, $6)';
        await pool.query(query, [id_livro, titulo, autor, ano_publicacao, genero, paginas]);
        res.json({ sucesso: true, mensagem: 'livro inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir livro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir livro' });
    }
});

// 4. Alterar livro
app.put('/livro/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, autor, ano_publicacao, genero, paginas } = req.body;
        const query = 'UPDATE public.livro SET titulo = $1, autor = $2, ano_publicacao = $3, genero = $4, paginas = $5 WHERE id_livro = $6';
        await pool.query(query, [titulo, autor, ano_publicacao, genero, paginas, id]);
        res.json({ sucesso: true, mensagem: 'livro atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar livro' });
    }
});

// 5. Excluir livro
app.delete('/livro/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM public.livro WHERE id_livro = $1';
        await pool.query(query, [id]);
        res.json({ sucesso: true, mensagem: 'livro excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir livro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir livro' });
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
    console.log(`  GET    http://${ip}:${port}/livros - Listar todos os livros`);
    console.log(`  GET    http://${ip}:${port}/livro/:id - Buscar livro por ID`);
    console.log(`  POST   http://${ip}:${port}/livro - Inserir novo livro`);
    console.log(`  PUT    http://${ip}:${port}/livro/:id - Alterar livro`);
    console.log(`  DELETE http://${ip}:${port}/livro/:id - Excluir livro`);
});