// src/utils/crypto.ts

import crypto from 'crypto';
import logger from '../lib/logger'; // Importa o logger padronizado

/**
 * Cria um hash HMAC-SHA256 do CPF para ser armazenado de forma segura e pesquisável.
 * @param cpf - O CPF a ser "hasheado".
 */
export function encryptCPF(cpf: string): string {
  // A chave secreta deve ser longa e complexa, definida no .env
  const salt = process.env.CPF_SALT;
  if (!salt) {
    // CORREÇÃO: Usando o logger padronizado em vez de console.error
    logger.error('[CRYPTO] ERRO CRÍTICO: CPF_SALT não está definido no .env. A segurança dos CPFs está comprometida.');
    throw new Error('Configuração de segurança do servidor está incompleta.');
  }

  const hash = crypto
    .createHmac('sha256', salt)
    .update(cpf)
    .digest('hex');

  return hash;
}