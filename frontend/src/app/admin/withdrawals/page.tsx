'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPendingWithdrawals, updateWithdrawalStatus, WithdrawalRequest } from '@/lib/api';
import { Title } from '@/components/atoms/Title';
import { Button } from '@/components/ui/button';

export default function AdminWithdrawalsPage() {
  const queryClient = useQueryClient();

  // Busca a lista de solicitações de saque pendentes
  const { data: response, isLoading, error } = useQuery<{ data: WithdrawalRequest[] }>({
    queryKey: ['pendingWithdrawals'],
    queryFn: () => fetchPendingWithdrawals({}),
  });

  const withdrawalRequests = response?.data || [];

  // Mutação para atualizar o status (marcar como pago ou falho)
  const mutation = useMutation({
    mutationFn: updateWithdrawalStatus,
    onSuccess: () => {
      alert('Status do saque atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['pendingWithdrawals'] });
    },
    onError: (error: any) => {
      alert(`Erro ao atualizar saque: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleUpdateWithdrawal = (transactionId: string, status: 'COMPLETED' | 'FAILED') => {
    let adminNotes: string | null = null;
    let confirmationMessage = `Tem certeza que deseja marcar este saque como PAGO? A ação não pode ser desfeita.`;

    if (status === 'FAILED') {
        confirmationMessage = `Tem certeza que deseja marcar este saque como FALHO? O saldo será estornado para o usuário.`;
        adminNotes = prompt('Opcional: Adicione uma nota explicando o motivo da falha (ex: "Chave PIX inválida").');
    }
    
    if (confirm(confirmationMessage)) {
      mutation.mutate({ transactionId, status, adminNotes: adminNotes || undefined });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Title>Saques Pendentes</Title>
      <p className="mt-2 text-text-secondary">
        Revise e processe as solicitações de saque de usuários com KYC aprovado.
      </p>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-bg-light">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">Usuário / Chave PIX (CPF)</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Valor do Saque (RC)</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Data da Solicitação</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-bg-dark">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-text-secondary">Carregando solicitações de saque...</td>
                  </tr>
                ) : error ? (
                   <tr>
                    <td colSpan={4} className="p-8 text-center text-red-400">Falha ao carregar as solicitações de saque.</td>
                  </tr>
                ) : withdrawalRequests.length > 0 ? (
                  withdrawalRequests.map((tx) => (
                    <tr key={tx.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="font-medium text-white">{tx.user.nickname}</div>
                        <div className="text-text-secondary">{tx.user.email}</div>
                        <div className="mt-1 font-mono text-xs text-tron-cyan">PIX: {tx.user.cpf || 'N/A'}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-tron-cyan">
                        💎 {Number(tx.amountRC).toLocaleString('pt-BR')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{new Date(tx.createdAt).toLocaleString('pt-BR')}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium space-x-2">
                        <Button 
                          onClick={() => handleUpdateWithdrawal(tx.id, 'COMPLETED')}
                          disabled={mutation.isPending && mutation.variables?.transactionId === tx.id}
                          className="bg-tron-green text-black"
                          size="sm"
                        >
                          Marcar como Pago
                        </Button>
                        <Button 
                          onClick={() => handleUpdateWithdrawal(tx.id, 'FAILED')}
                          disabled={mutation.isPending && mutation.variables?.transactionId === tx.id}
                          variant="destructive"
                          size="sm"
                        >
                          Marcar como Falho
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-text-secondary">Nenhuma solicitação de saque pendente.</td>
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