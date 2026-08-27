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

// --- ROTAS DO CRUD DE alunoS ---

// 1. Listar todos os alunos
app.get('/alunos', async (req, res) => {
    try {
        // Alias entre aspas força o retorno da chave "RA_aluno" (senão viria como ra_aluno em minúsculo)
        const query = 'SELECT RA_aluno AS "RA_aluno", nome_completo, data_nascimento, email, telefone, curso FROM public.aluno ORDER BY RA_aluno';
        const result = await pool.query(query);
        res.json({ sucesso: true, alunos: result.rows });
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 2. Buscar aluno por ID (PK)
app.get('/aluno/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT RA_aluno AS "RA_aluno", nome_completo, data_nascimento, email, telefone, curso FROM public.aluno WHERE RA_aluno = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'aluno não encontrado com este ID' });
        }
        res.json({ sucesso: true, aluno: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 3. Inserir aluno
app.post('/aluno', async (req, res) => {
    try {
        const { RA_aluno, nome_completo, data_nascimento, email, telefone, curso } = req.body;
        const query = 'INSERT INTO public.aluno (RA_aluno, nome_completo, data_nascimento, email, telefone, curso) VALUES ($1, $2, $3, $4, $5, $6)';
        await pool.query(query, [RA_aluno, nome_completo, data_nascimento, email, telefone, curso]);
        res.json({ sucesso: true, mensagem: 'aluno inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir aluno:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir aluno' });
    }
});

// 4. Alterar aluno
app.put('/aluno/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome_completo, data_nascimento, email, telefone, curso } = req.body;
        const query = 'UPDATE public.aluno SET nome_completo = $1, data_nascimento = $2, email = $3, telefone = $4, curso = $5 WHERE RA_aluno = $6';
        await pool.query(query, [nome_completo, data_nascimento, email, telefone, curso, id]);
        res.json({ sucesso: true, mensagem: 'aluno atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar aluno' });
    }
});

// 5. Excluir aluno
app.delete('/aluno/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM public.aluno WHERE RA_aluno = $1';
        await pool.query(query, [id]);
        res.json({ sucesso: true, mensagem: 'aluno excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir aluno' });
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
    console.log(`  GET    http://${ip}:${port}/alunos - Listar todos os alunos`);
    console.log(`  GET    http://${ip}:${port}/aluno/:id - Buscar aluno por ID`);
    console.log(`  POST   http://${ip}:${port}/aluno - Inserir novo aluno`);
    console.log(`  PUT    http://${ip}:${port}/aluno/:id - Alterar aluno`);
    console.log(`  DELETE http://${ip}:${port}/aluno/:id - Excluir aluno`);
});