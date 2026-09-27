import { characters } from "@/repositories/characterRepository";
import { mcuCatalog } from "@/data/mcuCatalog";
import { mcuEntities } from "@/data/mcuEntities";
import { getDetailedTitleIds, getTitleDetails } from "@/data/titles";
import { viewingRoutes } from "@/data/viewingRoutes";
import { parseIsoDate } from "@/utils/editorialDate";

/**
 * Barrido de integridad del catálogo: slugs e identificadores únicos, fechas de
 * revisión con formato, fuentes seguras y toda referencia cruzada apuntando a una
 * entrada real.
 *
 * Vive en `validation/` y no en `repositories/` porque no es acceso a datos: es una
 * comprobación de build que recorre los catálogos. Se solapa a propósito con
 * `validateProgressRelations` (ambas verifican que los pasos de una ruta apunten a
 * un título existente) porque cada validador se usa como guard independiente: cada
 * uno debe ser útil por sí solo, con datos inyectados y sin depender del otro.
 */
export function validateContentIntegrity() {
  const errors: string[] = [];
  const titleSlugs = new Set(mcuCatalog.map(({ slug }) => slug));
  const characterIds = new Set(characters.map(({ id }) => id));

  const reportDuplicates = (label: string, values: readonly string[]) => {
    const seen = new Set<string>();
    for (const value of values) {
      if (seen.has(value)) errors.push(`${label} duplicado: ${value}`);
      seen.add(value);
    }
  };

  const checkSource = (subject: string, url: string) => {
    if (!URL.canParse(url) || new URL(url).protocol !== "https:")
      errors.push(`${subject}: fuente no segura ${url}`);
  };

  reportDuplicates(
    "Slug de título",
    mcuCatalog.map(({ slug }) => slug),
  );
  reportDuplicates(
    "ID de personaje",
    characters.map(({ id }) => id),
  );
  reportDuplicates(
    "Slug de ruta",
    viewingRoutes.map(({ slug }) => slug),
  );
  reportDuplicates(
    "Entidad",
    mcuEntities.map(({ kind, slug }) => `${kind}:${slug}`),
  );
  reportDuplicates("Metadatos de título", getDetailedTitleIds());

  for (const character of characters) {
    if (!parseIsoDate(character.reviewedAt))
      errors.push(`${character.name}: fecha de revisión no válida`);
    if (!character.sources.length) errors.push(`${character.name}: faltan fuentes editoriales`);
    character.sources.forEach(({ url }) => checkSource(character.name, url));
    if (!character.affiliations.length)
      errors.push(`${character.name}: falta al menos una afiliación`);

    for (const appearance of character.appearances) {
      if (!titleSlugs.has(appearance.titleId)) {
        errors.push(
          `${character.name}: la aparición "${appearance.title}" no enlaza con ningún título (${appearance.titleId})`,
        );
      }
    }
  }

  for (const route of viewingRoutes) {
    for (const step of route.steps) {
      if (!titleSlugs.has(step.titleId))
        errors.push(`${route.name}: el título ${step.titleId} no existe`);
    }
  }

  const entityKeys = new Set(mcuEntities.map(({ kind, slug }) => `${kind}:${slug}`));

  for (const entity of mcuEntities) {
    entity.titleIds.forEach((titleId) => {
      if (!titleSlugs.has(titleId)) errors.push(`${entity.name}: el título ${titleId} no existe`);
    });
    entity.characterIds.forEach((characterId) => {
      if (!characterIds.has(characterId))
        errors.push(`${entity.name}: el personaje ${characterId} no existe`);
    });
    // Varias entidades pueden apuntar a la misma: se comprueba que exista, no que sea única.
    for (const connection of entity.connections) {
      if (!entityKeys.has(`${connection.kind}:${connection.slug}`))
        errors.push(`${entity.name}: la conexión ${connection.kind}:${connection.slug} no existe`);
    }
  }

  for (const titleId of getDetailedTitleIds()) {
    if (!titleSlugs.has(titleId))
      errors.push(`Los metadatos apuntan a un título inexistente: ${titleId}`);
    const details = getTitleDetails(titleId);
    [...(details?.watchBefore ?? []), ...(details?.watchAfter ?? [])].forEach((relatedId) => {
      if (!titleSlugs.has(relatedId))
        errors.push(`${titleId}: la recomendación ${relatedId} no existe`);
    });
    details?.sources.forEach(({ url }) => checkSource(titleId, url));
  }

  const detailedIds = new Set(getDetailedTitleIds());
  for (const title of mcuCatalog) {
    if (!detailedIds.has(title.slug))
      errors.push(`${title.title}: falta el expediente editorial (${title.slug})`);
  }

  return errors;
}
