// src/modules/prizeClaim/services/prizeClaim.service.ts

import type { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../../../config/prisma';
import logger from '../../../lib/logger';
import userEventService, { UserEventTypes } from '../../user/services/userEvent.service';

const prizeClaimService = {
  async listByUser(userId: string) {
    return prisma.prizeClaim.findMany({
      where: { userId },
      include: {
        tournamentPrize: {
          include: {
            item: true,
            tournament: { select: { name: true, id: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async claim(userId: string, prizeClaimId: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const claim = await tx.prizeClaim.findUnique({
        where: { id: prizeClaimId },
        include: {
          tournamentPrize: {
            include: {
              item: true,
              tournament: { select: { name: true } },
            },
          },
        },
      });

      if (!claim) throw new Error('Reivindicação não encontrada.');
      if (claim.userId !== userId) throw new Error('Acesso negado: esta reivindicação não pertence ao usuário.');
      if (claim.status !== 'PENDING_CLAIM') throw new Error(`Reivindicação já processada (status: ${claim.status}).`);

      const { tournamentPrize } = claim;
      let newStatus: 'ITEM_CLAIMED' | 'CONVERTED_TO_RC';

      if (typeof tournamentPrize.rcAmount === 'number' && tournamentPrize.rcAmount > 0) {
        newStatus = 'CONVERTED_TO_RC';
        await tx.user.update({
          where: { id: userId },
          data: { riffaCoinsAvailable: { increment: tournamentPrize.rcAmount } },
        });
        logger.info(`[PRIZE_CLAIM] Creditado ${tournamentPrize.rcAmount} RC ao usuário ${userId}`);
      } else if (tournamentPrize.item) {
        newStatus = 'ITEM_CLAIMED';
        logger.info(`[PRIZE_CLAIM] Item '${tournamentPrize.item.name}' reivindicado por ${userId}.`);
      } else {
        logger.error(`[PRIZE_CLAIM] Prêmio ${tournamentPrize.id} sem valor configurado.`);
        throw new Error('Prêmio sem valor definido. Contate o suporte.');
      }

      const updatedClaim = await tx.prizeClaim.update({
        where: { id: prizeClaimId },
        data: { status: newStatus, claimedAt: new Date() },
      });

      await userEventService.create(userId, UserEventTypes.PRIZE_CLAIMED, {
        prizeClaimId,
        newStatus,
        details: `Reivindicado prêmio do torneio '${tournamentPrize.tournament.name}'`,
      } as Prisma.JsonObject);

      logger.info(`[PRIZE_CLAIM] Usuário ${userId} processou a reivindicação ${prizeClaimId}. Novo status: ${newStatus}`);
      return updatedClaim;
    });
  },
};

export default prizeClaimService;