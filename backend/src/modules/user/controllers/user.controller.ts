import type { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { generateResponse } from '../../../utils/responseHandler';
import logger from '../../../lib/logger';

/**
 * Controlador de Usuário: obtém perfis e gerencia exclusão de conta.
 */
const userController = {
  /**
   * Retorna o perfil do usuário autenticado.
   * O authMiddleware garante que req.user exista.
   */
  async getCurrentUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const userProfile = await userService.getProfileById(userId);
      return res
        .status(200)
        .json(generateResponse(true, 'Perfil carregado com sucesso.', userProfile));
    } catch (err) {
      logger.error('Erro em getCurrentUserProfile:', err);
      return next(err);
    }
  },

  /**
   * Exclui a conta do usuário autenticado e encerra a sessão.
   */
  async deleteCurrentUserAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await userService.deleteAccount(userId);

      // Limpa cookies de sessão após exclusão de conta
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });

      logger.info(
        `[ACCOUNT_DELETION] Usuário ${userId} excluído com sucesso. Sessão encerrada.`
      );

      return res
        .status(200)
        .json(generateResponse(true, result.message));
    } catch (err) {
      logger.error('Erro em deleteCurrentUserAccount:', err);
      return next(err);
    }
  },
};

export default userController;
