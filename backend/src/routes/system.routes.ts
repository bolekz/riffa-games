// src/routes/system.routes.ts

import { Router, Request, Response } from 'express';
import { generateResponse } from '../utils/responseHandler';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Verifica a saúde e o tempo de atividade do servidor.
 * @access  Público
 */
router.get('/health', (req: Request, res: Response) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
  };
  return res.status(200).json(generateResponse(true, 'Servidor está operacional', healthCheck));
});

/**
 * @route   GET /api/csrf-token
 * @desc    Fornece um token CSRF para o frontend usar em requisições seguras.
 * @access  Público
 */
router.get('/csrf-token', (req: Request, res: Response) => {
  // A função req.csrfToken() é adicionada pelo middleware 'csurf'
  // É essencial que esta rota seja chamada ANTES do middleware CSRF ser aplicado globalmente se necessário,
  // ou que não tenha a proteção aplicada a ela, para que possa fornecer o token inicial.
  return res.json({ csrfToken: req.csrfToken() });
});

export default router;