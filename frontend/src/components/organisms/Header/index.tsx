'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// CORREÇÃO: Usando aliases de caminho (@/) para importações robustas.
// O alias '@/' aponta diretamente para a pasta 'src', tornando os imports mais limpos
// e independentes da localização do ficheiro atual.
import { useUser } from '@/hooks/useUser';
import { logout } from '@/lib/api';
import { Logo } from '@/components/atoms/Logo';
import { Button } from '@/components/ui/button';

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user, clearUser } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Falha ao fazer logout no servidor:', error);
    } finally {
      clearUser();
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-bg-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="block">
          <Logo className="h-8 w-auto" />
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium text-text-primary hover:text-tron-cyan focus:outline-none">
                Olá,&nbsp;
                <span className="font-bold text-tron-cyan">{user.nickname}</span>
                <span className="ml-2 text-tron-green">💎 {Number(user.riffaCoinsAvailable ?? 0).toLocaleString('pt-BR')}</span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-700 rounded-md bg-bg-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/me"
                          className={`${active ? 'bg-gray-700 text-white' : 'text-gray-300'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Meu Perfil
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`group flex w-full items-center rounded-md px-2 py-2 text-sm ${active ? 'bg-red-800 text-white' : 'text-red-400'}`}
                        >
                          Sair
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => router.push('/auth/login')}
                className="text-text-primary hover:text-tron-cyan"
              >
                Entrar
              </Button>
              <Button onClick={() => router.push('/auth/register')} className="bg-tron-cyan text-black hover:bg-cyan-300">
                Criar Conta
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}