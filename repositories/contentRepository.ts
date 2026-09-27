import { characters, getCharacter } from "@/repositories/characterRepository";
import { mcuCatalog } from "@/data/mcuCatalog";
import { viewingRoutes } from "@/data/viewingRoutes";
import { mcuEntities } from "@/data/mcuEntities";

import type { TitleDossier } from "@/types/title";

const titlesBySlug = new Map(mcuCatalog.map((title) => [title.slug, title]));

export function getTitle(slug: string) {
  return titlesBySlug.get(slug);
}

export function getCharactersForTitle(slug: string) {
  return characters.filter((character) =>
    character.appearances.some((appearance) => appearance.titleId === slug),
  );
}

export function getTitleDossier(slug: string): TitleDossier | undefined {
  const title = getTitle(slug);
  if (!title) return undefined;

  const currentIndex = mcuCatalog.findIndex((entry) => entry.slug === slug);
  return {
    ...title,
    characters: getCharactersForTitle(slug),
    previous: mcuCatalog[(currentIndex - 1 + mcuCatalog.length) % mcuCatalog.length],
    next: mcuCatalog[(currentIndex + 1) % mcuCatalog.length],
  };
}

export function getEntitiesForTitle(slug: string) {
  return mcuEntities.filter((entity) => entity.titleIds.includes(slug));
}

export function getEntitiesForCharacter(characterId: string) {
  return mcuEntities.filter((entity) => entity.characterIds.includes(characterId));
}

export function getViewingRoutesForCharacter(characterId: string) {
  const titleIds = new Set(
    getCharacter(characterId)?.appearances.map(({ titleId }) => titleId) ?? [],
  );
  return viewingRoutes.filter((route) => route.steps.some(({ titleId }) => titleIds.has(titleId)));
}
