// src/app/(plataforma)/me/settings/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

import { useUser } from '@/hooks/useUser';
import { updateUserProfile } from '@/lib/api';
import { Title } from '@/components/atoms/Title';
import { Button } from '@/components/ui/button';

type FormDetails = {
  name: string;
  cpf: string;
  whatsapp?: string;
  tradeUrl?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading } = useUser();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tradeUrl, setTradeUrl] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCpf(user.cpf || '');
      setWhatsapp(user.whatsapp || '');
      setTradeUrl(user.tradeUrl || '');
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: (details: FormDetails) => updateUserProfile(details),
    onSuccess: () => {
      toast.success('Perfil atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      router.push('/me');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || 'Erro inesperado';
      toast.error(`Erro ao atualizar perfil: ${msg}`);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ name, cpf, whatsapp, tradeUrl });
  };

  if (isLoading) {
    return <div className="container mx-auto p-8 text-center">Carregando configurações...</div>;
  }

  if (!user) {
    return <div className="container mx-auto p-8 text-center">Usuário não encontrado.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-12">
      <div>
        <Title>Configurações do Perfil</Title>
        <p className="mt-2 text-text-secondary">
          Mantenha seus dados atualizados para garantir a segurança e o recebimento de prêmios.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-6 rounded-lg border border-gray-700 bg-gray-800/50 p-8"
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            aria-disabled="true"
            className="mt-1 block w-full cursor-not-allowed rounded-md border-gray-700 bg-bg-light/50 px-3 py-2 text-text-secondary"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
            Nome Completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-text-secondary">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white"
            placeholder="___.___.___-__"
            required
          />
          <p className="mt-1 text-xs text-text-secondary">
            Seu CPF é criptografado e usado apenas para transações financeiras.
          </p>
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-text-secondary">
            Telefone Celular (WhatsApp)
          </label>
          <input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white"
            placeholder="(XX) XXXXX-XXXX"
          />
        </div>

        <div className="border-t border-gray-700 pt-6">
          <label htmlFor="tradeUrl" className="block text-sm font-medium text-text-secondary">
            URL de Troca da Steam
          </label>
          <input
            id="tradeUrl"
            type="url"
            value={tradeUrl}
            onChange={(e) => setTradeUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-700 bg-bg-light px-3 py-2 text-white"
            placeholder="https://steamcommunity.com/tradeoffer/new/..."
          />
          <p className="mt-2 text-xs text-text-secondary">
            Necessária para criar torneios e receber prêmios.
            <Link
              href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-semibold text-tron-cyan hover:underline"
            >
              Encontre a sua aqui.
            </Link>
          </p>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-tron-cyan text-black shadow-glow-cyan hover:bg-cyan-300"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
