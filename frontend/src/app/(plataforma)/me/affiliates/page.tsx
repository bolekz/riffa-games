// src/app/(plataforma)/me/affiliate/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchMyAffiliateCode,
  fetchMyAffiliateStats,
  fetchMyAffiliateCommissions,
} from '@/lib/api';
import { Title } from '@/components/atoms/Title';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import React from 'react';

interface AffiliateStats {
  totalReferrals: number;
  totalCommissionRC: number;
}
interface Commission {
  id: string;
  amountRC: number;
  createdAt: string;
  details?: {
    referredUserEmail?: string;
  };
}

const StatCard = ({
  title,
  value,
  isLoading,
  icon,
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
  icon: React.ReactNode;
}) => (
  <div className="rounded-lg border border-gray-700 bg-bg-light p-6">
    <p className="text-sm font-medium text-text-secondary">{title}</p>
    {isLoading ? (
      <div className="mt-2 h-10 w-2/3 animate-pulse rounded bg-gray-700" />
    ) : (
      <div className="mt-1 flex items-center gap-3">
        {icon}
        <p className="text-4xl font-bold text-white">{value}</p>
      </div>
    )}
  </div>
);

export default function AffiliateDashboardPage() {
  const { data: codeData, isLoading: isLoadingCode } = useQuery({
    queryKey: ['myAffiliateCode'],
    queryFn: fetchMyAffiliateCode,
    retry: false,
  });

  const { data: statsData, isLoading: isLoadingStats } = useQuery<AffiliateStats>({
    queryKey: ['myAffiliateStats'],
    queryFn: fetchMyAffiliateStats,
  });

  const { data: commissionsResponse, isLoading: isLoadingCommissions } = useQuery<{
    data: Commission[];
  }>({
    queryKey: ['myAffiliateCommissions'],
    queryFn: fetchMyAffiliateCommissions,
  });

  const commissions = commissionsResponse?.data || [];

  const handleCopyCode = () => {
    if (!codeData?.code) return;

    navigator.clipboard.writeText(codeData.code).then(() => {
      toast.success('Código de afiliado copiado!');
    });
  };

  return (
    <div className="container mx-auto space-y-12 px-4 py-12">
      <div>
        <Title>Painel de Afiliado</Title>
        <p className="mt-2 text-text-secondary">
          Acompanhe seus indicados e suas comissões.
        </p>
      </div>

      <div className="rounded-lg border border-tron-green/50 bg-green-900/20 p-6 shadow-lg shadow-green-900/20">
        <h2 className="text-lg font-semibold text-white">Seu Código de Convite</h2>
        <p className="text-sm text-text-secondary">
          Compartilhe este código com seus amigos. Você ganhará uma comissão sobre
          as compras deles!
        </p>
        {isLoadingCode ? (
          <div className="mt-4 h-12 w-1/3 animate-pulse rounded bg-gray-700" />
        ) : codeData?.code ? (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="select-all rounded-md bg-bg-dark px-4 py-2 font-mono text-2xl font-bold text-tron-green">
              {codeData.code}
            </p>
            <Button onClick={handleCopyCode} variant="outline" size="sm">
              Copiar
            </Button>
          </div>
        ) : (
          <p className="mt-4 text-yellow-400">
            Você ainda não possui um plano de assinatura ativo para participar do
            programa de afiliados.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          title="Total de Indicados"
          value={statsData?.totalReferrals ?? 0}
          isLoading={isLoadingStats}
          icon={<span className="text-2xl text-tron-cyan">👥</span>}
        />
        <StatCard
          title="Total de Comissão Ganha"
          value={`💎 ${Number(statsData?.totalCommissionRC || 0).toLocaleString('pt-BR')}`}
          isLoading={isLoadingStats}
          icon={<span className="text-2xl text-tron-green">💰</span>}
        />
      </div>

      <div>
        <h2 className="font-display text-xl font-bold text-white">
          Histórico de Comissões Recebidas
        </h2>
        <div className="mt-4 flow-root">
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-bg-light">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">
                    Descrição
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Data
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-bg-dark">
                {isLoadingCommissions ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-text-secondary">
                      Carregando comissões...
                    </td>
                  </tr>
                ) : commissions.length > 0 ? (
                  commissions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-4 pl-4 pr-3 text-sm text-white">
                        Comissão pela recarga de{' '}
                        {tx.details?.referredUserEmail || 'um usuário indicado'}
                      </td>
                      <td className="px-3 py-4 text-sm text-text-secondary">
                        {new Date(tx.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-3 py-4 text-sm font-bold text-tron-green">
                        + {Number(tx.amountRC).toLocaleString('pt-BR')} RC
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-text-secondary">
                      Nenhuma comissão recebida ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
