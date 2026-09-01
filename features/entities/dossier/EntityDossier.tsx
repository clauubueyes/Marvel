import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MotionEffects } from "@/components/common/MotionEffects";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { siteConfig } from "@/config/site";
import { getEntityHref } from "@/data/mcuEntities";
import { getEntityDossier } from "@/repositories/entityRepository";
import type { MCUEntity } from "@/types/entity";
import { EntityCharacters } from "./components/EntityCharacters";
import { EntityConnections } from "./components/EntityConnections";
import { EntityExplanation } from "./components/EntityExplanation";
import { EntityHero } from "./components/EntityHero";
import { EntityTitles } from "./components/EntityTitles";

const roots = { EVENTO: { label: "EVENTOS", href: "/eventos" }, UNIVERSO: { label: "UNIVERSOS", href: "/universos" }, EQUIPO: { label: "EQUIPOS", href: "/equipos" } } as const;

export function EntityDossier({ entity }: { entity: MCUEntity }) {
  const dossier = getEntityDossier(entity);
  const entityUrl = new URL(getEntityHref(entity), siteConfig.url).toString();
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: entity.name, description: entity.summary, articleSection: entity.kind, url: entityUrl, mainEntityOfPage: entityUrl, inLanguage: siteConfig.language, about: entity.connections.map(({ label }) => label) };

  /* `--entity-accent` adapta círculos, títulos y enlaces al color de la entidad. */
  return <main className="entity-profile" style={{ "--accent": entity.color, "--entity-accent": entity.color, "--accent-2": "#4f6b28" } as React.CSSProperties}>
    {/* Cabecera persistente y accesos rápidos a los tres tipos de entidad. */}
    <MotionEffects />
    <GlobalNavigation context={`${entity.kind} / EXPEDIENTE`} />
    <Breadcrumbs items={[roots[entity.kind], { label: entity.name }]} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} />
    <nav className="entity-section-tabs" aria-label="Explorar conexiones"><Link href="/eventos">EVENTOS</Link><Link href="/universos">UNIVERSOS</Link><Link href="/equipos">EQUIPOS</Link></nav>
    {/* Orden visual del dossier: hero, contexto, títulos, conexiones y reparto. */}
    <EntityHero entity={entity} imageTitle={dossier.titles[0]} />
    <EntityExplanation entity={entity} />
    <EntityTitles titles={dossier.titles} />
    <EntityConnections connections={dossier.connections} />
    <EntityCharacters characters={dossier.relatedCharacters} />
  </main>;
}
