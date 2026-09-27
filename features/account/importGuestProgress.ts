import type { MovieProgressStore } from "@/services/progress/movieProgressStore";

/**
 * Vuelca a la cuenta el progreso que el visitante marcó sin sesión.
 *
 * Solo añade: si un título ya está visto en la cuenta se deja como está, de modo que
 * el progreso que venga de otro dispositivo nunca se pierde. Las claves de invitado se
 * borran únicamente tras confirmar la escritura; si algo falla se conservan y el
 * siguiente inicio de sesión lo reintenta, porque la importación es idempotente.
 *
 * El catálogo y el lector de almacenamiento se importan de forma diferida: esta vía
 * solo se ejecuta al iniciar sesión y no debe entrar en el bundle inicial, que
 * `AccountProvider` comparte con todas las páginas.
 */
export async function importGuestProgress(store: MovieProgressStore): Promise<void> {
  if (!store.getSnapshot().user) return;
  try {
    const { ids, keys } = await readGuest();
    if (!keys.length) return;
    if (!ids.length) {
      await forget(keys);
      return;
    }
    // La carga puede haber fallado: sin `ready` el store ignora las escrituras y
    // borrar las claves perdería el progreso del visitante.
    if (!store.getSnapshot().ready) return;
    const watched = store.getSnapshot().watched;
    const missing = ids.filter((id) => !watched.has(id));
    if (missing.length) {
      store.setMany(missing, true);
      const { ok } = await store.whenSettled();
      if (!ok) return;
    }
    await forget(keys);
  } catch {
    // Sin almacenamiento disponible no hay nada que importar ni que recuperar.
  }
}

async function readGuest() {
  const [{ readGuestProgress }, { mcuCatalog }] = await Promise.all([
    import("@/services/progress/guestProgress"),
    import("@/data/mcuCatalog"),
  ]);
  return readGuestProgress(window.localStorage, new Set(mcuCatalog.map(({ slug }) => slug)));
}

async function forget(keys: readonly string[]) {
  const { clearGuestProgress } = await import("@/services/progress/guestProgress");
  clearGuestProgress(window.localStorage, keys);
}
