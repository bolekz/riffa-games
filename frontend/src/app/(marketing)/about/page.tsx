import { Title } from '@/components/atoms/Title';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Title>Sobre a Riffa Games</Title>
      <article className="prose prose-invert mt-8 max-w-none text-text-secondary">
        <h2>Nossa Missão</h2>
        <p>
          A Riffa Games nasceu da paixão por eSports e da crença de que a habilidade deve ser a única coisa que separa um jogador da vitória. Nossa missão é oferecer um ambiente de competição justo, transparente e emocionante, onde jogadores podem monetizar suas habilidades e conquistar os itens que sempre desejaram, baseando-se unicamente em seu desempenho.
        </p>
        <h2>Nossa Visão</h2>
        <p>
          Nossa visão é nos tornarmos a principal plataforma de competições baseadas em habilidade da América Latina, criando uma comunidade vibrante e um ecossistema sustentável para jogadores e criadores de conteúdo.
        </p>
      </article>
    </div>
  );
}