// src/modules/tournament/controllers/tournament.controller.ts

import type { Request, Response, NextFunction } from 'express';
import tournamentService from '../services/tournament.service';
import { generateResponse } from '../../../utils/responseHandler';
import logger from '../../../lib/logger';

/**
 * Controlador de torneios: orquestra as ações após validação prévia.
 */
const tournamentController = {
  /**
   * Cria um novo torneio.
   * req.body já validado pelo middleware.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.id;
      const newTournament = await tournamentService.create(ownerId, req.body);
      return res
        .status(201)
        .json(generateResponse(true, 'Torneio criado com sucesso.', newTournament));
    } catch (err) {
      logger.error('Erro em tournamentController.create:', err);
      return next(err);
    }
  },

  /**
   * Lista torneios públicos e ativos, aplicando filtros de query.
   * req.query já validado pelo middleware.
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const tournaments = await tournamentService.list(req.query);
      return res
        .status(200)
        .json(generateResponse(true, 'Torneios consultados com sucesso.', tournaments));
    } catch (err) {
      logger.error('Erro em tournamentController.list:', err);
      return next(err);
    }
  },

  /**
   * Busca um torneio por ID.
   * req.params já validado pelo middleware.
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const tournament = await tournamentService.getById(id);
      return res
        .status(200)
        .json(generateResponse(true, 'Torneio encontrado com sucesso.', tournament));
    } catch (err) {
      logger.error('Erro em tournamentController.getById:', err);
      return next(err);
    }
  },

  /**
   * Inscreve o usuário autenticado em um torneio.
   */
  async join(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const tournamentId = req.params.id;
      const result = await tournamentService.join(userId, tournamentId);
      return res
        .status(200)
        .json(generateResponse(true, 'Inscrição realizada com sucesso.', result));
    } catch (err) {
      logger.error('Erro em tournamentController.join:', err);
      return next(err);
    }
  },

  /**
   * Submete a pontuação de uma tentativa.
   * req.body e req.params já validados pelo middleware.
   */
  async submitScore(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const tournamentId = req.params.id;
      const { score } = req.body;
      const result = await tournamentService.submitScore(userId, tournamentId, score);
      return res
        .status(200)
        .json(generateResponse(true, 'Pontuação submetida com sucesso.', result));
    } catch (err) {
      logger.error('Erro em tournamentController.submitScore:', err);
      return next(err);
    }
  },

  /**
   * Cancela um torneio (rota administrativa).
   */
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const tournamentId = req.params.id;
      const result = await tournamentService.cancel(tournamentId);
      return res
        .status(200)
        .json(generateResponse(true, 'Torneio cancelado com sucesso.', result));
    } catch (err) {
      logger.error('Erro em tournamentController.cancel:', err);
      return next(err);
    }
  },

  /**
   * Finaliza um torneio e cria claims de prêmios (rota administrativa).
   */
  async finalize(req: Request, res: Response, next: NextFunction) {
    try {
      const tournamentId = req.params.id;
      const result = await tournamentService.finalize(tournamentId);
      return res
        .status(200)
        .json(generateResponse(true, 'Torneio finalizado com sucesso.', result));
    } catch (err) {
      logger.error('Erro em tournamentController.finalize:', err);
      return next(err);
    }
  },
};

export default tournamentController;