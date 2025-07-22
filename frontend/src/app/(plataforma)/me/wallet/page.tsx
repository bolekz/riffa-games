'use client';

import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { fetchUserTransactions } from '@/lib/api';
import { Title } from '@/components/atoms/Title';
import { Button } from '@/components/ui/button';
import { DepositSection } from '@/components/modules/DepositSection'; // ✅ Importação do módulo separado

// Tipagem para uma Transação
interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'PURCHASE_TICKET' | 'SUBSCRIPTION_FEE' | 'AFFILIATE_PAYOUT' | 'TOURNAMENT_PAYOUT';
  amountRC: number;
  createdAt: string;
  details?: {
    tournamentName?: string;
  };
}

// Componente para Histórico de Transações
const TransactionHistory = () => {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['userTransactions'],
    queryFn: () => fetchUserTransactions({ pageParam: 1 }),
  });

  const transactions: Transaction[] = response?.data || [];

  return (
    <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/50 p-6">
      <h2 className="font-display text-xl font-bold text-white">Histórico de Transações</h2>
      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-2">
        {isLoading ? (
          <p className="py-8 text-center text-text-secondary">Carregando histórico...</p>
        ) : error ? (
          <p className="py-8 text-center text-red-500">Erro ao carregar seu histórico.</p>
        ) : transactions.length > 0 ? (
          transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-md bg-bg-light p-3">
              <div>
                <p className="font-semibold capitalize text-white">{tx.type.replace(/_/g, ' ').toLowerCase()}</p>
                <p className="text-xs text-text-secondary">{new Date(tx.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <span
                className={`font-display text-lg font-bold ${
                  ['DEPOSIT', 'AFFILIATE_PAYOUT', 'TOURNAMENT_PAYOUT'].includes(tx.type)
                    ? 'text-tron-green'
                    : 'text-red-500'
                }`}
              >
                {['DEPOSIT', 'AFFILIATE_PAYOUT', 'TOURNAMENT_PAYOUT'].includes(tx.type) ? '+' : '-'}
                {Number(tx.amountRC).toLocaleString('pt-BR')} RC
              </span>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-text-secondary">Nenhuma transação encontrada.</p>
        )}
      </div>
    </div>
  );
};

// Componente Principal
export default function WalletPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="p-8 text-center">Carregando sua carteira...</div>;
  }

  if (!user) {
    return <div className="p-8 text-center">Não foi possível carregar os dados da sua carteira.</div>;
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-12">
      <div>
        <Title>Sua Carteira</Title>
        <p className="mt-2 text-text-secondary">Gerencie seu saldo e veja seu histórico de transações.</p>
      </div>

      <div className="rounded-lg bg-cyan-900/80 p-6 text-center shadow-lg shadow-cyan-900/30">
        <p className="text-sm font-medium text-cyan-200">SALDO DISPONÍVEL</p>
        <p className="font-display mt-2 text-5xl font-extrabold text-white">
          💎 {Number(user.riffaCoinsAvailable || 0).toLocaleString('pt-BR')}{' '}
          <span className="text-3xl text-tron-cyan">RC</span>
        </p>
      </div>

      <DepositSection /> {/* 💳 Seção de recarga separada */}
      <TransactionHistory />
    </div>
  );
}
