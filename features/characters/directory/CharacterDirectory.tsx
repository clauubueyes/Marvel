"use client";

import { CharacterDirectoryCard } from "./components/CharacterDirectoryCard";
import { CharacterFilters } from "./components/CharacterFilters";
import { useCharacterFilters } from "./hooks/useCharacterFilters";
import type { Character } from "@/types/character";

export function CharacterDirectory({ characters }: { characters: Character[] }) {
  const filters = useCharacterFilters(characters);
  return <>
    <CharacterFilters
      category={filters.category}
      status={filters.status}
      universe={filters.universe}
      affiliation={filters.affiliation}
      universes={filters.universes}
      affiliations={filters.affiliations}
      resultCount={filters.visibleCharacters.length}
      setCategory={filters.setCategory}
      setStatus={filters.setStatus}
      setUniverse={filters.setUniverse}
      setAffiliation={filters.setAffiliation}
      onReset={filters.reset}
    />
    <section className="characters-directory" key={`${filters.category}-${filters.status}-${filters.universe}-${filters.affiliation}`} aria-label="Catálogo de personajes" aria-live="polite">
      {filters.visibleCharacters.map((character, index) => <CharacterDirectoryCard character={character} index={index} key={character.id} />)}
      {!filters.visibleCharacters.length && <div className="character-empty"><strong>SIN COINCIDENCIAS</strong><p>Prueba otra combinación de filtros.</p><button onClick={filters.reset}>MOSTRAR TODO</button></div>}
    </section>
  </>;
}
