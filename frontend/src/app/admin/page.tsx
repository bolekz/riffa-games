'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Title } from '@/components/atoms/Title';
import { fetchAdminDashboardStats } from '@/lib/api'; 

// --- Interface para a tipagem dos dados do dashboard ---
interface DashboardStats {
  pendingKycCount: number;
  pendingWithdrawalsCount: number;
  totalUsers: number;
  totalAffiliates: number;
}

// --- Componente reutilizável para os cards de estatística ---
const StatCard = ({ title, value, isLoading, link }: { title: string; value: string | number; isLoading: boolean; link?: string }) => {
  const CardContent = () => (
    <div className="rounded-lg border border-gray-700 bg-bg-light p-6 transition-colors group-hover:border-tron-cyan">
      <p className="text-sm font-medium text-text-secondary">{title}</p>
      {isLoading ? (
        <div className="mt-2 h-10 w-2/3 animate-pulse rounded bg-gray-700"></div>
      ) : (
        <p className="mt-1 text-4xl font-bold text-white">{value}</p>
      )}
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block group">
        <CardContent />
      </Link>
    );
  }
  return <CardContent />;
};

// --- Componente Principal da Página do Dashboard ---
export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['adminDashboardStats'],
    queryFn: fetchAdminDashboardStats, 
  });

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Erro ao carregar os dados do dashboard. Verifique sua conexão e permissões.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div>
        <Title>Dashboard do Administrador</Title>
        <p className="mt-2 text-text-secondary">
          Visão geral da saúde e das pendências da plataforma.
        </p>
      </div>

      {/* Grid com os principais KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="KYCs Pendentes"
          value={data?.pendingKycCount ?? 0}
          isLoading={isLoading}
          link="/admin/kyc"
        />
        <StatCard
          title="Saques a Processar"
          value={data?.pendingWithdrawalsCount ?? 0}
          isLoading={isLoading}
          link="/admin/withdrawals"
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
          link="/admin/affiliates"
        />
      </div>

      {/* Seção de Ações Rápidas (revisada) */}
      <div>
        <h2 className="font-display text-xl font-semibold text-white">Ações Comuns</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/kyc" className="rounded-lg bg-bg-light p-4 text-center text-white transition-colors hover:bg-gray-700">
            Gerenciar Aprovações de KYC
          </Link>
          <Link href="/admin/withdrawals" className="rounded-lg bg-bg-light p-4 text-center text-white transition-colors hover:bg-gray-700">
            Processar Saques
          </Link>
          <Link href="/admin/wallet" className="rounded-lg bg-bg-light p-4 text-center text-white transition-colors hover:bg-gray-700">
            Ajustar Saldo de Usuário
          </Link>
        </div>
      </div>
    </div>
  );
}