"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { TitleViewingPlanner } from "@/components/TitleViewingPlanner";
import type { MCUContinuity, MCUType } from "@/lib/mcuCatalog";
import { getTitleImage } from "@/lib/titleImages";

export type TitleDirectoryEntry = {
  slug: string; order: number; title: string; period: string; type: MCUType;
  continuity: MCUContinuity; phase: string; event: string; releaseDateISO: string;
  runtime: string; coverage: string; routes: { slug: string; name: string }[];
};

type Props = { titles: TitleDirectoryEntry[] };
type OrderMode = "NARRATIVO" | "ESTRENO";
type SortMode = "ORDEN" | "AÑO" | "NOMBRE" | "RELEVANCIA";
type ProgressFilter = "TODOS" | "PENDIENTES" | "VISTOS";
type ViewMode = "CUADRÍCULA" | "LISTA";

const TITLE_TYPES = ["TODOS", "PELÍCULA", "SERIE", "ESPECIAL", "ONE-SHOT"];
const SAGAS = ["SAGA DEL INFINITO", "SAGA DEL MULTIVERSO", "OTRAS HISTORIAS"];
const CONTINUITIES: MCUContinuity[] = ["SAGA PRINCIPAL", "MARVEL TELEVISION", "MULTIVERSO"];
const progressStorageKey = "nexus:titles:watched";
const progressEvent = "nexus-title-progress";

function getSaga(phase: string) {
  const phaseNumber = Number(phase.match(/\d+/)?.[0]);
  if (phaseNumber >= 1 && phaseNumber <= 3) return "SAGA DEL INFINITO";
  if (phaseNumber >= 4 && phaseNumber <= 6) return "SAGA DEL MULTIVERSO";
  return "OTRAS HISTORIAS";
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

function subscribeProgress(callback: () => void) {
  const handleStorage = (event: StorageEvent) => { if (event.key === progressStorageKey) callback(); };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(progressEvent, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(progressEvent, callback);
  };
}

function progressSnapshot() {
  return window.localStorage.getItem(progressStorageKey) ?? "[]";
}

function parseProgress(value: string, validIds: Set<string>) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string" && validIds.has(id)) : []);
  } catch {
    return new Set<string>();
  }
}

export function TitleDirectory({ titles }: Props) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("TODOS");
  const [phase, setPhase] = useState("TODAS");
  const [saga, setSaga] = useState("TODAS");
  const [continuity, setContinuity] = useState("TODAS");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("TODOS");
  const [orderMode, setOrderMode] = useState<OrderMode>("NARRATIVO");
  const [sortMode, setSortMode] = useState<SortMode>("ORDEN");
  const [viewMode, setViewMode] = useState<ViewMode>("CUADRÍCULA");
  const [planning, setPlanning] = useState(false);
  const [selectedTitles, setSelectedTitles] = useState<Set<string>>(() => new Set());
  const validIds = useMemo(() => new Set(titles.map(({ slug }) => slug)), [titles]);
  const subscribe = useCallback((callback: () => void) => subscribeProgress(callback), []);
  const storedProgress = useSyncExternalStore(subscribe, progressSnapshot, () => "[]");
  const watched = parseProgress(storedProgress, validIds);
  const phases = useMemo(() => [...new Set(titles.map((title) => title.phase))].sort(), [titles]);

  const visibleTitles = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return titles.filter((title) => {
      const matchesQuery = !normalizedQuery || normalize(`${title.title} ${title.event} ${title.phase} ${title.period}`).includes(normalizedQuery);
      const matchesProgress = progressFilter === "TODOS" || (progressFilter === "VISTOS" ? watched.has(title.slug) : !watched.has(title.slug));
      return matchesQuery && (type === "TODOS" || title.type === type) && (phase === "TODAS" || title.phase === phase)
        && (saga === "TODAS" || getSaga(title.phase) === saga) && (continuity === "TODAS" || title.continuity === continuity) && matchesProgress;
    }).sort((left, right) => {
      if (sortMode === "NOMBRE") return left.title.localeCompare(right.title, "es");
      if (sortMode === "RELEVANCIA") return right.routes.length - left.routes.length || left.order - right.order;
      if (sortMode === "AÑO" || orderMode === "ESTRENO") return left.releaseDateISO.localeCompare(right.releaseDateISO) || left.order - right.order;
      return left.order - right.order;
    });
  }, [continuity, orderMode, phase, progressFilter, query, saga, sortMode, titles, type, watched]);

  const pendingTitles = useMemo(() => titles.filter((title) => !watched.has(title.slug) && title.coverage !== "TÍTULO ANUNCIADO" && title.type !== "ONE-SHOT" && !/CORTOS/i.test(title.runtime)), [titles, watched]);
  const visiblePending = useMemo(() => visibleTitles.filter((title) => !watched.has(title.slug) && title.coverage !== "TÍTULO ANUNCIADO" && title.type !== "ONE-SHOT" && !/CORTOS/i.test(title.runtime)), [visibleTitles, watched]);
  const plannerTitles = useMemo(() => titles.filter((title) => selectedTitles.has(title.slug)).map((title) => ({ id: title.slug, title: title.title, url: `/titulos/${title.slug}`, runtime: title.runtime, type: title.type })), [selectedTitles, titles]);

  function persistWatched(next: Set<string>) {
    window.localStorage.setItem(progressStorageKey, JSON.stringify([...next]));
    window.dispatchEvent(new Event(progressEvent));
  }

  function setTitlesWatched(slugs: string[], isWatched: boolean) {
    const next = parseProgress(progressSnapshot(), validIds);
    slugs.forEach((slug) => isWatched ? next.add(slug) : next.delete(slug));
    persistWatched(next);
  }

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

  return <>
    <section className="title-library-toolbar" aria-label="Gestión de la biblioteca">
      <label className="title-search"><span>BUSCAR EN EL ARCHIVO</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título, acontecimiento, año…" /></label>
      <div className="title-library-progress"><strong>{watched.size}<small>/ {titles.length}</small></strong><span>VISTOS</span><i><b style={{ width: `${Math.round(watched.size / titles.length * 100)}%` }} /></i></div>
      <button className="title-primary-plan" type="button" onClick={() => selectForPlan(pendingTitles)}>PLANIFICAR TODO LO PENDIENTE <b>{pendingTitles.length}</b></button>
    </section>

    <section className="title-filters" aria-label="Filtros del catálogo de títulos">
      <div className="title-filter-types"><span>FORMATO</span>{TITLE_TYPES.map((value) => <button key={value} className={type === value ? "active" : ""} onClick={() => setType(value)}>{value}</button>)}</div>
      <p className="title-result-count"><strong>{visibleTitles.length}</strong><span>RESULTADOS</span></p>
      <div className="title-view-switch" aria-label="Presentación del catálogo"><button className={viewMode === "CUADRÍCULA" ? "active" : ""} onClick={() => setViewMode("CUADRÍCULA")} aria-pressed={viewMode === "CUADRÍCULA"}>▦ CUADRÍCULA</button><button className={viewMode === "LISTA" ? "active" : ""} onClick={() => setViewMode("LISTA")} aria-pressed={viewMode === "LISTA"}>☰ LISTA</button></div>
      <details className="title-advanced-filters">
        <summary>FILTROS AVANZADOS <b>+</b></summary>
        <div>
          <label><span>FASE</span><select value={phase} onChange={(event) => setPhase(event.target.value)}><option>TODAS</option>{phases.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span>SAGA</span><select value={saga} onChange={(event) => setSaga(event.target.value)}><option>TODAS</option>{SAGAS.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span>CONTINUIDAD</span><select value={continuity} onChange={(event) => setContinuity(event.target.value)}><option>TODAS</option>{CONTINUITIES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label><span>ESTADO</span><select value={progressFilter} onChange={(event) => setProgressFilter(event.target.value as ProgressFilter)}><option>TODOS</option><option>PENDIENTES</option><option>VISTOS</option></select></label>
          <label><span>ORDEN</span><select value={orderMode} onChange={(event) => setOrderMode(event.target.value as OrderMode)}><option>NARRATIVO</option><option>ESTRENO</option></select></label>
          <label><span>ORDENAR POR</span><select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}><option value="ORDEN">ORDEN ACTUAL</option><option value="AÑO">AÑO DE ESTRENO</option><option value="NOMBRE">NOMBRE</option><option value="RELEVANCIA">RELEVANCIA EN RUTAS</option></select></label>
          <button className="filter-reset" onClick={resetFilters}>RESTABLECER FILTROS</button>
        </div>
      </details>
    </section>

    <section className="title-bulk-actions" aria-label="Acciones sobre los resultados">
      <p><strong>{visibleTitles.length}</strong> títulos en esta vista · <b>{visiblePending.length}</b> pendientes</p>
      <div><button type="button" onClick={() => selectForPlan(visiblePending)} disabled={!visiblePending.length}>PLANIFICAR ESTOS RESULTADOS</button><button type="button" onClick={() => setTitlesWatched(visibleTitles.map(({ slug }) => slug), true)} disabled={!visibleTitles.length}>MARCAR RESULTADOS COMO VISTOS</button><button type="button" onClick={() => setTitlesWatched(visibleTitles.map(({ slug }) => slug), false)} disabled={!visibleTitles.length}>MARCAR COMO PENDIENTES</button><button type="button" onClick={() => setPlanning((value) => !value)}>{planning ? "CERRAR PLAN" : `SELECCIÓN MANUAL · ${selectedTitles.size}`}</button></div>
    </section>

    {planning && <><TitleViewingPlanner titles={plannerTitles} onClose={() => setPlanning(false)} /><div className="title-plan-selection-actions"><span>SELECCIÓN ACTUAL · {selectedTitles.size}</span><button type="button" onClick={() => setSelectedTitles(new Set(visiblePending.map(({ slug }) => slug)))}>SUSTITUIR POR RESULTADOS PENDIENTES</button><button type="button" onClick={() => setSelectedTitles(new Set())} disabled={!selectedTitles.size}>VACIAR SELECCIÓN</button></div></>}

    <section className={`titles-directory ${viewMode === "CUADRÍCULA" ? "is-grid" : "is-list"}`} aria-label="Archivo de títulos" aria-live="polite">
      {visibleTitles.map((title) => {
        const isWatched = watched.has(title.slug);
        const isSelected = selectedTitles.has(title.slug);
        return <div className={`title-directory-row ${planning ? "is-planning" : ""} ${isSelected ? "is-selected" : ""} ${isWatched ? "is-watched" : ""}`} key={title.slug}>
          <Link className="title-directory-card" href={`/titulos/${title.slug}`} data-reveal>
            <div className="title-card-art"><Image src={getTitleImage(title.slug)} alt={`Cartel de ${title.title}`} fill sizes={viewMode === "CUADRÍCULA" ? "(max-width: 700px) 90vw, (max-width: 1200px) 45vw, 30vw" : "180px"} /><span>{isWatched ? "✓" : String(title.order).padStart(2, "0")}</span><small>{title.type}</small></div>
            <div className="title-card-copy"><small>{title.period} · {title.coverage}</small><h2>{title.title}</h2><p>{title.event}</p>{title.routes.length > 0 && <div className="title-route-tags" aria-label="Recorridos relacionados">{title.routes.map((route) => <b key={route.slug}>{route.name}</b>)}</div>}</div>
            <aside><b>{title.phase}</b><small>{getSaga(title.phase)}</small><small>{title.continuity}</small><small>{title.releaseDateISO.slice(0, 4)}</small></aside><i>↗</i>
          </Link>
          <div className="title-card-actions">
            <button type="button" className="title-watch-toggle" onClick={() => setTitlesWatched([title.slug], !isWatched)} aria-pressed={isWatched}>{isWatched ? "✓ VISTO" : "MARCAR VISTO"}</button>
            {planning && <button type="button" className="title-plan-select" onClick={() => togglePlannedTitle(title.slug)} aria-pressed={isSelected}><span>{isSelected ? "✓" : "+"}</span>{isSelected ? "EN EL PLAN" : "AÑADIR AL PLAN"}</button>}
          </div>
        </div>;
      })}
      {!visibleTitles.length && <div className="title-directory-empty"><strong>SIN COINCIDENCIAS</strong><p>Prueba otra búsqueda o combinación de filtros.</p><button onClick={resetFilters}>MOSTRAR TODO</button></div>}
    </section>
  </>;
}
