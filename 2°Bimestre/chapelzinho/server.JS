const express = require('express');
const os = require('os');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Configuração do pool de conexão com PostgreSQL
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Middleware para parsear JSON
app.use(express.json());

// Middleware CORS (Verificação de origem da Servidorina)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Rota Única: Enviar e Receber Mensagens (POST)
app.post('/api/mensagens', async (req, res) => {
    try {
        const mensagemRecebida = req.body.mensagem;

        if (!mensagemRecebida) {
            return res.status(400).json({ status: "erro", mensagem: "Bilhete vazio!" });
        }

        const agora = new Date();
        const dataHora = `${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`;
        console.log(`Bilhete recebido da Clientina: ${mensagemRecebida} - ${dataHora}`);

        // REGRA 1: Se for "vovó"
        if (mensagemRecebida === "vovó") {
            return res.status(200).json({
                status: "sucesso",
                mensagem: "Oi, em que posso ajudar?"
            });
        }

        // REGRA 2: Se for "chegou"
        else if (mensagemRecebida === "chegou") {
            return res.status(200).json({
                status: "sucesso",
                mensagem: "a Chapeuzinho chegou aqui com o bilhete"
            });
        }

        else if (mensagemRecebida === "paes") {
            try {
                const query = "SELECT quantidade_produto FROM public.produto WHERE nome_produto ='Pão'";
                const result = await pool.query(query);

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: "Quantidade de pães: " + result.rows[0].quantidade_produto
                });

            } catch (erro) {
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao consultar os pães"
                });
            }
        }

        else if (mensagemRecebida === "bolo") {
            try {
                const query = "SELECT quantidade_produto FROM public.produto WHERE nome_produto ='Bolo'";
                const result = await pool.query(query);

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: "Quantidade de bolo: " + result.rows[0].quantidade_produto
                });
            } catch (erro) {
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro ao consultar o bolo"
                });
            }
        }

        // REGRA 3: Se for "situacao" - consulta o estoque e retorna o que precisa ser reposto
        else if (mensagemRecebida === "situacao") {
            try {
                // Consulta o banco de dados
                const query = 'SELECT * FROM public.produto';
                const result = await pool.query(query);

                // Aplica a regra de negócio (calcula o que precisa ser reposto)
                let reposicao = {};

                result.rows.forEach(produto => {
                    if (produto.quantidade_produto < produto.quantidade_minima_produto) {
                        const quantidadeParaPedir = produto.quantidade_maxima_produto - produto.quantidade_produto;

                        // Formata o nome para minúsculo
                        let nomeFormatado = produto.nome_produto.toLowerCase();

                        reposicao[nomeFormatado] = quantidadeParaPedir;
                    }
                });

                // Prepara uma mensagem amigável para mostrar no frontend
                let mensagemResposta = "";
                const itens = Object.entries(reposicao);

                if (itens.length === 0) {
                    mensagemResposta = "Tudo ok! Nenhum item precisa ser reposto no momento.";
                } else {
                    mensagemResposta = "Precisamos repor:\n";
                    itens.forEach(([item, quantidade]) => {
                        mensagemResposta += `- ${item}: ${quantidade} unidades\n`;
                    });
                }

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta,
                    dados_reposicao: reposicao  // Dados estruturados caso queira usar
                });

            } catch (dbError) {
                console.error('Erro no banco de dados:', dbError);
                return res.status(500).json({
                    status: "erro",
                    mensagem: 'Erro ao consultar situação do estoque'
                });
            }
        }

        else if(mensagemRecebida === "minimos") {
            try{
                const query = "SELECT nome_produto, quantidade_minima_produto FROM public.produto";
                const result = await pool.query(query);

                let mensagemResposta = "Quantidades minímas: \n";

                result.rows.forEach(produto => {
                    mensagemResposta += `${produto.nome_produto}: ${produto.quantidade_minima_produto}\n`;
                });

                return res.status(200).json({
                    status: "sucesso",
                    mensagem: mensagemResposta
                });
                
            } catch (erro) {
                return res.status(500).json({
                    status: "erro",
                    mensagem: "Erro a consultar as quantidades mínimas"
                });
            }
        }

        // REGRA 4: Qualquer outra palavra
        else {
            return res.status(200).json({
                status: "sucesso",
                mensagem: "mensagem não entendida"
            });
        }

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        res.status(500).json({ status: "erro", mensagem: 'Erro interno da Servidorina' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidorina atenta na porta ${port}`);
    console.log(`Rota disponível:`);
    console.log(`  POST http://localhost:${port}/api/mensagens - Enviar Bilhetes`);
    console.log(`\nMensagens disponíveis (possíveis)`);
    console.log(`  "vovó"     -> Resposta de saudação`);
    console.log(`  "chegou"   -> Confirmação de chegada`);
    console.log(`  "situacao" -> Consulta de reposição de estoque`);
    console.log(`  "paes" -> Consulta a quantidade de paes`);
    console.log(`  "bolo" -> Consulta a quantidade de bolo`);
    console.log(`  "minimos" -> Consulta as quantidades minimas de cada produto`);
    console.log(`  (outras)   -> Mensagem não entendida`);
});