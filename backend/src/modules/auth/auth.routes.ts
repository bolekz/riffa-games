// backend/src/modules/auth/auth.routes.ts

import { Router } from 'express';
import authController from './auth.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import validateRequest from '../../middlewares/validateRequest';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validator';

const router = Router();

// --- Rotas Públicas ---

// Rota de Registro: valida o corpo da requisição com o registerSchema
router.post('/register', validateRequest(registerSchema), authController.register);

// Rota de Login: valida com o loginSchema
router.post('/login', validateRequest(loginSchema), authController.login);

// Rota para solicitar reset de senha
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.requestPasswordReset);

// Rota para efetivar o reset de senha
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

// --- Rotas que exigem um Refresh Token (mas não um Access Token) ---

// Rota para renovar o access token
router.post('/refresh', authController.refreshToken);

// --- Rotas Autenticadas (exigem Access Token válido) ---

// Rota de Logout
router.post('/logout', authMiddleware, authController.logout);


export default router;