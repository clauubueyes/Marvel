import { characters, type Character } from "@/lib/characters";
import { mcuCatalog, type MCUEntry } from "@/lib/mcuCatalog";

export type TitleDossier = MCUEntry & {
  characters: Character[];
  previous: MCUEntry;
  next: MCUEntry;
};

const titlesBySlug = new Map(mcuCatalog.map((title) => [title.slug, title]));

export function getTitle(slug: string) {
  return titlesBySlug.get(slug);
}

export function getCharactersForTitle(slug: string) {
  return characters.filter((character) =>
    character.appearances.some((appearance) => appearance.titleId === slug),
  );
}

export function getTitleDossier(slug: string): TitleDossier | undefined {
  const title = getTitle(slug);
  if (!title) return undefined;

  const currentIndex = mcuCatalog.findIndex((entry) => entry.slug === slug);
  return {
    ...title,
    characters: getCharactersForTitle(slug),
    previous: mcuCatalog[(currentIndex - 1 + mcuCatalog.length) % mcuCatalog.length],
    next: mcuCatalog[(currentIndex + 1) % mcuCatalog.length],
  };
}

export function validateContent() {
  const errors: string[] = [];
  const titleSlugs = new Set<string>();
  const characterIds = new Set<string>();

  for (const title of mcuCatalog) {
    if (titleSlugs.has(title.slug)) errors.push(`Slug de título duplicado: ${title.slug}`);
    titleSlugs.add(title.slug);
  }

  for (const character of characters) {
    if (characterIds.has(character.id)) errors.push(`ID de personaje duplicado: ${character.id}`);
    characterIds.add(character.id);

    for (const appearance of character.appearances) {
      if (!titleSlugs.has(appearance.titleId)) {
        errors.push(`${character.name}: la aparición "${appearance.title}" no enlaza con ningún título (${appearance.titleId})`);
      }
    }
  }

  return errors;
}
