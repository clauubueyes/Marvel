import { readdir } from "node:fs/promises";
import path from "node:path";

const extensions = ["webp", "avif", "jpg", "jpeg", "png"];

/** Se consulta desde la página de servidor, nunca desde el navegador. */
export async function getCharacterStoryImages(characterId: string, count: number): Promise<(string | undefined)[]> {
  if (!/^[a-z0-9-]+$/.test(characterId)) throw new Error("Invalid character ID");
  const publicPath = `/characters/history/${characterId}`;
  let filenames: string[];
  try {
    const entries = await readdir(path.join(process.cwd(), "public", publicPath), { withFileTypes: true });
    filenames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    filenames = [];
  }
  return Array.from({ length: count }, (_, index) => {
    const filename = extensions.map((extension) => `acto-${index + 1}.${extension}`).find((name) => filenames.includes(name));
    return filename ? `${publicPath}/${filename}` : undefined;
  });
}
