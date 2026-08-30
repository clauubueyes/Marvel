import type { Metadata } from "next";
import Link from "next/link";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { MotionEffects } from "@/components/MotionEffects";
import { mcuCatalog } from "@/lib/mcuCatalog";

export const metadata: Metadata = {
  title: "Películas y series del MCU — NEXUS",
  description: "Archivo cronológico de películas, series, especiales y one-shots del universo audiovisual de Marvel.",
  alternates: { canonical: "/titulos" },
};

export default function TitlesPage() {
  return (
    <main className="titles-index" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
      <MotionEffects />
      <GlobalNavigation context="ARCHIVO / TÍTULOS" />

      <section className="titles-index-hero">
        <p className="eyebrow"><span /> UNIVERSO AUDIOVISUAL MARVEL</p>
        <h1>PELÍCULAS<br />Y <em>SERIES</em></h1>
        <p>Explora el archivo completo y descubre qué sucede en cada título, dónde encaja y qué personajes conecta.</p>
        <div><strong>{String(mcuCatalog.length).padStart(2, "0")}</strong><span>TÍTULOS DOCUMENTADOS</span></div>
      </section>

      <section className="titles-directory" aria-label="Archivo de títulos">
        {mcuCatalog.map((title) => (
          <Link className="title-directory-card" href={`/titulos/${title.slug}`} key={title.slug} data-reveal>
            <span>{String(title.order).padStart(2, "0")}</span>
            <div>
              <small>{title.period} · {title.type}</small>
              <h2>{title.title}</h2>
              <p>{title.event}</p>
            </div>
            <aside><b>{title.phase}</b><small>{title.continuity}</small></aside>
            <i>↗</i>
          </Link>
        ))}
      </section>
    </main>
  );
}
