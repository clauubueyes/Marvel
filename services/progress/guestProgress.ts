import { TITLE_PROGRESS_STORAGE_KEY } from "@/constants/titleDirectory";
import { parsePersistedStringSet } from "@/utils/persistedStringSet";

/**
 * Progreso de títulos en modo invitado.
 *
 * Un visitante sin cuenta marca títulos en `localStorage`, repartidos en varias
 * claves: una general (`nexus:titles:watched`) y una por ruta de visionado
 * (`nexus:route:<slug>`). Todas guardan slugs del catálogo, que es exactamente lo
 * que `movie_progress.movie_id` almacena para las cuentas, así que el volcado a la
 * cuenta es una unión sin traducción.
 *
 * Al iniciar sesión se importan únicamente los títulos que la cuenta todavía no
 * tiene vistos: nunca se desmarca nada, para no perder el progreso que ya venga
 * sincronizado desde otro dispositivo. Las claves de invitado solo se borran
 * cuando la escritura se ha confirmado; si falla, se conservan y el siguiente
 * inicio de sesión reintenta.
 */

export const ROUTE_PROGRESS_KEY_PREFIX = "nexus:route:";

/** Almacenamiento con la parte de `Storage` que necesita este módulo. */
export type ProgressStorage = Pick<Storage, "length" | "key" | "getItem" | "removeItem">;

function guestKeys(storage: ProgressStorage): string[] {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key === TITLE_PROGRESS_STORAGE_KEY || key?.startsWith(ROUTE_PROGRESS_KEY_PREFIX))
      keys.push(key);
  }
  return keys;
}

/**
 * Unión de todos los títulos válidos guardados en modo invitado. Los ids que ya
 * no existen en el catálogo se descartan: una clave antigua puede contener slugs
 * que se hayan retirado del contenido.
 */
export function readGuestProgress(
  storage: ProgressStorage,
  validIds: ReadonlySet<string>,
): { ids: string[]; keys: string[] } {
  const union = new Set<string>();
  const keys = guestKeys(storage);
  for (const key of keys) {
    const raw = storage.getItem(key);
    if (!raw) continue;
    for (const id of parsePersistedStringSet(raw, validIds)) union.add(id);
  }
  return { ids: [...union], keys };
}

/**
 * Borra las claves de invitado ya importadas. Si `removeItem` lanza (modo privado,
 * cuota agotada) se ignora: la clave se filtrará contra el catálogo al reintentar
 * y volver a importarla es idempotente.
 */
export function clearGuestProgress(storage: ProgressStorage, keys: readonly string[]): void {
  for (const key of keys) {
    try {
      storage.removeItem(key);
    } catch {
      // Un almacenamiento que no admite borrado no puede impedir la importacion.
    }
  }
}
