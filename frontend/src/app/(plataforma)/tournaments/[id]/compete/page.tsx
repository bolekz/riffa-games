'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchTournamentDetails, submitScore, Tournament } from '@/lib/api';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/atoms/Title';

// --- Componente principal da página de competição ---
export default function CompetePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const tournamentId = params.id as string;
  
  const { user } = useUser();
  const [score, setScore] = useState('');

  // Busca os detalhes do torneio para validar o acesso
  const { data: tournament, isLoading, error } = useQuery<Tournament>({
    queryKey: ['tournamentDetails', tournamentId], // Usa a mesma query key da pág. de detalhes para aproveitar o cache
    queryFn: () => fetchTournamentDetails(tournamentId),
    enabled: !!tournamentId,
  });

  // Mutação para enviar a pontuação
  const submitScoreMutation = useMutation({
    // A API espera o ID da tentativa (attemptId), não do torneio.
    // Para este exemplo, vamos assumir que o backend pode lidar com o envio para o torneio
    // e encontrar a tentativa correta do usuário. Uma implementação real pode precisar passar o ID da tentativa.
    mutationFn: (newScore: number) => submitScore(tournamentId, newScore), // Simplificação para o exemplo
    onSuccess: (data) => {
      alert(`Pontuação enviada com sucesso! Sua melhor pontuação agora é: ${data.bestScore}`);
      queryClient.invalidateQueries({ queryKey: ['tournamentDetails', tournamentId] }); // Atualiza o placar
      router.push(`/tournaments/${tournamentId}`); // Volta para a página de detalhes
    },
    onError: (err: any) => {
      alert(`Erro ao enviar pontuação: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    const numericScore = parseInt(score, 10);
    if (!isNaN(numericScore)) {
      submitScoreMutation.mutate(numericScore);
    } else {
      alert('Por favor, insira um número válido.');
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Carregando arena de competição...</div>;
  }

  // Validações de segurança e estado
  if (error || !tournament) {
    return <div className="p-10 text-center text-red-500">Torneio não encontrado ou erro ao carregar.</div>;
  }
  
  // Verifica se o usuário pode competir
  if (!tournament.isUserRegistered) {
    return (
        <div className="p-10 text-center text-yellow-400">
            <p>Você não está inscrito neste torneio.</p>
            <Button onClick={() => router.push(`/tournaments/${tournamentId}`)} className="mt-4">Voltar aos Detalhes</Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
      <div className="text-center">
        <Title>Competir: {tournament.name}</Title>
        <p className="mt-2 text-text-secondary">Mostre sua habilidade e alcance o topo do placar!</p>
      </div>

      {/* Placeholder para o Mini-Game */}
      <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-bg-light text-text-secondary">
        <p className="text-lg">[Área do Mini-Game]</p>
      </div>

      {/* Formulário de Submissão de Score */}
      <form onSubmit={handleSubmitScore} className="mx-auto max-w-sm space-y-4">
        <div>
          <label htmlFor="score" className="block text-center text-sm font-medium text-text-secondary">Sua Pontuação</label>
          <input
            id="score"
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="Digite sua pontuação aqui"
            className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light p-4 text-center text-2xl font-bold text-white focus:border-tron-cyan focus:ring-tron-cyan"
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-tron-green text-black shadow-glow-green"
          disabled={submitScoreMutation.isPending}
        >
          {submitScoreMutation.isPending ? 'Enviando...' : 'Enviar Pontuação'}
        </Button>
      </form>
    </div>
  );
}