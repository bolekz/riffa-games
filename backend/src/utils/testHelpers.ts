// Gera um e-mail único com base no timestamp
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `user_${timestamp}@riffa.com`;
}

// Gera uma senha forte aleatória (mínimo 12 caracteres)
export function generateStrongPassword(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Gera um CPF válido aleatório
// export function generateRandomCPF(): string {
//   const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
//   const d1 = (n.reduce((acc, curr, i) => acc + curr * (10 - i), 0) * 10) % 11 % 10;
//   const d2 = ([...n, d1].reduce((acc, curr, i) => acc + curr * (11 - i), 0) * 10) % 11 % 10;
//   return [...n, d1, d2].join('');
// }

// Gera uma chave Pix aleatória (formato UUID simplificado)
// export function generateRandomPixKey(): string {
//   const hex = () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
//   return `${hex()}${hex()}-${hex()}-${hex()}-${hex()}-${hex()}${hex()}${hex()}`;
// }
