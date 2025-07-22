'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Title } from '@/components/atoms/Title';
import { Button } from '@/components/ui/button';
import { adjustUserWallet } from '@/lib/api'; // Precisaremos criar esta função na api.ts

export default function AdminWalletManagementPage() {
  const queryClient = useQueryClient();
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');

  const mutation = useMutation({
    mutationFn: adjustUserWallet, // Deve chamar algo como POST /private/wallet/adjust
    onSuccess: () => {
      alert('Saldo do usuário ajustado com sucesso!');
      // Limpa o formulário
      setTargetUserEmail('');
      setAmount('');
      setReason('');
      // Opcional: invalidar queries relacionadas ao usuário, se houver
    },
    onError: (error: any) => {
      alert(`Erro ao ajustar saldo: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!targetUserEmail || !amount || !reason) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Por favor, insira um valor numérico válido.');
      return;
    }

    mutation.mutate({
      email: targetUserEmail,
      amount: numericAmount,
      type: adjustmentType,
      reason,
    });
  };

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <Title>Gerenciamento de Carteiras</Title>
        <p className="text-gray-400 mt-2">
          Adicione ou remova RiffaCoins manualmente da conta de um usuário.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 rounded-lg border border-gray-700 bg-gray-800/50 p-8"
        >
          <h2 className="text-lg font-semibold text-white">Ajuste Manual de Saldo</h2>
          
          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-gray-300">Email do Usuário</label>
            <input
              id="user-email"
              type="email"
              value={targetUserEmail}
              onChange={(e) => setTargetUserEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Valor (RC)</label>
            <input
              id="amount"
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Tipo de Ajuste</label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value as 'CREDIT' | 'DEBIT')}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500"
            >
              <option value="CREDIT">Crédito (Adicionar Saldo)</option>
              <option value="DEBIT">Débito (Remover Saldo)</option>
            </select>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-300">Motivo do Ajuste</label>
            <input
              id="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Bônus de boas-vindas"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? 'Processando...' : 'Confirmar Ajuste'}
          </Button>
        </form>
      </div>
    </div>
  );
}