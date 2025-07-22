import { Request, Response } from 'express';
import { generateResponse } from '../utils/responseHandler';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json(generateResponse(false, 'Rota não encontrada.'));
}
