"use client";

import { TitleViewingPlanner } from "@/features/titles/planner";
import type { TitleDirectoryEntry } from "@/types/title";
import { TitleBulkActions } from "./components/TitleBulkActions";
import { TitleDirectoryCard } from "./components/TitleDirectoryCard";
import { TitleFilters } from "./components/TitleFilters";
import { TitleLibraryToolbar } from "./components/TitleLibraryToolbar";
import { useTitleDirectory } from "./hooks/useTitleDirectory";

export function TitleDirectory({ titles }: { titles: TitleDirectoryEntry[] }) {
  const directory = useTitleDirectory(titles);
  return <>
    <TitleLibraryToolbar directory={directory} />
    <TitleFilters directory={directory} />
    <TitleBulkActions directory={directory} />

    {directory.planning && <>
      <TitleViewingPlanner titles={directory.plannerTitles} onClose={() => directory.setPlanning(false)} />
      <div className="title-plan-selection-actions"><span>SELECCIÓN ACTUAL · {directory.selectedTitles.size}</span><button type="button" onClick={() => directory.setSelectedTitles(new Set(directory.visiblePending.map(({ slug }) => slug)))}>SUSTITUIR POR RESULTADOS PENDIENTES</button><button type="button" onClick={() => directory.setSelectedTitles(new Set())} disabled={!directory.selectedTitles.size}>VACIAR SELECCIÓN</button></div>
    </>}

    <section className={`titles-directory ${directory.viewMode === "CUADRÍCULA" ? "is-grid" : "is-list"}`} aria-label="Archivo de títulos" aria-live="polite">
      {directory.visibleTitles.map((title) => <TitleDirectoryCard
        title={title}
        viewMode={directory.viewMode}
        planning={directory.planning}
        isSelected={directory.selectedTitles.has(title.slug)}
        isWatched={directory.watched.has(title.slug)}
        onToggleSelected={() => directory.togglePlannedTitle(title.slug)}
        onToggleWatched={() => directory.setTitlesWatched([title.slug], !directory.watched.has(title.slug))}
        key={title.slug}
      />)}
      {!directory.visibleTitles.length && <div className="title-directory-empty"><strong>SIN COINCIDENCIAS</strong><p>Prueba otra búsqueda o combinación de filtros.</p><button onClick={directory.resetFilters}>MOSTRAR TODO</button></div>}
    </section>
  </>;
}
