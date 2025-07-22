// Define uma interface para a estrutura da resposta, para uso em todo o projeto
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * Padroniza todas as respostas da API, garantindo uma estrutura consistente.
 * * @param {boolean} success - Indica se a operação foi bem-sucedida.
 * @param {string} message - Uma mensagem descritiva da resposta.
 * @param {T | null} [data=null] - Os dados retornados pela requisição (opcional).
 * @returns {ApiResponse<T>} Um objeto de resposta padronizado.
 */
export function generateResponse<T>(success: boolean, message: string, data: T | null = null): ApiResponse<T> {
  return {
    success,
    message,
    data,
  };
}

// Nota: Não usamos module.exports aqui porque já estamos a usar a sintaxe de export do ES Module,
// que o TypeScript compilará corretamente para CommonJS.