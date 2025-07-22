// src/modules/webhook/services/webhook.service.ts

import type { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import logger from '../../../lib/logger';
import { payment as paymentClient } from '../../../config/mercadopago';
import userEventService, { UserEventTypes } from '../../user/services/userEvent.service';

/**
 * Serviço para processar notificações de webhook do Mercado Pago.
 */
const webhookService = {
  /**
   * Processa a notificação de um pagamento, atualizando a transação local.
   * @param paymentId - ID do pagamento fornecido pelo Mercado Pago.
   */
  async processPaymentNotification(paymentId: string): Promise<void> {
    logger.info(`[WEBHOOK] Iniciando processamento para o paymentId: ${paymentId}`);

    // 1. Busca os detalhes reais do pagamento na API do Mercado Pago
    const payment = await paymentClient.get({ id: paymentId });
    if (!payment) {
      logger.warn(`[WEBHOOK] Pagamento ${paymentId} não encontrado no Mercado Pago.`);
      return;
    }

    // 2. Recupera o ID da nossa transação local a partir da referência externa
    const localTransactionId = payment.external_reference;
    if (!localTransactionId) {
      logger.error(`[WEBHOOK] Pagamento ${paymentId} não possui uma external_reference.`);
      return;
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: localTransactionId },
    });
    if (!transaction) {
      logger.error(`[WEBHOOK] Transação local ${localTransactionId} não encontrada para o pagamento ${paymentId}.`);
      return;
    }

    // 3. Idempotência: Garante que a transação só seja processada uma vez.
    if (transaction.status !== 'PENDING') {
      logger.warn(`[WEBHOOK] Transação ${transaction.id} já processada (status: ${transaction.status}). Ignorando.`);
      return;
    }

    // 4. Se o pagamento não foi aprovado, atualiza nossa transação para FAILED.
    if (payment.status !== 'approved') {
      logger.warn(`[WEBHOOK] Pagamento ${paymentId} não aprovado (status: ${payment.status}). Atualizando transação para FAILED.`);
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED', details: { mercadoPagoStatus: payment.status } as Prisma.JsonObject },
      });
      return;
    }

    // 5. Se o pagamento foi aprovado, atualiza saldo e transação atomicamente.
    try {
      await prisma.$transaction(async (tx) => {
        // Credita as RiffaCoins ao usuário
        await tx.user.update({
          where: { id: transaction.userId },
          data: { riffaCoinsAvailable: { increment: transaction.amountRc ?? 0 } },
        });
        // Atualiza a transação para COMPLETED com detalhes do pagamento
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'COMPLETED',
            gatewayTransactionId: paymentId,
            details: {
              mercadoPagoStatus: payment.status,
              paymentMethod: payment.payment_method_id,
              cardLastFour: payment.card?.last_four_digits,
            } as Prisma.JsonObject,
          },
        });
      });

      // Registra evento de auditoria após a transação ser bem-sucedida
      // CORREÇÃO: Converte o tipo Decimal para number antes de enviar para o payload.
      await userEventService.create(transaction.userId, UserEventTypes.PAYMENT_SUCCESS, {
        transactionId: transaction.id,
        amountBrl: transaction.amountBrl?.toNumber() ?? 0,
        amountRc: transaction.amountRc,
      });

      logger.info(`[WEBHOOK] Transação ${transaction.id} processada. Usuário ${transaction.userId} creditado com ${transaction.amountRc} RCs.`);
    } catch (error) {
      logger.error({ error, transactionId: transaction.id }, `[WEBHOOK] Falha crítica na transação do banco ao processar webhook.`);
      throw new Error('Falha no banco de dados durante o processamento do webhook.');
    }
  },
};

export default webhookService;