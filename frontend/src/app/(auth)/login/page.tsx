'use client';

import React, { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';

// Importações centralizadas, mantendo o código limpo e organizado.
import { login, AuthCredentials, AuthResponse } from '@/lib/api';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/atoms/Logo';
import { SteamLoginButton } from '@/components/features/SteamLoginButton';

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  // Estados locais para controlar os inputs e a mensagem de erro.
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // useMutation para lidar com a chamada de login de forma robusta.
  // A tipagem forte <AuthResponse, AxiosError<{ message: string }>, AuthCredentials>
  // garante que o TypeScript nos ajude a evitar erros.
  const mutation = useMutation<AuthResponse, AxiosError<{ message: string }>, AuthCredentials>({
    mutationFn: login,
    onSuccess: (data: AuthResponse) => {
      // Lógica executada quando o login é bem-sucedido.
      if (data.user) {
        setUser(data.user);
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        router.push('/me'); // Redireciona para a área do usuário
      } else {
        setErrorMessage('Resposta de login inválida do servidor.');
      }
    },
    onError: (err: AxiosError<{ message: string }>) => {
      // Extrai a mensagem de erro específica do backend para dar um feedback claro.
      setErrorMessage(err.response?.data.message || 'Falha ao autenticar. Verifique suas credenciais.');
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null); // Limpa erros antigos antes de uma nova tentativa.
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-dark p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-8 shadow-lg">
          <h1 className="font-display text-center text-2xl font-bold text-white">
            Acessar Plataforma
          </h1>
          <p className="mb-6 text-center text-sm text-gray-400">
            Bem-vindo de volta, guerreiro.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-text-primary shadow-sm focus:border-tron-cyan focus:ring-tron-cyan"
                aria-label="Email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-text-primary shadow-sm focus:border-tron-cyan focus:ring-tron-cyan"
                aria-label="Senha"
              />
            </div>

            {/* Exibe a mensagem de erro de forma condicional e acessível */}
            {errorMessage && (
              <p className="text-center text-sm text-red-500" role="alert">
                {errorMessage}
              </p>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-tron-cyan text-black shadow-glow-cyan hover:bg-cyan-300"
                disabled={mutation.isPending}
                aria-busy={mutation.isPending}
              >
                {mutation.isPending ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-800 px-2 text-text-secondary">OU</span>
            </div>
          </div>

          <SteamLoginButton />

        </div>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Não tem uma conta?{' '}
          <Link href="/auth/register" className="font-semibold text-tron-cyan hover:text-cyan-300">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}