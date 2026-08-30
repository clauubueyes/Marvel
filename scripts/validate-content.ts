import { validateContent } from "../lib/contentRepository";

const errors = validateContent();

if (errors.length) {
  console.error("El contenido de NEXUS contiene relaciones no válidas:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("Contenido válido: slugs únicos y apariciones enlazadas.");
}
