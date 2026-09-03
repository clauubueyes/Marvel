"use client";

import Image from "next/image";
import type { TitleDossier } from "@/types/title";
import { useYouTubeEmbed } from "@/hooks/useYouTubeEmbed";

type TitleTrailerProps = {
  title: TitleDossier;
  videoId: string;
};

export function TitleTrailer({ title, videoId }: TitleTrailerProps) {
  const { embedUrl, play } = useYouTubeEmbed(videoId);
  const trailerTitle = `Tráiler oficial de ${title.title}`;

  return (
    <div className="title-trailer" data-playing={Boolean(embedUrl)} data-reveal>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={trailerTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" onClick={play} aria-label={`Reproducir ${trailerTitle}`}>
          <Image
            src={`/trailers/${title.slug}.webp`}
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 88vw"
          />
          <span>TRÁILER OFICIAL</span>
          <strong aria-hidden="true">▶</strong>
          <b>REPRODUCIR AQUÍ</b>
        </button>
      )}
    </div>
  );
}
