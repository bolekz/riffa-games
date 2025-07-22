import pino from 'pino';

// Configurações do logger
const logger = pino({
  // Em desenvolvimento, usa o pino-pretty para logs mais legíveis e coloridos.
  // Em produção, usa o formato JSON padrão, que é mais eficiente para máquinas.
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export default logger;