import { XMLParser } from "fast-xml-parser";
import { fallbackNews } from "@/data/news";
import type { NewsItem } from "@/types/news";

const FEED_URL = "https://news.google.com/rss/search?q=Marvel&hl=es&gl=ES&ceid=ES:es";

type RssItem = {
  guid?: string | { "#text"?: string };
  title?: string;
  link?: string;
  pubDate?: string;
  source?: string | { "#text"?: string };
};

function textValue(value: RssItem["source"] | RssItem["guid"]) {
  return typeof value === "string" ? value : value?.["#text"] ?? "";
}

function normalizeNewsItem(item: RssItem, index: number): NewsItem {
  const source = textValue(item.source) || "Actualidad Marvel";
  return {
    id: textValue(item.guid) || item.link || `news-${index}`,
    title: (item.title ?? "Nueva historia del multiverso").replace(new RegExp(` - ${source}$`), ""),
    url: item.link ?? "https://www.marvel.com/articles",
    source,
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
  };
}

export async function getMarvelNews() {
  try {
    const response = await fetch(FEED_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`RSS respondió con ${response.status}`);
    const xml = await response.text();
    const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
    const rawItems: RssItem[] = parsed?.rss?.channel?.item ?? [];
    const items = rawItems.slice(0, 6).map(normalizeNewsItem);
    if (!items.length) throw new Error("El RSS no contiene artículos");
    return { items, live: true };
  } catch {
    return { items: fallbackNews, live: false };
  }
}
