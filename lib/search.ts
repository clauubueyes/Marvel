import { characters } from "@/lib/characters";
import { mcuCatalog } from "@/lib/mcuCatalog";

export type SearchResult = {
  id: string;
  type: "PERSONAJE" | "TÍTULO";
  title: string;
  subtitle: string;
  description: string;
  href: string;
  image: string;
  searchText: string;
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

export const searchIndex: SearchResult[] = [
  ...characters.map((character): SearchResult => ({
    id: character.id,
    type: "PERSONAJE",
    title: character.name,
    subtitle: `${character.alias} · ${character.role}`,
    description: character.description,
    href: `/personajes/${character.id}`,
    image: character.image,
    searchText: normalize(`${character.name} ${character.alias} ${character.role} ${character.origin} ${character.universe} ${character.abilities.join(" ")} ${character.appearances.map(({ title }) => title).join(" ")}`),
  })),
  ...mcuCatalog.map((title): SearchResult => ({
    id: title.slug,
    type: "TÍTULO",
    title: title.title,
    subtitle: `${title.type} · ${title.period}`,
    description: title.event,
    href: `/titulos/${title.slug}`,
    image: `/api/title-image?title=${encodeURIComponent(title.title)}&type=${encodeURIComponent(title.type)}`,
    searchText: normalize(`${title.title} ${title.type} ${title.period} ${title.phase} ${title.continuity} ${title.event}`),
  })),
];

function editDistance(left: string, right: string) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex];
      previous[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[right.length];
}

export function searchContent(query: string, type: "TODO" | SearchResult["type"] = "TODO") {
  const normalizedQuery = normalize(query.trim());
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return searchIndex
    .filter((item) => type === "TODO" || item.type === type)
    .map((item) => {
      if (!terms.length) return { item, score: 1 };
      const title = normalize(item.title);
      let score = 0;
      for (const term of terms) {
        if (title === term) score += 100;
        else if (title.startsWith(term)) score += 60;
        else if (title.includes(term)) score += 40;
        else if (item.searchText.includes(term)) score += 20;
        else {
          const closeWord = item.searchText.split(/\s+/).some((word) => word.length > 3 && editDistance(word, term) <= (term.length > 6 ? 2 : 1));
          if (closeWord) score += 8;
          else return { item, score: 0 };
        }
      }
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title, "es"))
    .map(({ item }) => item);
}
