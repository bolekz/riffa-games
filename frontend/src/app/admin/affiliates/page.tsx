'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Title } from '@/components/atoms/Title'; // Reutilizando seu componente de título
import { fetchAllAffiliates } from '@/lib/api'; // Precisaremos criar esta função na api.ts

// Interface para definir o tipo de um afiliado (melhora a qualidade do código)
interface Affiliate {
  id: string;
  user: {
    name: string;
    email: string;
  };
  code: string;
  referrals_count: number;
  total_commission: string;
}

export default function AdminManageAffiliatesPage() {
  // Busca a lista de TODOS os afiliados da sua API
  const { data, isLoading, error } = useQuery({
    queryKey: ['allAffiliates'],
    queryFn: fetchAllAffiliates, // Esta função deve chamar algo como GET /private/affiliates
  });

  if (isLoading) return <p>Carregando lista de afiliados...</p>;
  if (error) return <p className="text-red-500">Erro ao carregar afiliados.</p>;

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <Title>Gerenciamento de Afiliados</Title>
        <p className="text-gray-400 mt-2">
          Visualize todos os afiliados da plataforma, seus códigos e estatísticas.
        </p>
      </div>

      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">Afiliado</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Código de Afiliação</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Indicados</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Comissão Total (RC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data?.data.map((affiliate: Affiliate) => (
                  <tr key={affiliate.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="font-medium text-white">{affiliate.user.name}</div>
                      <div className="text-gray-400">{affiliate.user.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 font-mono">{affiliate.code}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{affiliate.referrals_count}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-green-400">
                      💎 {Number(affiliate.total_commission).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.data.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum afiliado encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}