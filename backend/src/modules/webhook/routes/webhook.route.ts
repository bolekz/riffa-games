// src/modules/webhook/routes/webhook.route.ts

import { Router } from 'express';
// CORREÇÃO: Usando chaves {} para importar uma função nomeada.
import { validateMercadoPagoWebhook } from '../../../middlewares/validateMercadoPagoWebhook';
import webhookController from '../controllers/webhook.controller';

const router = Router();

router.post(
  '/mercadopago',
  validateMercadoPagoWebhook,
  webhookController.handleMercadoPago
);

export default router;