// src/modules/payments/services/payment.service.ts

import type { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import logger from '../lib/logger';
import { preference } from '../config/mercadopago';

/**
 * Dados para criação de preferência de compra de RiffaCoins.
 */
export interface CreatePreferenceData {
  quantity: number;
  unitPrice: number;
}

const paymentService = {
  async createRiffaCoinPreference(
    userId: string,
    data: CreatePreferenceData
  ) {
    const { quantity, unitPrice } = data;
    const totalBRL = quantity * unitPrice;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // Cria a transação local com os nomes de campo corretos
    const localTransaction = await prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        status: 'PENDING',
        // CORREÇÃO: Usando 'amountBrl' e 'amountRc' (camelCase)
        amountBrl: totalBRL,
        amountRc: quantity,
        details: {
          description: `Compra de ${quantity} RiffaCoins`,
        } as Prisma.JsonObject,
      },
    });

    logger.info(
      `[PAYMENT] Transação PENDING criada: ${localTransaction.id} para usuário ${userId}`
    );

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

      await prisma.transaction.update({
        where: { id: localTransaction.id },
        data: { gatewayTransactionId: preferenceResult.id },
      });

      return preferenceResult;
    } catch (error) {
      logger.error(
        { error, transactionId: localTransaction.id },
        `Erro ao criar preferência no MP para transação ${localTransaction.id}`
      );

      await prisma.transaction.update({
        where: { id: localTransaction.id },
        data: { status: 'FAILED' },
      });

      throw new Error('Não foi possível iniciar o pagamento. Tente novamente mais tarde.');
    }
  },
};

export default paymentService;