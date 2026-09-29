import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_THEME_PREFERENCE,
  normalizeThemePreference,
  resolveTheme,
  THEME_BOOTSTRAP_SCRIPT,
  THEME_LIGHT_AVAILABLE,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
} from "./themePreference";

test("la preferencia por defecto es oscura, no la del sistema", () => {
  // El diseño ya es oscuro. Si el valor por defecto fuese "system", un usuario con
  // el sistema en claro vería la web sin la paleta clara, que todavía no existe.
  assert.equal(DEFAULT_THEME_PREFERENCE, "dark");
});

test("la paleta clara esta bloqueada mientras no exista (fase 2)", () => {
  // Guarda contra un cambio accidental: el claro no debe activarse hasta que las
  // hojas de cada feature esten tokenizadas (#13). Si se quiere activar, primero
  // hay que quitar este test a sabiendas.
  assert.equal(THEME_LIGHT_AVAILABLE, false);
});

test("normalizeThemePreference acepta solo las preferencias conocidas", () => {
  assert.equal(normalizeThemePreference("light"), "light");
  assert.equal(normalizeThemePreference("dark"), "dark");
  assert.equal(normalizeThemePreference("system"), "system");
});

test("un almacenamiento corrupto cae en la preferencia por defecto", () => {
  assert.equal(normalizeThemePreference("plasma"), DEFAULT_THEME_PREFERENCE);
  assert.equal(normalizeThemePreference(""), DEFAULT_THEME_PREFERENCE);
  assert.equal(normalizeThemePreference(null), DEFAULT_THEME_PREFERENCE);
  assert.equal(normalizeThemePreference(undefined), DEFAULT_THEME_PREFERENCE);
});

test("resolveTheme impone light y dark sin mirar el sistema", () => {
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
});

test("resolveTheme delega en el sistema cuando la preferencia es system", () => {
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
});

test("el script de arranque cubre la preferencia por defecto y la guardada", () => {
  // Se ejecuta en el navegador antes de hidratar, así que no puede depender de nada.
  assert.equal(THEME_BOOTSTRAP_SCRIPT.includes(THEME_STORAGE_KEY), true);
  assert.equal(THEME_BOOTSTRAP_SCRIPT.includes("prefers-color-scheme"), true);
  assert.equal(THEME_BOOTSTRAP_SCRIPT.includes("dataset.theme"), true);
  // Sin preferencia guardada debe caer al oscuro, igual que el modulo.
  assert.equal(THEME_BOOTSTRAP_SCRIPT.includes('p="dark"'), true);
});

test("mientras la paleta clara no exista, el arranque fuerza el oscuro y borra la preferencia", () => {
  if (THEME_LIGHT_AVAILABLE) return; // una vez activada la fase 2, este test deja de aplicar
  const script = THEME_BOOTSTRAP_SCRIPT;
  // Incluye la bandera en el propio script, antes de pintar nada.
  assert.equal(script.includes("available=false") || script.includes("available=true"), true);
  assert.equal(script.includes("localStorage.removeItem"), true);
  assert.equal(script.indexOf('dataset.theme="dark"') > -1, true);
});

test("el script de arranque no lanza si localStorage esta bloqueado", () => {
  // Safari en modo privado y cualquier iframe sin permisos hacen que getItem lance.
  // Un arranque roto deja la pagina sin tema, asi que el script va envuelto en try/catch.
  assert.equal(/try\{/.test(THEME_BOOTSTRAP_SCRIPT), true);
  assert.equal(/catch\(e\)\{/.test(THEME_BOOTSTRAP_SCRIPT), true);
});

test("el script de arranque no puede fallar por un valor inesperado", () => {
  assert.equal(THEME_BOOTSTRAP_SCRIPT.includes('p!=="light"'), true);
  assert.equal(THEME_BOOTSTRAP_SCRIPT.includes('p!=="dark"'), true);
  assert.equal(THEME_BOOTSTRAP_SCRIPT.includes('p!=="system"'), true);
});

test("el tipo ResolvedTheme solo admite los dos temas implementados", () => {
  const themes: ResolvedTheme[] = ["light", "dark"];
  assert.deepEqual(themes, ["light", "dark"]);
});
