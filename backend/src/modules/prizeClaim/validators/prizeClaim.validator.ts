// src/modules/prizeClaim/validators/prizeClaim.validator.ts

import { z } from 'zod';

// Valida se o ID da reivindicação de prêmio fornecido na URL é um UUID válido.
export const prizeClaimIdSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'O ID da reivindicação de prêmio é inválido.' }),
  }),
});