// src/modules/payments/services/payment.service.ts

import type { Prisma } from '@prisma/client';
import prisma from '../../../config/prisma';
import logger from '../../../lib/logger';
import { preference } from '../../../config/mercadopago';

/**
 * Dados para criação de preferência de compra de RiffaCoins.
 */
export interface CreatePreferenceData {
  quantity: number;
  unitPrice: number;
}

/**
 * Serviço de pagamentos: cria transação local e preferência no Mercado Pago.
 */
const paymentService = {
  async createRiffaCoinPreference(
    userId: string,
    data: CreatePreferenceData
  ) {
    const { quantity, unitPrice } = data;
    const totalBRL = quantity * unitPrice;

    // 1. Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // 2. Cria a transação local com status PENDENTE
    const localTransaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        status: 'PENDING',
        amountBrl: totalBRL,
        amountRc: quantity,
        // CORREÇÃO: A descrição agora faz parte do objeto JSON 'details'.
        details: {
          description: `Compra de ${quantity} RiffaCoins`,
        } as Prisma.JsonObject,
      },
    });

    logger.info(
      `[PAYMENT] Transação PENDING criada: ${localTransaction.id} para usuário ${userId}`
    );

    // 3. Monta e cria a preferência no Mercado Pago
    const frontendUrl = process.env.FRONTEND_URL!;
    const backendUrl = process.env.BACKEND_URL!;
    const preferenceBody = {
      items: [
        {
          id: 'riffacoin_package',
          title: `Pacote de ${quantity} RiffaCoins`,
          quantity: 1,
          unit_price: totalBRL,
          currency_id: 'BRL',
        },
      ],
      payer: { email: user.email },
      back_urls: {
        success: `${frontendUrl}/payment/success`,
        failure: `${frontendUrl}/payment/failure`,
        pending: `${frontendUrl}/payment/pending`,
      },
      notification_url: `${backendUrl}/api/webhooks/mercadopago`,
      external_reference: localTransaction.id,
    };

    try {
      const preferenceResult = await preference.create({ body: preferenceBody });

      // Atualiza a nossa transação com o ID da preferência do gateway
      await prisma.transaction.update({
        where: { id: localTransaction.id },
        data: { gatewayTransactionId: preferenceResult.id },
      });

      return preferenceResult;
    } catch (error) {
      logger.error(
        { error, transactionId: localTransaction.id },
        `Erro ao criar preferência no Mercado Pago para a transação ${localTransaction.id}`
      );

      // Marca nossa transação como FAILED se a criação no MP falhar.
      await prisma.transaction.update({
        where: { id: localTransaction.id },
        data: { status: 'FAILED' },
      });

      throw new Error('Não foi possível iniciar o pagamento. Tente novamente mais tarde.');
    }
  },
};

export default paymentService;