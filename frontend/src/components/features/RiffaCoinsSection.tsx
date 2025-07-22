'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const packages = [
  { brlAmount: 20, rcAmount: 2000, bonus: null, isFeatured: false },
  { brlAmount: 50, rcAmount: 5250, bonus: '+5% BÔNUS', isFeatured: false },
  { brlAmount: 100, rcAmount: 11000, bonus: '+10% BÔNUS', isFeatured: true },
];

export function RiffaCoinsSection() {
  return (
    <section className="bg-bg-dark py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
            RIFFA<span className="text-tron-cyan">COINS</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-6 text-gray-300">
            A moeda da sua habilidade. Use RCs para entrar nos torneios e conquiste prêmios incríveis. A conversão é simples e direta: R$ 1,00 = 100 RC.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.brlAmount}
              className={`relative rounded-lg p-6 text-center border bg-gray-800/50 transition-colors hover:border-tron-cyan ${
                pkg.isFeatured ? 'border-tron-cyan shadow-xl shadow-tron-cyan/20' : 'border-gray-700'
              }`}
            >
              {pkg.isFeatured && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-block rounded-full bg-tron-cyan px-4 py-1 text-xs font-semibold uppercase text-black shadow-md">
                    Mais Popular
                  </span>
                </div>
              )}

              <h3 className="font-display text-2xl font-bold text-text-primary">
                R$ {pkg.brlAmount.toFixed(2).replace('.', ',')}
              </h3>

              <div className="my-6">
                <p className="font-display text-4xl sm:text-5xl font-extrabold text-tron-cyan">
                  {pkg.rcAmount.toLocaleString('pt-BR')}
                </p>
                <p className="text-base sm:text-lg font-medium text-gray-300">RiffaCoins</p>
              </div>

              {pkg.bonus && (
                <p className="mb-6 font-semibold text-tron-green">{pkg.bonus}</p>
              )}
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/me/wallet" aria-label="Ir para sua carteira e carregar RiffaCoins">
            <Button className="bg-tron-green px-10 py-4 text-lg text-black shadow-glow-green hover:opacity-90 transition">
              Carregar RiffaCoins
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
