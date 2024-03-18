import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const cors = require('cors');
const app = express();
const port = 3333;

app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

app.get('/dados/:filter?', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const value = req.params.filter;
    let queryString = 'SELECT * FROM imoveis_sp';

    if (value) {
      queryString = `
      SELECT * FROM imoveis_sp WHERE 
      "NUMERO DO CONTRIBUINTE" LIKE '%${value}%' 
      OR "NOME DE LOGRADOURO DO IMOVEL" LIKE '%${value}%'
      OR "COMPLEMENTO DO IMOVEL" LIKE '%${value}%'
      OR "BAIRRO DO IMOVEL" LIKE '%${value}%'
      OR "CEP DO IMOVEL" LIKE '%${value}%'
      `
      if( Number(value) ){
        console.log(Number(value))
        queryString += `
      OR CAST ("NUMERO DO IMOVEL" AS VARCHAR) LIKE '%${Number(value)}%'
      OR CAST ("AREA DO TERRENO" AS VARCHAR) LIKE '%${Number(value)}%'
      OR CAST ("VALOR DO M2 DO TERRENO" AS VARCHAR) LIKE '%${Number(value)}%'
        `
}
    }

    const result = await client.query(queryString);
    client.release();

    res.json(result.rows);

  } catch (err) {

    console.error('Erro ao recuperar dados', err);
    
    res.status(404).send('Erro ao recuperar dados');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
