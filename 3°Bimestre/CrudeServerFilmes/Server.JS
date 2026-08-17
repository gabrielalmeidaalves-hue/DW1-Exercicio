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

// Middleware CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// --- ROTAS DO CRUD DE FILMES ---

// 1. Listar todos os filmes
app.get('/filmes', async (req, res) => {
    try {
        const query = 'SELECT id_filme, nome_filme, diretor_filme, data_lancamento, duracao_minutos FROM public.filme ORDER BY id_filme';
        const result = await pool.query(query);
        res.json({ sucesso: true, filmes: result.rows });
    } catch (error) {
        console.error('Erro ao listar filmes:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 2. Buscar filme por ID (PK)
app.get('/filme/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id_filme, nome_filme, diretor_filme, data_lancamento, duracao_minutos FROM public.filme WHERE id_filme = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'filme não encontrado com este ID' });
        }
        res.json({ sucesso: true, filme: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar filme:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 3. Inserir filme
app.post('/filme', async (req, res) => {
    try {
        const { id_filme, nome_filme, diretor_filme, data_lancamento, duracao_minutos } = req.body;
        const query = 'INSERT INTO public.filme (id_filme, nome_filme, diretor_filme, data_lancamento, duracao_minutos) VALUES ($1, $2, $3, $4, $5)';
        await pool.query(query, [id_filme, nome_filme, diretor_filme, data_lancamento, duracao_minutos]);
        res.json({ sucesso: true, mensagem: 'filme inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir filme:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir filme' });
    }
});

// 4. Alterar filme
app.put('/filme/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_filme, diretor_filme, data_lancamento, duracao_minutos } = req.body;
        const query = 'UPDATE public.filme SET nome_filme = $1, diretor_filme = $2, data_lancamento = $3, duracao_minutos = $4 WHERE id_filme = $5';
        await pool.query(query, [nome_filme, diretor_filme, data_lancamento, duracao_minutos, id]);
        res.json({ sucesso: true, mensagem: 'filme atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar filme:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar filme' });
    }
});

// 5. Excluir filme
app.delete('/filme/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM public.filme WHERE id_filme = $1';
        await pool.query(query, [id]);
        res.json({ sucesso: true, mensagem: 'filme excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir filme:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir filme' });
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
    console.log(`  GET    http://${ip}:${port}/filmes - Listar todos os filmes`);
    console.log(`  GET    http://${ip}:${port}/filme/:id - Buscar filme por ID`);
    console.log(`  POST   http://${ip}:${port}/filme - Inserir novo filme`);
    console.log(`  PUT    http://${ip}:${port}/filme/:id - Alterar filme`);
    console.log(`  DELETE http://${ip}:${port}/filme/:id - Excluir filme`);
});