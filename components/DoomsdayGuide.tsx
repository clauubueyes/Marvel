"use client";

import { useEffect, useState } from "react";
import { doomEvents } from "@/lib/doomsday";

const RELEASE = new Date("2026-12-18T00:00:00");

function useCountdown() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setDays(Math.max(0, Math.ceil((RELEASE.getTime() - Date.now()) / 86_400_000)));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return days;
}

export function DoomsdayGuide() {
  const days = useCountdown();
  return (
    <section className="doom-guide" id="doom">
      <div className="doom-noise" />
      <header className="doom-heading" data-reveal>
        <div><p className="eyebrow"><span /> EXPEDIENTE 2026</p><h2>EL CAMINO<br/>HACIA <em>DOOM</em></h2></div>
        <div className="doom-release"><span>ESTRENO OFICIAL</span><strong>18 · 12 · 2026</strong><p>{days === null ? "CALCULANDO…" : `${days} DÍAS PARA EL FIN`}</p></div>
      </header>
      <div className="doom-intro" data-reveal>
        <p>Una guía esencial para entender cómo el tiempo roto, las incursiones y los mundos paralelos conducen a una colisión inevitable.</p>
        <span>HECHOS CONFIRMADOS <i /> CONTEXTO NEXUS</span>
      </div>
      <div className="doom-timeline">
        {doomEvents.map((event, index) => <article className={event.status === "DESTINO" ? "doom-event final-event" : "doom-event"} data-reveal key={event.title} style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}>
          <div className="doom-event-art"><img src={event.image} alt=""/><span>{event.status}</span><b>{event.order}</b></div>
          <div className="doom-event-copy"><p>{event.year} · {event.format}</p><small>{event.chapter}</small><h3>{event.title}</h3><p>{event.summary}</p><strong>{event.key}</strong></div>
        </article>)}
      </div>
      <footer className="doom-destination" data-reveal>
        <div><span>EL DESTINO</span><h3>AVENGERS:<br/>DOOMSDAY</h3><p>La historia oficial todavía guarda sus secretos. Esta ruta distingue los datos confirmados de la interpretación editorial.</p></div>
        <a href="https://www.marvel.com/movies/avengers-kang-dynasty" target="_blank" rel="noreferrer"><i>▶</i><span>VER TEASER OFICIAL</span></a>
      </footer>
    </section>
  );
}
