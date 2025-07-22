'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useUserStore } from '@/store/userStore';
import { fetchUserProfile } from '@/lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  useEffect(() => {
    // A função para finalizar a sessão agora é mais simples e segura.
    const finalizeSession = async () => {
      try {
        // 1. O cookie de sessão já foi definido pelo backend.
        //    Nós apenas buscamos os dados do perfil do usuário para atualizar nosso estado no cliente.
        const user = await fetchUserProfile();

        if (user) {
          // 2. Salvamos os dados do usuário na nossa store global (Zustand).
          setUser(user);
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });

          // 3. Redirecionamos para a página de perfil, completando o login.
          router.replace('/me');
        } else {
          // Fallback caso a API não retorne o usuário por algum motivo.
          throw new Error('Perfil do usuário não encontrado após o callback.');
        }
      } catch (error) {
        console.error("Erro ao finalizar a sessão de callback:", error);
        // Em caso de erro, envia o usuário para a página de login com uma mensagem.
        router.replace('/auth/login?error=callback_failed');
      }
    };

    finalizeSession();
    
  // O array de dependências está vazio para garantir que o efeito rode apenas uma vez.
  // As funções como setUser e router são estáveis.
  }, [router, queryClient, setUser]);

  // Enquanto a lógica acima roda, mostramos uma tela de carregamento para o usuário.
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-bg-dark text-center">
      <div className="font-display text-2xl font-bold text-white">
        Finalizando autenticação...
      </div>
      <p className="mt-2 animate-pulse text-text-secondary">
        Quase lá! Estamos preparando a plataforma para você.
      </p>
    </div>
  );
}