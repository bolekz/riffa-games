// Caminho: frontend/src/app/me/claims/page.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { toast } from 'sonner';
import { fetchMyPrizeClaims, claimPrize } from '@/lib/api';
import { useUserStore } from '@/store/userStore';
import { Title } from '@/components/atoms/Title';
import { Button } from '@/components/ui/button';

// --- Interfaces ---
interface PrizeItem {
  name: string;
  imageUrl: string;
}
interface Tournament {
  name: string;
}
interface TournamentPrize {
  rank: number;
  item: PrizeItem;
  tournament: Tournament;
}
interface PrizeClaim {
  id: string;
  tournamentPrize: TournamentPrize;
}

// --- Card de Resgate de Prêmio ---
const PrizeClaimCard = ({ claim }: { claim: PrizeClaim }) => {
  const queryClient = useQueryClient();
  const userPlan = useUserStore((state) => state.user?.subscription?.plan);

  const mutation = useMutation({
    mutationFn: claimPrize,
    onSuccess: () => {
      toast.success('Prêmio resgatado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['myPrizeClaims'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || 'Erro ao resgatar prêmio';
      toast.error(msg);
    },
  });

  const handleClaim = (choice: 'ITEM' | 'CONVERT_TO_RC' | 'RE_RIFF') => {
    mutation.mutate({ claimId: claim.id, choice });
  };

  const prizeItem = claim.tournamentPrize.item;

  return (
    <div className="tron-border-animated green rounded-lg p-1">
      <div className="flex h-full flex-col gap-6 rounded-lg bg-tron-gray-dark/50 p-4 md:flex-row md:items-center">
        <div className="relative h-32 w-full flex-shrink-0 md:h-32 md:w-32">
          {prizeItem?.imageUrl ? (
            <Image
              src={prizeItem.imageUrl}
              alt={prizeItem.name}
              fill
              className="rounded-md object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-700 text-sm text-white">
              Sem imagem
            </div>
          )}
        </div>

        <div className="flex-grow text-center md:text-left">
          <p className="text-xs text-tron-gray-light">
            Você venceu no torneio: "{claim.tournamentPrize.tournament.name}"
          </p>
          <h3 className="font-display mt-1 text-xl font-bold text-white">
            {prizeItem.name}
          </h3>
          <p className="text-sm text-yellow-400">
            Rank: {claim.tournamentPrize.rank}º Lugar
          </p>
        </div>

        <div className="flex w-full flex-shrink-0 flex-col gap-2 md:w-auto">
          <Button
            onClick={() => handleClaim('ITEM')}
            disabled={mutation.isPending}
            className="bg-tron-green text-black shadow-glow-green"
          >
            Resgatar Item
          </Button>
          {userPlan && ['OURO', 'GLOBAL'].includes(userPlan) && (
            <Button
              onClick={() => handleClaim('CONVERT_TO_RC')}
              disabled={mutation.isPending}
              className="bg-tron-cyan text-black shadow-glow-cyan"
            >
              Converter em RC
            </Button>
          )}
          {userPlan === 'GLOBAL' && (
            <Button
              onClick={() => handleClaim('RE_RIFF')}
              disabled={mutation.isPending}
              className="bg-purple-600 hover:bg-purple-500"
            >
              Criar Novo Torneio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Página Principal ---
export default function MyClaimsPage() {
  const {
    data: claims,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['myPrizeClaims'],
    queryFn: fetchMyPrizeClaims,
  });

  if (isLoading)
    return <div className="p-10 text-center">Carregando seus prêmios...</div>;

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Não foi possível buscar seus prêmios.
      </div>
    );

  return (
    <div className="container mx-auto space-y-8 px-4 py-12">
      <div>
        <Title>Meus Prêmios</Title>
        <p className="mt-2 text-tron-gray-light">
          Aqui estão todas as suas conquistas pendentes. Resgate-as como preferir!
        </p>
      </div>

      {claims && claims.length > 0 ? (
        <div className="space-y-6">
          {claims.map((claim) => (
            <PrizeClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-tron-gray-dark/40 p-10 text-center">
          <p className="text-tron-gray-light">
            Você não tem prêmios pendentes no momento.
          </p>
          <p className="mt-2 text-gray-500">
            Continue competindo para encher sua galeria de troféus!
          </p>
        </div>
      )}
    </div>
  );
}
