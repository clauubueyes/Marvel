import { validateContent } from "../repositories/contentRepository";
import { characters } from "../repositories/characterRepository";
import { mcuCatalog } from "../data/mcuCatalog";
import { validateCharacterSpoilers } from "../validation/characterSpoilers";
import { validateProgressRelations } from "../validation/progressRelations";

const errors = [
  ...validateContent(),
  ...validateCharacterSpoilers(characters, new Set(mcuCatalog.map(({ slug }) => slug))),
  ...validateProgressRelations(),
];

if (errors.length) {
  console.error("El contenido de NEXUS contiene relaciones no válidas:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("Contenido válido: catálogo editorial completo, slugs únicos, relaciones enlazadas y requisitos de spoilers etiquetados.");
}
