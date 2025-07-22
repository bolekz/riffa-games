import mailerService from './mailer';
import logger from '../lib/logger';

/**
 * Gera um código numérico aleatório de 6 dígitos para 2FA.
 */
export function generate2FACode(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}

/**
 * Envia o código 2FA para o email do utilizador.
 */
export async function send2FACode(email: string, code: string): Promise<void> {
  try {
    const subject = 'O seu Código de Verificação - Riffa Games';
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h1 style="color: #0d6efd;">Seu Código de Acesso</h1>
            <p>Use o código abaixo para completar o seu login na plataforma Riffa Games.</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${code}
            </p>
            <p>Este código é válido por 10 minutos.</p>
            <p>Se você não tentou fazer login, pode ignorar este email com segurança.</p>
        </div>
    `;
    
    await mailerService.send(email, subject, html);
    
  } catch (error) {
    logger.error(error, `Falha ao enviar o código 2FA para o email: ${email}`);
  }
}