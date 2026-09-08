import type { Character } from "@/types/character";
import { getCharacterSpoilerRequirements } from "@/utils/characterSpoilers";

export function validateCharacterSpoilers(characters: readonly Character[], titleIds: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  for (const character of characters) {
    if (!character.story.length) errors.push(`${character.id}: historia sin requisitos de spoilers.`);
    if (character.spoilers?.facts?.length !== character.facts.length || character.spoilers?.variants?.length !== character.variants.length) {
      errors.push(`${character.id}: los requisitos no coinciden con sus datos/variantes.`);
    }
    for (const requirement of getCharacterSpoilerRequirements(character)) {
      if (!requirement?.allOf.length) errors.push(`${character.id}: contenido sensible sin obras de desbloqueo.`);
      else for (const id of requirement.allOf) {
        if (!titleIds.has(id)) errors.push(`${character.id}: requisito de spoiler desconocido (${id}).`);
      }
    }
  }
  return errors;
}
