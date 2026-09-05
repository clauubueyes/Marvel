"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/services/supabase/client";
import { authErrorMessage } from "@/services/supabase/authErrorMessage";
import { useAccount } from "./AccountProvider";

export function AccountForm() {
  const { user, initialized, pending, watched, ready, error, store } = useAccount();
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
        ? await client.auth.signUp({ ...credentials, options: { emailRedirectTo: `${window.location.origin}/cuenta` } })
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
  return <section className="account-panel" aria-label="Cuenta de Nexus" aria-busy={!initialized || busy}>
    <header className="account-panel-heading">
      <p className="account-kicker">{user ? "SESIÓN INICIADA" : "TU ARCHIVO PERSONAL"}</p>
      <h2>{user ? "TODO LISTO PARA SEGUIR" : register ? "CREAR CUENTA" : "INICIAR SESIÓN"}</h2>
      <p>{user ? "Tu cuenta conecta lo que has visto con lo que viene después." : register ? "Un lugar para guardar todo lo que ya has visto." : "Entra para recuperar tu progreso y continuar tu recorrido."}</p>
    </header>
    {!initialized ? <p className="account-message" role="status">Recuperando sesión…</p> : user ? <div className="account-profile">
      <div className="account-identity"><span className="account-avatar" aria-hidden="true">{user.email?.charAt(0).toUpperCase() || "N"}</span><div><span className="account-kicker">TU CUENTA</span><p>{user.email}</p></div></div>
      <div className="account-progress" aria-live="polite"><strong>{ready ? String(watched.size).padStart(2, "0") : "—"}</strong><div><span>TÍTULOS VISTOS</span><p>{error ? "El progreso necesita tu atención." : pending ? "Guardando tus últimos cambios…" : ready ? "Tu recorrido, guardado en tu cuenta." : "Recuperando tu progreso…"}</p></div></div>
      {error && <div className="account-message" role="alert"><p>{error}</p><button className="account-text-button" type="button" disabled={!!pending} onClick={() => void store.load()}>REINTENTAR</button></div>}
      <Link className="account-button account-button-primary" href="/titulos">IR A MIS TÍTULOS <span aria-hidden="true">↗</span></Link>
      <div className="account-session-footer"><span>Sesión en este dispositivo</span><button type="button" className="account-text-button" disabled={busy || !!pending} onClick={logout}>{pending ? "GUARDANDO CAMBIOS…" : "CERRAR SESIÓN"}</button></div>
    </div> :
      <form className="account-form" onSubmit={submit}>
        <label><span>EMAIL</span><input name="email" type="email" autoComplete="email" placeholder="tu@email.com" required maxLength={254} disabled={busy} /></label>
        <label><span id="account-password-label">CONTRASEÑA</span><input name="password" type="password" autoComplete={register ? "new-password" : "current-password"} aria-labelledby="account-password-label" aria-describedby={register ? "account-password-hint" : undefined} minLength={register ? 8 : undefined} required disabled={busy} />{register && <small id="account-password-hint">Al menos 8 caracteres.</small>}</label>
        <button className="account-button account-button-primary" disabled={busy} type="submit">{busy ? "CONECTANDO…" : register ? "REGISTRARME" : "ENTRAR"}<span aria-hidden="true">↗</span></button>
        <div className="account-switch"><span>{register ? "¿Ya formas parte de Nexus?" : "¿Tu primera vez aquí?"}</span><button className="account-text-button" disabled={busy} type="button" onClick={() => { setRegister(!register); setMessage(""); }}>{register ? "YA TENGO CUENTA" : "CREAR UNA CUENTA"}</button></div>
        <p className="account-footnote">Tu progreso de invitado se conserva en este navegador. Al entrar, usarás el de tu cuenta.</p>
      </form>}
    {message && <p className="account-message" role="status">{message}</p>}
  </section>;
}
