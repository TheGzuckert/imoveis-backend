"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pg_1 = require("pg");
const app = (0, express_1.default)();
const port = 3000;
// Configuração do banco de dados
const pool = new pg_1.Pool({
    user: 'seu_usuario',
    host: 'localhost',
    database: 'seu_banco_de_dados',
    password: 'sua_senha',
    port: 5432,
});
// Rota para recuperar todos os dados da tabela
app.get('/dados', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM sua_tabela');
        client.release();
        res.json(result.rows);
    }
    catch (err) {
        console.error('Erro ao recuperar dados', err);
        res.status(500).send('Erro ao recuperar dados');
    }
});
// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
