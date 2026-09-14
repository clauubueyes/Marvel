import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { MotionEffects } from "@/components/common/MotionEffects";
import { createPageMetadata } from "@/config/seo";
import { TitleDirectory, type TitleDirectoryEntry } from "@/features/titles/directory";
import type { TitleOrderMode, TitleProgressFilter, TitleSortMode, TitleTypeFilter, TitleViewMode } from "@/constants/titleDirectory";
import { mcuCatalog } from "@/data/mcuCatalog";
import { getDetailedTitleIds, getEditorialCoverage, getTitleDetails } from "@/data/titles";
import { viewingRoutes } from "@/data/viewingRoutes";

export const metadata = createPageMetadata({
  title: "Películas y series del MCU — NEXUS",
  description: "Archivo cronológico de películas, series, especiales y one-shots del universo audiovisual de Marvel.",
  path: "/titulos",
});

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function TitlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const get = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);

  const titles: TitleDirectoryEntry[] = mcuCatalog.map((title) => ({
    ...title,
    releaseDateISO: getTitleDetails(title.slug)?.releaseDateISO ?? "9999-12-31",
    runtime: getTitleDetails(title.slug)?.runtime ?? "POR CONFIRMAR",
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

      <TitleDirectory
        titles={titles}
        initialFilters={{
          query: get("q"),
          type: get("tipo") as TitleTypeFilter | undefined,
          phase: get("fase"),
          saga: get("saga"),
          continuity: get("continuidad"),
          progressFilter: get("estado") as TitleProgressFilter | undefined,
          orderMode: get("orden") as TitleOrderMode | undefined,
          sortMode: get("ordenar") as TitleSortMode | undefined,
          viewMode: get("vista") as TitleViewMode | undefined,
        }}
      />
    </main>
  );
}
