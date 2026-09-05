"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { mcuCatalog } from "@/data/mcuCatalog";
import type { ViewingRoute } from "@/types/viewingRoute";
import { getTitleImage } from "@/utils/titleImages";
import { useMovieProgress } from "@/hooks/useMovieProgress";
import { ProgressStatus } from "@/features/account/ProgressStatus";

const titleMap = new Map(mcuCatalog.map((title) => [title.slug, title]));
const progressEvent = "nexus-route-progress";

export function ViewingRouteExperience({ route, compact = false }: { route: ViewingRoute; compact?: boolean }) {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [onlyEssential, setOnlyEssential] = useState(false);
  const storageKey = `nexus:route:${route.slug}`;
  const availableSteps = useMemo(() => route.steps.filter(({ priority }) => priority !== "DESTINO"), [route.steps]);
  const availableIds = useMemo(() => new Set(availableSteps.map(({ titleId }) => titleId)), [availableSteps]);
  const { values: completed, toggle: toggleStep, ready } = useMovieProgress({ storageKey, eventName: progressEvent, validIds: availableIds });
  const completion = availableSteps.length ? Math.round((completed.size / availableSteps.length) * 100) : 0;
  const displayedSteps = onlyEssential ? route.steps.filter(({ priority }) => priority === "ESENCIAL" || priority === "DESTINO") : route.steps;

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
      <ProgressStatus />
      <ol className="viewing-route-list">
        {displayedSteps.map((step) => {
          const title = titleMap.get(step.titleId);
          if (!title) return null;
          const isDestination = step.priority === "DESTINO";
          const isComplete = completed.has(step.titleId);
          return <li className={`${isComplete ? "complete" : ""} ${isDestination ? "destination" : ""}`} key={step.titleId} data-reveal>
            <button type="button" className="route-check" disabled={isDestination || !ready} onClick={() => toggleStep(step.titleId)} aria-label={isComplete ? `Marcar ${title.title} como pendiente` : `Marcar ${title.title} como visto`} aria-pressed={isComplete}>{isDestination ? "✦" : isComplete ? "✓" : ""}</button>
            <Link className="route-step-art" href={`/titulos/${title.slug}`}><Image src={getTitleImage(title.slug)} alt="" fill sizes="(max-width: 700px) 80vw, 240px" /></Link>
            <article><div><span>{step.priority}</span><small>{title.period} · {title.type}</small></div><h3><Link href={`/titulos/${title.slug}`}>{title.title}</Link></h3><p>{step.contribution}</p>{showSpoilers && <p className="route-spoiler"><b>SPOILER</b>{step.spoiler}</p>}<Link href={`/titulos/${title.slug}`}>ABRIR EXPEDIENTE ↗</Link></article>
          </li>;
        })}
      </ol>
    </section>
  );
}
