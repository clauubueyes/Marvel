export const THEME_STORAGE_KEY = "nexus:theme";
export const THEME_EVENT = "nexus-theme";

/**
 * Preferencia que guarda el usuario. `system` delega en la del sistema operativo;
 * `light` y `dark` la imponen.
 */
export type ThemePreference = "system" | "light" | "dark";

/** Tema que se aplica de verdad a `data-theme`. */
export type ResolvedTheme = "light" | "dark";

/**
 * El diseño de NEXUS es oscuro de origen, así que la ausencia de preferencia no
 * significa "sigue al sistema": significa "usa el tema que el producto ya tiene
 * diseñado". Delegar en el sistema aquí pondría la web en modo claro ante la
 * paleta clara todavía inexistente.
 */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = "dark";

/**
 * La paleta clara todavía no existe: hay 600+ literals de color afinados a mano
 * para fondo oscuro repartidos por las hojas de cada feature (pendiente de #13).
 * Mientras esta bandera sea `false`, el claro no se aplica ni se ofrece: se ignora
 * y se borra cualquier preferencia guardada para que nadie aterrice en un modo
 * roto. Cuando la paleta clara esté tokenizada, basta con pasarla a `true`.
 */
export const THEME_LIGHT_AVAILABLE = false;

const PREFERENCES: readonly ThemePreference[] = ["system", "light", "dark"];

function isPreference(value: unknown): value is ThemePreference {
  return typeof value === "string" && (PREFERENCES as readonly string[]).includes(value);
}

/**
 * Lee el valor crudo del almacenamiento y descarta lo que no reconozcamos.
 * Un `localStorage` corrupto o escrito por una versión anterior no debe romper
 * el arranque, así que cualquier valor inesperado cae en la preferencia por defecto.
 */
export function normalizeThemePreference(raw: string | null | undefined): ThemePreference {
  return isPreference(raw) ? raw : DEFAULT_THEME_PREFERENCE;
}

/** Resuelve la preferencia contra la preferencia del sistema. */
export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

/**
 * Script de arranque que se ejecuta antes del primer pintado.
 *
 * Va incrustado en `<head>` a propósito: si el tema se aplicara desde un
 * componente de React, la página se pintaría primero con el tema por defecto y
 * después saltaría al elegido. Ese parpadeo es justo lo que hace que la gente
 * odie el modo oscuro, así que aquí se resuelve antes de que se dibuje nada.
 *
 * Va en cadena y sin dependencias a propósito: no puede importar nada, porque se
 * ejecuta antes de que exista el bundle.
 */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{
var available=${String(THEME_LIGHT_AVAILABLE)};
var p=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(!available){
document.documentElement.dataset.theme="dark";
if(p!=="dark"){localStorage.removeItem(${JSON.stringify(THEME_STORAGE_KEY)});}
return;
}
if(p!=="light"&&p!=="dark"&&p!=="system"){p="dark";}
var d=p==="system"
?window.matchMedia("(prefers-color-scheme: dark)").matches
:p==="dark";
document.documentElement.dataset.theme=d?"dark":"light";
}catch(e){document.documentElement.dataset.theme="dark";}})();`;

/** Marca el documento con el tema resuelto. */
export function applyTheme(theme: ResolvedTheme, root: { dataset: DOMStringMap }): void {
  root.dataset.theme = theme;
}
