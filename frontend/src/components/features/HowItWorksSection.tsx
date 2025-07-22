// src/components/features/HowItWorksSection.tsx
'use client';

const steps = [
  {
    number: '01',
    title: 'Carregue seus RCs',
    description: 'Compre RiffaCoins de forma rápida e segura. Eles são sua chave para todas as disputas na plataforma.',
  },
  {
    number: '02',
    title: 'Escolha sua Batalha',
    description: 'Navegue pelos torneios e encontre o prêmio que você mais deseja conquistar entre os jogos disponíveis.',
  },
  {
    number: '03',
    title: 'Mostre sua Habilidade',
    description: 'Participe do mini-game associado e registre a sua melhor pontuação dentro do tempo limite da competição.',
  },
  {
    number: '04',
    title: 'Conquiste seu Prêmio',
    description: 'Seu talento é recompensado. O maior score leva o prêmio. Sem sorte, pura habilidade.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Como <span className="text-tron-cyan">Funciona</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-6 text-gray-300">
          O caminho da sua habilidade até a conquista em 4 passos.
        </p>

        <div className="mt-20 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative pt-8">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-tron-cyan bg-bg-dark p-3 shadow-glow-cyan">
                  <span className="font-display text-2xl font-bold text-text-primary">
                    {step.number}
                  </span>
                </span>
              </div>

              <div className="border border-gray-700 h-full rounded-lg transition-colors hover:border-tron-cyan">
                <div className="h-full rounded-lg bg-gray-800/50 px-6 pb-8 text-center">
                  <h3 className="mt-8 font-display text-lg font-bold tracking-tight text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-5 text-base text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
