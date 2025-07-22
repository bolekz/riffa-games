// src/app/me/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// A tipagem e o componente de UI são importados.
// O caminho relativo está correto para a sua estrutura de pastas.
import { UserProfile } from '../../../lib/api';
import { ProfileView } from './ProfileView';

/**
 * Função auxiliar que roda APENAS no servidor para buscar os dados do usuário.
 * @returns {Promise<UserProfile | null>} O perfil do usuário ou nulo se não estiver autenticado.
 */
async function getUserFromServer(): Promise<UserProfile | null> {
  const cookieHeader = cookies().toString();
  if (!cookieHeader) return null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'}/users/me`,
      {
        headers: { Cookie: cookieHeader },
        // Garante que os dados da sessão do usuário sejam sempre buscados novamente.
        cache: 'no-store',
      },
    );
    // Se a resposta da API não for bem-sucedida, a sessão é considerada inválida.
    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error('Falha ao buscar usuário no servidor:', error);
    return null;
  }
}

/**
 * Esta é a nossa página de perfil, atuando como um Server Component.
 * A sua única responsabilidade é proteger a rota e buscar os dados iniciais.
 */
export default async function MyProfilePage() {
  // 1. Busca os dados do usuário no servidor ANTES de renderizar a página.
  const user = await getUserFromServer();

  // 2. Se não houver usuário, redireciona para o login de forma segura no servidor.
  if (!user) {
    redirect('/auth/login');
  }

  // 3. Se o usuário for válido, renderiza o componente de UI (Client Component)
  //    e passa os dados do usuário como uma prop.
  return <ProfileView initialUser={user} />;
}