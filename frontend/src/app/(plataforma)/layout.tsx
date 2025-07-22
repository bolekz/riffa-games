import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

// Função que verifica a sessão no servidor
async function getSession() {
  const token = cookies().get('access_token')?.value;

  // Se não houver token no cookie, a sessão é inválida.
  if (!token) {
    return null;
  }
  
  // Aqui, poderíamos adicionar uma validação extra do token se necessário,
  // mas por enquanto, a presença do cookie é suficiente para a proteção da rota.
  return { isAuthenticated: true };
}

export default async function PlataformaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  // Se a função getSession retornar null (sem token), redireciona para o login.
  // Isso acontece no servidor, antes de renderizar qualquer página.
  if (!session) {
    redirect('/auth/login');
  }

  // Se a sessão for válida, renderiza a página solicitada.
  return <>{children}</>;
}