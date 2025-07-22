'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const activeGames = [
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    imageUrl: '/games/cs2-banner.jpg',
    link: '/tournaments',
    description:
      'A nova era do Counter-Strike. Teste sua precisão e estratégia em nossos torneios e conquiste as skins mais desejadas.',
  },
];

export function ActiveGamesSection() {
  return (
    <section className="bg-bg-dark py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
            Jogos na <span className="text-tron-cyan">Plataforma</span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Comece sua jornada em nossos campos de batalha.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8">
          {activeGames.map((game) => (
            <div
              key={game.id}
              className="group relative overflow-hidden rounded-lg border border-gray-700 bg-bg-light shadow-md transition-all duration-300 hover:border-tron-cyan"
            >
              <div className="relative h-80 w-full">
                <Image
                  src={game.imageUrl}
                  alt={`Banner do jogo ${game.name}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-6 text-center backdrop-blur-sm">
                <h3 className="font-display text-4xl font-extrabold text-white drop-shadow-md">
                  {game.name}
                </h3>
                <p className="mt-3 max-w-md text-base text-gray-300">
                  {game.description}
                </p>
                <Link href={game.link} className="mt-6">
                  <Button className="bg-tron-green text-black shadow-glow-green hover:opacity-90 transition">
                    Ver Torneios de {game.name}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
