'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Title } from '@/components/atoms/Title';
import { fetchAdminDashboardStats } from '@/lib/api'; // Precisaremos criar esta função na api.ts

// Interface para definir o formato das estatísticas
interface DashboardStats {
  pendingKycCount: number;
  pendingWithdrawalsCount: number;
  totalUsers: number;
  totalAffiliates: number;
}

// Componente para um card de estatística individual
const StatCard = ({ title, value, isLoading }: { title: string; value: string | number; isLoading: boolean }) => (
  <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
    <p className="text-sm font-medium text-gray-400">{title}</p>
    {isLoading ? (
      <div className="mt-2 h-10 w-1/3 animate-pulse rounded bg-gray-700"></div>
    ) : (
      <p className="mt-1 text-4xl font-bold text-white">{value}</p>
    )}
  </div>
);

export default function PrivateDashboardPage() {
  // Busca os dados resumidos para o dashboard
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['adminDashboardStats'],
    queryFn: fetchAdminDashboardStats, // Deve chamar GET /private/dashboard-stats
  });

  if (error) return <p className="text-red-500">Erro ao carregar o dashboard.</p>;

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <Title>Dashboard do Administrador</Title>
        <p className="text-gray-400 mt-2">
          Visão geral da saúde e das pendências da plataforma.
        </p>
      </div>

      {/* Grid com os principais KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="KYCs Pendentes"
          value={data?.pendingKycCount ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Saques a Processar"
          value={data?.pendingWithdrawalsCount ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Total de Usuários"
          value={data?.totalUsers ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Total de Afiliados"
          value={data?.totalAffiliates ?? 0}
          isLoading={isLoading}
        />
      </div>

      {/* Seção de Ações Rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-white">Ações Rápidas</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/admin/kyc" passHref>
            <div className="cursor-pointer rounded-lg bg-gray-700 p-4 text-center text-white transition hover:bg-gray-600">
              Gerenciar KYC
            </div>
          </Link>
          <Link href="/admin/withdrawals" passHref>
            <div className="cursor-pointer rounded-lg bg-gray-700 p-4 text-center text-white transition hover:bg-gray-600">
              Processar Saques
            </div>
          </Link>
          <Link href="/private/affiliates" passHref>
            <div className="cursor-pointer rounded-lg bg-gray-700 p-4 text-center text-white transition hover:bg-gray-600">
              Ver Afiliados
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}