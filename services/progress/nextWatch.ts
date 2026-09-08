import { mcuCatalog } from "@/data/mcuCatalog";
import { getTitleDetails } from "@/data/titles";
import type { SpoilerProgress } from "@/types/spoiler";
import type { Character } from "@/types/character";

// Recommend the title, never the events or revelations connecting it to a character.
const releases = mcuCatalog.flatMap((entry) => {
  const details = getTitleDetails(entry.slug);
  return details && details.status === "ESTRENADO"
    ? [{ slug: entry.slug, title: entry.title, type: entry.type,
      releaseDate: details.releaseDateISO, trailerId: details.trailerId }]
    : [];
}).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.slug.localeCompare(b.slug));

export function getCharacterWatchTitleIds(character: Pick<Character, "appearances" | "story">): string[] {
  return [...new Set([
    ...character.appearances.map(({ titleId }) => titleId),
    ...character.story.flatMap(({ spoiler }) => spoiler?.allOf ?? []),
  ])];
}

export function getNextWatch(progress: SpoilerProgress, titleIds: readonly string[]) {
  if (!progress.ready || progress.allowSpoilers) return undefined;
  const related = new Set(titleIds);
  return releases.find(({ slug }) => related.has(slug) && !progress.watched.has(slug));
}
