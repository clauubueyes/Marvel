import { mcuCatalog } from "@/data/mcuCatalog";
import { getDetailedTitleIds, getTitleDetails } from "@/data/titles";
import { hasReviewedChronology } from "@/data/titles/editorialReview";
import { parseEditorialDate, parseIsoDate } from "@/utils/editorialDate";

export type AuditSeverity = "ERROR" | "AVISO" | "INFO";
export type AuditIssue = {
  severity: AuditSeverity;
  titleId: string;
  field: string;
  message: string;
};

const allowedCertifications = new Set([
  "G",
  "PG",
  "PG-13",
  "R",
  "TV-Y7",
  "TV-G",
  "TV-PG",
  "TV-14",
  "TV-MA",
  "POR CONFIRMAR",
  "SIN CLASIFICAR",
]);
const runtimePattern = /^(\d+ (MIN|EPISODIOS|CORTOS|WEBISODIOS)|POR CONFIRMAR|ESPECIAL)$/;

function isValidISODate(value: string) {
  return parseIsoDate(value) !== undefined;
}

export function auditEditorialContent(referenceDate = new Date("2026-08-30T00:00:00Z")) {
  const issues: AuditIssue[] = [];
  const push = (severity: AuditSeverity, titleId: string, field: string, message: string) =>
    issues.push({ severity, titleId, field, message });

  for (const titleId of getDetailedTitleIds()) {
    const details = getTitleDetails(titleId);
    if (!details) continue;
    const title = mcuCatalog.find(({ slug }) => slug === titleId);

    if (!isValidISODate(details.releaseDateISO))
      push("ERROR", titleId, "releaseDateISO", `Fecha ISO no válida: ${details.releaseDateISO}`);
    const releaseDate = new Date(`${details.releaseDateISO}T00:00:00Z`);
    if (details.status === "ESTRENADO" && releaseDate > referenceDate)
      push("ERROR", titleId, "status", "Figura como estrenado antes de su fecha de lanzamiento.");
    if (details.status !== "ESTRENADO" && releaseDate <= referenceDate)
      push(
        "AVISO",
        titleId,
        "status",
        "La fecha ya ha pasado, pero el estado no figura como estrenado.",
      );
    if (!runtimePattern.test(details.runtime))
      push("AVISO", titleId, "runtime", `Formato de duración no normalizado: ${details.runtime}`);
    if (!allowedCertifications.has(details.certification))
      push(
        "AVISO",
        titleId,
        "certification",
        `Clasificación no reconocida: ${details.certification}`,
      );
    if (!details.availability.trim())
      push("ERROR", titleId, "availability", "No se ha documentado disponibilidad.");
    if (!details.sources.length)
      push("ERROR", titleId, "sources", "El expediente no contiene fuentes.");
    details.sources.forEach(({ url }) => {
      if (!URL.canParse(url) || new URL(url).protocol !== "https:")
        push("ERROR", titleId, "sources", `Fuente no segura o no válida: ${url}`);
    });
    if (details.trailerId && !/^[\w-]{11}$/.test(details.trailerId))
      push(
        "ERROR",
        titleId,
        "trailerId",
        `Identificador de YouTube no válido: ${details.trailerId}`,
      );
    if (details.status === "ESTRENADO" && !details.directors.length)
      push("AVISO", titleId, "directors", "Faltan responsables de dirección.");
    if (details.status === "ESTRENADO" && !details.cast.length)
      push("AVISO", titleId, "cast", "Falta reparto principal.");
    if (!details.spoilerFreeSynopsis.trim())
      push("ERROR", titleId, "spoilerFreeSynopsis", "Falta la sinopsis sin spoilers.");

    const reviewedAt = parseEditorialDate(details.reviewedAt);
    if (!reviewedAt)
      push("ERROR", titleId, "reviewedAt", `Fecha editorial no válida: ${details.reviewedAt}`);
    else {
      const ageInDays = Math.floor((referenceDate.valueOf() - reviewedAt.valueOf()) / 86_400_000);
      if (ageInDays > 365)
        push("AVISO", titleId, "reviewedAt", `La ficha lleva ${ageInDays} días sin revisión.`);
      if (reviewedAt > referenceDate)
        push("ERROR", titleId, "reviewedAt", "La revisión está fechada en el futuro.");
    }

    const narrativeYear = title?.period.match(/\b(19|20)\d{2}\b/)?.[0];
    if (
      narrativeYear &&
      Number(narrativeYear) !== releaseDate.getUTCFullYear() &&
      !hasReviewedChronology(titleId)
    ) {
      push(
        "INFO",
        titleId,
        "period",
        `Cronología narrativa ${narrativeYear}; estreno ${releaseDate.getUTCFullYear()}. Verificar que la diferencia sea intencionada.`,
      );
    }
  }

  return issues.sort(
    (left, right) =>
      left.severity.localeCompare(right.severity) || left.titleId.localeCompare(right.titleId),
  );
}
