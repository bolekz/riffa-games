'use client'; 

import { useState } from 'react';
import { Title } from '@/components/atoms/Title'; 

const FaqItem = ({ question, answer }: { question: string; answer: string | React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left text-lg font-semibold text-white transition-colors hover:text-tron-cyan"
      >
        <span>{question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
      </button>
      {isOpen && (
        // ATUALIZAÇÃO AQUI: Adicionamos a classe 'prose' para formatar o conteúdo da resposta.
        <div className="prose prose-invert mt-4 max-w-none text-text-secondary">
          {typeof answer === 'string' ? <p>{answer}</p> : answer}
        </div>
      )}
    </div>
  );
};

export default function FaqPage() {
  const faqData = [
    {
      question: 'O que é a Riffa Games?',
      answer: 'A Riffa Games é uma plataforma de eSports onde a sua habilidade é recompensada. Vendedores podem criar torneios utilizando seus itens virtuais (skins) como prêmio, e competidores disputam minigames para ganhar esses itens com base em seu desempenho.',
    },
    {
      question: 'A Riffa Games é um site de apostas ou de sorte?',
      answer: 'Não. A Riffa Games é uma plataforma de competição de habilidade. O vencedor é sempre o jogador com melhor pontuação ou performance no minigame, nunca por sorte ou acaso. Nosso modelo é 100% legal e focado em entretenimento competitivo.',
    },
    {
      question: 'O que são RiffaCoins (RC)?',
      answer: 'RiffaCoins (RC) são a moeda virtual da Riffa Games, usadas para se inscrever em torneios. Você pode adquiri-las em pacotes na loja.',
    },
    {
      question: 'Ganhei! Como recebo meu prêmio?',
      answer: 'Parabéns! O item será entregue via troca segura na Steam. Usuários de planos premium (Ouro e Global) podem ter opções alternativas, como converter o prêmio em RCs.',
    },
    // Adicione mais perguntas e respostas aqui...
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Title>Perguntas Frequentes (FAQ)</Title>
      <p className="mt-2 text-lg text-text-secondary">Encontre aqui respostas rápidas para as dúvidas mais comuns sobre a Riffa Games.</p>
      <div className="mt-8">
        {faqData.map((item, index) => (
          <FaqItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}