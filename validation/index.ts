import { characters } from "@/repositories/characterRepository";
import { mcuCatalog } from "@/data/mcuCatalog";
import { validateCharacterSpoilers } from "./characterSpoilers";
import { validateContentIntegrity } from "./contentIntegrity";
import { validateProgressRelations } from "./progressRelations";
import type { ValidationIssue, ValidationScope } from "./types";

/** Orden de presentación: de la integridad estructural a la calidad editorial. */
const SCOPE_ORDER: readonly ValidationScope[] = ["integridad", "spoilers", "progreso"];

const SCOPE_LABEL: Record<ValidationScope, string> = {
  integridad: "Integridad del catálogo",
  spoilers: "Requisitos de spoilers",
  progreso: "Relaciones de progreso",
};

export type ValidationReport = {
  issues: ValidationIssue[];
  /** Recuento por ámbito, en el orden en que se presentan. */
  byScope: { scope: ValidationScope; label: string; issues: ValidationIssue[] }[];
  errors: number;
};

const byScopeOrder = (a: ValidationIssue, b: ValidationIssue) =>
  SCOPE_ORDER.indexOf(a.scope) - SCOPE_ORDER.indexOf(b.scope);

/**
 * Punto de entrada único de los validadores estructurales: ejecuta los tres
 * guards y devuelve una sola lista de incidencias con ámbito, severidad,
 * entrada afectada y campo. Así el runner no necesita saber de qué validador
 * procede cada mensaje.
 *
 * La auditoría editorial (`auditEditorialContent`) no entra aquí: describe la
 * calidad editorial de los expedientes y se ejecuta en su propio comando
 * (`npm run audit:content`).
 */
export function runValidation(): ValidationReport {
  const issues = [
    ...validateContentIntegrity(),
    ...validateCharacterSpoilers(characters, new Set(mcuCatalog.map(({ slug }) => slug))),
    ...validateProgressRelations(),
  ].sort(byScopeOrder);

  return {
    issues,
    byScope: SCOPE_ORDER.map((scope) => ({
      scope,
      label: SCOPE_LABEL[scope],
      issues: issues.filter((issue) => issue.scope === scope),
    })),
    errors: issues.filter((issue) => issue.severity === "ERROR").length,
  };
}
