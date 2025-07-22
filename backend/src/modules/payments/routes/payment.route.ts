// src/modules/payments/routes/payment.route.ts

import { Router } from 'express';
import authMiddleware from '../../../middlewares/authMiddleware';
import validateRequest from '../../../middlewares/validateRequest';
import paymentController from '../controllers/payment.controller';
import { createPreferenceSchema } from '../validators/payment.validator';

const router = Router();

// Todas as rotas de pagamento aqui exigem autenticação
router.use(authMiddleware);

/**
 * @route   POST /api/payments/create-preference
 * @desc    Cria uma preferência de pagamento no Mercado Pago.
 * @access  Privado (Usuário Logado)
 */
// CORREÇÃO: "outer.post" corrigido para "router.post"
router.post(
  '/create-preference',
  validateRequest(createPreferenceSchema),
  paymentController.createPreference
);

export default router;