'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveTournaments, Tournament } from '@/lib/api';
import { Title } from '@/components/atoms/Title';
import { TournamentCard } from '@/components/ui/TournamentCard';

// Componente de esqueleto para o estado de carregamento
const SkeletonCard = () => (
  <div className="h-full animate-pulse rounded-lg border border-gray-700 bg-bg-light p-4">
    <div className="h-48 rounded-md bg-gray-700"></div>
    <div className="mt-4 h-6 w-3/4 rounded bg-gray-700"></div>
    <div className="mt-6 h-10 w-full rounded-full bg-gray-700/50"></div>
  </div>
);

export default function TournamentsListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['allActiveTournaments'],
    queryFn: () => fetchActiveTournaments({}),
  });

  const tournaments = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <Title>Torneios Abertos</Title>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-text-secondary">
          Encontre uma disputa, mostre sua habilidade e conquiste prêmios incríveis.
        </p>
      </div>

      <div className="mt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-10 text-center text-red-400">
            <p className="font-bold">Oops! Algo deu errado.</p>
            <p>Não foi possível carregar os torneios no momento. Por favor, tente novamente mais tarde.</p>
          </div>
        ) : tournaments.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tournaments.map((tournament: Tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-700 bg-bg-light p-10 text-center text-text-secondary">
            <p className="font-bold">Nenhum torneio aberto no momento.</p>
            <p>Fique de olho! Novas competições são adicionadas frequentemente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
