// src/config/mercadopago.ts

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import logger from '../lib/logger';

// 1. Valida a existência da variável de ambiente essencial
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
if (!accessToken) {
  logger.error('[MERCADOPAGO] O MERCADOPAGO_ACCESS_TOKEN não está definido no arquivo .env.');
  throw new Error('Configuração do Mercado Pago está incompleta no servidor.');
}

// 2. Cria uma instância do cliente de configuração com o token
const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000, // Timeout de 5 segundos para as requisições
  },
});

// 3. Exporta instâncias específicas dos serviços que vamos usar, passando o cliente.
export const preference = new Preference(client);
export const payment = new Payment(client);

logger.info('[MERCADOPAGO] Cliente configurado com sucesso.');