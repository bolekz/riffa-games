// src/config/prisma.ts

import { PrismaClient } from '@prisma/client';
import logger from '../lib/logger';

// Instancia o cliente do Prisma com logs para monitorar o ciclo de vida da conexão.
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
  ],
});

logger.info('[PRISMA] Cliente Prisma inicializado.');

// Adiciona um listener para o evento de query (útil para depuração em desenvolvimento)
prisma.$on('query', (e) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`[PRISMA] Query: ${e.query}`);
    logger.info(`[PRISMA] Params: ${e.params}`);
    logger.info(`[PRISMA] Duration: ${e.duration}ms`);
  }
});

export default prisma;