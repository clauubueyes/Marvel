import type { Metadata } from "next";
import { MotionEffects } from "@/components/common/MotionEffects";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { characters } from "@/repositories/characterRepository";
import { CinematicIntro, DoomsdayGuide, HomeCharacterPreview, HomeFooter, HomeHero, MCUCatalog } from "@/features/home/components";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <main className="mcu-home" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <CinematicIntro />
    <MotionEffects />
    <GlobalNavigation home context="RUTA MCU · 2026" />
    <HomeHero />
    <DoomsdayGuide />
    <MCUCatalog />
    <HomeCharacterPreview characters={characters} />
    <HomeFooter />
  </main>;
}
