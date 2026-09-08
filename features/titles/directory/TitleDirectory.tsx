"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TitleViewingPlanner } from "@/features/titles/planner";
import type { TitleDirectoryEntry } from "@/types/title";
import { TitleBackToTop } from "./components/TitleBackToTop";
import { TitleBulkActions } from "./components/TitleBulkActions";
import { TitleDirectoryGrid } from "./components/TitleDirectoryGrid";
import { TitleFilters } from "./components/TitleFilters";
import { TitleLibraryToolbar } from "./components/TitleLibraryToolbar";
import { useTitleDirectory, type TitleDirectoryInitialFilters } from "./hooks/useTitleDirectory";
import { trackTitleMarkedWatched } from "@/services/analytics";
import { ProgressStatus } from "@/features/account/ProgressStatus";

const TOAST_DISMISS_MS = 5000;

export function TitleDirectory({ titles, initialFilters }: { titles: TitleDirectoryEntry[]; initialFilters?: TitleDirectoryInitialFilters }) {
  const directory = useTitleDirectory(titles, initialFilters);
  const [undoInfo, setUndoInfo] = useState<{ slug: string; title: string } | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);
  const directoryRef = useRef(directory);
  const undoInfoRef = useRef(undoInfo);
  const filterKey = `${directory.query}|${directory.type}|${directory.phase}|${directory.saga}|${directory.continuity}|${directory.progressFilter}|${directory.sortMode}|${directory.viewMode}`;

  useEffect(() => {
    directoryRef.current = directory;
    undoInfoRef.current = undoInfo;
  });

  const handleToggleWatched = useCallback((title: TitleDirectoryEntry) => {
    const current = directoryRef.current;
    const watched = current.watched.has(title.slug);
    current.toggleTitleWatched(title.slug);
    if (!watched) {
      trackTitleMarkedWatched(title.slug, title.title);
      window.clearTimeout(undoTimer.current);
      setUndoInfo({ slug: title.slug, title: title.title });
      undoTimer.current = window.setTimeout(() => setUndoInfo(null), TOAST_DISMISS_MS);
    } else if (undoInfoRef.current?.slug === title.slug) {
      setUndoInfo(null);
    }
  }, []);

  useEffect(() => () => window.clearTimeout(undoTimer.current), []);

  function handleUndo() {
    if (!undoInfo) return;
    directory.toggleTitleWatched(undoInfo.slug);
    window.clearTimeout(undoTimer.current);
    setUndoInfo(null);
  }

  return <>
    <ProgressStatus />
    <TitleLibraryToolbar directory={directory} />
    <TitleFilters directory={directory} />
    <TitleBulkActions directory={directory} />

    {directory.planning && <>
      <TitleViewingPlanner titles={directory.plannerTitles} onClose={() => directory.setPlanning(false)} />
      <div className="title-plan-selection-actions"><span>SELECCIÓN ACTUAL · {directory.selectedTitles.size}</span><button type="button" onClick={() => directory.setSelectedTitles(new Set(directory.visiblePending.map(({ slug }) => slug)))}>SUSTITUIR POR RESULTADOS PENDIENTES</button><button type="button" onClick={() => directory.setSelectedTitles(new Set())} disabled={!directory.selectedTitles.size}>VACIAR SELECCIÓN</button></div>
    </>}

    <TitleDirectoryGrid key={filterKey} titles={directory.visibleTitles} directory={directory} onToggleWatched={handleToggleWatched} />

    {undoInfo && <div className="title-toast" role="status"><span>✓ MARCADO COMO VISTO — <b>{undoInfo.title}</b></span><button type="button" onClick={handleUndo}>DESHACER</button></div>}

    <TitleBackToTop />
  </>;
}