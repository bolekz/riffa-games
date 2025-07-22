import Link from 'next/link';
import { Logo } from '@/components/atoms/Logo';

export function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-bg-dark text-text-primary">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <Logo />
            <p className="mt-2 text-sm text-text-secondary">
              © {new Date().getFullYear()} Riffa Games. Todos os direitos reservados.
            </p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-text-secondary">
            {/* Links atualizados para as rotas corretas */}
            <Link href="/how-it-works" className="transition-colors hover:text-tron-cyan">Como Funciona</Link>
            <Link href="/faq" className="transition-colors hover:text-tron-cyan">FAQ</Link>
            <Link href="/terms" className="transition-colors hover:text-tron-cyan">Termos de Uso</Link>
            <Link href="/privacy" className="transition-colors hover:text-tron-cyan">Privacidade</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}