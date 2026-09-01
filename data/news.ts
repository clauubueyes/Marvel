import type { NewsItem } from "@/types/news";

export const fallbackNews: NewsItem[] = [
  { id: "fallback-1", title: "Explora las últimas historias del universo Marvel", url: "https://www.marvel.com/articles", source: "Marvel", publishedAt: new Date().toISOString() },
  { id: "fallback-2", title: "Personajes, cómics y mundos que siguen creciendo", url: "https://www.marvel.com/comics", source: "Marvel", publishedAt: new Date(Date.now() - 86_400_000).toISOString() },
  { id: "fallback-3", title: "Descubre las novedades de Marvel Studios", url: "https://www.marvel.com/movies", source: "Marvel", publishedAt: new Date(Date.now() - 172_800_000).toISOString() },
];

export type { NewsItem } from "@/types/news";
