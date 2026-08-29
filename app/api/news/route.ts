import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { fallbackNews, type NewsItem } from "@/lib/news";

const FEED_URL = "https://news.google.com/rss/search?q=Marvel&hl=es&gl=ES&ceid=ES:es";

type RssItem = {
  guid?: string | { "#text"?: string };
  title?: string;
  link?: string;
  pubDate?: string;
  source?: string | { "#text"?: string };
};

function textValue(value: RssItem["source"] | RssItem["guid"]) {
  if (typeof value === "string") return value;
  return value?.["#text"] ?? "";
}

function normalize(item: RssItem, index: number): NewsItem {
  const source = textValue(item.source) || "Actualidad Marvel";
  const title = (item.title ?? "Nueva historia del multiverso").replace(new RegExp(` - ${source}$`), "");
  return {
    id: textValue(item.guid) || item.link || `news-${index}`,
    title,
    url: item.link ?? "https://www.marvel.com/articles",
    source,
    publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const response = await fetch(FEED_URL, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`RSS respondió con ${response.status}`);

    const xml = await response.text();
    const parsed = new XMLParser({ ignoreAttributes: false }).parse(xml);
    const rawItems: RssItem[] = parsed?.rss?.channel?.item ?? [];
    const items = rawItems.slice(0, 6).map(normalize);
    if (!items.length) throw new Error("El RSS no contiene artículos");

    return NextResponse.json({ items, live: true }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ items: fallbackNews, live: false });
  }
}
