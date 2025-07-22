import cron from 'node-cron';
import logger from '../lib/logger';
import tournamentService from '../modules/tournament/services/tournament.service';
import prisma from '../config/prisma';

/**
 * Job que verifica e finaliza torneios cuja data de competição já terminou.
 */
const finalizeFinishedTournaments = async (): Promise<void> => {
  logger.info('[JOB] Iniciando verificação de torneios para finalizar...');

  try {
    const tournamentsToFinalize = await prisma.tournament.findMany({
      where: {
        status: 'SELLING',
        competitionEndsAt: {
          lte: new Date(),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (tournamentsToFinalize.length === 0) {
      logger.info('[JOB] Nenhum torneio para finalizar nesta execução.');
      return;
    }

    logger.info(`[JOB] Encontrados ${tournamentsToFinalize.length} torneios para finalizar. Processando...`);

    for (const tournament of tournamentsToFinalize) {
      try {
        logger.info(`[JOB] Tentando finalizar o torneio: ${tournament.name} (ID: ${tournament.id})`);
        await tournamentService.finalize(tournament.id);
        logger.info(`[JOB] Torneio ${tournament.name} (ID: ${tournament.id}) finalizado com sucesso.`);
      } catch (error) {
        logger.error({ error, tournamentId: tournament.id }, `[JOB] Erro ao finalizar o torneio ${tournament.id}.`);
      }
    }

    logger.info('[JOB] Verificação de finalização de torneios concluída.');

  } catch (error) {
    logger.error(error, '[JOB] Erro crítico na tarefa de finalização de torneios.');
  }
};

/**
 * Agenda a tarefa para ser executada a cada minuto.
 */
export const tournamentFinalizerJob = (): void => {
  cron.schedule('* * * * *', finalizeFinishedTournaments);
  logger.info('[JOB] Tarefa de finalização de torneios agendada para executar a cada minuto.');
};

// ✅ Exportação compatível com CommonJS
module.exports = {
  finalizeFinishedTournaments,
  tournamentFinalizerJob,
};
