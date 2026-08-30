"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { mcuCatalog } from "@/lib/mcuCatalog";
import type { ViewingRoute } from "@/lib/viewingRoutes";

const titleMap = new Map(mcuCatalog.map((title) => [title.slug, title]));
const progressEvent = "nexus-route-progress";

function subscribeProgress(storageKey: string, callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) callback();
  };
  const handleProgress = (event: Event) => {
    if (event instanceof CustomEvent && event.detail === storageKey) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(progressEvent, handleProgress);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(progressEvent, handleProgress);
  };
}

function progressSnapshot(storageKey: string) {
  return window.localStorage.getItem(storageKey) ?? "[]";
}

function parseProgress(value: string, validIds: Set<string>) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string" && validIds.has(id)) : []);
  } catch {
    return new Set<string>();
  }
}

export function ViewingRouteExperience({ route, compact = false }: { route: ViewingRoute; compact?: boolean }) {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [onlyEssential, setOnlyEssential] = useState(false);
  const storageKey = `nexus:route:${route.slug}`;
  const subscribe = useCallback((callback: () => void) => subscribeProgress(storageKey, callback), [storageKey]);
  const getSnapshot = useCallback(() => progressSnapshot(storageKey), [storageKey]);
  const storedProgress = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const availableSteps = useMemo(() => route.steps.filter(({ priority }) => priority !== "DESTINO"), [route.steps]);
  const availableIds = useMemo(() => new Set(availableSteps.map(({ titleId }) => titleId)), [availableSteps]);
  const completed = parseProgress(storedProgress, availableIds);
  const completion = availableSteps.length ? Math.round((completed.size / availableSteps.length) * 100) : 0;
  const displayedSteps = onlyEssential ? route.steps.filter(({ priority }) => priority === "ESENCIAL" || priority === "DESTINO") : route.steps;

  function toggleStep(titleId: string) {
    // Read the persisted value at click time so a fast second interaction or a
    // change from another mounted route view cannot restore stale progress.
    const next = parseProgress(progressSnapshot(storageKey), availableIds);
    if (next.has(titleId)) next.delete(titleId);
    else next.add(titleId);
    window.localStorage.setItem(storageKey, JSON.stringify([...next]));
    window.dispatchEvent(new CustomEvent(progressEvent, { detail: storageKey }));
  }

  return (
    <section className={compact ? "viewing-route viewing-route-compact" : "viewing-route"} style={{ "--route-accent": route.accent } as React.CSSProperties}>
      <header className="viewing-route-header" data-reveal>
        <div><p className="eyebrow"><span /> {route.kicker}</p><h2>{route.name}</h2><p>{route.description}</p></div>
        <aside><strong>{completion}%</strong><span>COMPLETADO</span><div><i style={{ width: `${completion}%` }} /></div></aside>
      </header>
      <div className="viewing-route-controls">
        <div><button type="button" className={!onlyEssential ? "active" : ""} onClick={() => setOnlyEssential(false)}>RUTA COMPLETA</button><button type="button" className={onlyEssential ? "active" : ""} onClick={() => setOnlyEssential(true)}>SOLO ESENCIAL</button></div>
        <button type="button" className={showSpoilers ? "active" : ""} onClick={() => setShowSpoilers((visible) => !visible)} aria-pressed={showSpoilers}>{showSpoilers ? "OCULTAR SPOILERS" : "MOSTRAR SPOILERS"}</button>
      </div>
      <ol className="viewing-route-list">
        {displayedSteps.map((step) => {
          const title = titleMap.get(step.titleId);
          if (!title) return null;
          const isDestination = step.priority === "DESTINO";
          const isComplete = completed.has(step.titleId);
          return <li className={`${isComplete ? "complete" : ""} ${isDestination ? "destination" : ""}`} key={step.titleId} data-reveal>
            <button type="button" className="route-check" disabled={isDestination} onClick={() => toggleStep(step.titleId)} aria-label={isComplete ? `Marcar ${title.title} como pendiente` : `Marcar ${title.title} como visto`} aria-pressed={isComplete}>{isDestination ? "✦" : isComplete ? "✓" : ""}</button>
            <Link className="route-step-art" href={`/titulos/${title.slug}`}><Image src={`/api/title-image?title=${encodeURIComponent(title.title)}&type=${encodeURIComponent(title.type)}`} alt="" fill sizes="(max-width: 700px) 80vw, 240px" /></Link>
            <article><div><span>{step.priority}</span><small>{title.period} · {title.type}</small></div><h3><Link href={`/titulos/${title.slug}`}>{title.title}</Link></h3><p>{step.contribution}</p>{showSpoilers && <p className="route-spoiler"><b>SPOILER</b>{step.spoiler}</p>}<Link href={`/titulos/${title.slug}`}>ABRIR EXPEDIENTE ↗</Link></article>
          </li>;
        })}
      </ol>
    </section>
  );
}
