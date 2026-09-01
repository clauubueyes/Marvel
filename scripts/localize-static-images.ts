import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { characters } from "../repositories/characterRepository";
import { mcuCatalog } from "../data/mcuCatalog";
import { resolveTitleImage } from "../services/titleImageService";
import { getTitleDetails } from "../data/titles";

const staticImages = new Map<string, string>([
  ...characters.filter(({ image }) => image.startsWith("http")).map(({ id, image }) => [`characters/${id}`, image] as const),
  ["editorial/avengers-doomsday", "https://i.ytimg.com/vi/399Ez7WHK5s/maxresdefault.jpg"],
  ["editorial/avengers-endgame", "https://i.ytimg.com/vi/TcMBFSGVi1c/maxresdefault.jpg"],
  ["editorial/loki", "https://i.ytimg.com/vi/nW948Va-l10/maxresdefault.jpg"],
  ["editorial/spider-man-no-way-home", "https://i.ytimg.com/vi/JfVOs4VSpmA/maxresdefault.jpg"],
  ["editorial/doctor-strange-multiverse", "https://i.ytimg.com/vi/aWzlQ2N6qqg/maxresdefault.jpg"],
  ["editorial/deadpool-wolverine", "https://i.ytimg.com/vi/73_1biulkYk/maxresdefault.jpg"],
  ["editorial/fantastic-four", "https://i.ytimg.com/vi/18QQWa5MEcs/maxresdefault.jpg"],
  ["editorial/news-spider-man", "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg"],
  ["editorial/news-iron-man", "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg"],
  ["editorial/news-black-panther", "https://cdn.marvel.com/content/1x/blackpanther_lob_crd_01_4.jpg"],
]);

async function download([name, url]: [string, string]) {
  const output = path.join(process.cwd(), "public", `${name}.webp`);
  try {
    await access(output);
    return;
  } catch {}
  await mkdir(path.dirname(output), { recursive: true });
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${response.status} al descargar ${url}`);
  const source = Buffer.from(await response.arrayBuffer());
  await sharp(source).rotate().resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(output);
  console.log(`${name}.webp`);
}

async function main() {
  const queue = [...staticImages.entries()];
  for (let index = 0; index < queue.length; index += 6) {
    await Promise.all(queue.slice(index, index + 6).map(download));
  }

  for (let index = 0; index < mcuCatalog.length; index += 4) {
    await Promise.all(mcuCatalog.slice(index, index + 4).map(async ({ slug, title, type }) => {
      const url = await resolveTitleImage(title, type);
      if (!url) throw new Error(`No se encontró cartel para ${title}`);
      await download([`titles/${slug}`, url]);
    }));
  }

  const videoImages = [
    ...characters.map(({ id, image, screenMoment }) => [`moments/${id}`, screenMoment.videoId, image] as const),
    ...mcuCatalog.flatMap(({ slug }) => {
      const trailerId = getTitleDetails(slug)?.trailerId;
      return trailerId ? [[`trailers/${slug}`, trailerId, `/titles/${slug}.webp`] as const] : [];
    }),
  ];
  for (let index = 0; index < videoImages.length; index += 6) {
    await Promise.all(videoImages.slice(index, index + 6).map(async ([name, videoId, fallback]) => {
      try {
        await download([name, `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`]);
      } catch {
        try {
          await download([name, `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`]);
        } catch {
          const output = path.join(process.cwd(), "public", `${name}.webp`);
          await mkdir(path.dirname(output), { recursive: true });
          await sharp(path.join(process.cwd(), "public", fallback.replace(/^\//, ""))).webp({ quality: 82 }).toFile(output);
        }
      }
    }));
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
