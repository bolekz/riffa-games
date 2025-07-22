// src/middlewares/adminMiddleware.ts

import type { Request, Response, NextFunction } from 'express';
import { generateResponse } from '../utils/responseHandler';

function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json(generateResponse(false, 'Acesso restrito a administradores.'));
  }
  return next();
}

export default adminMiddleware;