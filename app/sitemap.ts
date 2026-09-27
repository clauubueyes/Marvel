import type { MetadataRoute } from "next";
import { characters } from "@/repositories/characterRepository";
import { mcuCatalog } from "@/data/mcuCatalog";
import { getEntityHref, mcuEntities } from "@/data/mcuEntities";
import { siteConfig } from "@/config/site";
import { viewingRoutes } from "@/data/viewingRoutes";
import { getTitleDetails } from "@/data/titles";
import { parseEditorialReviewedAt } from "@/utils/editorialDate";

/**
 * `lastModified` se deriva del propio contenido (`reviewedAt` de cada ficha) en
 * lugar de una fecha fija en el código. Ventajas frente a `git log` o
 * `fs.stat`: es determinista, no depende de que el historial esté disponible en
 * el entorno de build (Vercel clona en profundidad limitada) y el mtime de un
 * checkout nuevo no significa nada.
 * Los legales no tienen ficha editorial: se mantienen con su fecha de revisión.
 */
const LEGAL_REVIEWED_AT = "2026-08-31";

const LEGAL_DATE = parseEditorialReviewedAt(LEGAL_REVIEWED_AT) ?? new Date(LEGAL_REVIEWED_AT);

const toDate = (reviewedAt: string | undefined) =>
  parseEditorialReviewedAt(reviewedAt) ?? LEGAL_DATE;

const latestOf = (reviewedAts: readonly (string | undefined)[]) => {
  const valid = reviewedAts
    .map(parseEditorialReviewedAt)
    .filter((date): date is Date => date !== undefined);
  if (!valid.length) return LEGAL_DATE;
  return valid.reduce((latest, date) => (date > latest ? date : latest));
};

const titleReviewedAt = (titleId: string) => getTitleDetails(titleId)?.reviewedAt;
const characterReviewedAt = (characterId: string) =>
  characters.find((character) => character.id === characterId)?.reviewedAt;

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  const characterDates = characters.map(({ reviewedAt }) => reviewedAt);
  const titleDates = mcuCatalog.map(({ slug }) => titleReviewedAt(slug));
  const catalogDate = latestOf([...characterDates, ...titleDates]);
  const routesDate = latestOf(
    viewingRoutes.flatMap(({ steps }) => steps.map((step) => titleReviewedAt(step.titleId))),
  );
  const entitiesDate = latestOf(
    mcuEntities.flatMap(({ titleIds, characterIds }) => [
      ...titleIds.map(titleReviewedAt),
      ...characterIds.map(characterReviewedAt),
    ]),
  );

  const sectionDates: Record<string, Date> = {
    "/personajes": latestOf(characterDates),
    "/titulos": latestOf(titleDates),
    "/rutas": routesDate,
    "/eventos": entitiesDate,
    "/universos": entitiesDate,
    "/equipos": entitiesDate,
  };

  return [
    { url: url("/"), lastModified: catalogDate, changeFrequency: "weekly", priority: 1 },
    ...Object.entries(sectionDates).map(([path, lastModified]) => ({
      url: url(path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...["/privacidad", "/terminos"].map((path) => ({
      url: url(path),
      lastModified: toDate(LEGAL_REVIEWED_AT),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...characters.map(({ id, reviewedAt }) => ({
      url: url(`/personajes/${id}`),
      lastModified: toDate(reviewedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...mcuCatalog.map(({ slug }) => ({
      url: url(`/titulos/${slug}`),
      lastModified: latestOf([titleReviewedAt(slug)]),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...viewingRoutes.map(({ slug, steps }) => ({
      url: url(`/rutas/${slug}`),
      lastModified: latestOf(steps.map(({ titleId }) => titleReviewedAt(titleId))),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...mcuEntities.map((entity) => ({
      url: url(getEntityHref(entity)),
      lastModified: latestOf([
        ...entity.titleIds.map(titleReviewedAt),
        ...entity.characterIds.map(characterReviewedAt),
      ]),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
