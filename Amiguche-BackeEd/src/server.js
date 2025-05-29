import adicionarRotas from './routes.js';
import express from 'express';
import 'dotenv/config'
import cors from 'cors';

const server=express();
server.use(express.json());
server.use(cors())

// EXPOR PASTA DE IMAGENS
server.use('/storage', express.static('storage'));

adicionarRotas(server);

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`O server está rodadndo na porta ${PORT}`);
})
