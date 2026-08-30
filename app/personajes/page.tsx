import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { MotionEffects } from "@/components/MotionEffects";
import { characters } from "@/lib/characters";

export const metadata: Metadata = {
  title: "Personajes del MCU — NEXUS",
  description: "Expedientes de héroes, villanos y figuras esenciales del universo cinematográfico de Marvel.",
};

export default function CharactersPage() {
  return <main className="characters-index" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <MotionEffects />
    <GlobalNavigation context={`${String(characters.length).padStart(2, "0")} PERSONAJES`} />
    <section className="characters-index-hero">
      <div><p className="eyebrow"><span /> PERSONAJES EN PANTALLA</p><h1>QUIÉN ES<br /><em>QUIÉN</em></h1></div>
      <aside><strong>{String(characters.length).padStart(2, "0")}</strong><p>Expedientes centrados en decisiones, apariciones y conexiones dentro de la continuidad audiovisual.</p><Link href="/buscar">BUSCAR EN TODO NEXUS ↗</Link></aside>
    </section>
    <section className="characters-directory" aria-label="Catálogo de personajes">
      {characters.map((character, index) => (
        <Link href={`/personajes/${character.id}`} className="character-directory-card" key={character.id} data-reveal style={{ "--card-accent": character.color, "--delay": `${index * 55}ms` } as React.CSSProperties}>
          <Image src={character.image} alt="" fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 33vw" unoptimized />
          <span>{character.number} · {character.role}</span><h2>{character.name}</h2><p>{character.alias}</p><b>ABRIR EXPEDIENTE ↗</b>
        </Link>
      ))}
    </section>
  </main>;
}
