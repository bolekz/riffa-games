import { Router } from 'express';
import tournamentController from '../controllers/tournament.Controller'; // Caminho corrigido
import authMiddleware from '../../../middlewares/authMiddleware';
import adminMiddleware from '../../../middlewares/adminMiddleware';
import validateRequest from '../../../middlewares/validateRequest';
import {
  listTournamentSchema,
  createTournamentSchema,
  submitScoreSchema,
  tournamentIdParamsSchema,
} from '../validators/tournament.validator';

const router = Router();

// --- Rotas Públicas ---
router.get('/', validateRequest(listTournamentSchema), tournamentController.list);
router.get('/:id', validateRequest(tournamentIdParamsSchema), tournamentController.getById);

// --- Rotas para Usuários Autenticados ---
router.use(authMiddleware);

router.post('/', validateRequest(createTournamentSchema), tournamentController.create);
router.post('/:id/join', validateRequest(tournamentIdParamsSchema), tournamentController.join);
router.post('/:id/submit', validateRequest(submitScoreSchema), tournamentController.submitScore);

// --- Rotas Administrativas ---
router.use(adminMiddleware);

router.post('/:id/finalize', validateRequest(tournamentIdParamsSchema), tournamentController.finalize);
router.post('/:id/cancel', validateRequest(tournamentIdParamsSchema), tournamentController.cancel);

export default router;