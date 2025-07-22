import { HeroSection } from "@/components/features/HeroSection";
import { HowItWorksSection } from "@/components/features/HowItWorksSection";
import { ActiveGamesSection } from "@/components/features/ActiveGamesSection";
import { RiffaCoinsSection } from "@/components/features/RiffaCoinsSection";
import { FeaturedTournamentsSection } from "@/components/features/FeaturedTournamentsSection";

export default function HomePage() {
  return (
    <main className="flex flex-col bg-bg-dark text-text-primary">
      {/* Seção Principal (Hero) */}
      <HeroSection />

      {/* Seção Como Funciona */}
      <HowItWorksSection />

      {/* Seção de Jogos Ativos */}
      <ActiveGamesSection />

      {/* Seção de RiffaCoins */}
      <RiffaCoinsSection />

      {/* Seção de Torneios em Destaque */}
      <FeaturedTournamentsSection />
    </main>
  );
}