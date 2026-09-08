"use client";

import Link from "next/link";
import { useAccount } from "./AccountProvider";
import { SpoilerPreference } from "./SpoilerPreference";

export function SpoilerProgressSettings() {
  const { pending, watched, ready, error } = useAccount();

  return <section id="spoilers" className="account-spoilers" aria-labelledby="spoilers-heading">
    <header className="account-panel-heading">
      <h2 id="spoilers-heading">PROGRESO Y SPOILERS</h2>
      <p>Decide qué quieres descubrir y qué prefieres mantener oculto.</p>
    </header>

    <div className="account-spoiler-summary">
      <div className="account-spoiler-summary-count">
        <strong>{ready ? String(watched.size).padStart(2, "0") : "—"}</strong>
        <span>TÍTULOS VISTOS</span>
        <p>{error ? "Recarga el progreso para comprobar tus títulos." : pending ? "Guardando tus últimos cambios…" : ready ? watched.size ? "Sigue ampliando tu recorrido." : "Marca tu primer título para empezar." : "Recuperando tu progreso…"}</p>
      </div>
      <Link className="account-button account-button-primary" href="/titulos">GESTIONAR TÍTULOS <span aria-hidden="true">↗</span></Link>
    </div>

    <div className="account-spoiler-preference">
      <h3>PROTECCIÓN DE SPOILERS</h3>
      <SpoilerPreference />
    </div>

  </section>;
}
