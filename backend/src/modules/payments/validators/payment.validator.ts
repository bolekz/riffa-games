// src/modules/payments/validators/payment.validator.ts

import { z } from 'zod';

// Validação para o corpo da requisição de criação de preferência de pagamento
export const createPreferenceSchema = z.object({
  body: z.object({
    quantity: z.number().int().positive('A quantidade de RiffaCoins deve ser um número inteiro positivo.'),
    unitPrice: z.number().positive('O preço unitário deve ser um número positivo.'),
  }),
});