import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MotionEffects } from "@/components/common/MotionEffects";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { mcuCatalog } from "@/data/mcuCatalog";
import { getTitleDetails } from "@/data/titles";
import {
  TitleCast,
  TitleConnections,
  TitleCredits,
  TitleEventDossier,
  TitleHero,
  TitlePagination,
  TitlePostCredits,
  TitleSources,
  TitleWatchOrder,
} from "@/features/titles/dossier/components";
import { getEntitiesForTitle, getTitle, getTitleDossier } from "@/repositories/contentRepository";
import { getTitleImage } from "@/utils/titleImages";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return mcuCatalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = getTitleDossier((await params).slug);
  const details = title ? getTitleDetails(title.slug) : undefined;
  return title
    ? createPageMetadata({ title: `${title.title} — Archivo NEXUS`, socialTitle: title.title, description: details?.spoilerFreeSynopsis ?? title.event, path: `/titulos/${title.slug}` })
    : { title: "Título no encontrado — NEXUS" };
}

export default async function TitlePage({ params }: PageProps) {
  const title = getTitleDossier((await params).slug);
  if (!title) notFound();

  const details = getTitleDetails(title.slug);
  const connectedEntities = getEntitiesForTitle(title.slug);
  const beforeTitles = details?.watchBefore.flatMap((slug) => { const related = getTitle(slug); return related ? [related] : []; }) ?? [];
  const afterTitles = details?.watchAfter.flatMap((slug) => { const related = getTitle(slug); return related ? [related] : []; }) ?? [];
  const structuredData = details ? {
    "@context": "https://schema.org",
    "@type": title.type === "PELÍCULA" ? "Movie" : "TVSeries",
    name: title.title,
    description: details.spoilerFreeSynopsis,
    url: new URL(`/titulos/${title.slug}`, siteConfig.url).toString(),
    image: new URL(getTitleImage(title.slug), siteConfig.url).toString(),
    datePublished: details.releaseDateISO,
    director: details.directors.map((name) => ({ "@type": "Person", name })),
    actor: details.cast.map((name) => ({ "@type": "Person", name })),
    contentRating: details.certification,
    sameAs: details.sources.map(({ url }) => url),
    mainEntityOfPage: new URL(`/titulos/${title.slug}`, siteConfig.url).toString(),
  } : undefined;

  /* `title-profile` activa la dirección de arte verde/negra del dossier de títulos. */
  return <main className="title-profile" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    {/* Navegación y efectos compartidos por todas las fichas. */}
    <MotionEffects />
    <GlobalNavigation context={`ARCHIVO / ${String(title.order).padStart(2, "0")}`} />
    <Breadcrumbs items={[{ label: "TÍTULOS", href: "/titulos" }, { label: title.title }]} />
    {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} />}
    {/* Apertura visual y resumen del acontecimiento narrativo. */}
    <TitleHero title={title} details={details} imageUrl={getTitleImage(title.slug)} />
    <TitleEventDossier title={title} details={details} />
    {/* Información editorial ampliada disponible para títulos documentados. */}
    {details && <>
      <TitleCredits title={title} details={details} />
      <TitleWatchOrder before={beforeTitles} after={afterTitles} />
      <TitlePostCredits scenes={details.postCredits} />
    </>}
    {/* Cierre de la ficha: reparto, conexiones, fuentes y paginación. */}
    <TitleCast characters={title.characters} />
    <TitleConnections entities={connectedEntities} />
    {details && <TitleSources details={details} />}
    <TitlePagination previous={title.previous} next={title.next} />
  </main>;
}
