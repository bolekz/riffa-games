'use client';

import { purchaseRiffaCoins } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Tipagem básica do pacote de recarga
interface RiffaPackage {
  brlAmount: number;
  rcAmount: number;
  bonus?: string | null;
  isFeatured?: boolean;
}

const PACKAGES: RiffaPackage[] = [
  { brlAmount: 20, rcAmount: 2000, bonus: null, isFeatured: false },
  { brlAmount: 50, rcAmount: 5250, bonus: '+5%', isFeatured: true },
  { brlAmount: 100, rcAmount: 11000, bonus: '+10%', isFeatured: false },
];

export function DepositSection() {
  const mutation = useMutation({
    mutationFn: async (brlAmount: number) => {
      // Lógica temporária: simula o ID do pacote a partir do valor (idealmente viria do backend)
      const packageId = `rc-${brlAmount}`;
      return purchaseRiffaCoins(packageId);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Compra iniciada com sucesso!');
      // Aqui pode redirecionar para o checkout, se necessário
    },
    onError: (error: any) => {
      toast.error(`Erro ao iniciar compra: ${error?.response?.data?.message || error.message}`);
    },
  });

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
      <h2 className="font-display text-xl font-bold text-white">Carregar RiffaCoins</h2>
      <p className="mt-1 text-sm text-text-secondary">Escolha um pacote e comece a competir.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <Button
            key={pkg.brlAmount}
            variant="ghost"
            className={`group relative flex flex-col items-start gap-1 border-2 p-4 text-left transition-all duration-300 ${
              pkg.isFeatured ? 'border-tron-cyan shadow-glow-cyan' : 'border-gray-700 hover:border-tron-cyan'
            }`}
            onClick={() => mutation.mutate(pkg.brlAmount)}
            disabled={mutation.isPending}
          >
            {pkg.isFeatured && (
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform">
                <span className="inline-block rounded-full bg-tron-cyan px-3 py-1 text-xs font-semibold uppercase text-black">
                  Popular
                </span>
              </div>
            )}
            <p className="mt-4 text-lg font-bold text-white">R$ {pkg.brlAmount.toFixed(2)}</p>
            <p className="font-display text-3xl font-semibold text-tron-cyan">💎 {pkg.rcAmount.toLocaleString('pt-BR')} RC</p>
            {pkg.bonus && <p className="text-xs font-bold text-tron-green">{pkg.bonus} de bônus</p>}
          </Button>
        ))}
      </div>
    </div>
  );
}
