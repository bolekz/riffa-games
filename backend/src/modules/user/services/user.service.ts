// src/modules/user/services/user.service.ts

import type { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../../../config/prisma';
import logger from '../../../lib/logger';

/**
 * Serviço de Usuário: retorna perfis públicos e gerencia exclusão de conta.
 */
const userService = {
  /**
   * Retorna dados de perfil públicos de um usuário.
   * @param userId - ID do usuário
   */
  async getProfileById(userId: string) {
    if (!userId) {
      throw new Error('ID do usuário não fornecido.');
    }

    // Retorna apenas campos públicos/seguros, sem expor o email.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        role: true,
        createdAt: true,
        riffaCoinsAvailable: true,
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    return user;
  },

  /**
   * Exclui permanentemente a conta e dados associados de um usuário.
   * Opera tudo em transação para garantir atomicidade.
   * @param userId - ID do usuário
   */
  async deleteAccount(userId: string) {
    logger.warn(`[DELETE_ACCOUNT] Iniciando exclusão para usuário: ${userId}`);

    // Usamos a tipagem correta `Prisma.TransactionClient` para o cliente de transação.
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Verifica existência
      const userToDelete = await tx.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      if (!userToDelete) {
        throw new Error('Usuário não encontrado para exclusão.');
      }

      // 2. Nulifica relacionamentos opcionais
      await tx.tournament.updateMany({
        where: { OR: [{ ownerId: userId }, { winnerId: userId }] },
        data: { ownerId: null, winnerId: null },
      });

      // 3. Deleta registros dependentes em paralelo para melhor performance
      await Promise.all([
        tx.prizeClaim.deleteMany({ where: { userId } }),
        tx.notification.deleteMany({ where: { userId } }),
        tx.financialProfile.deleteMany({ where: { userId } }),
        tx.subscription.deleteMany({ where: { userId } }),
        tx.leaderboardEntry.deleteMany({ where: { userId } }),
        tx.userEvent.deleteMany({ where: { userId } }),
        tx.transaction.deleteMany({ where: { userId } }),
      ]);

      // 4. Exclui o usuário
      await tx.user.delete({ where: { id: userId } });

      logger.info(
        `[DELETE_ACCOUNT] Usuário ${userId} (${userToDelete.email}) excluído com sucesso.`
      );

      return { message: 'Conta e dados associados foram excluídos com sucesso.' };
    });

    return result;
  },
};

export default userService;