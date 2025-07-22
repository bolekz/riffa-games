import { Title } from '@/components/atoms/Title';

const steps = [
  { id: '01', name: 'Carregue seus RCs', description: 'Compre RiffaCoins de forma rápida e segura. Eles são sua chave para todas as disputas na plataforma.' },
  { id: '02', name: 'Escolha sua Batalha', description: 'Navegue pelos torneios e encontre o prêmio que você mais deseja conquistar.' },
  { id: '03', name: 'Mostre sua Habilidade', description: 'Participe do mini-game associado e registre a sua melhor pontuação dentro do tempo limite.' },
  { id: '04', name: 'Conquiste seu Prêmio', description: 'Seu talento é recompensado. O maior score leva o prêmio. Sem sorte, pura habilidade.' },
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Title>Como Funciona</Title>
      <p className="mt-2 text-lg text-text-secondary">O caminho da sua habilidade até a conquista em 4 passos simples.</p>
      <div className="mt-12 space-y-10">
        {steps.map((step) => (
          <div key={step.id} className="relative pl-12">
            <div className="absolute left-0 top-1 h-full w-px bg-gray-700"></div>
            <div className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-tron-cyan font-bold text-black">
              {step.id}
            </div>
            <h3 className="text-xl font-bold text-white">{step.name}</h3>
            <p className="mt-1 text-text-secondary">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}