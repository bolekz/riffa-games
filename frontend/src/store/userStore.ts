"use client";

import { create } from 'zustand';
// Importa a tipagem do perfil do usuário do nosso ficheiro central de API,
// garantindo consistência em todo o projeto.
import { UserProfile } from '@/lib/api';

// Define o formato do nosso estado: um objeto que pode conter um UserProfile ou ser nulo,
// e uma função para o modificar.
export type UserState = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

/**
 * Cria a store do Zustand.
 * É uma store simples e 'client-side' que guarda o estado do usuário logado.
 * O estado inicial do usuário é 'null'.
 */
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// Nota: mantenha a lógica de fetching do perfil (fetchUserProfile) separada,
// por exemplo em um hook customizado que chama React Query e setUser ao montar.
// Esta separação de responsabilidades (estado vs. busca de dados) é uma excelente prática.