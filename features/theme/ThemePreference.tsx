"use client";

import { useTheme } from "./ThemeProvider";
import type { ThemePreference as ThemePreferenceValue } from "@/services/theme/themePreference";

const OPTIONS: ReadonlyArray<{ value: ThemePreferenceValue; label: string; hint: string }> = [
  { value: "dark", label: "OSCURO", hint: "El tema de diseño de NEXUS." },
  { value: "light", label: "CLARO", hint: "Tema claro, aún en diseño (fase 2)." },
  { value: "system", label: "SISTEMA", hint: "Sigue la preferencia de tu sistema." },
];

export function ThemePreference() {
  const { preference, setPreference } = useTheme();

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
