import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import steamRoutes from './routes/steamRoutes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/steam', steamRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
