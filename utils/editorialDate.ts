const MONTHS: Record<string, number> = {
  ENE: 0,
  FEB: 1,
  MAR: 2,
  ABR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AGO: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DIC: 11,
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const EDITORIAL_DATE = /^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$/;

/** Interpreta el formato editorial `D MMM YYYY` ("30 AGO 2026"). */
export function parseEditorialDate(value: string | undefined | null): Date | undefined {
  if (!value) return undefined;
  const match = EDITORIAL_DATE.exec(value);
  if (!match) return undefined;
  const [, day, monthName, year] = match;
  const month = MONTHS[monthName];
  if (month === undefined) return undefined;
  const date = new Date(Date.UTC(Number(year), month, Number(day)));
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

/** Interpreta el formato ISO `YYYY-MM-DD`, rechazando fechas imposibles (31 FEB). */
export function parseIsoDate(value: string | undefined | null): Date | undefined {
  if (!value) return undefined;
  if (!ISO_DATE.test(value)) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf()) || !date.toISOString().startsWith(value)) return undefined;
  return date;
}

/**
 * El catálogo mezcla dos formatos de fecha de revisión: las fichas de personaje
 * usan `YYYY-MM-DD` y los expedientes de título `D MMM YYYY`. Esta función es la
 * única fuente de verdad para interpretar ambas.
 *
 * Devuelve `undefined` si el valor no encaja en ninguno de los dos formatos, de
 * modo que cada llamador decida su política de reserva en lugar de recibir una
 * `Invalid Date` que rompería el serializado.
 */
export function parseEditorialReviewedAt(value: string | undefined | null): Date | undefined {
  return parseIsoDate(value) ?? parseEditorialDate(value);
}
