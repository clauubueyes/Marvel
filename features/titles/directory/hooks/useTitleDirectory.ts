"use client";

import { useMemo, useState } from "react";
import { TITLE_PROGRESS_EVENT, TITLE_PROGRESS_STORAGE_KEY, type TitleOrderMode, type TitleProgressFilter, type TitleSortMode, type TitleTypeFilter, type TitleViewMode } from "@/constants/titleDirectory";
import { useMovieProgress } from "@/hooks/useMovieProgress";
import type { TitleDirectoryEntry } from "@/types/title";
import { normalizeSearchText } from "@/utils/text";
import { getTitleSaga } from "@/utils/title";

function canPlanTitle(title: TitleDirectoryEntry) {
  return title.coverage !== "TÍTULO ANUNCIADO" && title.type !== "ONE-SHOT" && !/CORTOS/i.test(title.runtime);
}

export function useTitleDirectory(titles: TitleDirectoryEntry[]) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TitleTypeFilter>("TODOS");
  const [phase, setPhase] = useState("TODAS");
  const [saga, setSaga] = useState("TODAS");
  const [continuity, setContinuity] = useState("TODAS");
  const [progressFilter, setProgressFilter] = useState<TitleProgressFilter>("TODOS");
  const [orderMode, setOrderMode] = useState<TitleOrderMode>("NARRATIVO");
  const [sortMode, setSortMode] = useState<TitleSortMode>("ORDEN");
  const [viewMode, setViewMode] = useState<TitleViewMode>("CUADRÍCULA");
  const [planning, setPlanning] = useState(false);
  const [selectedTitles, setSelectedTitles] = useState<Set<string>>(() => new Set());
  const validIds = useMemo(() => new Set(titles.map(({ slug }) => slug)), [titles]);
  const { values: watched, setMany: setTitlesWatched, toggle: toggleTitleWatched, ready: progressReady } = useMovieProgress({ storageKey: TITLE_PROGRESS_STORAGE_KEY, eventName: TITLE_PROGRESS_EVENT, validIds });
  const phases = useMemo(() => [...new Set(titles.map((title) => title.phase))].sort(), [titles]);

  const visibleTitles = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim());
    return titles.filter((title) => {
      const matchesQuery = !normalizedQuery || normalizeSearchText(`${title.title} ${title.event} ${title.phase} ${title.period}`).includes(normalizedQuery);
      const matchesProgress = progressFilter === "TODOS" || (progressFilter === "VISTOS" ? watched.has(title.slug) : !watched.has(title.slug));
      return matchesQuery && (type === "TODOS" || title.type === type) && (phase === "TODAS" || title.phase === phase)
        && (saga === "TODAS" || getTitleSaga(title.phase) === saga) && (continuity === "TODAS" || title.continuity === continuity) && matchesProgress;
    }).sort((left, right) => {
      if (sortMode === "NOMBRE") return left.title.localeCompare(right.title, "es");
      if (sortMode === "RELEVANCIA") return right.routes.length - left.routes.length || left.order - right.order;
      if (sortMode === "AÑO" || orderMode === "ESTRENO") return left.releaseDateISO.localeCompare(right.releaseDateISO) || left.order - right.order;
      return left.order - right.order;
    });
  }, [continuity, orderMode, phase, progressFilter, query, saga, sortMode, titles, type, watched]);

  const pendingTitles = useMemo(() => titles.filter((title) => !watched.has(title.slug) && canPlanTitle(title)), [titles, watched]);
  const visiblePending = useMemo(() => visibleTitles.filter((title) => !watched.has(title.slug) && canPlanTitle(title)), [visibleTitles, watched]);
  const plannerTitles = useMemo(() => titles.filter((title) => selectedTitles.has(title.slug)).map((title) => ({ id: title.slug, title: title.title, url: `/titulos/${title.slug}`, runtime: title.runtime, type: title.type })), [selectedTitles, titles]);

  function togglePlannedTitle(slug: string) {
    setSelectedTitles((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }

  function selectForPlan(entries: TitleDirectoryEntry[]) {
    setSelectedTitles(new Set(entries.filter((title) => !watched.has(title.slug) && title.coverage !== "TÍTULO ANUNCIADO").map(({ slug }) => slug)));
    setPlanning(true);
  }

  function resetFilters() {
    setQuery(""); setType("TODOS"); setPhase("TODAS"); setSaga("TODAS"); setContinuity("TODAS");
    setProgressFilter("TODOS"); setOrderMode("NARRATIVO"); setSortMode("ORDEN");
  }

  return { continuity, orderMode, pendingTitles, phase, phases, plannerTitles, planning, progressFilter, progressReady, query, resetFilters, saga, selectedTitles, selectForPlan, setContinuity, setOrderMode, setPhase, setPlanning, setProgressFilter, setQuery, setSaga, setSelectedTitles, setSortMode, setTitlesWatched, setType, setViewMode, sortMode, titles, togglePlannedTitle, toggleTitleWatched, type, viewMode, visiblePending, visibleTitles, watched };
}
