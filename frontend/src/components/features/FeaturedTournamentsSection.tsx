'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchActiveTournaments } from '@/lib/api';
import { TournamentCard } from '@/components/ui/TournamentCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tournament } from '@/types/tournament';

const SkeletonCard = () => (
  <div className="h-full animate-pulse rounded-lg border border-gray-700 bg-bg-light p-4">
    <div className="h-48 rounded-md bg-gray-700"></div>
    <div className="mt-4 h-6 w-3/4 rounded bg-gray-700"></div>
    <div className="mt-6 h-10 w-full rounded-full bg-gray-700/50"></div>
  </div>
);

export function FeaturedTournamentsSection() {
  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['featuredTournaments'],
    queryFn: () => fetchActiveTournaments({ pageSize: 4 }),
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 1,
  });

  const tournaments = response?.data || [];

  return (
    <section className="bg-bg-dark py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
            Torneios em <span className="text-tron-cyan">Destaque</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Disputas ativas agora. Escolha sua batalha e conquiste seu prêmio.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

          {error && (
            <div className="col-span-full text-center text-red-500">
              <p>Não foi possível carregar os torneios. Tente novamente em instantes.</p>
            </div>
          )}

          {!isLoading &&
            !error &&
            tournaments.map((tournament: Tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/tournaments">
            <Button variant="outline">Ver todos os torneios →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
