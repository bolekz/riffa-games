// src/modules/user/routes/user.routes.ts

import { Router } from 'express';
import authMiddleware from '../../../middlewares/authMiddleware';
import userController from '../controllers/user.controller';

const router = Router();

// Todas as rotas aqui exigem autenticação
// CORREÇÃO: "outer" alterado para "router"
router.use(authMiddleware);

/**
 * @route   GET /api/users/me
 * @desc    Obtém o perfil do usuário autenticado.
 * @access  Privado
 */
router.get('/me', userController.getCurrentUserProfile);

/**
 * @route   DELETE /api/users/me
 * @desc    Exclui a conta do usuário autenticado.
 * @access  Privado
 */
router.delete('/me', userController.deleteCurrentUserAccount);

export default router;