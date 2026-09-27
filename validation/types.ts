/**
 * Salida común de los validadores estructurales del contenido. Antes cada uno
 * devolvía su propia forma (`string[]` libre o `AuditIssue[]`) y el runner se
 * limitaba a concatenar. Con un tipo único el runner puede agrupar por ámbito y
 * por severidad, y los tests pueden afirmar sobre campos concretos en lugar de
 * buscar subcadenas dentro de un mensaje.
 *
 * `auditEditorialContent` mantiene su tipo propio: describe la calidad editorial
 * de los expedientes de título y se ejecuta en su propio comando.
 */
export type ValidationScope = "integridad" | "spoilers" | "progreso";
export type ValidationSeverity = "ERROR" | "AVISO";

export type ValidationIssue = {
  scope: ValidationScope;
  severity: ValidationSeverity;
  /** Entrada afectada: slug de título, id de personaje, nombre de ruta… */
  subject: string;
  field: string;
  message: string;
};
