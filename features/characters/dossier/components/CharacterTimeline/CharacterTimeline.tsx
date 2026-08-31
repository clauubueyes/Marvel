import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types/character";

export function CharacterTimeline({ character }: { character: Character }) {
  return <section className="profile-timeline profile-section character-story" data-scroll-section data-section-index="06">
    <div className="timeline-heading character-story-heading" data-reveal><div><p className="section-label">06 / CRONOLOGÍA</p><h2>MOMENTOS<br/>QUE <em>DEFINEN</em></h2></div><aside><b>{String(character.appearances.length).padStart(2, "0")}</b><p>Películas y series. Cada capítulo revela qué sucede y cómo transforma a {character.name}.</p></aside></div>
    <div className="character-story-rail">{character.appearances.map((appearance, index) => <article className="character-story-event" key={appearance.title} data-reveal style={{ "--delay": `${Math.min(index, 7) * 80}ms` } as React.CSSProperties}>
      <div className="story-event-art"><Image src={`/api/title-image?title=${encodeURIComponent(appearance.title)}&type=${encodeURIComponent(appearance.type)}`} alt={`Imagen de ${appearance.title}`} fill sizes="(max-width: 560px) 84vw, 30vw" /><span>{String(index + 1).padStart(2, "0")}</span></div>
      <div className="story-event-point"><i /></div><div className="story-event-copy"><div><b>{appearance.year}</b><small>{appearance.type}</small></div><h3><Link href={`/titulos/${appearance.titleId}`}>{appearance.title} ↗</Link></h3><p>{appearance.event}</p></div>
    </article>)}</div>
    <p className="story-scroll-cue">DESLIZA PARA RECORRER SU HISTORIA <span>→</span></p>
  </section>;
}
