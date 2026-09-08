import type { SpoilerRequirement } from "@/types/spoiler";

/** Watching a title is what reveals its own dossier spoilers. */
export function titleDossierRequirement(slug: string): SpoilerRequirement {
  return { allOf: [slug] };
}