"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  applyTheme,
  DEFAULT_THEME_PREFERENCE,
  normalizeThemePreference,
  resolveTheme,
  THEME_EVENT,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from "@/services/theme/themePreference";

export type ThemeState = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeState | null>(null);

function readPreference(): ThemePreference {
  try {
    return normalizeThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME_PREFERENCE;
  }
}

function writePreference(preference: ThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Sin almacenamiento (modo privado estricto) el tema sigue valiendo para la sesión.
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: preference }));
}

function subscribe(callback: () => void): () => void {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) callback();
  };
  const handleChange = () => callback();
  system.addEventListener("change", handleChange);
  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_EVENT, handleChange);
  return () => {
    system.removeEventListener("change", handleChange);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_EVENT, handleChange);
  };
}

function getSnapshot(): string {
  return `${readPreference()}:${window.matchMedia("(prefers-color-scheme: dark)").matches}`;
}

function getServerSnapshot(): string {
  return `${DEFAULT_THEME_PREFERENCE}:true`;
}

/**
 * Mantiene el tema sincronizado con lo que ya fijó el script de arranque.
 *
 * El script del `<head>` es el que decide el `data-theme` antes del primer
 * pintado; este provider no vuelve a aplicar nada hasta que el usuario cambia
 * la preferencia o cambia la del sistema, para no introducir parpadeos.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [rawPreference, rawSystemPrefersDark] = snapshot.split(":");
  const preference = normalizeThemePreference(rawPreference);
  const systemPrefersDark = rawSystemPrefersDark === "true";
  const resolved = resolveTheme(preference, systemPrefersDark);

  const setPreference = useCallback((next: ThemePreference) => {
    writePreference(next);
  }, []);

  useEffect(() => {
    // El script del <head> ya fijó el tema antes del primer pintado; este efecto
    // solo lo mantiene al día cuando cambia la preferencia o la del sistema.
    applyTheme(resolved, document.documentElement);
  }, [resolved]);

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Debe renderizarse debajo de un `<ThemeProvider>` (montado en el root). */
export function useTheme(): ThemeState {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme debe usarse dentro de ThemeProvider.");
  return value;
}
