// src/modules/auth/auth.types.ts

export interface RegisterData {
  name: string;
  nickname: string;
  email: string;
  password: string;
  cpf?: string;
  whatsapp?: string;
  referralCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserPayload {
  id: string;
  role: string;
}