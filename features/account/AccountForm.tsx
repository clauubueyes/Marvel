"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/services/supabase/client";
import { authErrorMessage } from "@/services/supabase/authErrorMessage";
import { useAccount } from "./AccountProvider";

export function AccountForm() {
  const { user, initialized, pending } = useAccount();
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
      setMessage(register && !data.session ? "Revisa tu correo para confirmar la cuenta y después inicia sesión." : "Sesión iniciada.");
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
  return <section className="route-planner title-planner" aria-label="Cuenta de Nexus">
    <div className="route-planner-intro"><div><p className="eyebrow">TU PROGRESO</p><h2>{user ? "MI CUENTA" : register ? "CREAR CUENTA" : "INICIAR SESIÓN"}</h2><p>Guarda tus películas y series vistas y recupéralas desde otro dispositivo.</p></div></div>
    {!initialized ? <p role="status">Recuperando sesión…</p> : user ? <div className="route-planner-form"><p>{user.email}</p><button type="button" className="consent-secondary" disabled={busy || !!pending} onClick={logout}>{pending ? "GUARDANDO CAMBIOS…" : "CERRAR SESIÓN"}</button><Link href="/titulos">IR A MIS TÍTULOS ↗</Link></div> :
      <form className="route-planner-form" onSubmit={submit}>
        <label><span>EMAIL</span><input name="email" type="email" autoComplete="email" required maxLength={254} disabled={busy} /></label>
        <label><span>CONTRASEÑA</span><input name="password" type="password" autoComplete={register ? "new-password" : "current-password"} minLength={register ? 8 : undefined} required disabled={busy} /></label>
        <button className="consent-primary" disabled={busy} type="submit">{busy ? "CONECTANDO…" : register ? "REGISTRARME" : "ENTRAR"}</button>
        <button className="consent-secondary" disabled={busy} type="button" onClick={() => { setRegister(!register); setMessage(""); }}>{register ? "YA TENGO CUENTA" : "CREAR UNA CUENTA"}</button>
        <p>El progreso de invitado permanece separado y no se importa a tu cuenta.</p>
      </form>}
    {message && <p className="google-calendar-status" role="status">{message}</p>}
  </section>;
}
