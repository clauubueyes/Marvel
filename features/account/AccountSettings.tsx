"use client";

import type { ReactNode } from "react";
import { useAccount } from "./AccountProvider";

export function AccountSettings({ onLogout, logoutBusy, logoutDisabled, progress }: {
  onLogout: () => void;
  logoutBusy: boolean;
  logoutDisabled: boolean;
  progress: ReactNode;
}) {
  const { user, pending, ready, error, store } = useAccount();

  return <div className="account-settings-body">
    <aside className="account-settings-nav" aria-label="Identidad y sesión">
      <div className="account-session-id">
        <span className="account-avatar" aria-hidden="true">{user?.email?.charAt(0).toUpperCase() || "N"}</span>
        <div><span className="account-kicker">SESIÓN INICIADA</span><p>{user?.email}</p></div>
      </div>
      <nav className="account-section-links" aria-label="Secciones de la cuenta">
        <a href="#sincronizacion">Cuenta y sesión <span aria-hidden="true">↗</span></a>
        <a href="#spoilers">Progreso y spoilers <span aria-hidden="true">↗</span></a>
      </nav>
      <div className="account-session-actions">
        <button type="button" className="account-settings-logout" disabled={logoutBusy || logoutDisabled} onClick={onLogout}>
          {logoutBusy ? "CERRANDO SESIÓN…" : logoutDisabled ? "GUARDANDO CAMBIOS…" : "CERRAR SESIÓN"}
        </button>
        <p>Solo se cerrará en este dispositivo.</p>
      </div>
    </aside>
    <div className="account-settings-content">
      <section id="sincronizacion" className="account-sync" aria-labelledby="account-sync-heading">
        <header className="account-panel-heading">
          <h2 id="account-sync-heading">CUENTA Y SESIÓN</h2>
          <p>Tu progreso se guarda en tu cuenta. Recárgalo si has marcado títulos desde otro dispositivo.</p>
        </header>
        <div className="account-sync-actions">
          <p className="account-sync-status" role="status"><span aria-hidden="true">●</span> {error ? "Revisa tu progreso" : pending ? "Guardando cambios…" : ready ? "Progreso actualizado" : "Recuperando progreso…"}</p>
          <button className="account-text-button" type="button" disabled={!!pending || (!ready && !error)} onClick={() => void store.load()}>RECARGAR PROGRESO</button>
        </div>
        {error && <p className="account-message" role="alert">{error}</p>}
      </section>
      {progress}
    </div>
  </div>;
}
