import { auditEditorialContent } from "../lib/contentAudit";
import { reviewedChronologyCount } from "../lib/content/titles/editorialReview";

const issues = auditEditorialContent();
const relevant = issues.filter(({ severity }) => severity !== "INFO");
const errors = relevant.filter(({ severity }) => severity === "ERROR");

if (!issues.length) {
  console.log(`Auditoría editorial superada sin observaciones. ${reviewedChronologyCount} diferencias cronológicas revisadas.`);
} else {
  for (const severity of ["ERROR", "AVISO", "INFO"] as const) {
    const group = issues.filter((issue) => issue.severity === severity);
    if (!group.length) continue;
    console.log(`\n${severity} (${group.length})`);
    group.forEach(({ titleId, field, message }) => console.log(`- ${titleId} · ${field}: ${message}`));
  }
  console.log(`\nResumen: ${errors.length} errores, ${relevant.length - errors.length} avisos y ${issues.length - relevant.length} diferencias cronológicas para revisión.`);
}

if (errors.length) process.exitCode = 1;
