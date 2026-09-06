"use client";

import Image from "next/image";
import type { Character } from "@/types/character";
import { useYouTubeEmbed } from "@/hooks/useYouTubeEmbed";

export function CharacterScreenMoment({ character }: { character: Character }) {
  const { embedUrl, play } = useYouTubeEmbed(character.screenMoment.videoId);
  const videoTitle = `Vídeo oficial: ${character.screenMoment.title}`;

  return <section className="screen-moment profile-section" data-scroll-section data-section-index="02">
    <div className="moment-copy" data-reveal>
      <p className="section-label">02 / ESCENA ESENCIAL</p><span>{character.screenMoment.kicker}</span><h2>{character.screenMoment.title}</h2><p>{character.screenMoment.text}</p>
      <button type="button" onClick={play}>REPRODUCIR VÍDEO <b>▶</b></button>
    </div>
    <div className="moment-video" data-playing={Boolean(embedUrl)} data-reveal data-tilt>
      {embedUrl ? <iframe src={embedUrl} title={videoTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> :
        <button type="button" onClick={play} aria-label={`Reproducir ${videoTitle}`}>
          <Image src={`/moments/${character.id}.webp`} alt="" fill sizes="(max-width: 900px) 88vw, 50vw" />
          <span className="play"><i>▶</i></span><small>REPRODUCIR AQUÍ · YOUTUBE</small>
        </button>}
    </div>
  </section>;
}
