"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { getSupabaseClient } from "@/services/supabase/client";
import { authErrorMessage } from "@/services/supabase/authErrorMessage";
import { useAccount, useFavoritesStore } from "./AccountProvider";
import { AccountSettings } from "./AccountSettings";

export function AccountForm({ children }: { children?: React.ReactNode }) {
  const { user, initialized, pending } = useAccount();
  const favorites = useFavoritesStore();
  const { pending: favoritePending } = useSyncExternalStore(favorites.subscribe, favorites.getSnapshot, favorites.getServerSnapshot);
  const [register, setRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setBusy(true); setMessage("");
    try {
      const client = getSupabaseClient();
      if (!client) { setMessage("El acceso a cuentas todavía no está configurado. Puedes seguir navegando como invitado."); return; }
      const credentials = { email: String(fields.get("email")).trim(), password: String(fields.get("password")) };
      const { data, error } = register
        ? await client.auth.signUp({ ...credentials, options: { emailRedirectTo: `${window.location.origin}/cuenta`, data: { avoid_spoilers: fields.has("avoid_spoilers") } } })
        : await client.auth.signInWithPassword(credentials);
      if (error) { setMessage(authErrorMessage(error, register)); return; }
      form.reset();
      setMessage(register ? !data.session ? "Revisa tu correo para confirmar la cuenta y después inicia sesión." : "Cuenta creada. Ya puedes empezar a guardar tu progreso." : "Sesión iniciada.");
    } catch { setMessage("No se pudo conectar con el servicio de cuentas. Inténtalo de nuevo."); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setMessage("");
    try {
      const { error } = await getSupabaseClient()!.auth.signOut({ scope: "local" });
      if (error) throw error;
      setMessage("Sesión cerrada en este dispositivo.");
    } catch { setMessage("No se pudo cerrar sesión. Inténtalo de nuevo."); }
    finally { setBusy(false); }
  }

  if (!initialized) {
    return <section className="account-panel" aria-label="Cuenta de Nexus" aria-busy>
      <p className="account-message" role="status">Recuperando sesión…</p>
    </section>;
  }

  if (user) {
    return (
      <section className="account-panel account-panel-settings" aria-label="Cuenta de Nexus" aria-busy={!!pending || busy}>
        <AccountSettings
          onLogout={logout}
          logoutBusy={busy}
          logoutDisabled={!!pending || favoritePending}
          progress={children}
        />
        {message && <p className="account-message" role="status">{message}</p>}
      </section>
    );
  }

  return (
    <section className="account-panel" aria-label="Cuenta de Nexus" aria-busy={busy}>
      <header className="account-panel-heading">
        <p className="account-kicker">TU ARCHIVO PERSONAL</p>
        <h2>{register ? "CREAR CUENTA" : "INICIAR SESIÓN"}</h2>
        <p>{register ? "Un lugar para guardar todo lo que ya has visto." : "Entra para recuperar tu progreso y continuar tu recorrido."}</p>
      </header>
      <form className="account-form" onSubmit={submit}>
        <label><span>EMAIL</span><input name="email" type="email" autoComplete="email" placeholder="tu@email.com" required maxLength={254} disabled={busy} /></label>
        <label><span id="account-password-label">CONTRASEÑA</span><input name="password" type="password" autoComplete={register ? "new-password" : "current-password"} aria-labelledby="account-password-label" aria-describedby={register ? "account-password-hint" : undefined} minLength={register ? 8 : undefined} required disabled={busy} />{register && <small id="account-password-hint">Al menos 8 caracteres.</small>}</label>
        {register && <div><label className="account-checkbox"><input name="avoid_spoilers" type="checkbox" defaultChecked disabled={busy} aria-describedby="register-spoilers-hint" /><span>Evitar spoilers</span></label><small id="register-spoilers-hint">Protege lo que todavía no has visto. Podrás personalizar tu progreso en tu cuenta. Si la desmarcas, verás el contenido con spoilers.</small></div>}
        <button className="account-button account-button-primary" disabled={busy} type="submit">{busy ? "CONECTANDO…" : register ? "REGISTRARME" : "ENTRAR"}<span aria-hidden="true">↗</span></button>
        <div className="account-switch"><span>{register ? "¿Ya formas parte de Nexus?" : "¿Tu primera vez aquí?"}</span><button className="account-text-button" disabled={busy} type="button" onClick={() => { setRegister(!register); setMessage(""); }}>{register ? "YA TENGO CUENTA" : "CREAR UNA CUENTA"}</button></div>
        <p className="account-footnote">Tu progreso de invitado se conserva en este navegador. Al entrar, usarás el de tu cuenta.</p>
      </form>
      {message && <p className="account-message" role="status">{message}</p>}
    </section>
  );
}
