'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

// Importando nossas funções e hooks centralizados
import { fetchTournamentDetails, joinTournament, Tournament } from '@/lib/api';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Title } from '@/components/atoms/Title';

// --- Sub-componente para a lista de prêmios ---
const PrizeList = ({ prizes }: { prizes: Tournament['prizes'] }) => (
  <div className="rounded-lg border border-gray-700 bg-bg-light p-6">
    <h3 className="font-display mb-4 text-lg font-semibold text-white">Prêmios da Competição</h3>
    <ul className="space-y-3">
      {prizes.map((prize) => (
        <li key={prize.id} className="flex items-center gap-4 rounded-md bg-bg-dark p-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-bg-light text-xl font-bold text-tron-cyan ring-1 ring-gray-700">
            {prize.rank}º
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-white">{prize.item.name}</p>
          </div>
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image src={prize.item.imageUrl} alt={prize.item.name} fill className="object-contain" />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// --- Sub-componente para o placar de líderes (Leaderboard) ---
const Leaderboard = ({ scores }: { scores: Tournament['scores'] }) => (
  <div className="rounded-lg border border-gray-700 bg-bg-light p-6">
    <h3 className="font-display mb-4 text-lg font-semibold text-white">Placar de Líderes</h3>
    <div className="space-y-2">
      {scores.map((entry, index) => (
        <div key={entry.user.id} className={`flex items-center justify-between rounded p-2 ${index < 3 ? 'bg-cyan-900/30' : 'bg-bg-dark'}`}>
          <div className="flex items-center gap-3">
            <span className="w-6 text-center font-bold text-text-secondary">{index + 1}</span>
            <p className="font-medium text-white">{entry.user.nickname}</p>
          </div>
          <p className="font-display font-bold text-tron-cyan">{entry.score.toLocaleString('pt-BR')}</p>
        </div>
      ))}
       {scores.length === 0 && <p className="py-4 text-center text-text-secondary">Nenhuma pontuação registrada ainda.</p>}
    </div>
  </div>
);

// --- Componente principal da página ---
export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;
  const queryClient = useQueryClient();
  
  // Usamos nosso hook central para saber se o usuário está autenticado
  const { isAuthenticated } = useUser();

  const { data: tournament, isLoading, error } = useQuery<Tournament>({
    queryKey: ['tournamentDetails', tournamentId],
    queryFn: () => fetchTournamentDetails(tournamentId),
    enabled: !!tournamentId,
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => joinTournament({ tournamentId: id }),
    onSuccess: () => {
      alert('Você entrou no torneio! Boa sorte!');
      // Invalida a query para que a página mostre o novo status ("VOCÊ ESTÁ PARTICIPANDO!")
      queryClient.invalidateQueries({ queryKey: ['tournamentDetails', tournamentId] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] }); // Invalida o perfil para atualizar o saldo de RCs
    },
    onError: (err: any) => {
      alert(`Erro ao entrar no torneio: ${err.response?.data?.message || err.message}`);
    },
  });

  const handleJoinTournament = () => {
    // Se o usuário não estiver logado, redireciona para o login
    if (!isAuthenticated) {
        router.push('/auth/login?redirect=/tournaments/' + tournamentId);
        return;
    }
    joinMutation.mutate(tournamentId);
  };

  if (isLoading) return <p className="p-10 text-center text-text-secondary">Carregando detalhes do torneio...</p>;
  if (error) return <p className="p-10 text-center text-red-500">Erro ao carregar o torneio.</p>;
  if (!tournament) return <p className="p-10 text-center text-text-secondary">Torneio não encontrado.</p>;

  return (
    <div className="container mx-auto space-y-8 px-4 py-12">
      <div className="text-center">
        <Title>{tournament.name}</Title>
        <p className="mx-auto mt-2 max-w-3xl text-lg text-text-secondary">{tournament.description}</p>
        <div className="mt-4 inline-block rounded-full bg-bg-light px-4 py-1 text-sm font-semibold text-tron-cyan ring-1 ring-inset ring-gray-700">
          Jogo: {tournament.game.name}
        </div>
      </div>

      <div className="flex justify-center">
        {tournament.isUserRegistered ? (
          <div className="rounded-md bg-green-900/50 p-4 text-center text-tron-green ring-1 ring-inset ring-green-500/30">
            <p className="font-bold">VOCÊ ESTÁ PARTICIPANDO!</p>
            <p className="text-sm">Vá para a página de competição para registrar sua pontuação.</p>
            <Button onClick={() => router.push(`/tournaments/${tournamentId}/compete`)} className="mt-2 bg-tron-green text-black">
              Jogar Agora
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleJoinTournament} 
            disabled={joinMutation.isPending}
            className="bg-tron-green px-8 py-4 text-lg text-black shadow-glow-green hover:bg-green-400"
          >
            {joinMutation.isPending ? 'Entrando...' : `Participar por 💎 ${tournament.entryFeeRC} RC`}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <PrizeList prizes={tournament.prizes} />
        <Leaderboard scores={tournament.scores} />
      </div>
    </div>
  );
}