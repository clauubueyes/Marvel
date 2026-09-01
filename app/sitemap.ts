import type { MetadataRoute } from "next";
import { characters } from "@/repositories/characterRepository";
import { mcuCatalog } from "@/data/mcuCatalog";
import { getEntityHref, mcuEntities } from "@/data/mcuEntities";
import { siteConfig } from "@/config/site";
import { viewingRoutes } from "@/data/viewingRoutes";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const lastModified = new Date("2026-08-31");
  return [
    { url: url("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...["/personajes", "/titulos", "/rutas", "/eventos", "/universos", "/equipos"].map((path) => ({ url: url(path), lastModified, changeFrequency: "weekly" as const, priority: .8 })),
    ...["/privacidad", "/terminos"].map((path) => ({ url: url(path), lastModified, changeFrequency: "yearly" as const, priority: .3 })),
    ...characters.map(({ id }) => ({ url: url(`/personajes/${id}`), lastModified, changeFrequency: "monthly" as const, priority: .8 })),
    ...mcuCatalog.map(({ slug }) => ({ url: url(`/titulos/${slug}`), lastModified, changeFrequency: "monthly" as const, priority: .7 })),
    ...viewingRoutes.map(({ slug }) => ({ url: url(`/rutas/${slug}`), lastModified, changeFrequency: "monthly" as const, priority: .7 })),
    ...mcuEntities.map((entity) => ({ url: url(getEntityHref(entity)), lastModified, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}
