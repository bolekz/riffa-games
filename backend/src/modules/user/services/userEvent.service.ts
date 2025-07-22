// src/modules/user/services/userEvent.service.ts

import type { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import logger from '../../../lib/logger';

/**
 * Define os tipos de eventos de usuário para uma auditoria consistente.
 */
export const UserEventTypes = {
  USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILURE: 'USER_LOGIN_FAILURE',
  USER_REGISTERED: 'USER_REGISTERED',
  USER_DELETED: 'USER_DELETED',
  TOURNAMENT_CREATED: 'TOURNAMENT_CREATED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  PRIZE_CLAIMED: 'PRIZE_CLAIMED',
} as const;

/**
 * Tipo de evento derivado do objeto UserEventTypes para garantir a segurança de tipos.
 */
export type UserEventType = typeof UserEventTypes[keyof typeof UserEventTypes];

/**
 * Serviço de auditoria para registrar eventos importantes do usuário.
 * As falhas na criação de eventos são apenas logadas e não interrompem o fluxo principal.
 */
const userEventService = {
  /**
   * Cria um novo registro de evento de usuário no banco de dados.
   * @param userId - O ID do usuário associado ao evento.
   * @param eventType - O tipo do evento (deve ser um dos UserEventTypes).
   * @param payload - Dados adicionais em formato JSON sobre o evento.
   */
  async create(
    userId: string,
    eventType: UserEventType,
    payload: Prisma.JsonObject = {}
  ): Promise<void> {
    try {
      await prisma.userEvent.create({
        data: { userId, eventType, payload },
      });
    } catch (error) {
      logger.error(
        { error, userId, eventType, payload },
        `Falha ao criar evento de usuário '${eventType}' para o usuário ${userId}`
      );
    }
  },
};

export default userEventService;