// src/middlewares/validateMercadoPagoWebhook.ts

import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import logger from '../lib/logger';
import { generateResponse } from '../utils/responseHandler';

/**
 * Middleware para validar a autenticidade de um webhook do Mercado Pago.
 * Ele compara a assinatura HMAC recebida no cabeçalho X-Signature com uma
 * assinatura gerada localmente, usando uma chave secreta.
 */
export function validateMercadoPagoWebhook(req: Request, res: Response, next: NextFunction) {
  const secretKey = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secretKey) {
    logger.error('[WEBHOOK_VALIDATION] A chave secreta do webhook do Mercado Pago não está configurada.');
    // Não enviamos a requisição adiante se a segurança não puder ser garantida.
    return res.status(500).json(generateResponse(false, 'Erro de configuração do servidor.'));
  }

  try {
    const signatureHeader = req.get('x-signature');
    if (!signatureHeader) {
      logger.warn('[WEBHOOK_VALIDATION] Requisição de webhook recebida sem o cabeçalho x-signature.');
      return res.status(401).json(generateResponse(false, 'Assinatura do webhook ausente.'));
    }

    // Extrai o timestamp (ts) e o hash (v1) do cabeçalho
    const parts = signatureHeader.split(',');
    const timestamp = parts.find(part => part.startsWith('ts='))?.split('=')[1];
    const receivedHash = parts.find(part => part.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !receivedHash) {
      logger.warn('[WEBHOOK_VALIDATION] Formato do cabeçalho x-signature inválido.');
      return res.status(401).json(generateResponse(false, 'Assinatura do webhook malformada.'));
    }

    // Recria a string assinada conforme a documentação do Mercado Pago
    const signedTemplate = `id:${req.body.data.id};request-id:${req.get('x-request-id')};ts:${timestamp};`;

    // Gera o hash HMAC usando a chave secreta
    const generatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(signedTemplate)
      .digest('hex');
    
    // Compara o hash gerado com o hash recebido
    if (crypto.timingSafeEqual(Buffer.from(generatedHash), Buffer.from(receivedHash))) {
      // Assinatura válida, a requisição pode prosseguir para o controller.
      logger.info(`[WEBHOOK_VALIDATION] Assinatura do webhook para o pagamento ${req.body.data.id} validada com sucesso.`);
      return next();
    } else {
      logger.warn(`[WEBHOOK_VALIDATION] Assinatura do webhook inválida para o pagamento ${req.body.data.id}.`);
      return res.status(401).json(generateResponse(false, 'Assinatura do webhook inválida.'));
    }
  } catch (error) {
    logger.error(error, '[WEBHOOK_VALIDATION] Erro inesperado durante a validação da assinatura do webhook.');
    return res.status(500).json(generateResponse(false, 'Erro interno ao validar o webhook.'));
  }
}