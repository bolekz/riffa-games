// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Inter, Rajdhani } from 'next/font/google';
import { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
});

export const metadata: Metadata = {
  title: 'Riffa Games',
  description: 'Conquiste a Próxima Geração de Recompensas.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`
          ${inter.variable} ${rajdhani.variable} font-sans antialiased 
          bg-bg-dark text-text-primary flex flex-col min-h-screen
        `}
      >
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
