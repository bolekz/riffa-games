// src/middlewares/rateLimiters.ts

import rateLimit from 'express-rate-limit';
import { generateResponse } from '../utils/responseHandler';

// Limite para rotas sensíveis (login, registro, etc.)
export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita cada IP a 10 requisições
  handler: (req, res) => {
    return res
      .status(429)
      .json(generateResponse(false, 'Muitas tentativas. Tente novamente em alguns minutos.'));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limite global padrão para toda a API
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Limita cada IP a 100 requisições por minuto
  handler: (req, res) => {
    return res
      .status(429)
      .json(generateResponse(false, 'Você excedeu o limite de requisições.'));
  },
  standardHeaders: true,
  legacyHeaders: false,
});