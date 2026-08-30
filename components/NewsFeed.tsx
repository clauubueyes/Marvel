"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fallbackNews, type NewsItem } from "@/lib/news";

const artClasses = ["story-red", "story-blue", "story-purple"];
const symbols = ["🕸", "⚡", "◇"];
const artwork = [
  "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg",
  "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg",
  "https://cdn.marvel.com/content/1x/blackpanther_lob_crd_01_4.jpg",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(value)).toUpperCase();
}

export function NewsFeed() {
  const [items, setItems] = useState<NewsItem[]>(fallbackNews);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/news", { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { items?: NewsItem[]; live?: boolean }) => {
        if (data.items?.length) setItems(data.items);
        setIsLive(Boolean(data.live));
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return (
    <>
      <div className="stories-head" data-reveal>
        <div><p className="eyebrow"><span /> ÚLTIMA TRANSMISIÓN {isLive && <i className="live-dot">EN DIRECTO</i>}</p><h2>DESDE EL<br/><em>MULTIVERSO</em></h2></div>
        <a href="https://news.google.com/search?q=Marvel&hl=es&gl=ES&ceid=ES%3Aes" target="_blank" rel="noreferrer">VER TODAS ↗</a>
      </div>
      <div className="story-grid">
        {items.slice(0, 3).map((story, index) => <article data-reveal data-tilt style={{ "--delay": `${index * 90}ms` } as React.CSSProperties} className={`story ${artClasses[index]}`} key={story.id}>
          <div className="story-art"><Image src={artwork[index]} alt="" fill sizes="(max-width: 900px) 50vw, 33vw" /><span>{symbols[index]}</span><b>0{index + 1}</b><i>SEÑAL / NEXUS</i></div>
          <div className="story-copy"><p><span>{story.source}</span>{formatDate(story.publishedAt)}</p><h3>{story.title}</h3><a href={story.url} target="_blank" rel="noreferrer">LEER HISTORIA <b>→</b></a></div>
        </article>)}
      </div>
    </>
  );
}
