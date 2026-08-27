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

// --- ROTAS DO CRUD DE veiculoS ---

// 1. Listar todos os veiculos
app.get('/veiculos', async (req, res) => {
    try {
        // Alias entre aspas força o retorno da chave "id_veiculo" (senão viria como id_veiculo em minúsculo)
        const query = 'SELECT id_veiculo, marca, modelo, ano_fabricacao, cor, placa FROM public.veiculo ORDER BY id_veiculo';
        const result = await pool.query(query);
        res.json({ sucesso: true, veiculos: result.rows });
    } catch (error) {
        console.error('Erro ao listar veiculos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 2. Buscar veiculo por ID (PK)
app.get('/veiculo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id_veiculo, marca, modelo, ano_fabricacao, cor, placa FROM public.veiculo WHERE id_veiculo = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'veiculo não encontrado com este ID' });
        }
        res.json({ sucesso: true, veiculo: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar veiculo:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
});

// 3. Inserir veiculo
app.post('/veiculo', async (req, res) => {
    try {
        const { id_veiculo, marca, modelo, ano_fabricacao, cor, placa } = req.body;
        const query = 'INSERT INTO public.veiculo (id_veiculo, marca, modelo, ano_fabricacao, cor, placa) VALUES ($1, $2, $3, $4, $5, $6)';
        await pool.query(query, [id_veiculo, marca, modelo, ano_fabricacao, cor, placa]);
        res.json({ sucesso: true, mensagem: 'veiculo inserido com sucesso!' });
    } catch (error) {
        console.error('Erro ao inserir veiculo:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir veiculo' });
    }
});

// 4. Alterar veiculo
app.put('/veiculo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { marca, modelo, ano_fabricacao, cor, placa } = req.body;
        const query = 'UPDATE public.veiculo SET marca = $1, modelo = $2, ano_fabricacao = $3, cor = $4, placa = $5 WHERE id_veiculo = $6';
        await pool.query(query, [marca, modelo, ano_fabricacao, cor, placa, id]);
        res.json({ sucesso: true, mensagem: 'veiculo atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar veiculo:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar veiculo' });
    }
});

// 5. Excluir veiculo
app.delete('/veiculo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM public.veiculo WHERE id_veiculo = $1';
        await pool.query(query, [id]);
        res.json({ sucesso: true, mensagem: 'veiculo excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir veiculo:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir veiculo' });
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
    console.log(`  GET    http://${ip}:${port}/veiculos - Listar todos os veiculos`);
    console.log(`  GET    http://${ip}:${port}/veiculo/:id - Buscar veiculo por ID`);
    console.log(`  POST   http://${ip}:${port}/veiculo - Inserir novo veiculo`);
    console.log(`  PUT    http://${ip}:${port}/veiculo/:id - Alterar veiculo`);
    console.log(`  DELETE http://${ip}:${port}/veiculo/:id - Excluir veiculo`);
});