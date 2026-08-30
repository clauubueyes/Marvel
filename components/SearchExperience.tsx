"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { useRouter } from "next/navigation";
import { searchContent, searchIndex, type SearchResult } from "@/lib/search";

type SearchFilter = "TODO" | SearchResult["type"];

export function SearchExperience({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<SearchFilter>("TODO");
  const deferredQuery = useDeferredValue(query);
  const allResults = searchContent(deferredQuery, filter);
  const results = deferredQuery.trim() ? allResults : allResults.slice(0, 12);
  const counts = {
    PERSONAJE: searchIndex.filter(({ type }) => type === "PERSONAJE").length,
    TÍTULO: searchIndex.filter(({ type }) => type === "TÍTULO").length,
    EVENTO: searchIndex.filter(({ type }) => type === "EVENTO").length,
    UNIVERSO: searchIndex.filter(({ type }) => type === "UNIVERSO").length,
    EQUIPO: searchIndex.filter(({ type }) => type === "EQUIPO").length,
  };

  function updateQuery(value: string) {
    setQuery(value);
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.replace(params.size ? `/buscar?${params}` : "/buscar", { scroll: false });
  }

  return (
    <>
      <section className="search-hero">
        <div>
          <p className="eyebrow"><span /> BASE DE DATOS NEXUS</p>
          <h1>ENCUENTRA<br /><em>LA CONEXIÓN</em></h1>
          <p>Busca personajes, identidades, poderes, películas, series, acontecimientos o universos.</p>
        </div>
        <label className="search-command">
          <span>¿QUÉ QUIERES SABER?</span>
          <div><input autoFocus value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Ej. Wanda, incursiones, Wakanda…" aria-label="Buscar en NEXUS" /><b>⌕</b></div>
          <small>{searchIndex.length} EXPEDIENTES INDEXADOS</small>
        </label>
      </section>

      <section className="search-results" aria-live="polite">
        <div className="search-result-tools">
          <div role="group" aria-label="Filtrar resultados">
            {(["TODO", "PERSONAJE", "TÍTULO", "EVENTO", "UNIVERSO", "EQUIPO"] as SearchFilter[]).map((item) => (
              <button className={filter === item ? "active" : ""} type="button" key={item} onClick={() => setFilter(item)}>
                {item} {item !== "TODO" && <span>{counts[item]}</span>}
              </button>
            ))}
          </div>
          <p>{deferredQuery.trim() ? <><b>{allResults.length}</b> RESULTADOS PARA “{deferredQuery.trim()}”</> : "EXPEDIENTES DESTACADOS"}</p>
        </div>

        {results.length ? (
          <div className="search-result-grid">
            {results.map((result) => (
              <Link href={result.href} className={`search-result-card search-result-${result.type.toLocaleLowerCase("es")}`} key={`${result.type}-${result.id}`}>
                <div><Image src={result.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized /></div>
                <article><span>{result.type}</span><small>{result.subtitle}</small><h2>{result.title}</h2><p>{result.description}</p><b>ABRIR EXPEDIENTE ↗</b></article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="search-empty"><strong>NO HAY COINCIDENCIAS</strong><p>Prueba con otro nombre, alias, poder o acontecimiento del MCU.</p><button type="button" onClick={() => updateQuery("")}>LIMPIAR BÚSQUEDA</button></div>
        )}
      </section>
    </>
  );
}
