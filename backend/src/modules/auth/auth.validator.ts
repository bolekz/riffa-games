import { z } from 'zod';

// Validação para o corpo da requisição de registro.
// Adicionamos campos opcionais para dados extras.
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, { message: 'Nome deve ter ao menos 3 caracteres' }),
    nickname: z.string().min(3, 'Nickname deve ter ao menos 3 caracteres').regex(/^[a-zA-Z0-9_]+$/, 'Nickname pode conter apenas letras, números e underscore.'),
    email: z.string().email({ message: 'Formato de email inválido.' }),
    password: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' }),
    cpf: z.string().optional(),
    whatsapp: z.string().optional(),
    referralCode: z.string().optional(),
  }),
});

// Validação para o corpo da requisição de login.
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Formato de email inválido.' }),
    password: z.string().min(1, { message: 'A senha é obrigatória.' }),
  }),
});

// Validação para o corpo da requisição de "esqueci minha senha".
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  }),
});

// Validação para o corpo da requisição de redefinição de senha.
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: 'O token é obrigatório.' }),
    password: z.string().min(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' }),
  }),
});