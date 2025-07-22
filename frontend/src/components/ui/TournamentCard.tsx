'use client';

import Link from 'next/link';
import Image from 'next/image';

// Tipagem para as props do componente
interface TournamentCardProps {
  tournament: {
    id: string;
    name: string;
    entryFeeRC: number;
    prizes: {
      item: {
        name: string;
        imageUrl: string;
      };
    }[];
  };
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const mainPrize = tournament.prizes[0]?.item;

  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className="group block h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-tron-cyan"
    >
      <div
        className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-700 bg-bg-light
                   transition-transform duration-300 hover:-translate-y-1 hover:border-tron-cyan hover:shadow-lg hover:shadow-cyan-900/50"
      >
        <div className="relative h-48 w-full">
          {mainPrize?.imageUrl ? (
            <Image
              src={mainPrize.imageUrl}
              alt={mainPrize.name}
              fill
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-bg-dark">
              <p className="text-sm text-text-secondary">Prêmio a ser revelado</p>
            </div>
          )}
        </div>

        <div className="flex flex-grow flex-col justify-between p-4">
          <h3 className="font-display text-lg font-bold text-white group-hover:text-tron-cyan transition-colors">
            {tournament.name}
          </h3>
          <div className="mt-4 text-center">
            <span className="inline-block w-full rounded-full bg-tron-cyan/10 px-4 py-2 text-sm font-semibold text-tron-cyan ring-1 ring-inset ring-tron-cyan/20">
              💎 {tournament.entryFeeRC} RC para entrar
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
