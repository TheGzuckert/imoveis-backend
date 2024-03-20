import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const cors = require('cors');
const app = express();
const port = 3333;

export type Imoveis = {
  numeroContribuinte: number
  nomeLogradouro: string
  numeroImovel: number
  complemento: string
  bairro: string
  cep: number
  areaTerreno: number
  valorM2: number
}

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

    const data: Imoveis[] = result.rows.map(row => {
      return {
        areaTerreno: row['AREA DO TERRENO'],
        bairro: row['BAIRRO DO IMOVEL'],
        cep: row['CEP DO IMOVEL'],
        complemento: row['COMPLEMENTO DO IMOVEL'],
        nomeLogradouro: row['NOME DE LOGRADOURO DO IMOVEL'],
        numeroContribuinte: row['NUMERO DO CONTRIBUINTE'],
        numeroImovel: row['NUMERO DO IMOVEL'],
        valorM2: row['VALOR DO M2 DO TERRENO'],
      }
    })
    res.json(data);

  } catch (err) {

    console.error('Erro ao recuperar dados', err);
    
    res.status(404).send('Erro ao recuperar dados');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
