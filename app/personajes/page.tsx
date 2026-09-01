import Link from "next/link";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { MotionEffects } from "@/components/common/MotionEffects";
import { createPageMetadata } from "@/config/seo";
import { characters } from "@/repositories/characterRepository";
import { CharacterDirectory } from "@/features/characters/directory";

export const metadata = createPageMetadata({
  title: "Personajes del MCU — NEXUS",
  description: "Expedientes de héroes, villanos y figuras esenciales del universo cinematográfico de Marvel.",
  path: "/personajes",
});

export default function CharactersPage() {
  return <main className="characters-index" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <MotionEffects />
    <GlobalNavigation context={`${String(characters.length).padStart(2, "0")} PERSONAJES`} />
    <section className="characters-index-hero">
      <div className="characters-hero-scan" aria-hidden="true"><i /><i /><i /></div>
      <div className="characters-hero-title"><p className="eyebrow"><span /> PERSONAJES EN PANTALLA</p><h1><span>QUIÉN ES</span><br /><em>QUIÉN</em></h1></div>
      <aside><strong>{String(characters.length).padStart(2, "0")}</strong><p>Expedientes centrados en decisiones, apariciones y conexiones dentro de la continuidad audiovisual.</p><Link href="/buscar">BUSCAR EN TODO NEXUS ↗</Link></aside>
      <p className="characters-scroll-cue">EXPLORAR ARCHIVO <span>↓</span></p>
    </section>
    <CharacterDirectory characters={characters} />
  </main>;
}
