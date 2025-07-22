// src/modules/payments/controllers/payment.controller.ts

import type { Request, Response, NextFunction } from 'express';
import paymentService from '../services/payment.service';
import { generateResponse } from '../../../utils/responseHandler';
import logger from '../../../lib/logger';

/**
 * Controlador de Pagamentos: orquestra criação de preferências MP.
 */
const paymentController = {
  /**
   * Cria preferência de compra de RiffaCoins.
   * req.body já validado pelo middleware validateRequest(createPreferenceSchema)
   */
  async createPreference(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const { quantity, unitPrice } = req.body;

      const preference = await paymentService.createRiffaCoinPreference(
        userId,
        { quantity, unitPrice }
      );

      res
        .status(201)
        .json(
          generateResponse(
            true,
            'Preferência de pagamento criada com sucesso.',
            preference
          )
        );
    } catch (err) {
      logger.error('Erro em paymentController.createPreference:', err);
      return next(err);
    }
  },
};

export default paymentController;
