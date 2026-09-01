import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { MotionEffects } from "@/components/common/MotionEffects";
import { createPageMetadata } from "@/config/seo";
import { SearchExperience } from "@/features/search";

export const metadata = createPageMetadata({
  title: "Buscar en el MCU — NEXUS",
  description: "Busca personajes, películas, series, poderes y acontecimientos conectados del universo audiovisual Marvel.",
  path: "/buscar",
  index: false,
});

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: PageProps) {
  const query = (await searchParams).q ?? "";
  return <main className="search-page" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <MotionEffects />
    <GlobalNavigation context="BUSCADOR GLOBAL" />
    <SearchExperience initialQuery={query} />
  </main>;
}
