import Image from "next/image";
import type { Character } from "@/types/character";

export function CharacterScreenMoment({ character }: { character: Character }) {
  const videoUrl = `https://www.youtube.com/watch?v=${character.screenMoment.videoId}`;
  return <section className="screen-moment profile-section" data-scroll-section data-section-index="02">
    <div className="moment-copy" data-reveal>
      <p className="section-label">02 / ESCENA ESENCIAL</p><span>{character.screenMoment.kicker}</span><h2>{character.screenMoment.title}</h2><p>{character.screenMoment.text}</p>
      <a href={videoUrl} target="_blank" rel="noreferrer">VER VÍDEO OFICIAL <b>↗</b></a>
    </div>
    <a className="moment-video" data-reveal data-tilt href={videoUrl} target="_blank" rel="noreferrer" aria-label={`Ver ${character.screenMoment.title}`}>
      <Image src={`/moments/${character.id}.webp`} alt={`Fotograma del tráiler: ${character.screenMoment.title}`} fill sizes="(max-width: 900px) 88vw, 50vw" />
      <span className="play"><i>▶</i></span><small>FUENTE OFICIAL · YOUTUBE</small>
    </a>
  </section>;
}
