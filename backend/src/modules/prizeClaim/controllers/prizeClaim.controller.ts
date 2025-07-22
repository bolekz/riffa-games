// src/modules/prizeClaim/controllers/prizeClaim.controller.ts

import type { Request, Response, NextFunction } from 'express';
import prizeClaimService from '../services/prizeClaim.service';
import { generateResponse } from '../../../utils/responseHandler';
import logger from '../../../lib/logger';

/**
 * Controlador de Prize Claims: orquestra listagem e processamento de claims.
 */
const prizeClaimController = {
  /**
   * Retorna todas as reivindicações de prêmio do usuário autenticado.
   */
  async listMyClaims(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const claims = await prizeClaimService.listByUser(userId);
      return res
        .status(200)
        .json(generateResponse(true, 'Reivindicações encontradas com sucesso.', claims));
    } catch (err) {
      logger.error('Erro em prizeClaimController.listMyClaims:', err);
      return next(err);
    }
  },

  /**
   * Processa a reivindicação de um prêmio (claim) pelo usuário.
   */
  async claimPrize(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const prizeClaimId = req.params.id;

      const updatedClaim = await prizeClaimService.claim(userId, prizeClaimId);
      return res
        .status(200)
        .json(generateResponse(true, 'Prêmio reivindicado com sucesso.', updatedClaim));
    } catch (err) {
      logger.error('Erro em prizeClaimController.claimPrize:', err);
      return next(err);
    }
  },
};

export default prizeClaimController;
