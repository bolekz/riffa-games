// backend/src/modules/auth/auth.controller.ts

import type { Request, Response, NextFunction } from 'express';
import authService from './auth.service';
import { generateResponse } from '../../utils/responseHandler';
import logger from '../../lib/logger';

/**
 * Controlador de autenticação.
 * Assume que os dados da requisição já foram validados pelo middleware 'validateRequest'.
 */
const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // O corpo da requisição já está validado, podemos usá-lo diretamente.
      const newUser = await authService.register(req.body);
      return res.status(201).json(generateResponse(true, 'Usuário registrado com sucesso.', newUser));
    } catch (err) {
      // Passa o erro para o errorHandler global.
      return next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body, res);
      return res.status(200).json(generateResponse(true, 'Login realizado com sucesso.', result));
    } catch (err) {
      // Erros de login (ex: senha errada) são tratados aqui com status 401.
      logger.error(err, `Falha na tentativa de login para ${req.body.email}`);
      return res.status(401).json(generateResponse(false, (err as Error).message));
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const result = await authService.logout(refreshToken, res);
      return res.status(200).json(generateResponse(true, result.message));
    } catch (err) {
      return next(err);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const result = await authService.refreshToken(refreshToken, res);
      return res.status(200).json(generateResponse(true, result.message));
    } catch (err) {
      return res.status(401).json(generateResponse(false, (err as Error).message));
    }
  },

  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.requestPasswordReset(req.body.email);
      return res.status(200).json(
        generateResponse(true, 'Se um usuário com este email existir, um link de redefinição foi enviado.')
      );
    } catch (err) {
      return next(err);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);
      return res.status(200).json(generateResponse(true, 'Senha redefinida com sucesso.'));
    } catch (err) {
      return res.status(400).json(generateResponse(false, (err as Error).message));
    }
  },
};

export default authController;