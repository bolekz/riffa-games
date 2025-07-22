'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { useUserStore } from '@/store/userStore';
import { fetchUserProfile } from '@/lib/api';

/**
 * Hook customizado para gerir o estado de autenticação do usuário.
 * Ele busca os dados do perfil se o usuário estiver numa página protegida
 * e ainda não tiver os dados carregados na store.
 */
export function useUser() {
  const queryClient = useQueryClient();
  const { user, setUser } = useUserStore();
  const pathname = usePathname(); // Pega a rota atual (ex: '/dashboard')

  // Condição inteligente para ativar a query:
  // 1. A rota atual NÃO é uma página pública/de autenticação.
  // 2. Ainda não temos os dados do usuário na store global.
  const isProtectedPage = !['/auth/login', '/auth/register', '/'].includes(pathname);
  const shouldFetch = !user && isProtectedPage;

  // useQuery para buscar o perfil do usuário.
  // Graças ao 'apiClient', o cookie de autenticação é enviado automaticamente.
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile'], // Chave de cache para os dados do usuário
    queryFn: fetchUserProfile, // A função que chama a API
    enabled: shouldFetch,      // A query só é executada quando 'shouldFetch' é verdadeiro
    staleTime: 5 * 60 * 1000,  // Os dados são considerados "frescos" por 5 minutos
    retry: false,              // Não tenta novamente em caso de erro (o interceptor já lida com 401)
  });

  // Efeito para salvar os dados na store quando a query for bem-sucedida
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  // Efeito para limpar a store se a query resultar num erro
  useEffect(() => {
    if (isError) {
      setUser(null);
      queryClient.removeQueries({ queryKey: ['userProfile'] });
    }
  }, [isError, setUser, queryClient]);

  // Retorna um objeto com o estado de autenticação completo
  return {
    user: user,
    isLoading: isLoading && shouldFetch, // O estado de 'loading' só é relevante se a query estiver ativa
    isError,
    error,
    isAuthenticated: !!user, // Um booleano simples para verificar se o usuário está logado
    clearUser: () => {
      // Função para deslogar o usuário manualmente (ex: botão de logout)
      setUser(null);
      queryClient.removeQueries({ queryKey: ['userProfile'] });
    }
  };
}