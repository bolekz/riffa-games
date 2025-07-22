// src/middlewares/errorHandler.ts

import type { Request, Response, NextFunction } from 'express';
import { generateResponse } from '../utils/responseHandler';
import logger from '../lib/logger';

// Interface customizada para erros que podem ter um statusCode
interface HttpError extends Error {
  statusCode?: number;
}

function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  logger.error(
    {
      err: { message: err.message, stack: err.stack, name: err.name },
      req: { method: req.method, url: req.originalUrl, ip: req.ip },
    },
    'ERRO CAPTURADO PELO MIDDLEWARE GLOBAL'
  );

  // Se a resposta já foi enviada, delega para o próximo handler de erro do Express
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;
  const message = (status === 500)
    ? 'Ocorreu um erro inesperado no servidor.'
    : err.message;

  return res.status(status).json(generateResponse(false, message));
}

export default errorHandler;