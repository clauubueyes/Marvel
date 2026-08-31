import { NextRequest, NextResponse } from "next/server";

type WikiPage = { thumbnail?: { source?: string } };
type WikiResponse = { query?: { pages?: Record<string, WikiPage> } };
type ImdbItem = { i?: { imageUrl?: string }; qid?: string };
type ImdbResponse = { d?: ImdbItem[] };

const aliases: Record<string, string> = {
  "Capitán América: El Primer Vengador": "Captain America The First Avenger",
  "Capitana Marvel": "Captain Marvel film",
  "El Increíble Hulk": "The Incredible Hulk film",
  "Los Vengadores": "The Avengers 2012 film",
  "Thor: El Mundo Oscuro": "Thor The Dark World",
  "Capitán América: El Soldado de Invierno": "Captain America The Winter Soldier",
  "Vengadores: La Era de Ultrón": "Avengers Age of Ultron",
  "Capitán América: Civil War": "Captain America Civil War",
  "Spider-Man: Lejos de casa": "Spider-Man Far From Home",
  "Doctor Strange en el Multiverso de la Locura": "Doctor Strange in the Multiverse of Madness",
  "Ojo de Halcón": "Hawkeye television series",
  "Caballero Luna": "Moon Knight television series",
  "Thor: Love and Thunder": "Thor Love and Thunder",
  "Ant-Man y la Avispa: Quantumanía": "Ant-Man and the Wasp Quantumania",
  "Capitán América: Brave New World": "Captain America Brave New World",
  "Guardianes de la Galaxia: Especial Felices Fiestas": "The Guardians of the Galaxy Holiday Special",
  "Los Cuatro Fantásticos: Primeros pasos": "The Fantastic Four First Steps",
  "Tu amigo y vecino Spider-Man": "Your Friendly Neighborhood Spider-Man",
  "Agatha, ¿quién si no?": "Agatha All Along television series",
  "Deadpool y Lobezno": "Deadpool & Wolverine",
  "Guardianes de la Galaxia": "Guardians of the Galaxy",
  "Guardianes de la Galaxia Vol. 2": "Guardians of the Galaxy Vol 2",
  "Guardianes de la Galaxia Vol. 3": "Guardians of the Galaxy Vol 3",
  "Vengadores: Infinity War": "Avengers Infinity War",
  "Vengadores: Endgame": "Avengers Endgame",
  "Viuda Negra": "Black Widow",
  "Bruja Escarlata y Visión": "WandaVision",
  "Falcon y el Soldado de Invierno": "The Falcon and the Winter Soldier",
  "Shang-Chi y la leyenda de los Diez Anillos": "Shang-Chi and the Legend of the Ten Rings",
  "Black Panther: Wakanda Forever": "Black Panther Wakanda Forever",
  "Invasión Secreta": "Secret Invasion",
  "The Marvels": "The Marvels",
  "I Am Groot · Temporadas 1 y 2": "I Am Groot",
};

function cleanTitle(title: string) {
  return (aliases[title] ?? title)
    .replace(/\s*[··]\s*Temporadas?.*$/i, "")
    .replace(/\s*[··]\s*Temporada.*$/i, "")
    .trim();
}

async function findThumbnail(title: string, media: string, language: "es" | "en") {
  const kind = media === "PELÍCULA" ? "film" : media === "SERIE" ? "television series" : media === "PERSONAJE" ? "Marvel Cinematic Universe character" : "television special";
  const query = encodeURIComponent(`${cleanTitle(title)} ${kind} Marvel`);
  const url = `https://${language}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrlimit=3&prop=pageimages&piprop=thumbnail&pilicense=any&pithumbsize=720&format=json`;
  const response = await fetch(url, { cache: "force-cache", headers: { "User-Agent": "Marvel-Nexus/1.0 (image resolver)" } });
  if (!response.ok) return null;
  const data = await response.json() as WikiResponse;
  return Object.values(data.query?.pages ?? {}).find(page => page.thumbnail?.source)?.thumbnail?.source ?? null;
}

async function findImdbImage(title: string, media: string) {
  const query = cleanTitle(title).toLowerCase().replace(/[^a-z0-9áéíóúüñ]+/gi, "_");
  const response = await fetch(`https://v3.sg.media-imdb.com/suggestion/x/${encodeURIComponent(query)}.json`, { cache: "force-cache" });
  if (!response.ok) return null;
  const data = await response.json() as ImdbResponse;
  const expected = media === "PELÍCULA" ? ["movie"] : media === "SERIE" ? ["tvSeries", "tvMiniSeries"] : ["tvSpecial", "short"];
  const candidates = data.d?.filter(item => item.i?.imageUrl) ?? [];
  return (candidates.find(item => item.qid && expected.includes(item.qid)) ?? candidates[0])?.i?.imageUrl ?? null;
}

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title")?.trim();
  const media = request.nextUrl.searchParams.get("type")?.trim() ?? "";
  if (!title) return new NextResponse(null, { status: 400 });

  const image = await resolveTitleImage(title, media);
  if (!image) return new NextResponse(null, { status: 404 });
  const imageUrl = new URL(image);
  if (!imageUrl.hostname.endsWith("wikimedia.org") && !imageUrl.hostname.endsWith("media-amazon.com")) return new NextResponse(null, { status: 404 });

  try {
    const imageResponse = await fetch(imageUrl, {
      cache: "force-cache",
      headers: { "User-Agent": "Marvel-Nexus/1.0 (image proxy)" },
      signal: AbortSignal.timeout(8000),
    });
    const contentType = imageResponse.headers.get("content-type") ?? "";
    if (!imageResponse.ok || !contentType.startsWith("image/") || !imageResponse.body) return new NextResponse(null, { status: 404 });

    return new NextResponse(imageResponse.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch {
    return new NextResponse(null, { status: 504 });
  }
}

export async function resolveTitleImage(title: string, media: string) {
  return (media === "PERSONAJE" ? null : await findImdbImage(title, media))
    ?? await findThumbnail(title, media, "en")
    ?? await findThumbnail(title, media, "es");
}
