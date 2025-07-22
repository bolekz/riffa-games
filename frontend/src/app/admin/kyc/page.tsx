'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPendingKyc, updateKycStatus } from '@/lib/api';
import { Title } from '@/components/atoms/Title';
import { Button } from '@/components/ui/button';

// Interface para dar tipo aos dados de cada solicitação
interface KycRequest {
  id: string; // ID do usuário
  name: string;
  email: string;
  cpf: string | null;
  updatedAt: string; // Data da última atualização, que indica a solicitação
}

export default function AdminKycPage() {
  const queryClient = useQueryClient();

  // Busca a lista de solicitações de KYC pendentes
  const { data: response, isLoading, error } = useQuery<{ data: KycRequest[] }>({
    queryKey: ['pendingKyc'],
    queryFn: () => fetchPendingKyc({}),
  });

  const kycRequests = response?.data || [];

  // Mutação para aprovar ou rejeitar uma solicitação
  const mutation = useMutation({
    mutationFn: updateKycStatus,
    onSuccess: () => {
      alert('Status do KYC atualizado com sucesso!');
      // Invalida a query para que a lista seja recarregada sem o item processado
      queryClient.invalidateQueries({ queryKey: ['pendingKyc'] });
    },
    onError: (error: any) => {
      alert(`Erro ao atualizar KYC: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleUpdateKyc = (userId: string, status: 'APPROVED' | 'REJECTED') => {
    const action = status === 'APPROVED' ? 'APROVAR' : 'REJEITAR';
    if (confirm(`Tem certeza que deseja ${action} o KYC deste usuário?`)) {
      mutation.mutate({ userId, status });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Title>Aprovações de KYC Pendentes</Title>
      <p className="mt-2 text-text-secondary">
        Revise os documentos e aprove ou rejeite as solicitações abaixo.
      </p>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-bg-light">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">Usuário</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">CPF</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Data da Solicitação</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-bg-dark">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-text-secondary">Carregando solicitações...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-red-400">Falha ao carregar as solicitações.</td>
                  </tr>
                ) : kycRequests.length > 0 ? (
                  kycRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="font-medium text-white">{request.name}</div>
                        <div className="text-text-secondary">{request.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{request.cpf || 'Não informado'}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{new Date(request.updatedAt).toLocaleString('pt-BR')}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium space-x-2">
                        <Button 
                          onClick={() => handleUpdateKyc(request.id, 'APPROVED')}
                          disabled={mutation.isPending && mutation.variables?.userId === request.id}
                          className="bg-tron-green text-black"
                          size="sm"
                        >
                          Aprovar
                        </Button>
                        <Button 
                          onClick={() => handleUpdateKyc(request.id, 'REJECTED')}
                          disabled={mutation.isPending && mutation.variables?.userId === request.id}
                          variant="destructive"
                          size="sm"
                        >
                          Rejeitar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-text-secondary">Nenhuma solicitação de KYC pendente no momento.</td>
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