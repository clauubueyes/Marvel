import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/lib/characters";
import { MotionEffects } from "@/components/MotionEffects";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getEntitiesForCharacter, getViewingRoutesForCharacter } from "@/lib/contentRepository";
import { getEntityHref } from "@/lib/mcuEntities";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return characters.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const character = getCharacter((await params).id);
  return character
    ? { title: `${character.name} — Archivo NEXUS`, description: character.description, alternates: { canonical: `/personajes/${character.id}` }, openGraph: { title: character.name, description: character.description, url: `/personajes/${character.id}` } }
    : { title: "Personaje no encontrado — NEXUS" };
}

export default async function CharacterPage({ params }: PageProps) {
  const character = getCharacter((await params).id);
  if (!character) notFound();

  const currentIndex = characters.findIndex(({ id }) => id === character.id);
  const previous = characters[(currentIndex - 1 + characters.length) % characters.length];
  const next = characters[(currentIndex + 1) % characters.length];
  const connectedEntities = getEntitiesForCharacter(character.id);
  const relatedRoutes = getViewingRoutesForCharacter(character.id);

  return (
    <main className={`profile profile-${character.id}`} style={{ "--accent": character.color, "--accent-2": character.color2 } as React.CSSProperties}>
      <MotionEffects />
      <div className="character-atmosphere" aria-hidden="true"><i /><i /><i /><i /></div>
      <GlobalNavigation context={`ARCHIVO / ${character.number}`} />
      <Breadcrumbs items={[{ label: "PERSONAJES", href: "/personajes" }, { label: character.name }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: character.name, alternateName: character.alias, description: character.description, image: character.image, sameAs: character.sourceUrl }).replaceAll("<", "\\u003c") }} />

      <section className="profile-hero">
        <div className="profile-grid" aria-hidden="true" />
        <div className="profile-title">
          <p className="eyebrow"><span /> {character.role}</p>
          <h1>{character.name}</h1>
          <div className="profile-meta"><span>{character.alias}</span><span>{character.universe}</span><span>{character.origin}</span></div>
        </div>
        <div className={`profile-figure profile-arrival profile-arrival-${character.id}`} aria-hidden="true">
          <div className="arrival-trail"><i /><i /><i /><i /><i /></div>
          <div className="profile-rings"><i /><i /><i /></div>
          <div className="profile-body"><Image src={character.image} alt={character.name} fill priority sizes="(max-width: 900px) 290px, 32vw" style={{ objectPosition: character.imagePosition ?? "center top" }} /></div>
          <b>{character.symbol}</b>
        </div>
        <blockquote>“{character.quote}”</blockquote>
        <div className="scroll-cue">DESPLAZA PARA EXPLORAR <span>↓</span></div>
      </section>

      <section className="profile-intro profile-section">
        <div className="identity-title" data-reveal><p className="section-label">01 / IDENTIDAD</p><h2>DETRÁS<br />DEL <em>SÍMBOLO</em></h2><div className="identity-status"><i /> EXPEDIENTE ACTIVO <b>NXS-{character.number}616</b></div></div>
        <div className="identity-portrait" data-reveal aria-hidden="true">
          <div className="portrait-orbit"><i /><i /></div>
          <span className="portrait-symbol">{character.symbol}</span>
          <Image src={character.image} alt="" fill sizes="(max-width: 560px) 86vw, 520px" style={{ objectPosition: character.imagePosition ?? "center top" }} />
          <b className="portrait-index">{character.number}</b>
          <small>{character.alias} / {character.role}</small>
        </div>
        <div className="intro-copy"><p>{character.description}</p><dl><div><dt>IDENTIDAD</dt><dd>{character.alias}</dd></div><div><dt>ORIGEN</dt><dd>{character.origin}</dd></div><div><dt>UNIVERSO</dt><dd>{character.universe}</dd></div><div><dt>FUNCIÓN</dt><dd>{character.category}</dd></div><div><dt>ESTADO</dt><dd>{character.status}</dd></div><div><dt>AFILIACIONES</dt><dd>{character.affiliations.join(" · ")}</dd></div></dl><a className="image-credit" href={character.sourceUrl} target="_blank" rel="noreferrer">IMAGEN Y PERSONAJE © MARVEL · VER FUENTE ↗</a></div>
      </section>

      <section className="screen-moment profile-section">
        <div className="moment-copy" data-reveal>
          <p className="section-label">02 / ESCENA ESENCIAL</p>
          <span>{character.screenMoment.kicker}</span>
          <h2>{character.screenMoment.title}</h2>
          <p>{character.screenMoment.text}</p>
          <a href={`https://www.youtube.com/watch?v=${character.screenMoment.videoId}`} target="_blank" rel="noreferrer">VER VÍDEO OFICIAL <b>↗</b></a>
        </div>
        <a className="moment-video" data-reveal data-tilt href={`https://www.youtube.com/watch?v=${character.screenMoment.videoId}`} target="_blank" rel="noreferrer" aria-label={`Ver ${character.screenMoment.title}`}>
          <Image src={`https://img.youtube.com/vi/${character.screenMoment.videoId}/maxresdefault.jpg`} alt={`Fotograma del tráiler: ${character.screenMoment.title}`} fill sizes="(max-width: 900px) 88vw, 50vw" />
          <span className="play"><i>▶</i></span><small>FUENTE OFICIAL · YOUTUBE</small>
        </a>
      </section>

      <section className="profile-facts profile-section">
        <div className="facts-aura" aria-hidden="true"><span>{character.symbol}</span><i /><i /><i /></div>
        <div className="facts-heading" data-reveal><p className="section-label">03 / DATOS CURIOSOS</p><h2>LO QUE NO<br/><em>SE VE</em></h2><span>TRES FRAGMENTOS DEL EXPEDIENTE QUE CAMBIAN LA FORMA DE ENTENDER AL PERSONAJE.</span></div>
        <div className="facts-grid">
          {character.facts.map((fact, index) => <article data-reveal style={{ "--delay": `${index * 100}ms` } as React.CSSProperties} key={fact.label}><span>0{index + 1}</span><strong>{fact.value}</strong><h3>{fact.label}</h3><p>{fact.text}</p></article>)}
        </div>
      </section>

      <section className="filmography profile-section">
        <div className="film-heading" data-reveal><p className="section-label">04 / EN PANTALLA</p><h2>SU HISTORIA<br/><em>EN CINE</em></h2><p>Una selección de los capítulos que definieron su recorrido audiovisual.</p></div>
        <div className="film-reel" data-reveal>
          {character.appearances.map((appearance, index) => <Link href={`/titulos/${appearance.titleId}`} key={appearance.title}><b>{String(index + 1).padStart(2, "0")}</b><div><span>{appearance.type}</span><h3>{appearance.title}</h3></div><strong>{appearance.year}</strong><i>↗</i></Link>)}
        </div>
      </section>

      <section className="profile-power profile-section">
        <div className="power-heading" data-reveal><p className="section-label">05 / CAPACIDADES</p><h2>MEDIR LO<br/><em>IMPOSIBLE</em></h2><span>LECTURA DE ENERGÍA / NEXUS</span></div>
        <div className="power-core" data-reveal aria-hidden="true">
          <div className="core-rings"><i /><i /><i /></div>
          <Image src={character.image} alt="" fill sizes="(max-width: 560px) 88vw, 45vw" />
          <strong>{character.symbol}</strong><span>NIVEL<br/>OMEGA</span>
        </div>
        <div className="stat-list" data-reveal>
          {character.stats.map((stat) => <div className="stat" key={stat.label}>
            <div><span>{stat.label}</span><b>{stat.value}</b></div><div className="stat-track"><i style={{ width: `${stat.value}%` }} /></div>
          </div>)}
        </div>
        <div className="ability-list">
          {character.abilities.map((ability, index) => <div key={ability}><b>0{index + 1}</b><span>{ability}</span><i>{character.symbol}</i></div>)}
        </div>
      </section>

      <section className="profile-timeline profile-section character-story">
        <div className="timeline-heading character-story-heading">
          <div><p className="section-label">06 / CRONOLOGÍA</p><h2>MOMENTOS<br/>QUE <em>DEFINEN</em></h2></div>
          <aside><b>{String(character.appearances.length).padStart(2, "0")}</b><p>Películas y series. Cada capítulo revela qué sucede y cómo transforma a {character.name}.</p></aside>
        </div>
        <div className="character-story-rail">
          {character.appearances.map((appearance, index) => <article className="character-story-event" key={appearance.title}>
            <div className="story-event-art"><Image src={`/api/title-image?title=${encodeURIComponent(appearance.title)}&type=${encodeURIComponent(appearance.type)}`} alt={`Imagen de ${appearance.title}`} fill sizes="(max-width: 560px) 84vw, 30vw" /><span>{String(index + 1).padStart(2, "0")}</span></div>
            <div className="story-event-point"><i /></div>
            <div className="story-event-copy"><div><b>{appearance.year}</b><small>{appearance.type}</small></div><h3><Link href={`/titulos/${appearance.titleId}`}>{appearance.title} ↗</Link></h3><p>{appearance.event}</p></div>
          </article>)}
        </div>
        <p className="story-scroll-cue">DESLIZA PARA RECORRER SU HISTORIA <span>→</span></p>
      </section>

      {connectedEntities.length > 0 && <section className="context-nodes profile-section"><header><p className="section-label">07 / CONEXIONES</p><h2>SU LUGAR<br /><em>EN EL NEXUS</em></h2></header><div>{connectedEntities.map((entity) => <Link href={getEntityHref(entity)} key={`${entity.kind}-${entity.slug}`} style={{ "--node-accent": entity.color } as React.CSSProperties}><span>{entity.kind}</span><strong>{entity.symbol}</strong><h3>{entity.name}</h3><p>{entity.summary}</p><b>EXPLORAR ↗</b></Link>)}</div></section>}

      <section className="character-reference profile-section">
        <header><p className="section-label">08 / EXPEDIENTE EDITORIAL</p><h2>VARIANTES Y<br /><em>RECORRIDOS</em></h2></header>
        <div className="character-reference-grid">
          <article><span>VARIANTES</span>{character.variants.length ? character.variants.map((variant) => <div key={`${variant.name}-${variant.universe}`}><h3>{variant.name}</h3><b>{variant.universe}</b><p>{variant.description}</p></div>) : <p>No hay variantes audiovisuales relevantes documentadas.</p>}</article>
          <article><span>QUÉ VER PARA CONOCERLE</span>{relatedRoutes.map((route) => <Link href={`/rutas/${route.slug}`} key={route.slug}><h3>{route.name}</h3><p>{route.description}</p><b>ABRIR RECORRIDO ↗</b></Link>)}</article>
          <article><span>FUENTES Y REVISIÓN</span>{character.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}<p>Última revisión: <time dateTime={character.reviewedAt}>{character.reviewedAt}</time></p></article>
        </div>
      </section>

      <nav className="character-pagination">
        <Link href={`/personajes/${previous.id}`}><small>← ANTERIOR</small><strong>{previous.name}</strong></Link>
        <span>{character.symbol}</span>
        <Link href={`/personajes/${next.id}`}><small>SIGUIENTE →</small><strong>{next.name}</strong></Link>
      </nav>
    </main>
  );
}
