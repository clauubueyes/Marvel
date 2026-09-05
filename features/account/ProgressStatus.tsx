"use client";

import { useAccount } from "./AccountProvider";

export function ProgressStatus() {
  const { user, initialized, ready, pending, error, store } = useAccount();
  if (initialized && (!user || (ready && !pending && !error))) return null;
  return <div className="title-plan-selection-actions" aria-live="polite">
    {!error && <span>{!initialized ? "RECUPERANDO SESIÓN…" : !ready ? "CARGANDO PROGRESO…" : "GUARDANDO PROGRESO…"}</span>}
    {error && <span role="alert">{error}</span>}
    {user && error && <button type="button" disabled={!!pending} onClick={() => void store.load()}>REINTENTAR</button>}
  </div>;
}
