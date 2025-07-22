'use client';

import React, { useState, FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Importando os tipos e a função de registro da nossa API
import { register, AuthResponse } from '@/lib/api';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/atoms/Logo';
import { SteamLoginButton } from '@/components/features/SteamLoginButton';

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  // Estados para os termos de uso (UX aprimorado)
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Mutação para registrar o usuário
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data: AuthResponse) => {
      // --- LÓGICA DE SUCESSO ATUALIZADA (AUTO-LOGIN) ---
      // 1. O backend retornou os dados do usuário recém-criado.
      //    O cookie de sessão já foi definido.
      if (data.user) {
        // 2. Salvamos o usuário na nossa store global.
        setUser(data.user);
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });

        // 3. Redirecionamos o usuário diretamente para a plataforma, já logado!
        router.push('/me');
      } else {
        alert('Registro bem-sucedido! Por favor, faça o login.');
        router.push('/auth/login');
      }
    },
    onError: (error: any) => {
      console.error("Erro no registro:", error);
    }
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      alert('As senhas não conferem!');
      return;
    }
    if (!termsAccepted || !privacyAccepted) {
      alert('É necessário ler e aceitar os Termos e a Política de Privacidade.');
      return;
    }
    mutation.mutate({ name, nickname, email, password, password_confirmation: passwordConfirmation });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-dark p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-8 shadow-lg">
          <h1 className="font-display mb-6 text-center text-2xl font-bold text-white">Criar sua Conta</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Nome completo</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white shadow-sm focus:border-tron-cyan focus:ring-tron-cyan" />
            </div>
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-text-secondary">Nickname (Apelido)</label>
              <input id="nickname" type="text" required value={nickname} onChange={(e) => setNickname(e.target.value)} className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white shadow-sm focus:border-tron-cyan focus:ring-tron-cyan" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white shadow-sm focus:border-tron-cyan focus:ring-tron-cyan" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Senha</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white shadow-sm focus:border-tron-cyan focus:ring-tron-cyan" />
            </div>
            <div>
              <label htmlFor="password-confirmation" className="block text-sm font-medium text-text-secondary">Confirmar senha</label>
              <input id="password-confirmation" type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white shadow-sm focus:border-tron-cyan focus:ring-tron-cyan" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" onChange={(e) => setTermsAccepted(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-tron-cyan focus:ring-tron-cyan"/>
                <label htmlFor="terms" className="ml-2 block text-sm text-text-secondary">Eu li e aceito os <Link href="/terms" target="_blank" className="text-tron-cyan hover:underline">Termos de Uso</Link>.</label>
              </div>
              <div className="flex items-center">
                <input id="privacy" name="privacy" type="checkbox" onChange={(e) => setPrivacyAccepted(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-tron-cyan focus:ring-tron-cyan"/>
                <label htmlFor="privacy" className="ml-2 block text-sm text-text-secondary">Eu li e aceito a <Link href="/privacy" target="_blank" className="text-tron-cyan hover:underline">Política de Privacidade</Link>.</label>
              </div>
            </div>
            
            {mutation.isError && (
              <p className="text-center text-sm text-red-500">
                {(mutation.error as any).response?.data?.message || 'Ocorreu um erro ao criar a conta.'}
              </p>
            )}

            <Button type="submit" className="!mt-6 w-full bg-tron-cyan text-black shadow-glow-cyan hover:bg-cyan-300" disabled={mutation.isPending || !termsAccepted || !privacyAccepted}>
              {mutation.isPending ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-gray-800 px-2 text-text-secondary">OU</span></div>
          </div>
          
          <div>
            <SteamLoginButton />
          </div>
        </div>
        
        <p className="mt-6 text-center text-sm text-text-secondary">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="font-semibold text-tron-cyan hover:text-cyan-300">Faça login</Link>
        </p>
      </div>
    </div>
  );
}