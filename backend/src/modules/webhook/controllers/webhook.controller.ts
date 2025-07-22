// src/modules/webhook/controllers/webhook.controller.ts

import type { Request, Response, NextFunction } from 'express';
import webhookService from '../services/webhook.service';
import logger from '../../../lib/logger';

const webhookController = {
  async handleMercadoPago(req: Request, res: Response, next: NextFunction): Promise<void> {
    const paymentId = req.body?.data?.id as string | undefined;

    if (!paymentId) {
      logger.warn('[WEBHOOK] payload válido, porém sem data.id (paymentId).');
      // CORREÇÃO: Removido o 'return' para satisfazer o tipo de retorno Promise<void>.
      res.sendStatus(400);
      return; // Apenas para sair da função
    }

    try {
      await webhookService.processPaymentNotification(paymentId);
    } catch (err) {
      logger.error({ err, paymentId }, '[WEBHOOK] Falha no processamento interno da notificação.');
    }

    res.sendStatus(200);
  },
};

export default webhookController;