import type { Character } from "@/types/character";

export type CharacterEditorialData = Pick<Character, "category" | "status" | "affiliations" | "variants" | "sources" | "reviewedAt">;

const reviewedAt = "2026-08-30";
const editorialById: Record<string, Omit<CharacterEditorialData, "sources" | "reviewedAt">> = {
  spider: { category: "HÉROE", status: "ACTIVO", affiliations: ["Vengadores"], variants: [{ name: "Peter Parker", universe: "Tierra-96283", description: "Spider-Man de una realidad alternativa que ayuda a reparar la fractura multiversal." }, { name: "Peter Parker", universe: "Tierra-120703", description: "Otra variante arácnida convocada por el hechizo de Strange." }] },
  iron: { category: "HÉROE", status: "INACTIVO", affiliations: ["Vengadores", "Stark Industries"], variants: [] },
  strange: { category: "HÉROE", status: "ACTIVO", affiliations: ["Maestros de las Artes Místicas"], variants: [{ name: "Defender Strange", universe: "Realidad alternativa", description: "Una variante que intenta proteger a América Chávez del multiverso." }, { name: "Sinister Strange", universe: "Realidad destruida", description: "Una versión corrompida por el Darkhold." }] },
  panther: { category: "HÉROE", status: "INACTIVO", affiliations: ["Wakanda", "Vengadores"], variants: [{ name: "Star-Lord T'Challa", universe: "Realidad animada", description: "Variante que fue abducida por los Devastadores y transformó el cosmos." }] },
  wanda: { category: "ANTI-HÉROE", status: "DESCONOCIDO", affiliations: ["Vengadores"], variants: [{ name: "Wanda Maximoff", universe: "Tierra-838", description: "Madre de Billy y Tommy en una realidad visitada durante una incursión." }] },
  "captain-america": { category: "HÉROE", status: "INACTIVO", affiliations: ["Vengadores", "Comandos Aulladores"], variants: [{ name: "Capitana Carter", universe: "Realidad animada", description: "Peggy Carter recibe el suero del supersoldado en lugar de Steve." }] },
  thor: { category: "HÉROE", status: "ACTIVO", affiliations: ["Vengadores", "Asgardianos"], variants: [{ name: "Party Thor", universe: "Realidad animada", description: "Una variante criada sin Loki como hermano." }] },
  hulk: { category: "HÉROE", status: "ACTIVO", affiliations: ["Vengadores"], variants: [] },
  "black-widow": { category: "HÉROE", status: "INACTIVO", affiliations: ["Vengadores", "S.H.I.E.L.D."], variants: [{ name: "Natasha Romanoff", universe: "Realidad animada", description: "Superviviente de una realidad arrasada por Ultron Infinito." }] },
  hawkeye: { category: "HÉROE", status: "ACTIVO", affiliations: ["Vengadores", "S.H.I.E.L.D."], variants: [] },
  loki: { category: "ANTI-HÉROE", status: "ACTIVO", affiliations: ["TVA", "Asgardianos"], variants: [{ name: "Sylvie", universe: "Rama temporal", description: "Variante fugitiva decidida a terminar con quienes controlaban su destino." }, { name: "Loki clásico", universe: "Rama temporal", description: "Sobrevivió a Thanos y dominó ilusiones de escala extraordinaria." }] },
  "captain-marvel": { category: "HÉROE", status: "ACTIVO", affiliations: ["Vengadores", "The Marvels"], variants: [] },
  "sam-wilson": { category: "HÉROE", status: "ACTIVO", affiliations: ["Vengadores", "Fuerzas Aéreas de EE. UU."], variants: [] },
};

export function getCharacterEditorialData(id: string, sourceUrl: string): CharacterEditorialData {
  const data = editorialById[id];
  if (!data) throw new Error(`Faltan metadatos editoriales para el personaje: ${id}`);
  return { ...data, reviewedAt, sources: [{ label: "Ficha oficial del personaje", url: sourceUrl }, { label: "Marvel Studios", url: "https://www.marvel.com/movies" }] };
}
