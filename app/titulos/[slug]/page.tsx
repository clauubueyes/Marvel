import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionEffects } from "@/components/MotionEffects";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { SpoilerDisclosure } from "@/components/SpoilerDisclosure";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getEntitiesForTitle, getTitle, getTitleDossier } from "@/lib/contentRepository";
import { mcuCatalog } from "@/lib/mcuCatalog";
import { getEntityHref } from "@/lib/mcuEntities";
import { getEditorialCoverage, getTitleDetails } from "@/lib/content/titles/details";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return mcuCatalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = getTitleDossier((await params).slug);
  const details = title ? getTitleDetails(title.slug) : undefined;
  return title
    ? { title: `${title.title} — Archivo NEXUS`, description: details?.spoilerFreeSynopsis ?? title.event, alternates: { canonical: `/titulos/${title.slug}` }, openGraph: { title: title.title, description: details?.spoilerFreeSynopsis ?? title.event, url: `/titulos/${title.slug}` } }
    : { title: "Título no encontrado — NEXUS" };
}

export default async function TitlePage({ params }: PageProps) {
  const title = getTitleDossier((await params).slug);
  if (!title) notFound();

  const imageUrl = `/api/title-image?title=${encodeURIComponent(title.title)}&type=${encodeURIComponent(title.type)}`;
  const connectedEntities = getEntitiesForTitle(title.slug);
  const details = getTitleDetails(title.slug);
  const beforeTitles = details?.watchBefore.flatMap((slug) => { const related = getTitle(slug); return related ? [related] : []; }) ?? [];
  const afterTitles = details?.watchAfter.flatMap((slug) => { const related = getTitle(slug); return related ? [related] : []; }) ?? [];
  const schema = details ? {
    "@context": "https://schema.org",
    "@type": title.type === "PELÍCULA" ? "Movie" : "TVSeries",
    name: title.title,
    description: details.spoilerFreeSynopsis,
    datePublished: details.releaseDateISO,
    director: details.directors.map((name) => ({ "@type": "Person", name })),
    actor: details.cast.map((name) => ({ "@type": "Person", name })),
    contentRating: details.certification,
    sameAs: details.sources.map(({ url }) => url),
  } : undefined;

  return (
    <main className="title-profile" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
      <MotionEffects />
      <GlobalNavigation context={`ARCHIVO / ${String(title.order).padStart(2, "0")}`} />
      <Breadcrumbs items={[{ label: "TÍTULOS", href: "/titulos" }, { label: title.title }]} />
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll("<", "\\u003c") }} />}

      <section className="title-profile-hero">
        <div className="title-profile-art" aria-hidden="true">
          <Image src={imageUrl} alt="" fill priority sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="title-profile-copy">
          <p className="eyebrow"><span /> {title.type} · {title.phase}</p>
          <h1>{title.title}</h1>
          <p>{details?.spoilerFreeSynopsis ?? title.event}</p>
          <div className="title-profile-tags"><span>{details?.status ?? title.period}</span><span>{getEditorialCoverage(title.slug)}</span><span>{title.continuity}</span><span>ORDEN {String(title.order).padStart(2, "0")}</span></div>
        </div>
        <span className="title-profile-number">{String(title.order).padStart(2, "0")}</span>
      </section>

      <section className="title-dossier profile-section">
        <div className="title-dossier-heading" data-reveal>
          <p className="section-label">01 / EL ACONTECIMIENTO</p>
          <h2>QUÉ CAMBIA<br />EN EL <em>MCU</em></h2>
        </div>
        <div className="title-dossier-event" data-reveal><SpoilerDisclosure label="RESUMEN CON SPOILERS"><p>{title.event}</p></SpoilerDisclosure></div>
        <dl className="title-dossier-meta" data-reveal>
          <div><dt>{details ? "ESTRENO" : "POSICIÓN"}</dt><dd>{details?.releaseDate ?? title.period}</dd></div>
          <div><dt>{details ? "DURACIÓN" : "FORMATO"}</dt><dd>{details?.runtime ?? title.type}</dd></div>
          <div><dt>{details ? "CLASIFICACIÓN" : "ETAPA"}</dt><dd>{details?.certification ?? title.phase}</dd></div>
          <div><dt>{details ? "DISPONIBILIDAD" : "CONTINUIDAD"}</dt><dd>{details?.availability ?? title.continuity}</dd></div>
        </dl>
      </section>

      {details && <>
        <section className="title-credits profile-section">
          <header data-reveal><p className="section-label">02 / FICHA TÉCNICA</p><h2>QUIÉN LE DIO<br /><em>FORMA</em></h2></header>
          <div className="title-credit-columns" data-reveal><article><span>DIRECCIÓN</span>{details.directors.length ? details.directors.map((name) => <b key={name}>{name}</b>) : <b>POR CONFIRMAR</b>}</article><article><span>GUION</span>{details.writers.length ? details.writers.map((name) => <b key={name}>{name}</b>) : <b>POR CONFIRMAR</b>}</article><article><span>REPARTO PRINCIPAL</span>{details.cast.map((name) => <b key={name}>{name}</b>)}</article></div>
          {details.trailerId && <a className="title-trailer" href={`https://www.youtube.com/watch?v=${details.trailerId}`} target="_blank" rel="noreferrer" data-reveal><Image src={`https://img.youtube.com/vi/${details.trailerId}/maxresdefault.jpg`} alt={`Tráiler oficial de ${title.title}`} fill sizes="(max-width: 800px) 100vw, 55vw" /><span>TRÁILER OFICIAL</span><strong>▶</strong><b>VER EN YOUTUBE ↗</b></a>}
        </section>

        <section className="title-watch profile-section"><header><p className="section-label">03 / ORDEN DE VISIONADO</p><h2>ANTES Y<br /><em>DESPUÉS</em></h2></header><div className="title-watch-columns"><article><span>VER ANTES</span>{beforeTitles.length ? beforeTitles.map((related) => <Link href={`/titulos/${related.slug}`} key={related.slug}><small>{related.type} · {related.period}</small><strong>{related.title}</strong><i>↗</i></Link>) : <p>Esta historia funciona como punto de entrada.</p>}</article><article><span>CONTINUAR CON</span>{afterTitles.map((related) => <Link href={`/titulos/${related.slug}`} key={related.slug}><small>{related.type} · {related.period}</small><strong>{related.title}</strong><i>↗</i></Link>)}</article></div></section>

        <section className="title-postcredits profile-section"><header><p className="section-label">04 / DESPUÉS DE LOS CRÉDITOS</p><h2>QUÉ OCULTA<br /><em>EL FINAL</em></h2></header>{details.postCredits.length ? <SpoilerDisclosure label={`${details.postCredits.length} ${details.postCredits.length === 1 ? "ESCENA" : "ESCENAS"} POSCRÉDITOS`}>{details.postCredits.map((scene) => <article key={scene.label}><span>{scene.label}</span><p>{scene.description}</p></article>)}</SpoilerDisclosure> : <div className="no-postcredits"><strong>SIN ESCENAS POSCRÉDITOS</strong><p>La historia termina antes de que finalicen los créditos.</p></div>}</section>
      </>}

      <section className="title-cast profile-section">
        <div data-reveal>
          <p className="section-label">02 / PERSONAJES CONECTADOS</p>
          <h2>QUIÉN ESTÁ<br /><em>IMPLICADO</em></h2>
          <p>Personajes con expediente NEXUS cuya historia pasa por este título.</p>
        </div>
        {title.characters.length ? (
          <div className="title-cast-grid">
            {title.characters.map((character) => (
              <Link href={`/personajes/${character.id}`} key={character.id} data-reveal>
                <Image src={character.image} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" />
                <span>{character.role}</span><h3>{character.name}</h3><b>ABRIR EXPEDIENTE ↗</b>
              </Link>
            ))}
          </div>
        ) : <p className="title-cast-empty">Todavía no hay personajes enlazados a este expediente.</p>}
      </section>

      {connectedEntities.length > 0 && <section className="context-nodes profile-section"><header><p className="section-label">03 / CONEXIONES</p><h2>MÁS ALLÁ<br /><em>DEL TÍTULO</em></h2></header><div>{connectedEntities.map((entity) => <Link href={getEntityHref(entity)} key={`${entity.kind}-${entity.slug}`} style={{ "--node-accent": entity.color } as React.CSSProperties}><span>{entity.kind}</span><strong>{entity.symbol}</strong><h3>{entity.name}</h3><p>{entity.summary}</p><b>EXPLORAR ↗</b></Link>)}</div></section>}

      {details && <section className="title-sources"><div><span>ÚLTIMA REVISIÓN</span><strong>{details.reviewedAt}</strong></div><div><span>FUENTES OFICIALES</span>{details.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}</div><p>Los datos técnicos proceden de las fuentes enlazadas. Las explicaciones argumentales y relaciones son síntesis editoriales de NEXUS.</p></section>}

      <nav className="character-pagination title-pagination">
        <Link href={`/titulos/${title.previous.slug}`}><small>← ANTERIOR</small><strong>{title.previous.title}</strong></Link>
        <span>✦</span>
        <Link href={`/titulos/${title.next.slug}`}><small>SIGUIENTE →</small><strong>{title.next.title}</strong></Link>
      </nav>
    </main>
  );
}
