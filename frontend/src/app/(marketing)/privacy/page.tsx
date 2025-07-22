import { Title } from '@/components/atoms/Title';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Title>Política de Privacidade – RIFFA GAMES</Title>
      <p className="mt-2 text-sm text-text-secondary">Última atualização: 01 de julho de 2025</p>
      
      <article className="prose prose-invert mt-8 max-w-none text-text-secondary prose-h2:text-white prose-strong:text-white">
        <p>Agradecemos por escolher a Riffa Games! Respeitar e proteger sua privacidade é nossa maior prioridade. Esta Política de Privacidade detalha, de forma clara e transparente, como coletamos, usamos e protegemos seus dados pessoais em nossa plataforma, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018). Este documento aplica-se a todos os usuários e complementa nossos Termos de Uso — ao utilizar a plataforma, você concorda com ambos.</p>

        <h2>1. INTRODUÇÃO E NOSSO COMPROMISSO</h2>
        <p>Esta Política de Privacidade detalha como a Riffa Games ("nós", "nosso") coleta, utiliza, armazena e protege as informações e dados pessoais dos seus usuários ("você"). Todas as nossas práticas estão em total conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei 13.709/2018) do Brasil.</p>

        <h2>2. QUAIS DADOS PESSOAIS COLETAMOS?</h2>
        <p>Coletamos os dados estritamente necessários para a operação da plataforma, divididos nas seguintes categorias:</p>
        <ul>
            <li><strong>Dados fornecidos diretamente por você:</strong> Nome completo, apelido (nickname), e-mail e CPF (para transações financeiras e verificação KYC).</li>
            <li><strong>Dados da sua conta Steam:</strong> Coletamos seu Steam ID (identificador único), nome de perfil público e URL de perfil público para integração. Também solicitamos acesso ao seu inventário público para verificar os itens que você deseja usar como prêmio e para entregar suas recompensas.</li>
            <li><strong>Dados de transações financeiras:</strong> Mantemos um histórico de suas compras de RiffaCoins e taxas de inscrição em torneios. É importante ressaltar que não armazenamos dados sensíveis de pagamento, como número de cartão de crédito ou CVV. Estes são processados diretamente por nossos parceiros de pagamento (gateways), que possuem certificação de segurança.</li>
            <li><strong>Dados de uso da Plataforma e gameplay:</strong> Registramos seu histórico de participação em torneios, resultados, pontuações, e logs de atividade para garantir a integridade das competições e a segurança da sua conta.</li>
            <li><strong>Dados técnicos e de dispositivo:</strong> Endereço IP, tipo de navegador, sistema operacional e cookies essenciais para o funcionamento seguro do nosso site.</li>
        </ul>

        <h2>3. PARA QUAIS FINALIDADES USAMOS SEUS DADOS?</h2>
        <p>Utilizamos seus dados para as seguintes finalidades legítimas:</p>
        <ul>
            <li><strong>Operar a Plataforma:</strong> Gerenciar seu perfil, autenticação, acesso a torneios e a correta entrega de prêmios.</li>
            <li><strong>Processar transações:</strong> Confirmar suas compras de RiffaCoins, gerenciar seu saldo e processar saques (quando aplicável).</li>
            <li><strong>Garantir integridade e segurança:</strong> Gerar rankings justos, determinar vencedores e, crucialmente, detectar e prevenir fraudes, trapaças (cheating) ou qualquer forma de manipulação.</li>
            <li><strong>Melhorar a Plataforma:</strong> Analisar dados de uso de forma agregada e anônima para identificar bugs, aprimorar a experiência do usuário e desenvolver novos recursos.</li>
            <li><strong>Comunicação e suporte:</strong> Enviar notificações importantes sobre sua conta, torneios, transações e para responder às suas solicitações de suporte.</li>
            <li><strong>Cumprir obrigações legais:</strong> Manter registros de transações para fins fiscais e legais, e para responder a eventuais requisições de autoridades competentes.</li>
        </ul>

        <h2>4. COM QUEM COMPARTILHAMOS SEUS DADOS?</h2>
        <p>Seus dados são compartilhados apenas quando estritamente necessário e com parceiros que seguem rigorosos padrões de segurança:</p>
        <ul>
            <li><strong>Valve Corporation (Steam):</strong> Para operar o sistema de login, custódia e entrega de prêmios.</li>
            <li><strong>Processadores de pagamento:</strong> Para processar as compras de RiffaCoins.</li>
            <li><strong>Autoridades legais:</strong> Em caso de ordem judicial ou requisição legal, conforme exigido por lei.</li>
            <li><strong>Outros usuários:</strong> Seu apelido (nickname) e sua performance nos jogos (pontuação) são públicos nos rankings dos torneios dos quais você participa.</li>
        </ul>

        <h2>5. SEUS DIREITOS COMO TITULAR (Art. 18 LGPD)</h2>
        <p>Você, como titular dos dados, pode, a qualquer momento e mediante requisição, exercer seus direitos de: confirmação da existência do tratamento, acesso aos dados, correção de dados incompletos ou desatualizados, anonimização, bloqueio ou eliminação de dados desnecessários, portabilidade dos dados, e informação sobre com quem compartilhamos seus dados. Para exercer seus direitos, envie um e-mail para nosso Encarregado de Proteção de Dados (DPO) através do canal oficial: <strong>privacidade@riffagames.com.br</strong>.</p>
        
        <h2>6. SEGURANÇA E ARMAZENAMENTO</h2>
        <p>Adotamos as melhores medidas técnicas e administrativas para proteger seus dados, incluindo criptografia de ponta a ponta (SSL/TLS), firewalls e controle de acesso restrito. Seus dados são armazenados em servidores seguros e são retidos apenas pelo tempo necessário para cumprir as finalidades para as quais foram coletados ou para cumprir obrigações legais.</p>

        <h2>7. CONTATO DO ENCARREGADO DE PROTEÇÃO DE DADOS (DPO)</h2>
        <p>Para qualquer dúvida, ou para exercer seus direitos relativos à proteção de dados, entre em contato com nosso Encarregado de Proteção de Dados (DPO) através do e-mail oficial: <strong>suporte@riffagames.com.br</strong>.</p>
      </article>
    </div>
  );
}