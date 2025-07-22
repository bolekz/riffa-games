import logger from '../lib/logger';

/**
 * Módulo de simulação para envio de emails.
 * Numa aplicação real, isto seria substituído por uma biblioteca como Nodemailer
 * e um serviço de SMTP (SendGrid, Amazon SES, etc.).
 */
const mailerService = {
  /**
   * Função genérica para "enviar" um email, que na verdade apenas o regista no log.
   * @param to - O destinatário do email.
   * @param subject - O assunto do email.
   * @param html - O conteúdo HTML do email.
   */
  send: async (to: string, subject: string, html: string): Promise<void> => {
    logger.info(`--- SIMULAÇÃO DE ENVIO DE EMAIL ---`);
    logger.info(`Para: ${to}`);
    logger.info(`Assunto: ${subject}`);
    logger.info(`Corpo do HTML: ${html}`);
    logger.info(`---------------------------------`);
    // Em produção, a lógica real de envio estaria aqui.
    return Promise.resolve();
  },

  /**
   * Envia o email específico para a redefinição de senha.
   * @param email - O email do destinatário.
   * @param token - O token de redefinição (não o hash).
   */
  sendPasswordResetEmail: async (email: string, token: string): Promise<void> => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = 'Recuperação de Senha - Riffa Games';
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #0d6efd;">Recuperação de Senha</h1>
        <p>Você solicitou a redefinição da sua senha na plataforma Riffa Games.</p>
        <p>Por favor, clique no botão abaixo para criar uma nova senha. O link é válido por 1 hora.</p>
        <a href="${resetUrl}" target="_blank" style="background-color: #0d6efd; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Redefinir Senha
        </a>
        <p style="margin-top: 20px;">Se você não solicitou esta redefinição, pode ignorar este email com segurança.</p>
      </div>
    `;
    return mailerService.send(email, subject, html);
  },
};

export default mailerService;