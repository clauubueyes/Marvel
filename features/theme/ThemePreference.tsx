"use client";

import { useTheme } from "./ThemeProvider";
import {
  THEME_LIGHT_AVAILABLE,
  type ThemePreference as ThemePreferenceValue,
} from "@/services/theme/themePreference";

const OPTIONS: ReadonlyArray<{ value: ThemePreferenceValue; label: string; hint: string }> = [
  { value: "dark", label: "OSCURO", hint: "El tema de diseño de NEXUS." },
  { value: "light", label: "CLARO", hint: "Tema claro, aún en diseño (fase 2)." },
  { value: "system", label: "SISTEMA", hint: "Sigue la preferencia de tu sistema." },
];

export function ThemePreference() {
  const { preference, resolved, setPreference } = useTheme();

  if (!THEME_LIGHT_AVAILABLE) {
    return (
      <fieldset className="theme-control">
        <legend>APARIENCIA</legend>
        <p className="theme-control-hint">NEXUS se ve oscuro por diseño.</p>
        <div className="theme-control-status" aria-live="polite">
          <span className={`theme-control-dot theme-control-dot--${resolved}`} aria-hidden="true" />
          <span>{resolved === "dark" ? "OSCURO" : "CLARO"}</span>
        </div>
        <small>
          El tema claro estará disponible cuando se complete la paleta clara (fase 2, ligada a la
          tokenización de colores).
        </small>
      </fieldset>
    );
  }

  return (
    <fieldset className="theme-control">
      <legend>APARIENCIA</legend>
      <p className="theme-control-hint">Cómo quieres ver Nexus en este dispositivo.</p>
      <div className="theme-control-options">
        {OPTIONS.map(({ value, label, hint }) => (
          <label className="theme-control-option" key={value} title={hint}>
            <input
              type="radio"
              name="theme-preference"
              value={value}
              checked={preference === value}
              onChange={() => setPreference(value)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <small>El tema elegido se guarda en este navegador, también sin sesión.</small>
    </fieldset>
  );
}
