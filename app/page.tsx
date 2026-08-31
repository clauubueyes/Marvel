import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { characters } from "@/lib/characters";
import { MotionEffects } from "@/components/MotionEffects";
import { DoomsdayGuide } from "@/components/DoomsdayGuide";
import { MCUCatalog } from "@/components/MCUCatalog";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { CinematicIntro } from "@/components/CinematicIntro";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <main className="mcu-home" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <CinematicIntro />
    <MotionEffects />
    <GlobalNavigation home context="RUTA MCU · 2026" />

    <section className="doom-hero" id="inicio">
      <div className="doom-hero-image" aria-hidden="true" />
      <div className="doom-hero-grid" aria-hidden="true" />
      <div className="doom-hero-copy">
        <p className="eyebrow"><span /> MARVEL STUDIOS · GUÍA SIN CÓMICS</p>
        <h1>ANTES DE<br/><em>DOOMSDAY</em></h1>
        <p className="doom-deck">Todo lo que el MCU ya te ha contado para entender a Victor von Doom, el multiverso y la colisión que viene.</p>
      <div className="hero-actions"><a className="primary" href="#doom">EMPEZAR DESDE CERO <b>↓</b></a><a className="ghost-action" href="#cronologia">VER TODO EL MCU</a></div>
      </div>
      <div className="doom-hero-fact"><span>OBJETIVO</span><b>06 TÍTULOS</b><p>Una ruta directa. Sin relleno. Solo películas y series del MCU.</p></div>
      <div className="ticker"><span>MULTIVERSO</span><b>✦</b><span>INCURSIONES</span><b>✦</b><span>VARIANTES</span><b>✦</b><span>VICTOR VON DOOM</span></div>
    </section>

    <DoomsdayGuide />
    <MCUCatalog />

    <section className="mcu-characters section" id="personajes">
      <div className="section-backdrop" aria-hidden="true">MCU</div>
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow"><span /> PERSONAJES EN PANTALLA</p><h2>QUIÉN ES<br/><em>QUIÉN</em></h2></div>
        <div className="heading-aside"><b>{String(characters.length).padStart(2, "0")}</b><p>Fichas centradas en su recorrido cinematográfico y televisivo: apariciones, decisiones y relación con el multiverso.</p><span>SOLO CONTINUIDAD MCU</span></div>
      </div>
      <div className="mcu-character-grid">
        {characters.map((character, index) => <a href={`/personajes/${character.id}`} className="mcu-character" key={character.id} data-reveal style={{ "--delay": `${index * 60}ms`, "--card-accent": character.color } as React.CSSProperties}>
          <Image src={character.image} alt="" fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 20vw"/><span>0{index + 1} · {character.role}</span><h3>{character.name}</h3><p>{character.alias}</p><b>ABRIR EXPEDIENTE ↗</b>
        </a>)}
      </div>
    </section>

    <footer><a className="brand" href="#inicio"><span>N</span>NEXUS</a><p>GUÍA EDITORIAL DEL MCU · PROYECTO NO OFICIAL</p><Link href="/titulos">ARCHIVO DE TÍTULOS ↗</Link><a href="#inicio">VOLVER ARRIBA ↑</a></footer>
  </main>;
}
