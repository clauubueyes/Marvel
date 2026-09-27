import { runValidation } from "../validation";

const { issues, byScope, errors } = runValidation();

if (!issues.length) {
  console.log(
    "Contenido válido: catálogo editorial completo, slugs únicos, relaciones enlazadas y requisitos de spoilers etiquetados.",
  );
} else {
  console.error(`El contenido de NEXUS contiene ${errors} relaciones no válidas:\n`);
  for (const group of byScope) {
    if (!group.issues.length) continue;
    console.error(`${group.label}:`);
    for (const issue of group.issues) {
      console.error(`- [${issue.severity}] ${issue.subject} · ${issue.field}: ${issue.message}`);
    }
    console.error("");
  }
  process.exitCode = 1;
}
