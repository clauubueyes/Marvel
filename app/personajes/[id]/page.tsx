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

function IronTransition({ label, asset, tone }: { label: string; asset?: string; tone: "helmet" | "reactor" | "blueprint" }) {
  return <div className={`iron-section-transition iron-transition-${tone}`} aria-hidden="true"><div><span>STARK INDUSTRIES / SECUENCIA ACTIVA</span><strong>{label}</strong></div>{asset && <Image src={asset} alt="" fill unoptimized sizes="100vw" />}</div>;
}

function IronHud({ section = "OVERVIEW" }: { section?: string }) {
  return <div className="iron-hud" aria-hidden="true">
    <div className="iron-hud-corners"><i /><i /><i /><i /></div>
    <div className="iron-hud-coordinate iron-hud-coordinate-a">STARK OS // 42.817 N&nbsp;&nbsp;73.921 W</div>
    <div className="iron-hud-coordinate iron-hud-coordinate-b">TARGET LOCK / {section}</div>
  </div>;
}

function IronHeroScan() {
  return <div className="iron-hero-scan" aria-hidden="true">
    <div className="iron-scan-orbit"><i /><i /></div><div className="iron-scan-beam" />
    <div className="iron-scan-marker iron-scan-marker-core"><i /><span>ENERGY CORE<br /><b>ONLINE</b></span></div>
    <div className="iron-scan-marker iron-scan-marker-shoulder"><i /><span>SHOULDER PLATE<br /><b>INTEGRITY 98.7%</b></span></div>
    <div className="iron-scan-marker iron-scan-marker-hand"><i /><span>REPULSOR ARRAY<br /><b>CALIBRATED</b></span></div>
  </div>;
}

function ArmorDiagnostics({ stats }: { stats: { label: string; value: number }[] }) {
  const systems = ["REACTOR ARC", "PROPULSIÓN", "REPULSORES", "JARVIS LINK"];
  return <section className="iron-diagnostics profile-section" id="armadura" aria-label="Diagnóstico de armadura">
    <IronHud section="ARMOR" />
    <header><p className="section-label">05A / INGENIERÍA STARK</p><h2>MARK <em>85</em></h2><p>TELEMETRÍA DE ARMADURA / CONFIGURACIÓN DE CAMPO</p></header>
    <div className="iron-diagnostic-layout">
      <div className="iron-reactor-console" aria-hidden="true"><div className="iron-reactor-core"><span>ARC</span></div><small>ENERGY CORE</small><b>100<span>%</span></b></div>
      <div className="iron-system-list">{systems.map((system, index) => <div key={system}><span>SYS-0{index + 1}</span><strong>{system}</strong><b>ONLINE</b><i style={{ "--charge": `${[100, 96, 98, 92][index]}%` } as React.CSSProperties} /></div>)}</div>
      <div className="iron-spec-list">{stats.map((stat) => <div key={stat.label}><span>{stat.label}</span><b>{stat.value}<small>%</small></b><i><em style={{ width: `${stat.value}%` }} /></i></div>)}</div>
    </div>
  </section>;
}

function IronConnectionMap({ entities }: { entities: ReturnType<typeof getEntitiesForCharacter> }) {
  return <section className="iron-connection-map profile-section" aria-labelledby="iron-network-title">
    <IronHud section="NEXUS" />
    <header><p className="section-label">08 / RED NEXUS</p><h2 id="iron-network-title">CONEXIÓN<br /><em>ESTABLECIDA</em></h2><p>RELACIONES CONFIRMADAS EN EL ARCHIVO MCU</p></header>
    <div className="iron-network" style={{ "--node-count": entities.length } as React.CSSProperties}>
      <div className="iron-network-root"><i>◉</i><strong>IRON MAN</strong><span>SUBJECT / 02</span></div>
      {entities.map((entity, index) => <Link href={getEntityHref(entity)} key={`${entity.kind}-${entity.slug}`} className="iron-network-node" style={{ "--node-index": index, "--node-accent": entity.color } as React.CSSProperties}><i /><span>{entity.kind}</span><strong>{entity.name}</strong><small>OPEN NODE ↗</small></Link>)}
    </div>
  </section>;
}

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
  const heroImage = character.id === "iron" ? "/images/iron-man/iron-man-repulsor.jpg" : character.image;
  const portraitImage = character.id === "iron" ? "/images/iron-man/tony-armor.jpg" : character.image;
  const powerImage = character.id === "iron" ? "/images/iron-man/hologram-assembly.gif" : character.image;

  return (
    <main className={`profile profile-${character.id}`} style={{ "--accent": character.color, "--accent-2": character.color2 } as React.CSSProperties}>
      <MotionEffects />
      <div className="character-atmosphere" aria-hidden="true"><i /><i /><i /><i /></div>
      <GlobalNavigation context={`ARCHIVO / ${character.number}`} />
      <Breadcrumbs items={[{ label: "PERSONAJES", href: "/personajes" }, { label: character.name }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: character.name, alternateName: character.alias, description: character.description, image: character.image, sameAs: character.sourceUrl }).replaceAll("<", "\\u003c") }} />

      <section className="profile-hero">
        <div className="profile-grid" aria-hidden="true" />
        {character.id === "iron" && <><IronHud /><nav className="iron-system-nav" aria-label="Secciones del expediente"><a href="#identidad">OVERVIEW</a><a href="#armadura">ARMOR</a><a href="#historia">HISTORY</a><a href="#capacidades">ABILITIES</a></nav><div className="iron-hero-readout" aria-label="Estado de armadura"><span>SUIT STATUS <b>ONLINE</b></span><span>ARC REACTOR <b>100%</b></span><span>THREAT LEVEL <b>NOMINAL</b></span></div></>}
        <div className="profile-title">
          <p className="eyebrow"><span /> {character.role}</p>
          {character.id === "iron" && <p className="iron-subject-status">ANALYSIS COMPLETE <b>SUBJECT IDENTIFIED</b></p>}
          <h1>{character.name}</h1>
          <div className="profile-meta"><span>{character.alias}</span><span>{character.universe}</span><span>{character.origin}</span></div>
        </div>
        <div className={`profile-figure ${character.id === "iron" ? "profile-arrival profile-arrival-iron" : ""}`} aria-hidden="true">
          {character.id === "iron" && <><div className="arrival-trail"><i /><i /><i /><i /><i /></div><div className="iron-figure-label iron-figure-label-a">CHEST PLATE<br /><b>INTEGRITY 98.7</b></div><div className="iron-figure-label iron-figure-label-b">REPULSOR ARRAY<br /><b>CALIBRATED</b></div></>}
          {character.id === "iron" && <IronHeroScan />}
          <div className="profile-rings"><i /><i /><i /></div>
          <div className="profile-body"><Image src={heroImage} alt={character.name} fill priority unoptimized={character.id === "iron"} sizes="(max-width: 900px) 290px, 32vw" style={{ objectPosition: character.imagePosition ?? "center top" }} /></div>
          <b>{character.symbol}</b>
        </div>
        <blockquote>“{character.quote}”</blockquote>
        <div className="scroll-cue">DESPLAZA PARA EXPLORAR <span>↓</span></div>
      </section>
      {character.id === "iron" && <IronTransition tone="helmet" label="ARMADURA EN LÍNEA" asset="/images/iron-man/armor-up.gif" />}

      <section className="profile-intro profile-section" id="identidad">
        <div className="identity-title" data-reveal><p className="section-label">01 / IDENTIDAD</p><h2>DETRÁS<br />DEL <em>SÍMBOLO</em></h2><div className="identity-status"><i /> EXPEDIENTE ACTIVO <b>NXS-{character.number}616</b></div></div>
        <div className="identity-portrait" data-reveal aria-hidden="true">
          <div className="portrait-orbit"><i /><i /></div>
          <span className="portrait-symbol">{character.symbol}</span>
          <Image src={portraitImage} alt="" fill unoptimized={character.id === "iron"} sizes="(max-width: 560px) 86vw, 520px" style={{ objectPosition: character.imagePosition ?? "center top" }} />
          <b className="portrait-index">{character.number}</b>
          <small>{character.alias} / {character.role}</small>
        </div>
        <div className="intro-copy"><p>{character.description}</p><dl><div><dt>IDENTIDAD</dt><dd>{character.alias}</dd></div><div><dt>ORIGEN</dt><dd>{character.origin}</dd></div><div><dt>UNIVERSO</dt><dd>{character.universe}</dd></div><div><dt>FUNCIÓN</dt><dd>{character.category}</dd></div><div><dt>ESTADO</dt><dd>{character.status}</dd></div><div><dt>AFILIACIONES</dt><dd>{character.affiliations.join(" · ")}</dd></div></dl><a className="image-credit" href={character.sourceUrl} target="_blank" rel="noreferrer">IMAGEN Y PERSONAJE © MARVEL · VER FUENTE ↗</a></div>
      </section>
      {character.id === "iron" && <IronTransition tone="reactor" label="REACTOR ARC / ONLINE" asset="/images/iron-man/arc-reactor.gif" />}

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
          {character.id === "iron" && <div className="iron-video-metadata"><span>ARCHIVE / IM3-2013</span><span>CLASSIFICATION / RECOVERED</span><b>● REC</b></div>}<span className="play"><i>▶</i></span><small>FUENTE OFICIAL · YOUTUBE</small>
        </a>
      </section>
      {character.id === "iron" && <IronTransition tone="blueprint" label="PROYECCIÓN DE ARMADURA" />}

      <section className={`profile-facts profile-section ${character.id === "iron" ? "iron-recovered-data" : ""}`}>
        {character.id === "iron" && <div className="iron-facts-reactor" aria-hidden="true"><Image src="/images/iron-man/arc-reactor.gif" alt="" fill unoptimized sizes="260px" /></div>}
        <div className="facts-aura" aria-hidden="true"><span>{character.symbol}</span><i /><i /><i /></div>
        <div className="facts-heading" data-reveal><p className="section-label">03 / DATOS CURIOSOS</p><h2>LO QUE NO<br/><em>SE VE</em></h2><span>TRES FRAGMENTOS DEL EXPEDIENTE QUE CAMBIAN LA FORMA DE ENTENDER AL PERSONAJE.</span></div>
        <div className="facts-grid">
          {character.facts.map((fact, index) => <article data-reveal style={{ "--delay": `${index * 100}ms` } as React.CSSProperties} key={fact.label}><span>FRAGMENTO / 0{index + 1}</span><strong>{fact.value}</strong><h3>{fact.label}</h3><p>{fact.text}</p><small>{character.id === "iron" ? "DATA RECOVERED / VERIFIED" : ""}</small></article>)}
        </div>
      </section>

      <section className="filmography profile-section">
        <div className="film-heading" data-reveal><p className="section-label">04 / EN PANTALLA</p><h2>SU HISTORIA<br/><em>EN CINE</em></h2><p>Una selección de los capítulos que definieron su recorrido audiovisual.</p></div>
        <div className="film-reel" data-reveal>
          {character.appearances.map((appearance, index) => <Link href={`/titulos/${appearance.titleId}`} key={appearance.title}><b>{String(index + 1).padStart(2, "0")}</b><div><span>{appearance.type}</span><h3>{appearance.title}</h3></div><strong>{appearance.year}</strong><i>↗</i></Link>)}
        </div>
      </section>

      {character.id === "iron" && <ArmorDiagnostics stats={character.stats} />}
      <section className="profile-power profile-section" id="capacidades">
        <div className="power-heading" data-reveal><p className="section-label">05 / CAPACIDADES</p><h2>MEDIR LO<br/><em>IMPOSIBLE</em></h2><span>LECTURA DE ENERGÍA / NEXUS</span></div>
        <div className="power-core" data-reveal aria-hidden="true">
          <div className="core-rings"><i /><i /><i /></div>
          <Image src={powerImage} alt="" fill unoptimized={character.id === "iron"} sizes="(max-width: 560px) 88vw, 45vw" />
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

      <section className="profile-timeline profile-section character-story" id="historia">
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

      {connectedEntities.length > 0 && (character.id === "iron" ? <IronConnectionMap entities={connectedEntities} /> : <section className="context-nodes profile-section"><header><p className="section-label">07 / CONEXIONES</p><h2>SU LUGAR<br /><em>EN EL NEXUS</em></h2></header><div>{connectedEntities.map((entity) => <Link href={getEntityHref(entity)} key={`${entity.kind}-${entity.slug}`} style={{ "--node-accent": entity.color } as React.CSSProperties}><span>{entity.kind}</span><strong>{entity.symbol}</strong><h3>{entity.name}</h3><p>{entity.summary}</p><b>EXPLORAR ↗</b></Link>)}</div></section>)}

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
