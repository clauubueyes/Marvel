import type { Character } from "@/types/character";
import { getCharacterSpoilerRequirements } from "@/utils/characterSpoilers";
import type { ValidationIssue } from "./types";

/**
 * Cada acto de la historia de un personaje debe declarar sus requisitos de
 * spoilers y estos deben apuntar a títulos reales del catálogo. Un requisito vacío
 * dejaría el contenido sensible visible desde el primer momento.
 */
export function validateCharacterSpoilers(
  characters: readonly Character[],
  titleIds: ReadonlySet<string>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (subject: string, field: string, message: string) =>
    issues.push({ scope: "spoilers", severity: "ERROR", subject, field, message });

  for (const character of characters) {
    if (!character.story.length)
      push(character.id, "story", "historia sin requisitos de spoilers.");
    if (
      character.spoilers?.facts?.length !== character.facts.length ||
      character.spoilers?.variants?.length !== character.variants.length
    ) {
      push(character.id, "spoilers", "los requisitos no coinciden con sus datos/variantes.");
    }
    for (const requirement of getCharacterSpoilerRequirements(character)) {
      if (!requirement?.allOf.length) {
        push(character.id, "spoilers", "contenido sensible sin obras de desbloqueo.");
      } else {
        for (const id of requirement.allOf) {
          if (!titleIds.has(id))
            push(character.id, "spoilers", `requisito de spoiler desconocido (${id}).`);
        }
      }
    }
  }

  return issues;
}
