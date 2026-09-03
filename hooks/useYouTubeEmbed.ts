"use client";

import { useState } from "react";

export function useYouTubeEmbed(videoId: string) {
  const [embedUrl, setEmbedUrl] = useState<string>();

  const play = () => {
    const parameters = new URLSearchParams({
      autoplay: "1",
      rel: "0",
      origin: window.location.origin,
    });

    setEmbedUrl(`https://www.youtube-nocookie.com/embed/${videoId}?${parameters}`);
  };

  return { embedUrl, play };
}
