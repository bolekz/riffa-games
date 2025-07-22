// src/modules/prizeClaim/routes/prizeClaim.routes.ts

import { Router } from 'express';
import prizeClaimController from '../controllers/prizeClaim.controller';
import authMiddleware from '../../../middlewares/authMiddleware';
import validateRequest from '../../../middlewares/validateRequest';
import { prizeClaimIdSchema } from '../validators/prizeClaim.validator';

const router = Router();

// Todas as rotas de reivindicação de prêmios exigem autenticação.
router.use(authMiddleware);

/**
 * @route   GET /api/claims/my-claims
 * @desc    Lista todas as reivindicações de prêmios do usuário autenticado.
 * @access  Privado (Usuário Logado)
 */
router.get('/my-claims', prizeClaimController.listMyClaims);

/**
 * @route   POST /api/claims/:id/claim
 * @desc    Processa a reivindicação de um prêmio específico.
 * @access  Privado (Usuário Logado)
 */
router.post(
  '/:id/claim',
  validateRequest(prizeClaimIdSchema), // 1. Valida o ID na URL
  prizeClaimController.claimPrize       // 2. Executa o controller
);

export default router;