import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-24 text-center">
      <div className="mx-auto max-w-7xl px-4 sm:py-32">
        <h1
          className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-6xl"
        >
          Conquiste a Próxima Geração de{' '}
          <span className="text-tron-cyan">Recompensas</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
          Na Riffa Games, sua habilidade é o que conta. Participe de torneios, mostre seu
          talento e conquiste os itens mais desejados dos seus jogos favoritos.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {/* ATUALIZAÇÃO AQUI: O link agora aponta para /tournaments */}
          <Link href="/tournaments">
            <Button size="lg" className="bg-tron-green text-black shadow-glow-green hover:bg-green-400">
              Ver Torneios Ativos
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button size="lg" variant="ghost" className="text-text-primary">
              Saber Mais →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}