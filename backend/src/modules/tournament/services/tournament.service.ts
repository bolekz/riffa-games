// src/modules/tournament/services/tournament.service.ts

import type { Prisma, Tournament, User, TournamentAttempt, TournamentPrize } from '@prisma/client';
import prisma from '../../../config/prisma';
import logger from '../../../lib/logger';
import userEventService, { UserEventTypes } from '../../user/services/userEvent.service';

export type CreateTournamentData = Omit<
  Prisma.TournamentCreateInput,
  'owner' | 'status' | 'sellingEndsAt' | 'competitionStartsAt' | 'competitionEndsAt'
> & {
  sellingEndsAt: string;
  competitionStartsAt: string;
  competitionEndsAt: string;
};

export interface ListTournamentFilters {
  status?: 'SELLING' | 'COMPLETED' | 'CANCELED';
  gameId?: string;
}

function validateJoinConditions(user: User | null, tournament: Tournament | null, attemptsCount: number): void {
  if (!tournament || tournament.status !== 'SELLING') throw new Error('Torneio não está disponível para inscrição.');
  if (tournament.ticketsSold >= tournament.ticketTarget) throw new Error('Ingressos esgotados.');
  if (!user || user.riffaCoinsAvailable < tournament.pricePerTicket) throw new Error('RiffaCoins insuficientes.');
  if (attemptsCount >= tournament.maxAttemptsPerUser) throw new Error('Limite de tentativas atingido.');
}

const tournamentService = {
  async create(ownerId: string, data: CreateTournamentData) {
    const { sellingEndsAt, competitionStartsAt, competitionEndsAt, ...rest } = data;
    const tournament = await prisma.tournament.create({
      data: {
        ...rest,
        owner: { connect: { id: ownerId } },
        status: 'SELLING',
        sellingEndsAt: new Date(sellingEndsAt),
        competitionStartsAt: new Date(competitionStartsAt),
        competitionEndsAt: new Date(competitionEndsAt),
      },
    });

    await userEventService.create(ownerId, UserEventTypes.TOURNAMENT_CREATED, {
      tournamentId: tournament.id,
      tournamentName: tournament.name,
    });

    return tournament;
  },

  async list(filters: ListTournamentFilters) {
    const where: Prisma.TournamentWhereInput = {
      status: filters.status ?? 'SELLING',
      visibility: { in: ['PUBLIC', 'SUBSCRIBERS_ONLY'] },
      sellingEndsAt: { gt: new Date() },
      ...(filters.gameId && { gameId: filters.gameId }),
    };

    return prisma.tournament.findMany({
      where,
      include: {
        game: { select: { name: true, id: true } },
        miniGame: { select: { name: true } },
        owner: { select: { id: true, nickname: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string) {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        game: true,
        miniGame: true,
        owner: { select: { id: true, nickname: true } },
        prizes: { include: { item: true }, orderBy: { rank: 'asc' } },
        attempts: {
          where: { score: { not: null } },
          include: { competitor: { select: { id: true, nickname: true } } },
          orderBy: { score: 'desc' },
        },
      },
    });

    if (!tournament) throw new Error('Torneio não encontrado.');
    return tournament;
  },

  async join(userId: string, tournamentId: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const [tournament, user, attemptsCount] = await Promise.all([
        tx.tournament.findUnique({ where: { id: tournamentId } }),
        tx.user.findUnique({ where: { id: userId } }),
        tx.tournamentAttempt.count({ where: { tournamentId, competitorId: userId } }),
      ]);

      validateJoinConditions(user, tournament, attemptsCount);

      const [updatedUser, transaction] = await Promise.all([
        tx.user.update({
          where: { id: userId },
          data: { riffaCoinsAvailable: { decrement: tournament!.pricePerTicket } },
        }),
        tx.transaction.create({
          data: {
            userId,
            type: 'PURCHASE_TICKET',
            amountRc: tournament!.pricePerTicket,
            status: 'COMPLETED',
            details: { description: `Ingresso: ${tournament!.name}` } as Prisma.JsonObject,
          },
        }),
      ]);

      const attempt = await tx.tournamentAttempt.create({
        data: {
          tournamentId,
          competitorId: userId,
          amountPaidInRC: tournament!.pricePerTicket,
          transactionId: transaction.id,
        },
      });

      const updatedTournament = await tx.tournament.update({
        where: { id: tournamentId },
        data: { ticketsSold: { increment: 1 } },
      });

      return {
        attempt,
        user: { riffaCoinsAvailable: updatedUser.riffaCoinsAvailable },
        tournament: { ticketsSold: updatedTournament.ticketsSold },
      };
    });
  },

  async submitScore(userId: string, tournamentId: string, score: number) {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: { miniGame: { select: { minScore: true, maxScore: true } } },
    });

    if (!tournament || tournament.status !== 'SELLING') throw new Error('Competição não está ativa.');
    const now = new Date();
    if (now < tournament.competitionStartsAt || now > tournament.competitionEndsAt) throw new Error('Fora do período de competição.');
    if (tournament.miniGame.minScore != null && score < tournament.miniGame.minScore) throw new Error(`Pontuação mínima: ${tournament.miniGame.minScore}.`);
    if (tournament.miniGame.maxScore != null && score > tournament.miniGame.maxScore) throw new Error(`Pontuação máxima: ${tournament.miniGame.maxScore}.`);

    const attempt = await prisma.tournamentAttempt.findFirst({
      where: { tournamentId, competitorId: userId, score: null },
      orderBy: { createdAt: 'asc' },
    });

    if (!attempt) throw new Error('Nenhuma tentativa disponível para submeter pontuação.');

    return prisma.tournamentAttempt.update({ where: { id: attempt.id }, data: { score } });
  },

  async cancel(tournamentId: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const tournament = await tx.tournament.findUnique({
        where: { id: tournamentId },
        include: { attempts: { select: { competitorId: true, amountPaidInRC: true } } },
      });

      if (!tournament || tournament.status !== 'SELLING') throw new Error('Torneio não pode ser cancelado.');

      await Promise.all(
        tournament.attempts
          .filter((attempt: { amountPaidInRC: number | null }) => (attempt.amountPaidInRC ?? 0) > 0)
          .map((attempt: { competitorId: string; amountPaidInRC: number | null }) =>
            tx.user.update({ where: { id: attempt.competitorId }, data: { riffaCoinsAvailable: { increment: attempt.amountPaidInRC! } } }))
      );

      const updated = await tx.tournament.update({ where: { id: tournamentId }, data: { status: 'CANCELED' } });

      logger.info(`[CANCEL] Torneio ${tournamentId} cancelado. Reembolsos: ${tournament.attempts.length}`);
      return { ...updated, refundsProcessed: tournament.attempts.length };
    });
  },

  async finalize(tournamentId: string) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const tournament = await tx.tournament.findUnique({
        where: { id: tournamentId },
        include: {
          attempts: { where: { score: { not: null } } },
          prizes: { orderBy: { rank: 'asc' } },
          miniGame: true,
        },
      });

      if (!tournament) throw new Error('Torneio não encontrado.');
      if (tournament.status !== 'SELLING') throw new Error('O torneio não pode ser finalizado neste estado.');
      if (new Date() < tournament.competitionEndsAt) throw new Error('A competição ainda não terminou.');
      
      if (tournament.attempts.length === 0) {
        logger.warn(`[FINALIZE] Torneio ${tournamentId} sem pontuações. Será cancelado.`);
        return tx.tournament.update({ where: { id: tournamentId }, data: { status: 'CANCELED' } });
      }

      const ranked = [...tournament.attempts].sort((a: TournamentAttempt, b: TournamentAttempt) => {
        const scoreA = a.score ?? 0;
        const scoreB = b.score ?? 0;
        return tournament.miniGame.scoreOrder === 'ASC' ? scoreA - scoreB : scoreB - scoreA;
      });

      await Promise.all(
        tournament.prizes
          .filter((prize: TournamentPrize) => (prize.rank - 1) < ranked.length)
          .map((prize: TournamentPrize) => {
            const winner = ranked[prize.rank - 1];
            logger.info(`[FINALIZE] Criando PrizeClaim (Rank ${prize.rank}) para o usuário ${winner.competitorId}`);
            return tx.prizeClaim.create({ data: { userId: winner.competitorId, tournamentPrizeId: prize.id, status: 'PENDING_CLAIM' } });
          })
      );

      return tx.tournament.update({
        where: { id: tournamentId },
        data: { status: 'COMPLETED', winnerId: ranked[0].competitorId },
      });
    });
  },
};

export default tournamentService;