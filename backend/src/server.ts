// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import http, { Server } from 'http';
import type { AddressInfo } from 'net';
import prisma from './config/prisma';
import logger from './lib/logger';
import { tournamentFinalizerJob } from './jobs/tournamentFinalizer';

let server: Server;
const PORT = Number(process.env.PORT) || 3333;

function initJobs(): void {
  logger.info('[JOB] Inicializando agendadores...');
  try {
    tournamentFinalizerJob();
  } catch (err) {
    logger.warn('[JOB] Falha ao iniciar tournamentFinalizerJob:', err);
  }
}

function startServer(): Server {
  server = http.createServer(app);
  server.listen(PORT, () => {
    const address = server.address() as AddressInfo;
    logger.info(`🚀 Servidor da Riffa Games rodando em http://localhost:${address.port}`);
  });
  return server;
}

// Handlers de erros e desligamento (inalterados)
process.on('uncaughtException', (error: Error) => {
  logger.error({ err: error }, 'UNCAUGHT EXCEPTION! Desligando...');
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'UNHANDLED REJECTION!');
});

function gracefulShutdown(signal: string): void {
  logger.warn(`[SERVER] Sinal ${signal} recebido. Encerrando...`);
  server.close(async () => {
    logger.info('[SERVER] Servidor HTTP fechado.');
    await prisma.$disconnect();
    logger.info('[SERVER] Prisma desconectado.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('[SERVER] Timeout de 10s. Encerrando forçadamente.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = { startServer, get server() { return server; } };

initJobs();
startServer();

export { server };

