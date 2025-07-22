import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { UserProfile } from '@/lib/api';

/**
 * Função auxiliar para buscar os dados do usuário no servidor.
 * Esta função só é executada no lado do servidor (Server Component).
 * @returns UserProfile ou null se não autenticado
 */
async function getUserFromServer(): Promise<UserProfile | null> {
  // Obtém todos os cookies da requisição atual de forma segura.
  const cookieHeader = cookies().toString();
  if (!cookieHeader) {
    return null;
  }

  try {
    // Chama o endpoint protegido da nossa API, passando os cookies da sessão.
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'}/users/me`,
      {
        headers: { Cookie: cookieHeader },
        // Garante que os dados do usuário não fiquem em cache, sendo sempre recentes.
        cache: 'no-store',
      }
    );

    // Se a resposta não for bem-sucedida (ex: 401), a sessão é inválida.
    if (!response.ok) {
      return null;
    }

    const user: UserProfile = await response.json();
    return user;
  } catch (err) {
    console.error('Erro ao buscar usuário no servidor:', err);
    return null;
  }
}

interface AdminLayoutProps {
  children: ReactNode;
}

/**
 * Layout de servidor que protege todas as rotas filhas,
 * garantindo acesso apenas a usuários com role 'ADMIN'.
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Busca os dados do usuário antes de renderizar qualquer parte do layout.
  const user = await getUserFromServer();

  // Se não estiver autenticado ou não tiver a permissão correta, redireciona.
  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  // Se tudo estiver correto, renderiza o conteúdo protegido.
  return <>{children}</>;
}