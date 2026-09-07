import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const extensions = ["webp", "avif", "jpg", "jpeg", "png"];

/** Se consulta desde la página de servidor, nunca desde el navegador. */
export async function getCharacterStoryImages(characterId: string, count: number): Promise<(string | undefined)[]> {
  if (!/^[a-z0-9-]+$/.test(characterId)) throw new Error("Invalid character ID");
  const publicPath = `/characters/history/${characterId}`;
  const absolutePath = path.join(process.cwd(), "public", publicPath);
  let filenames: string[];
  try {
    const entries = await readdir(absolutePath, { withFileTypes: true });
    filenames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    filenames = [];
  }
  return Promise.all(
    Array.from({ length: count }, async (_, index) => {
      const filename = extensions.map((extension) => `acto-${index + 1}.${extension}`).find((name) => filenames.includes(name));
      if (!filename) return undefined;
      const version = await getVersionStamp(path.join(absolutePath, filename));
      return version === null ? `${publicPath}/${filename}` : `${publicPath}/${filename}?v=${version}`;
    }),
  );
}

/** Cache-buster: marca de tiempo de modificación del archivo (ms) para que el
 * navegador no reutilice versiones antiguas al cambiar la imagen. */
async function getVersionStamp(filePath: string): Promise<string | null> {
  try {
    const file = await stat(filePath);
    return String(file.mtimeMs).replace(".", "");
  } catch {
    return null;
  }
}
