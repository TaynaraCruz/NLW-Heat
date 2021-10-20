import 'dotenv/config';
import express from 'express';
import { router } from './routes';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  /**
   * Permite que todas as fontes se conectem com a aplicação tanto http
   * quando socket io
   */
  cors: {
    origin: '*',
  }
});

io.on('connection', socket => {
  console.log(`Usuário conectado no Socket ${socket.id}`);
})

app.use(express.json()); //Aceita body no formato JSON
app.use(router); //Toda vez que se usa app.use estamos usando middlewares

app.get('/github', (req, res) => {
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
});

app.get('/signin/callback', (req, res) => {
  const { code } = req.query;
  return res.json(code);
});

export { serverHttp, io }