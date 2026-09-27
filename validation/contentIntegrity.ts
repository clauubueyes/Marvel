import { characters } from "@/repositories/characterRepository";
import { mcuCatalog } from "@/data/mcuCatalog";
import { mcuEntities } from "@/data/mcuEntities";
import { getDetailedTitleIds, getTitleDetails } from "@/data/titles";
import { viewingRoutes } from "@/data/viewingRoutes";
import { parseIsoDate } from "@/utils/editorialDate";
import type { ValidationIssue } from "./types";

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
export function validateContentIntegrity(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (subject: string, field: string, message: string) =>
    issues.push({ scope: "integridad", severity: "ERROR", subject, field, message });

  const titleSlugs = new Set(mcuCatalog.map(({ slug }) => slug));
  const characterIds = new Set(characters.map(({ id }) => id));

  const reportDuplicates = (field: string, values: readonly string[]) => {
    const seen = new Set<string>();
    for (const value of values) {
      if (seen.has(value)) push(value, field, `${field} duplicado: ${value}`);
      seen.add(value);
    }
  };

  const checkSource = (subject: string, url: string) => {
    if (!URL.canParse(url) || new URL(url).protocol !== "https:")
      push(subject, "sources", `fuente no segura ${url}`);
  };

  reportDuplicates(
    "slug",
    mcuCatalog.map(({ slug }) => slug),
  );
  reportDuplicates(
    "id",
    characters.map(({ id }) => id),
  );
  reportDuplicates(
    "slug",
    viewingRoutes.map(({ slug }) => slug),
  );
  reportDuplicates(
    "entidad",
    mcuEntities.map(({ kind, slug }) => `${kind}:${slug}`),
  );
  reportDuplicates("metadatos", getDetailedTitleIds());

  for (const character of characters) {
    if (!parseIsoDate(character.reviewedAt))
      push(character.name, "reviewedAt", "fecha de revisión no válida");
    if (!character.sources.length) push(character.name, "sources", "faltan fuentes editoriales");
    character.sources.forEach(({ url }) => checkSource(character.name, url));
    if (!character.affiliations.length)
      push(character.name, "affiliations", "falta al menos una afiliación");

    for (const appearance of character.appearances) {
      if (!titleSlugs.has(appearance.titleId)) {
        push(
          character.name,
          "appearances",
          `la aparición "${appearance.title}" no enlaza con ningún título (${appearance.titleId})`,
        );
      }
    }
  }

  for (const route of viewingRoutes) {
    for (const step of route.steps) {
      if (!titleSlugs.has(step.titleId))
        push(route.name, "steps", `el título ${step.titleId} no existe`);
    }
  }

  const entityKeys = new Set(mcuEntities.map(({ kind, slug }) => `${kind}:${slug}`));

  for (const entity of mcuEntities) {
    entity.titleIds.forEach((titleId) => {
      if (!titleSlugs.has(titleId)) push(entity.name, "titleIds", `el título ${titleId} no existe`);
    });
    entity.characterIds.forEach((characterId) => {
      if (!characterIds.has(characterId))
        push(entity.name, "characterIds", `el personaje ${characterId} no existe`);
    });
    // Varias entidades pueden apuntar a la misma: se comprueba que exista, no que sea única.
    for (const connection of entity.connections) {
      if (!entityKeys.has(`${connection.kind}:${connection.slug}`))
        push(
          entity.name,
          "connections",
          `la conexión ${connection.kind}:${connection.slug} no existe`,
        );
    }
  }

  const detailedIds = new Set(getDetailedTitleIds());

  for (const titleId of detailedIds) {
    if (!titleSlugs.has(titleId))
      push(titleId, "metadatos", "los metadatos apuntan a un título inexistente");
    const details = getTitleDetails(titleId);
    [...(details?.watchBefore ?? []), ...(details?.watchAfter ?? [])].forEach((relatedId) => {
      if (!titleSlugs.has(relatedId))
        push(titleId, "watchBefore/watchAfter", `la recomendación ${relatedId} no existe`);
    });
    details?.sources.forEach(({ url }) => checkSource(titleId, url));
  }

  for (const title of mcuCatalog) {
    if (!detailedIds.has(title.slug))
      push(title.title, "expediente", `falta el expediente editorial (${title.slug})`);
  }

  return issues;
}
