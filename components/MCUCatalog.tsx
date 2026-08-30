"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { mcuCatalog, type MCUContinuity, type MCUType } from "@/lib/mcuCatalog";

type Filter = "TODO" | MCUType | MCUContinuity;
const PAGE_SIZE = 7;
const archiveImages: Record<string, string> = {
  "Vengadores: Endgame": "https://i.ytimg.com/vi/TcMBFSGVi1c/maxresdefault.jpg",
  "Loki · Temporadas 1 y 2": "https://i.ytimg.com/vi/nW948Va-l10/maxresdefault.jpg",
  "Spider-Man: No Way Home": "https://i.ytimg.com/vi/JfVOs4VSpmA/maxresdefault.jpg",
  "Doctor Strange en el Multiverso de la Locura": "https://i.ytimg.com/vi/aWzlQ2N6qqg/maxresdefault.jpg",
  "Deadpool y Lobezno": "https://i.ytimg.com/vi/73_1biulkYk/maxresdefault.jpg",
  "Los Cuatro Fantásticos: Primeros pasos": "https://i.ytimg.com/vi/18QQWa5MEcs/maxresdefault.jpg",
  "Avengers: Doomsday": "https://i.ytimg.com/vi/399Ez7WHK5s/maxresdefault.jpg",
};

export function MCUCatalog() {
  const [filter, setFilter] = useState<Filter>("TODO");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    return mcuCatalog.filter(entry => (filter === "TODO" || entry.type === filter || entry.continuity === filter) && (!normalized || `${entry.title} ${entry.period} ${entry.event}`.toLocaleLowerCase("es").includes(normalized)));
  }, [filter, query]);
  const displayed = visible.slice(0, visibleCount);

  return <section className="doom-guide mcu-catalog" id="cronologia">
    <header className="doom-heading catalog-heading" data-reveal>
      <div><p className="eyebrow"><span /> ORDEN DE VISIONADO</p><h2>LA CRONOLOGÍA<br/>DEL <em>MCU</em></h2></div>
      <div className="doom-release catalog-count"><span>ARCHIVO COMPLETO</span><strong>{String(mcuCatalog.length).padStart(2, "0")} TÍTULOS</strong><p>PELÍCULAS · SERIES · ESPECIALES</p></div>
    </header>
    <div className="doom-intro catalog-intro" data-reveal><p>De los orígenes de Wakanda al choque de universos: toda la historia audiovisual en un único recorrido.</p><span>ORDEN CRONOLÓGICO <i /> CONTINUIDAD IDENTIFICADA</span></div>
    <div className="catalog-tools" data-reveal>
      <label><span>BUSCAR UN TÍTULO</span><input value={query} onChange={event => { setQuery(event.target.value); setVisibleCount(PAGE_SIZE); }} placeholder="Ej. Daredevil, Wanda, Thor…" /></label>
      <div className="catalog-filters" aria-label="Filtrar cronología">
        {(["TODO", "PELÍCULA", "SERIE", "ESPECIAL", "SAGA PRINCIPAL", "MARVEL TELEVISION", "MULTIVERSO"] as Filter[]).map(item => <button key={item} className={filter === item ? "active" : ""} onClick={() => { setFilter(item); setVisibleCount(PAGE_SIZE); }}>{item}</button>)}
      </div>
    </div>
    <div className="catalog-result"><span>{visible.length} TÍTULOS</span><span>ORDEN CRONOLÓGICO APROXIMADO</span></div>
    <div className="catalog-list watch-timeline">
      {displayed.map(entry => <details className="catalog-entry watch-entry" key={`${entry.order}-${entry.title}`} data-reveal>
        <summary>
          <span className="watch-order">{String(entry.order).padStart(2, "0")}</span>
          <div className={`catalog-art catalog-art-${entry.continuity.toLowerCase().replaceAll(" ", "-")} has-image`} aria-hidden="true"><Image src={archiveImages[entry.title] ?? `/api/title-image?title=${encodeURIComponent(entry.title)}&type=${encodeURIComponent(entry.type)}`} alt="" fill sizes="(max-width: 560px) 80vw, 245px" onError={event => { event.currentTarget.hidden = true; event.currentTarget.parentElement?.classList.remove("has-image"); }}/><b>{entry.title.split(" ").slice(0, 2).map(word => word[0]).join("")}</b><small>{entry.phase}</small><span>MARVEL STUDIOS · ARCHIVO {String(entry.order).padStart(2, "0")}</span></div>
          <div className="watch-main"><small>{entry.period} · {entry.type}</small><h3>{entry.title}</h3><p>{entry.event}</p><b>{entry.continuity}</b></div>
          <span className="expand-label"><i>+</i> VER SUCESO</span>
        </summary>
        <div className="event-dossier catalog-event"><div><span>EL SUCESO CLAVE</span><p>{entry.event}</p><Link className="dossier-link" href={`/titulos/${entry.slug}`}>ABRIR EXPEDIENTE COMPLETO ↗</Link></div><div><span>POSICIÓN EN LA HISTORIA</span><p>{entry.period}</p><strong>{entry.phase} · {entry.continuity}</strong></div><div><span>FORMATO</span><article><b>{entry.type}</b><small>PRODUCCIÓN AUDIOVISUAL</small></article></div></div>
      </details>)}
      {!visible.length && <div className="catalog-empty"><b>NO HAY RESULTADOS</b><p>Prueba con otro título o elimina los filtros.</p></div>}
    </div>
    {displayed.length < visible.length && <div className="catalog-more"><p>HAS VISTO <b>{displayed.length}</b> DE <b>{visible.length}</b></p><button onClick={() => setVisibleCount(count => count + PAGE_SIZE)}>CARGAR 7 MÁS <span>↓</span></button></div>}
    <p className="catalog-source">Orden editorial basado en la cronología de Xataka. Las fechas discutidas, el multiverso y las producciones heredadas de Marvel Television están identificadas de forma separada.</p>
  </section>;
}
