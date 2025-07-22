// src/app/me/ProfileView.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Os caminhos relativos estão corretos para a sua estrutura de pastas.
import { useUser } from '../../../hooks/useUser';
import { logout, UserProfile } from '../../../lib/api';
import { Title } from '../../../components/atoms/Title';
import { Button } from '../../../components/ui/button';

/**
 * Este é um Client Component responsável por renderizar a interface do perfil do usuário.
 * Ele recebe os dados iniciais do usuário como uma prop do Server Component pai (page.tsx).
 */
export function ProfileView({ initialUser }: { initialUser: UserProfile }) {
  const router = useRouter();
  // O hook useUser ainda é útil aqui para aceder a funções como `clearUser`.
  const { user, clearUser } = useUser();

  // Garante que a UI sempre use os dados mais atualizados disponíveis.
  const currentUser = user || initialUser;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Falha ao fazer logout no servidor:', error);
    } finally {
      // Limpa o estado do cliente e redireciona, garantindo uma saída limpa.
      clearUser();
      router.push('/');
    }
  };

  // Como a verificação de autenticação já aconteceu no servidor,
  // não precisamos de estados de 'isLoading' ou 'error' aqui.
  // Este componente só é renderizado se o usuário for válido.
  return (
    <div className="container mx-auto max-w-4xl space-y-12 px-4 py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Title>Meu Perfil</Title>
          <p className="mt-2 text-lg text-text-secondary">
            Bem-vindo de volta, <span className="font-bold text-tron-cyan">{currentUser.nickname}!</span>
          </p>
        </div>
        <Button onClick={handleLogout} variant="destructive">
          Sair (Logout)
        </Button>
      </div>

      <div className="max-w-md rounded-lg bg-cyan-900/80 p-6 text-center shadow-lg shadow-cyan-900/30">
        <p className="text-sm font-medium text-cyan-200">SALDO DISPONÍVEL</p>
        <p className="font-display mt-2 text-5xl font-extrabold text-white">
          💎 {Number(currentUser.riffaCoinsAvailable || 0).toLocaleString('pt-BR')}
        </p>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-white">Gerenciamento da Conta</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/me/settings"
            className="group rounded-lg border border-gray-700 bg-gray-800 p-4 text-center text-text-secondary transition-colors hover:border-tron-cyan hover:bg-gray-700"
          >
            Editar Perfil
          </Link>
          <Link
            href="/me/wallet"
            className="group rounded-lg border border-gray-700 bg-gray-800 p-4 text-center text-text-secondary transition-colors hover:border-tron-cyan hover:bg-gray-700"
          >
            Minha Carteira
          </Link>
          <Link
            href="/me/claims"
            className="group rounded-lg border border-gray-700 bg-gray-800 p-4 text-center text-text-secondary transition-colors hover:border-tron-cyan hover:bg-gray-700"
          >
            Meus Prêmios
          </Link>
          <Link
            href="/me/affiliates"
            className="group rounded-lg border border-gray-700 bg-gray-800 p-4 text-center text-text-secondary transition-colors hover:border-tron-cyan hover:bg-gray-700"
          >
            Painel de Afiliado
          </Link>
        </div>
      </div>
    </div>
  );
}