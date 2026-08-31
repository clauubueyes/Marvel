"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/lib/characters";

type Props = { characters: Character[] };

export function CharacterDirectory({ characters }: Props) {
  const [category, setCategory] = useState("TODOS");
  const [status, setStatus] = useState("TODOS");
  const [universe, setUniverse] = useState("TODOS");
  const [affiliation, setAffiliation] = useState("TODAS");
  const universes = useMemo(() => [...new Set(characters.map(({ universe }) => universe))].sort(), [characters]);
  const affiliations = useMemo(() => [...new Set(characters.flatMap(({ affiliations }) => affiliations))].sort(), [characters]);
  const visible = characters.filter((character) =>
    (category === "TODOS" || character.category === category) &&
    (status === "TODOS" || character.status === status) &&
    (universe === "TODOS" || character.universe === universe) &&
    (affiliation === "TODAS" || character.affiliations.includes(affiliation)),
  );
  const reset = () => { setCategory("TODOS"); setStatus("TODOS"); setUniverse("TODOS"); setAffiliation("TODAS"); };

  return <>
    <section className="character-filters" aria-label="Filtros de personajes">
      <div><span>FUNCIÓN</span>{["TODOS", "HÉROE", "ANTI-HÉROE", "VILLANO", "SECUNDARIO"].map((value) => <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>{value}</button>)}</div>
      <label><span>ESTADO</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>TODOS</option><option>ACTIVO</option><option>INACTIVO</option><option>DESCONOCIDO</option></select></label>
      <label><span>UNIVERSO</span><select value={universe} onChange={(event) => setUniverse(event.target.value)}><option>TODOS</option>{universes.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label><span>AFILIACIÓN</span><select value={affiliation} onChange={(event) => setAffiliation(event.target.value)}><option>TODAS</option>{affiliations.map((value) => <option key={value}>{value}</option>)}</select></label>
      <p><strong>{visible.length}</strong> RESULTADOS</p><button className="filter-reset" onClick={reset}>LIMPIAR</button>
    </section>
    <section className="characters-directory" key={`${category}-${status}-${universe}-${affiliation}`} aria-label="Catálogo de personajes" aria-live="polite">
      {visible.map((character, index) => <Link href={`/personajes/${character.id}`} className="character-directory-card" key={character.id} data-reveal data-tilt style={{ "--card-accent": character.color, "--delay": `${Math.min(index, 11) * 45}ms` } as React.CSSProperties}>
        <Image src={character.image} alt="" fill sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 25vw" style={{ objectPosition: character.imagePosition ?? "center top" }} />
        <i className="character-card-light" aria-hidden="true" /><span>{character.number} · {character.role}</span><h2>{character.name}</h2><p>{character.alias}</p><b>ABRIR EXPEDIENTE <i>↗</i></b>
      </Link>)}
      {!visible.length && <div className="character-empty"><strong>SIN COINCIDENCIAS</strong><p>Prueba otra combinación de filtros.</p><button onClick={reset}>MOSTRAR TODO</button></div>}
    </section>
  </>;
}
