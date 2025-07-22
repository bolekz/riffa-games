import axios from 'axios';
import { useUserStore } from '@/store/userStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ===================== TIPAGEM =====================
export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  email: string;
  role: 'USER' | 'ADMIN';
  riffaCoinsAvailable: number;
  riffaCoinsPending?: number;
  kycStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  steamId?: string;
  subscription?: {
    plan: 'RECRUTA' | 'PRATA' | 'OURO' | 'GLOBAL';
    status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE';
  } | null;
  cpf?: string | null;
  whatsapp?: string | null;
  tradeUrl?: string | null;
}

export interface AuthResponse {
  user: UserProfile;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RiffaPackage {
  brlAmount: number;
  rcAmount: number;
  bonus?: string;
  isFeatured: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  entryFeeRC: number;
  isUserRegistered: boolean;
  prizes: {
    id: string;
    rank: number;
    item: { name: string; imageUrl: string };
  }[];
  scores: { user: { id: string; nickname: string }; score: number }[];
  game: { name: string };
}

export interface PrizeClaim {
  id: string;
  tournamentPrize: {
    rank: number;
    item: { name: string; imageUrl: string };
    tournament: { name: string };
  };
}

export interface Promotion {
  id: string;
  code: string;
  type: 'DEPOSIT_BONUS' | 'TICKET_DISCOUNT';
  discountPercentage?: number;
  rcBonusAmount?: number;
  validUntil: string;
  maxUses: number;
  currentUses: number;
}

export interface WithdrawalRequest {
  id: string;
  amountRC: number;
  createdAt: string;
  user: { id: string; email: string; nickname: string; cpf?: string | null };
}

// ===================== FUNÇÕES =====================
export const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return data;
};

export const register = async (payload: {
  name: string;
  nickname: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> => {
  const { password_confirmation, ...registerData } = payload;
  const { data } = await apiClient.post<AuthResponse>('/users/register', registerData);
  return data;
};

export const getSteamAuthUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_URL || apiClient.defaults.baseURL;
  return `${base}/auth/steam`;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>('/users/me');
  return data;
};

export const updateUserProfile = async (
  updates: Partial<Pick<UserProfile, 'name' | 'cpf' | 'whatsapp' | 'tradeUrl'>>,
): Promise<UserProfile> => {
  const { data } = await apiClient.put<UserProfile>('/users/me', updates);
  return data;
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post('/users/password-reset', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await apiClient.post('/users/password-reset/confirm', {
    token,
    password: newPassword,
  });
};

export const fetchRiffaCoinsPackages = async (): Promise<RiffaPackage[]> => {
  const { data } = await apiClient.get<RiffaPackage[]>('/riffa-coins/packages');
  return data;
};

export const purchaseRiffaCoins = async (packageId: string): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.post<{ success: boolean; message?: string }>('/riffa-coins/purchase', { packageId });
  return data;
};

export const fetchActiveTournaments = async (
  { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {},
): Promise<{ data: Tournament[]; total: number }> => {
  const { data } = await apiClient.get<{ data: Tournament[]; total: number }>('/tournaments', {
    params: { page, pageSize, status: 'SELLING' },
  });
  return data;
};

export const fetchTournamentDetails = async (id: string): Promise<Tournament> => {
  const { data } = await apiClient.get<Tournament>(`/tournaments/${id}`);
  return data;
};

export const createTournament = async (
  payload: Partial<Omit<Tournament, 'id' | 'isUserRegistered' | 'prizes' | 'scores' | 'game'>>,
): Promise<Tournament> => {
  const { data } = await apiClient.post<Tournament>('/tournaments', payload);
  return data;
};

export const joinTournament = async (
  params: { tournamentId: string; promoCode?: string },
): Promise<{ success: boolean; remainingBalance: number }> => {
  const { data } = await apiClient.post(`/tournaments/${params.tournamentId}/join`, {
    promoCode: params.promoCode,
  });
  return data;
};

export const submitScore = async (
  tournamentId: string,
  score: number,
): Promise<{ success: boolean; bestScore: number }> => {
  const { data } = await apiClient.patch(`/tournaments/${tournamentId}/score`, { score });
  return data;
};

export const fetchUserTournaments = async (
  { page = 1, pageSize = 10 }: { page?: number; pageSize?: number },
): Promise<{ data: Tournament[]; total: number }> => {
  const { data } = await apiClient.get('/users/me/tournaments', {
    params: { page, pageSize },
  });
  return data;
};

export const fetchMyPrizeClaims = async (): Promise<PrizeClaim[]> => {
  const { data } = await apiClient.get('/users/me/claims');
  return data;
};

export const claimPrize = async (params: { claimId: string; choice: 'ITEM' | 'CONVERT_TO_RC' | 'RE_RIFF' }): Promise<void> => {
  await apiClient.patch(`/prizes/${params.claimId}/claim`, { option: params.choice });
};

export const fetchActivePromotions = async (): Promise<Promotion[]> => {
  const { data } = await apiClient.get('/promotions');
  return data;
};

export const requestWithdrawal = async (amountRC: number): Promise<void> => {
  await apiClient.post('/users/me/withdraw', { amount: amountRC });
};

export const fetchPendingWithdrawals = async (): Promise<{ data: WithdrawalRequest[]; total: number }> => {
  const { data } = await apiClient.get('/admin/withdrawals/pending');
  return data;
};

export const updateWithdrawalStatus = async (params: { transactionId: string; status: 'COMPLETED' | 'FAILED'; adminNotes?: string }): Promise<void> => {
  await apiClient.patch(`/admin/withdrawals/${params.transactionId}`, {
    status: params.status,
    adminNotes: params.adminNotes,
  });
};

export const fetchPendingKyc = async (): Promise<{ data: any[]; total: number }> => {
  const { data } = await apiClient.get('/admin/kyc/pending');
  return data;
};

export const updateKycStatus = async (params: { userId: string; status: 'APPROVED' | 'REJECTED' }): Promise<void> => {
  await apiClient.patch(`/admin/kyc/${params.userId}`, { status: params.status });
};

export const adjustUserWallet = async (params: { email: string; amount: number; type: 'CREDIT' | 'DEBIT'; reason: string }): Promise<void> => {
  await apiClient.post('/admin/wallet/adjust', params);
};

export const fetchMyAffiliateCode = async (): Promise<{ code: string }> => {
  const { data } = await apiClient.get('/affiliates/me/code');
  return data;
};

export const fetchMyAffiliateStats = async (): Promise<{ totalReferrals: number; totalCommissionRC: number }> => {
  const { data } = await apiClient.get('/affiliates/me/stats');
  return data;
};

export const fetchMyAffiliateCommissions = async (): Promise<{ data: any[]; total: number }> => {
  const { data } = await apiClient.get('/affiliates/me/commissions');
  return data;
};

export const fetchUserTransactions = async ({ pageParam = 1 }: { pageParam?: number }): Promise<{ data: any[]; total: number }> => {
  const { data } = await apiClient.get('/users/me/transactions', {
    params: { page: pageParam },
  });
  return data;
};

export const fetchAdminDashboardStats = async (): Promise<any> => {
  const { data } = await apiClient.get('/admin/dashboard-stats');
  return data;
};

export const fetchAllAffiliates = async (): Promise<{ data: any[] }> => {
  const { data } = await apiClient.get('/admin/affiliates');
  return data;
};

export const fetchGames = async (): Promise<any[]> => {
  const { data } = await apiClient.get('/games');
  return data;
};

export const fetchMiniGames = async (gameId: string): Promise<any[]> => {
  const { data } = await apiClient.get(`/games/${gameId}/minigames`);
  return data;
};

// ===================== INTERCEPTOR =====================
const setupInterceptors = () => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const { setUser } = useUserStore.getState();
        setUser(null);
        if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login';
        }
      }
      return Promise.reject(error);
    },
  );
};

if (typeof window !== 'undefined') setupInterceptors();
