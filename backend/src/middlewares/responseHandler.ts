// src/utils/responseHandler.ts

/**
 * Interface que define a estrutura padrão para todas as respostas da API.
 * O tipo T é um genérico para os dados que podem ser retornados.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * Padroniza a criação de objetos de resposta da API.
 * @param success - Indica se a operação foi bem-sucedida.
 * @param message - Uma mensagem descritiva sobre o resultado.
 * @param data - Os dados a serem enviados na resposta (opcional).
 * @returns Um objeto de resposta padronizado e bem tipado.
 */
export function generateResponse<T>(
  success: boolean,
  message: string,
  data: T | null = null
): ApiResponse<T> {
  return {
    success,
    message,
    data,
  };
}