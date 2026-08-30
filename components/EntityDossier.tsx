import Image from "next/image";
import Link from "next/link";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { MotionEffects } from "@/components/MotionEffects";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { characters } from "@/lib/characters";
import { mcuCatalog } from "@/lib/mcuCatalog";
import { getEntityHref, getMCUEntity, type MCUEntity } from "@/lib/mcuEntities";

const titleMap = new Map(mcuCatalog.map((title) => [title.slug, title]));
const characterMap = new Map(characters.map((character) => [character.id, character]));

export function EntityDossier({ entity }: { entity: MCUEntity }) {
  const titles = entity.titleIds.flatMap((id) => { const title = titleMap.get(id); return title ? [title] : []; });
  const relatedCharacters = entity.characterIds.flatMap((id) => { const character = characterMap.get(id); return character ? [character] : []; });
  const connections = entity.connections.flatMap((connection) => { const connected = getMCUEntity(connection.kind, connection.slug); return connected ? [{ ...connection, entity: connected }] : []; });
  const imageTitle = titles[0];
  const roots = { EVENTO: { label: "EVENTOS", href: "/eventos" }, UNIVERSO: { label: "UNIVERSOS", href: "/universos" }, EQUIPO: { label: "EQUIPOS", href: "/equipos" } } as const;

  return <main className="entity-profile" style={{ "--accent": entity.color, "--entity-accent": entity.color, "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <MotionEffects />
    <GlobalNavigation context={`${entity.kind} / EXPEDIENTE`} />
    <Breadcrumbs items={[roots[entity.kind], { label: entity.name }]} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: entity.name, description: entity.summary, articleSection: entity.kind, about: entity.connections.map(({ label }) => label) }).replaceAll("<", "\\u003c") }} />
    <nav className="entity-section-tabs" aria-label="Explorar conexiones"><Link href="/eventos">EVENTOS</Link><Link href="/universos">UNIVERSOS</Link><Link href="/equipos">EQUIPOS</Link></nav>
    <section className="entity-profile-hero">
      {imageTitle && <div className="entity-profile-art" aria-hidden="true"><Image src={`/api/title-image?title=${encodeURIComponent(imageTitle.title)}&type=${encodeURIComponent(imageTitle.type)}`} alt="" fill priority sizes="60vw" /></div>}
      <div><p className="eyebrow"><span /> {entity.kicker}</p><h1>{entity.name}</h1><p>{entity.summary}</p><span className="entity-status">{entity.status}</span></div><strong>{entity.symbol}</strong>
    </section>
    <section className="entity-explanation profile-section"><div><p className="section-label">01 / CONTEXTO</p><h2>QUÉ<br /><em>SIGNIFICA</em></h2></div><article><p>{entity.description}</p><aside><b>{entity.status}</b><span>{entity.status === "CONFIRMADO EN PANTALLA" ? "Información mostrada o expresada directamente en las producciones relacionadas." : "Síntesis NEXUS que conecta hechos mostrados sin presentarla como confirmación futura."}</span></aside></article></section>
    <section className="entity-titles profile-section"><header><p className="section-label">02 / PRODUCCIONES</p><h2>DÓNDE<br /><em>OCURRE</em></h2></header><div>{titles.map((title, index) => <Link href={`/titulos/${title.slug}`} key={title.slug}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{title.type} · {title.period}</small><h3>{title.title}</h3><p>{title.event}</p></div><i>↗</i></Link>)}</div></section>
    <section className="entity-connections profile-section"><header><p className="section-label">03 / MAPA NEXUS</p><h2>CONEXIONES<br /><em>DIRECTAS</em></h2></header><div className="entity-connection-grid">{connections.map(({ entity: connected, label }) => <Link href={getEntityHref(connected)} key={`${connected.kind}-${connected.slug}`} style={{ "--connection-accent": connected.color } as React.CSSProperties}><span>{connected.kind}</span><strong>{connected.symbol}</strong><h3>{connected.name}</h3><p>{label}</p><b>ABRIR NODO ↗</b></Link>)}</div></section>
    {relatedCharacters.length > 0 && <section className="entity-characters profile-section"><header><p className="section-label">04 / PERSONAJES</p><h2>QUIÉN ESTÁ<br /><em>IMPLICADO</em></h2></header><div>{relatedCharacters.map((character) => <Link href={`/personajes/${character.id}`} key={character.id}><Image src={character.image} alt="" fill sizes="(max-width: 650px) 50vw, 20vw" /><span>{character.role}</span><h3>{character.name}</h3></Link>)}</div></section>}
  </main>;
}
