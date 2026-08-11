const express = require('express');
const os = require('os');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configura o pool de conexões reutilizando os dados protegidos do arquivo .env
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});


app.use(express.json());
//Permite que o frontend (mesmo rodando em outra origem/porta) acesse esta API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();// Passa o controle para a próxima rota correspondente
});


app.post('/api/listarVeiculos', async (req, res) => {
    try {
        const agora = new Date();
        const dataHora = `${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`;
         console.log(`Listando todos os veículos - ${dataHora}`);


        const query = "Select v.modelo, v.marca, v.ano_fabricacao From veiculo v Order By v.modelo";
        const result = await pool.query(query);
// Envia as linhas retornadas do banco (result.rows) em formato JSON para o cliente
        res.json(result.rows)

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        res.status(500).json({ status: "erro", mensagem: 'Erro ao listar veículos' });
    }
});

app.post('/api/BuscarVeiculo', async (req, res) => {
    try {
        const agora = new Date();
        const dataHora = `${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`;
         console.log(`Buscando veículo - ${dataHora}`);

        const modelo = req.body.modelo;
        const query = "Select c.nome_categoria, v.modelo, v.marca, v.ano_fabricacao From veiculo v Inner join categoria c On v.id_categoria = c.id_categoria Where v.modelo ILIKE $1"
        const result = await pool.query(query,[`%${modelo}%`])
          if (result.rows.length === 0) {
            return res.json({ mensagem: 'Veículo não encontrado' });
        }
        res.json(result.rows)

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        res.status(500).json({ status: "erro", mensagem: 'Erro ao buscar veículos' });
    }
});


app.post('/api/BuscarCategorias', async (req, res) => {
    try {
        const agora = new Date();
        const dataHora = `${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`;
        console.log(`Buscando categoria - ${dataHora}`);


        const categoria = req.body.categoria;
        const query = "Select c.nome_categoria, v.modelo, v.marca, v.ano_fabricacao From veiculo v Inner join categoria c On v.id_categoria = c.id_categoria Where Lower(c.nome_categoria) = Lower($1)";
        const result = await pool.query(query,[categoria]);

          if (result.rows.length === 0) {
            return res.json({ mensagem: 'Veículo não encontrado' });
        }
        res.json(result.rows)

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        res.status(500).json({ status: "erro", mensagem: 'Erro ao buscar categoria' });
    }
});


// Inicializa o servidor HTTP escutando no IP '0.0.0.0' (torna acessível na rede local) e na porta definida
app.listen(port, '0.0.0.0', () => {
    console.log(`porta ${port}`);
    console.log(`Rota disponível:`);
    console.log(`  POST http://localhost:${port}/api/listarVeiculos`);
    console.log(`  POST http://localhost:${port}/api/BuscarVeiculo`);
    console.log(`  POST http://localhost:${port}/api/BuscarCategorias`);
});