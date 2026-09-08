"use client";

import Image from "next/image";
import { useYouTubeEmbed } from "@/hooks/useYouTubeEmbed";
import "./NextTrailer.css";

export function NextTrailer({ videoId, title, slug, active }: { videoId: string; title: string; slug: string; active: boolean }) {
  const { embedUrl, play } = useYouTubeEmbed(videoId);
  return <div className="next-watch-trailer">
    {active && embedUrl ? <iframe src={embedUrl} title={`Tráiler oficial de ${title}`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      : <button type="button" onClick={play} disabled={!active} aria-label={`Reproducir tráiler de ${title}`}><Image data-trailer-poster src={`/trailers/${slug}.webp`} alt="" fill sizes="(max-width: 900px) 88vw, 47vw" /><span aria-hidden="true">▶</span><b>VER TRÁILER OFICIAL</b></button>}
  </div>;
}
