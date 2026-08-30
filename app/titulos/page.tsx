import type { Metadata } from "next";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { MotionEffects } from "@/components/MotionEffects";
import { TitleDirectory, type TitleDirectoryEntry } from "@/components/TitleDirectory";
import { mcuCatalog } from "@/lib/mcuCatalog";
import { getDetailedTitleIds, getEditorialCoverage, getTitleDetails } from "@/lib/content/titles/details";
import { viewingRoutes } from "@/lib/viewingRoutes";

export const metadata: Metadata = {
  title: "Películas y series del MCU — NEXUS",
  description: "Archivo cronológico de películas, series, especiales y one-shots del universo audiovisual de Marvel.",
  alternates: { canonical: "/titulos" },
};

export default function TitlesPage() {
  const titles: TitleDirectoryEntry[] = mcuCatalog.map((title) => ({
    ...title,
    releaseDateISO: getTitleDetails(title.slug)?.releaseDateISO ?? "9999-12-31",
    coverage: getEditorialCoverage(title.slug),
    routes: viewingRoutes.filter(({ steps }) => steps.some(({ titleId }) => titleId === title.slug)).map(({ slug, name }) => ({ slug, name })),
  }));

  return (
    <main className="titles-index" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
      <MotionEffects />
      <GlobalNavigation context="ARCHIVO / TÍTULOS" />

      <section className="titles-index-hero">
        <p className="eyebrow"><span /> UNIVERSO AUDIOVISUAL MARVEL</p>
        <h1>PELÍCULAS<br />Y <em>SERIES</em></h1>
        <p>Explora el archivo completo y descubre qué sucede en cada título, dónde encaja y qué personajes conecta.</p>
        <div><strong>{String(mcuCatalog.length).padStart(2, "0")}</strong><span>TÍTULOS DOCUMENTADOS · {getDetailedTitleIds().length} EXPEDIENTES COMPLETOS O ANUNCIADOS</span></div>
      </section>

      <TitleDirectory titles={titles} />
    </main>
  );
}
