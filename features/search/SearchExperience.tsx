"use client";

import { SearchResultCard } from "./components/SearchResultCard";
import { useSearchExperience, type SearchFilter } from "./hooks/useSearchExperience";
import { searchIndex } from "@/services/searchService";

const filters: SearchFilter[] = ["TODO", "PERSONAJE", "TÍTULO", "EVENTO", "UNIVERSO", "EQUIPO"];

export function SearchExperience({ initialQuery = "" }: { initialQuery?: string }) {
  const search = useSearchExperience(initialQuery);
  return <>
    <section className="search-hero">
      <div><p className="eyebrow"><span /> BASE DE DATOS NEXUS</p><h1>ENCUENTRA<br /><em>LA CONEXIÓN</em></h1><p>Busca personajes, identidades, poderes, películas, series, acontecimientos o universos.</p></div>
      <label className="search-command"><span>¿QUÉ QUIERES SABER?</span><div><input autoFocus value={search.query} onChange={(event) => search.updateQuery(event.target.value)} placeholder="Ej. Wanda, incursiones, Wakanda…" aria-label="Buscar en NEXUS" /><b>⌕</b></div><small>{searchIndex.length} EXPEDIENTES INDEXADOS</small></label>
    </section>
    <section className="search-results" aria-live="polite">
      <div className="search-result-tools">
        <div role="group" aria-label="Filtrar resultados">{filters.map((item) => <button className={search.filter === item ? "active" : ""} type="button" key={item} onClick={() => search.setFilter(item)}>{item} {item !== "TODO" && <span>{search.counts[item]}</span>}</button>)}</div>
        <p>{search.deferredQuery.trim() ? <><b>{search.allResults.length}</b> RESULTADOS PARA “{search.deferredQuery.trim()}”</> : "EXPEDIENTES DESTACADOS"}</p>
      </div>
      {search.results.length ? <div className="search-result-grid">{search.results.map((result) => <SearchResultCard result={result} key={`${result.type}-${result.id}`} />)}</div> : <div className="search-empty"><strong>NO HAY COINCIDENCIAS</strong><p>Prueba con otro nombre, alias, poder o acontecimiento del MCU.</p><button type="button" onClick={() => search.updateQuery("")}>LIMPIAR BÚSQUEDA</button></div>}
    </section>
  </>;
}
