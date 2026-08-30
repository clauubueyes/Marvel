import type { MetadataRoute } from "next";
import { characters } from "@/lib/characters";
import { mcuCatalog } from "@/lib/mcuCatalog";
import { getEntityHref, mcuEntities } from "@/lib/mcuEntities";
import { siteConfig } from "@/lib/site";
import { viewingRoutes } from "@/lib/viewingRoutes";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();
  const lastModified = new Date("2026-08-30");
  return [
    { url: url("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    ...["/buscar", "/personajes", "/titulos", "/rutas", "/eventos", "/universos", "/equipos"].map((path) => ({ url: url(path), lastModified, changeFrequency: "weekly" as const, priority: .8 })),
    ...characters.map(({ id }) => ({ url: url(`/personajes/${id}`), lastModified, changeFrequency: "monthly" as const, priority: .8 })),
    ...mcuCatalog.map(({ slug }) => ({ url: url(`/titulos/${slug}`), lastModified, changeFrequency: "monthly" as const, priority: .7 })),
    ...viewingRoutes.map(({ slug }) => ({ url: url(`/rutas/${slug}`), lastModified, changeFrequency: "monthly" as const, priority: .7 })),
    ...mcuEntities.map((entity) => ({ url: url(getEntityHref(entity)), lastModified, changeFrequency: "monthly" as const, priority: .7 })),
  ];
}
