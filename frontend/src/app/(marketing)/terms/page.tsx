import { Title } from '@/components/atoms/Title';

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Title>Termos e Condições de Uso – RIFFA GAMES</Title>
      <p className="mt-2 text-sm text-text-secondary">Última atualização: 30 de junho de 2025</p>
      
      <article className="prose prose-invert mt-8 max-w-none text-text-secondary prose-h2:text-white prose-strong:text-white">
        <p>Bem-vindo à Riffa Games! Ao se registrar e utilizar nossa plataforma, você concorda com os seguintes Termos e Condições (“Termos”). Por favor, leia-os com atenção, pois eles constituem um acordo legalmente vinculativo entre você e a Riffa Games. Se você não concordar com qualquer parte destes Termos, não utilize a Plataforma.</p>

        <h2>1. ACEITAÇÃO DOS TERMOS</h2>
        <p>Ao criar uma conta ou utilizar os serviços oferecidos pela Riffa Games (“Plataforma”), você confirma que leu, entendeu e aceita cumprir estes Termos, incluindo todas as regras, políticas e diretrizes aqui incorporadas. Caso não concorde com os Termos, você não deverá usar a Plataforma. Ao aceitar estes Termos, você também declara que tem capacidade legal para celebrá-los.</p>

        <h2>2. DEFINIÇÕES</h2>
        <ul>
          <li><strong>Plataforma:</strong> O site, aplicativos, jogos, serviços e funcionalidades oferecidos pela Riffa Games.</li>
          <li><strong>Usuário:</strong> Qualquer indivíduo que cria uma conta na Plataforma, incluindo Vendedores e Competidores.</li>
          <li><strong>Vendedor:</strong> Usuário que submete um item virtual de sua propriedade para ser o prêmio de um Torneio.</li>
          <li><strong>Competidor:</strong> Usuário que paga uma taxa de inscrição para participar de um Torneio.</li>
          <li><strong>Torneio (ou Competição):</strong> Evento em que o resultado é determinado exclusivamente pela habilidade dos Competidores em um mini-game, promovido e organizado pela Riffa Games, cujo prêmio consiste em um item virtual fornecido por um Vendedor.</li>
          <li><strong>RiffaCoin (RC):</strong> Moeda virtual interna da Plataforma, utilizada para todas as transações.</li>
          <li><strong>Escrow (Custódia):</strong> Procedimento pelo qual a Plataforma retém o item-prêmio de um Vendedor em conta de garantia segura até a conclusão ou cancelamento do Torneio.</li>
        </ul>

        <h2>3. ELEGIBILIDADE E CADASTRO</h2>
        <p><strong>Idade Mínima:</strong> Somente maiores de 18 anos podem criar conta e usar a Plataforma. Ao aceitar estes Termos, você declara ter pelo menos 18 anos.</p>
        <p><strong>Conta Steam:</strong> Para participar de Torneios, é necessário conectar sua conta Steam válida e pública.</p>
        <p><strong>Segurança da Conta:</strong> Você é o único responsável pela segurança de suas credenciais de acesso (login e senha) e por todas as atividades realizadas em sua conta. A Riffa Games não se responsabiliza por perdas decorrentes de acesso não autorizado.</p>
        <p><strong>Cadastro Único:</strong> Cada indivíduo pode manter apenas uma conta na Plataforma. A detecção de múltiplas contas resultará na suspensão ou encerramento de todas as contas associadas.</p>
        <p><strong>Informações Verdadeiras:</strong> Você se compromete a fornecer dados precisos, completos e atualizados durante o cadastro e a mantê-los assim ao longo do tempo.</p>

        <h2>4. NATUREZA DA PLATAFORMA</h2>
        <p>A Riffa Games é uma plataforma de eSports baseada em habilidade. Os Torneios são competições de destreza, não jogos de azar, sorteios ou qualquer modalidade similar. O resultado dos Torneios depende única e exclusivamente da performance e habilidade dos competidores no mini-game proposto.</p>

        <h2>5. RIFFACOINS (RC)</h2>
        <p>As RiffaCoins (RC) são a moeda virtual exclusiva da Plataforma. Elas não possuem valor monetário fora do ambiente da Riffa Games e não podem ser convertidas em dinheiro real, vendidas ou transferidas para outros usuários. Todas as compras de pacotes de RC são finais e não reembolsáveis, exceto nos casos previstos pelo direito de arrependimento (Art. 49 do Código de Defesa do Consumidor), aplicável no prazo de 7 dias após a compra, desde que as RCs não tenham sido utilizadas.</p>
        
        <h2>6. REGRAS PARA VENDEDORES</h2>
        <p>Ao criar um torneio, o Vendedor deve transferir o item-prêmio para a conta de custódia (Escrow) da Riffa Games via troca segura na Steam. O item permanecerá sob custódia até a conclusão ou cancelamento do torneio. A remuneração do Vendedor é paga em RCs após a finalização do torneio e consiste no valor arrecadado com as inscrições, descontada a comissão da plataforma, que varia conforme o Plano de Assinatura do Vendedor.</p>

        <h2>7. REGRAS PARA COMPETIDORES</h2>
        <p>A inscrição em um Torneio é paga com RCs e não é reembolsável, exceto em caso de cancelamento do Torneio pela Plataforma. O vencedor do Torneio receberá o prêmio via troca segura na Steam. Usuários de planos premium (Ouro e Global) podem ter opções alternativas de premiação, como a conversão do valor do item em RCs. É estritamente proibido o uso de cheats, hacks, scripts, bots ou qualquer software de terceiros que conceda uma vantagem injusta. A violação desta regra resultará em desqualificação imediata, perda de quaisquer prêmios e potencial banimento da plataforma.</p>
      </article>
    </div>
  );
}