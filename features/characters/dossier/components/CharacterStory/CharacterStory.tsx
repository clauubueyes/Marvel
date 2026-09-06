import Image from "next/image";
import type { Character } from "@/types/character";

export function CharacterStory({ character }: { character: Character }) {
  return <section className="profile-timeline profile-section character-story" data-scroll-section data-section-index="06">
    <div className="timeline-heading character-story-heading" data-reveal><div><p className="section-label">06 / HISTORIA</p><h2>LA HISTORIA<br/>DE <em>{character.name}</em></h2></div><aside><b>{String(character.story.length).padStart(2, "0")}</b><p>Capítulos clave. No un listado de apariciones, sino los momentos que definen a {character.name}.</p></aside></div>
    {character.story.length > 0
      ? <div className="character-story-rail" style={{ "--story-count": character.story.length } as React.CSSProperties}>{character.story.map((chapter, index) => <article className="character-story-event" key={chapter.kicker} data-reveal style={{ "--delay": `${Math.min(index, 7) * 80}ms` } as React.CSSProperties}>
        <div className="story-event-art story-event-cover"><Image src={character.image} alt={character.name} fill sizes="(max-width: 560px) 84vw, 30vw" /><span>{chapter.year}</span><i>{chapter.kicker}<b>{chapter.title}</b></i></div>
        <div className="story-event-point"><i /></div><div className="story-event-copy"><h3>{chapter.title}</h3><p>{chapter.text}</p></div>
      </article>)}</div>
      : <p className="story-coming-soon">La historia en pantalla de {character.name} llegará a este manifiesto próximamente. Sus apariciones ya están recogidas en {character.appearances.length > 0 ? "EN PANTALLA (04)" : "el catálogo de títulos"}.</p>}
    {character.story.length > 0 && <p className="story-scroll-cue">DESLIZA PARA RECORRER SU HISTORIA <span>→</span></p>}
  </section>;
}
