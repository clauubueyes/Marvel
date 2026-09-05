"use client";

import Link from "next/link";
import { useAccount } from "./AccountProvider";

export function ProgressStatus() {
  const { user, initialized, ready, pending, error, store } = useAccount();
  return <div className="title-plan-selection-actions" aria-live="polite">
    <span>{!initialized ? "RECUPERANDO SESIÓN…" : !user ? "PROGRESO DE INVITADO · SOLO EN ESTE NAVEGADOR" : !ready && !error ? "CARGANDO PROGRESO…" : pending ? "GUARDANDO PROGRESO…" : "PROGRESO DE TU CUENTA"}</span>
    {error && <span role="alert">{error}</span>}
    {user && <button type="button" disabled={!!pending || (!ready && !error)} onClick={() => void store.load()}>RECARGAR PROGRESO</button>}
    <Link href="/cuenta">{user ? "MI CUENTA" : "INICIAR SESIÓN / REGISTRARSE"}</Link>
  </div>;
}
