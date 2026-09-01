"use client";

import { useMemo, useState } from "react";
import type { Character } from "@/types/character";

export type CharacterCategoryFilter = "TODOS" | Character["category"];
export type CharacterStatusFilter = "TODOS" | Character["status"];

export function useCharacterFilters(characters: Character[]) {
  const [category, setCategory] = useState<CharacterCategoryFilter>("TODOS");
  const [status, setStatus] = useState<CharacterStatusFilter>("TODOS");
  const [universe, setUniverse] = useState("TODOS");
  const [affiliation, setAffiliation] = useState("TODAS");
  const universes = useMemo(() => [...new Set(characters.map(({ universe }) => universe))].sort(), [characters]);
  const affiliations = useMemo(() => [...new Set(characters.flatMap(({ affiliations }) => affiliations))].sort(), [characters]);
  const visibleCharacters = useMemo(() => characters.filter((character) =>
    (category === "TODOS" || character.category === category) &&
    (status === "TODOS" || character.status === status) &&
    (universe === "TODOS" || character.universe === universe) &&
    (affiliation === "TODAS" || character.affiliations.includes(affiliation)),
  ), [affiliation, category, characters, status, universe]);

  function reset() {
    setCategory("TODOS");
    setStatus("TODOS");
    setUniverse("TODOS");
    setAffiliation("TODAS");
  }

  return { affiliation, affiliations, category, reset, setAffiliation, setCategory, setStatus, setUniverse, status, universe, universes, visibleCharacters };
}
