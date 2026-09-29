import { EditorialShell } from "@/components/layout/EditorialShell";
import { createPageMetadata } from "@/config/seo";
import { SearchExperience } from "@/features/search";

export const metadata = createPageMetadata({
  title: "Buscar en el MCU — NEXUS",
  description:
    "Busca personajes, películas, series, poderes y acontecimientos conectados del universo audiovisual Marvel.",
  path: "/buscar",
  index: false,
});

type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: PageProps) {
  const query = (await searchParams).q ?? "";
  return (
    <EditorialShell className="search-page" context="BUSCADOR GLOBAL">
      <SearchExperience initialQuery={query} />
    </EditorialShell>
  );
}
