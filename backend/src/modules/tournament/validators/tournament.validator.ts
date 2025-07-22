// src/modules/tournament/validators/tournament.validator.ts

import { z } from 'zod';

// Schema base para validar apenas o ID do torneio nos parâmetros da URL.
// Reutilizável em várias rotas (getById, join, cancel, finalize).
export const tournamentIdParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'O ID do torneio fornecido na URL é inválido.' }),
  }),
});

// Schema para a criação de um novo torneio.
export const createTournamentSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'O nome do torneio deve ter pelo menos 3 caracteres.'),
    gameId: z.string().uuid('ID do jogo inválido.'),
    miniGameId: z.string().uuid('ID do minigame inválido.'),
    pricePerTicket: z.number().int().positive('O preço por ingresso deve ser um número inteiro positivo.'),
    maxAttemptsPerUser: z.number().int().positive('O máximo de tentativas deve ser um número inteiro positivo.'),
    ticketTarget: z.number().int().positive('A meta de ingressos deve ser um número inteiro positivo.'),
    sellingEndsAt: z.string().datetime({ message: 'A data de fim das vendas é inválida.' }),
    competitionStartsAt: z.string().datetime({ message: 'A data de início da competição é inválida.' }),
    competitionEndsAt: z.string().datetime({ message: 'A data de fim da competição é inválida.' }),
    visibility: z.enum(['PUBLIC', 'PRIVATE', 'SUBSCRIBERS_ONLY']).default('PUBLIC'),
    publishAt: z.string().datetime().optional(),
  }),
});

// Schema para a submissão de score.
// MELHORIA: Reutiliza o `tournamentIdParamsSchema` para validar os parâmetros.
export const submitScoreSchema = z.object({
  body: z.object({
    score: z.number().int().nonnegative('A pontuação deve ser um número inteiro não negativo.'),
  }),
}).merge(tournamentIdParamsSchema); // Funde com o schema de validação de ID.

// NOVO: Schema para validar os filtros de query na listagem de torneios.
export const listTournamentSchema = z.object({
  query: z.object({
    status: z.enum(['SELLING', 'COMPLETED', 'CANCELLED']).optional(),
    gameId: z.string().uuid({ message: 'O gameId fornecido como filtro é inválido.' }).optional(),
  }),
});