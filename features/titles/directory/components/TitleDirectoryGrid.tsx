"use client";

import { useEffect, useRef, useState } from "react";
import type { TitleDirectoryEntry } from "@/types/title";
import type { ReturnTypeOfUseTitleDirectory } from "../types";
import { TitleDirectoryCard } from "./TitleDirectoryCard";

const INITIAL_VISIBLE_COUNT = 24;
const VISIBLE_COUNT_STEP = 24;

export function TitleDirectoryGrid({ titles, directory, onToggleWatched }: {
  titles: TitleDirectoryEntry[];
  directory: ReturnTypeOfUseTitleDirectory;
  onToggleWatched: (title: TitleDirectoryEntry) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const loadMoreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (titles.length <= visibleCount) return;
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisibleCount((count) => count + VISIBLE_COUNT_STEP);
      }
    }, { rootMargin: "140px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [titles.length, visibleCount]);

  return <section className={`titles-directory ${directory.viewMode === "CUADRÍCULA" ? "is-grid" : "is-list"}`} aria-label="Archivo de títulos" aria-live="polite">
    {titles.slice(0, visibleCount).map((title) => <TitleDirectoryCard
      title={title}
      viewMode={directory.viewMode}
      planning={directory.planning}
      isSelected={directory.selectedTitles.has(title.slug)}
      isWatched={directory.watched.has(title.slug)}
      progressReady={directory.progressReady}
      onToggleSelected={directory.togglePlannedTitle}
      onToggleWatched={onToggleWatched}
      key={title.slug}
    />)}
    {!titles.length && <div className="title-directory-empty"><strong>SIN COINCIDENCIAS</strong><p>Prueba otra búsqueda o combinación de filtros.</p><button onClick={directory.resetFilters}>MOSTRAR TODO</button></div>}
    {titles.length > visibleCount && <button ref={loadMoreRef} type="button" className="title-load-more" onClick={() => setVisibleCount((count) => count + VISIBLE_COUNT_STEP)}>CARGAR MÁS · <b>{titles.length - visibleCount}</b> RESTANTES</button>}
  </section>;
}