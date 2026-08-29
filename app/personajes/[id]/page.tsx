import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { characters, getCharacter } from "@/lib/characters";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return characters.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const character = getCharacter((await params).id);
  return character
    ? { title: `${character.name} — Archivo NEXUS`, description: character.description }
    : { title: "Personaje no encontrado — NEXUS" };
}

export default async function CharacterPage({ params }: PageProps) {
  const character = getCharacter((await params).id);
  if (!character) notFound();

  const currentIndex = characters.findIndex(({ id }) => id === character.id);
  const previous = characters[(currentIndex - 1 + characters.length) % characters.length];
  const next = characters[(currentIndex + 1) % characters.length];

  return (
    <main className={`profile profile-${character.id}`} style={{ "--accent": character.color, "--accent-2": character.color2 } as React.CSSProperties}>
      <header className="profile-nav">
        <Link className="brand" href="/"><span>N</span>NEXUS</Link>
        <p>ARCHIVO / {character.number}</p>
        <Link href="/#characters">CERRAR <b>×</b></Link>
      </header>

      <section className="profile-hero">
        <div className="profile-grid" aria-hidden="true" />
        <div className="profile-title">
          <p className="eyebrow"><span /> {character.role}</p>
          <h1>{character.name}</h1>
          <div className="profile-meta"><span>{character.alias}</span><span>{character.universe}</span><span>{character.origin}</span></div>
        </div>
        <div className="profile-figure" aria-hidden="true">
          <div className="profile-rings"><i /><i /><i /></div>
          <div className="profile-body"><img src={character.image} alt={character.name} /></div>
          <b>{character.symbol}</b>
        </div>
        <blockquote>“{character.quote}”</blockquote>
        <div className="scroll-cue">DESPLAZA PARA EXPLORAR <span>↓</span></div>
      </section>

      <section className="profile-intro profile-section">
        <div><p className="section-label">01 / IDENTIDAD</p><h2>DETRÁS<br />DEL <em>SÍMBOLO</em></h2></div>
        <div className="intro-copy"><p>{character.description}</p><dl><div><dt>IDENTIDAD</dt><dd>{character.alias}</dd></div><div><dt>ORIGEN</dt><dd>{character.origin}</dd></div><div><dt>UNIVERSO</dt><dd>{character.universe}</dd></div></dl><a className="image-credit" href={character.sourceUrl} target="_blank" rel="noreferrer">IMAGEN Y PERSONAJE © MARVEL · VER FUENTE ↗</a></div>
      </section>

      <section className="profile-power profile-section">
        <div className="power-heading"><p className="section-label">02 / CAPACIDADES</p><h2>MEDIR LO<br/><em>IMPOSIBLE</em></h2></div>
        <div className="stat-list">
          {character.stats.map((stat) => <div className="stat" key={stat.label}>
            <div><span>{stat.label}</span><b>{stat.value}</b></div><div className="stat-track"><i style={{ width: `${stat.value}%` }} /></div>
          </div>)}
        </div>
        <div className="ability-list">
          {character.abilities.map((ability, index) => <div key={ability}><b>0{index + 1}</b><span>{ability}</span><i>{character.symbol}</i></div>)}
        </div>
      </section>

      <section className="profile-timeline profile-section">
        <div className="timeline-heading"><p className="section-label">03 / CRONOLOGÍA</p><h2>MOMENTOS<br/>QUE <em>DEFINEN</em></h2></div>
        <div className="timeline-line">
          {character.timeline.map((event) => <article key={event.title}><b>{event.year}</b><i /><h3>{event.title}</h3><p>{event.text}</p></article>)}
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
