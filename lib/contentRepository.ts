import { characters, getCharacter, type Character } from "@/lib/characters";
import { mcuCatalog, type MCUEntry } from "@/lib/mcuCatalog";
import { viewingRoutes } from "@/lib/viewingRoutes";
import { mcuEntities } from "@/lib/mcuEntities";
import { getDetailedTitleIds, getTitleDetails } from "@/lib/content/titles/details";

export type TitleDossier = MCUEntry & {
  characters: Character[];
  previous: MCUEntry;
  next: MCUEntry;
};

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
  const titleIds = new Set(getCharacter(characterId)?.appearances.map(({ titleId }) => titleId) ?? []);
  return viewingRoutes.filter((route) => route.steps.some(({ titleId }) => titleIds.has(titleId)));
}

export function validateContent() {
  const errors: string[] = [];
  const titleSlugs = new Set<string>();
  const characterIds = new Set<string>();

  for (const title of mcuCatalog) {
    if (titleSlugs.has(title.slug)) errors.push(`Slug de título duplicado: ${title.slug}`);
    titleSlugs.add(title.slug);
  }

  for (const character of characters) {
    if (characterIds.has(character.id)) errors.push(`ID de personaje duplicado: ${character.id}`);
    characterIds.add(character.id);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(character.reviewedAt)) errors.push(`${character.name}: fecha de revisión no válida`);
    if (!character.sources.length) errors.push(`${character.name}: faltan fuentes editoriales`);
    character.sources.forEach(({ url }) => {
      if (!url.startsWith("https://")) errors.push(`${character.name}: fuente no segura ${url}`);
    });
    if (!character.affiliations.length) errors.push(`${character.name}: falta al menos una afiliación`);

    for (const appearance of character.appearances) {
      if (!titleSlugs.has(appearance.titleId)) {
        errors.push(`${character.name}: la aparición "${appearance.title}" no enlaza con ningún título (${appearance.titleId})`);
      }
    }
  }

  const routeSlugs = new Set<string>();
  for (const route of viewingRoutes) {
    if (routeSlugs.has(route.slug)) errors.push(`Slug de ruta duplicado: ${route.slug}`);
    routeSlugs.add(route.slug);
    for (const step of route.steps) {
      if (!titleSlugs.has(step.titleId)) errors.push(`${route.name}: el título ${step.titleId} no existe`);
    }
  }

  const entityKeys = new Set<string>();
  for (const entity of mcuEntities) {
    const key = `${entity.kind}:${entity.slug}`;
    if (entityKeys.has(key)) errors.push(`Entidad duplicada: ${key}`);
    entityKeys.add(key);
    entity.titleIds.forEach((titleId) => {
      if (!titleSlugs.has(titleId)) errors.push(`${entity.name}: el título ${titleId} no existe`);
    });
    entity.characterIds.forEach((characterId) => {
      if (!characterIds.has(characterId)) errors.push(`${entity.name}: el personaje ${characterId} no existe`);
    });
  }
  for (const entity of mcuEntities) {
    entity.connections.forEach((connection) => {
      if (!entityKeys.has(`${connection.kind}:${connection.slug}`)) errors.push(`${entity.name}: la conexión ${connection.kind}:${connection.slug} no existe`);
    });
  }
  const detailedIds = new Set<string>();
  for (const titleId of getDetailedTitleIds()) {
    if (detailedIds.has(titleId)) errors.push(`Metadatos de título duplicados: ${titleId}`);
    detailedIds.add(titleId);
    if (!titleSlugs.has(titleId)) errors.push(`Los metadatos apuntan a un título inexistente: ${titleId}`);
    const details = getTitleDetails(titleId);
    [...(details?.watchBefore ?? []), ...(details?.watchAfter ?? [])].forEach((relatedId) => {
      if (!titleSlugs.has(relatedId)) errors.push(`${titleId}: la recomendación ${relatedId} no existe`);
    });
    details?.sources.forEach(({ url }) => {
      if (!url.startsWith("https://")) errors.push(`${titleId}: fuente no segura ${url}`);
    });
  }
  for (const title of mcuCatalog) {
    if (!detailedIds.has(title.slug)) errors.push(`${title.title}: falta el expediente editorial (${title.slug})`);
  }

  return errors;
}
