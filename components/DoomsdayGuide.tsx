"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { doomEvents } from "@/lib/doomsday";

const RELEASE = new Date("2026-12-18T00:00:00");

export function DoomsdayGuide() {
  const [days, setDays] = useState<number | null>(null);
  const [filter, setFilter] = useState<"TODO" | "IMPRESCINDIBLE">("TODO");
  useEffect(() => {
    const update = () => setDays(Math.max(0, Math.ceil((RELEASE.getTime() - Date.now()) / 86_400_000)));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const visibleEvents = useMemo(() => filter === "TODO" ? doomEvents : doomEvents.filter(({ status }) => status !== "AMPLÍA"), [filter]);

  return <>
    <section className="doom-primer section" id="doom">
      <div className="section-backdrop" aria-hidden="true">DOOM</div>
      <div className="primer-heading" data-reveal><p className="eyebrow"><span /> ARCHIVO CERO · SIN CÓMICS</p><h2>ENTENDER A<br/><em>DOOM</em></h2></div>
      <div className="primer-copy" data-reveal>
        <p className="primer-lead">No necesitas conocer décadas de viñetas. Para llegar preparado basta con entender tres ideas que el MCU ya ha puesto sobre la mesa.</p>
        <div className="primer-grid">
          <article><b>01</b><h3>El multiverso</h3><p>Son realidades completas, cada una con sus propias versiones de personas y acontecimientos.</p></article>
          <article><b>02</b><h3>Las incursiones</h3><p>Cuando dos universos interfieren demasiado, pueden colisionar. Es el mayor riesgo establecido hasta ahora.</p></article>
          <article><b>03</b><h3>Victor von Doom</h3><p>Es la amenaza confirmada. Su historia concreta en el MCU sigue bajo secreto; aquí separamos hechos de teorías.</p></article>
        </div>
      </div>
      <aside className="truth-card" data-reveal><span>LO CONFIRMADO</span><strong>ROBERT DOWNEY JR.</strong><p>interpreta a Victor von Doom. Compartir actor con Tony Stark no confirma que ambos personajes sean la misma persona.</p></aside>
    </section>

    <section className="doom-guide" id="cronologia">
      <header className="doom-heading" data-reveal>
        <div><p className="eyebrow"><span /> ORDEN DE VISIONADO</p><h2>LA RUTA<br/>HACIA <em>DOOM</em></h2></div>
        <div className="doom-release"><span>ESTRENO OFICIAL</span><strong>18 · 12 · 2026</strong><p>{days === null ? "CALCULANDO…" : `${days} DÍAS PARA DOOMSDAY`}</p></div>
      </header>
      <div className="route-controls" data-reveal>
        <p>Orden narrativo recomendado, centrado solo en películas y series del MCU.</p>
        <div><button className={filter === "TODO" ? "active" : ""} onClick={() => setFilter("TODO")}>RUTA COMPLETA · 6 + DESTINO</button><button className={filter === "IMPRESCINDIBLE" ? "active" : ""} onClick={() => setFilter("IMPRESCINDIBLE")}>RUTA RÁPIDA · 4 + DESTINO</button></div>
      </div>
      <div className="watch-timeline">
        {visibleEvents.map((event) => <details className={`watch-entry status-${event.status.toLowerCase()}`} key={event.order} data-reveal>
          <summary>
            <span className="watch-order">{event.order}</span><img src={event.image} alt="" />
            <div className="watch-main"><small>{event.year} · {event.format} · {event.duration}</small><h3>{event.title}</h3><p>{event.summary}</p><b>{event.status}</b></div>
            <span className="expand-label"><i>+</i> VER SUCESOS</span>
          </summary>
          <div className="event-dossier">
            <div><span>QUÉ SUCEDE</span><ol>{event.events.map(item => <li key={item}>{item}</li>)}</ol></div>
            <div><span>POR QUÉ IMPORTA</span><p>{event.connection}</p><strong>{event.key}</strong></div>
            <div><span>PERSONAJES CLAVE</span>{event.characters.map(character => <article key={character.name}><b>{character.name}</b><small>{character.role}</small>{character.id && <Link href={`/personajes/${character.id}`}>ABRIR FICHA ↗</Link>}</article>)}</div>
          </div>
        </details>)}
      </div>
      <p className="spoiler-note">⚠ Cada expediente contiene spoilers. Ábrelo después de ver el título si quieres descubrir la historia por tu cuenta.</p>
    </section>
  </>;
}
