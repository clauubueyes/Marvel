import type { Metadata } from "next";
import Link from "next/link";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { MotionEffects } from "@/components/MotionEffects";
import { characters } from "@/lib/characters";
import { CharacterDirectory } from "@/components/CharacterDirectory";

export const metadata: Metadata = {
  title: "Personajes del MCU — NEXUS",
  description: "Expedientes de héroes, villanos y figuras esenciales del universo cinematográfico de Marvel.",
  alternates: { canonical: "/personajes" },
};

export default function CharactersPage() {
  return <main className="characters-index" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <MotionEffects />
    <GlobalNavigation context={`${String(characters.length).padStart(2, "0")} PERSONAJES`} />
    <section className="characters-index-hero">
      <div><p className="eyebrow"><span /> PERSONAJES EN PANTALLA</p><h1>QUIÉN ES<br /><em>QUIÉN</em></h1></div>
      <aside><strong>{String(characters.length).padStart(2, "0")}</strong><p>Expedientes centrados en decisiones, apariciones y conexiones dentro de la continuidad audiovisual.</p><Link href="/buscar">BUSCAR EN TODO NEXUS ↗</Link></aside>
    </section>
    <CharacterDirectory characters={characters} />
  </main>;
}
