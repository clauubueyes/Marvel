"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/services/supabase/client";
import { useAccount } from "./AccountProvider";

export function SpoilerPreference() {
  const { user, store } = useAccount();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function change(avoidSpoilers: boolean) {
    if (!user || busy) return;
    const userId = user.id;
    setBusy(true); setError("");
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error("Unavailable");
      const result = await client.auth.updateUser({ data: { avoid_spoilers: avoidSpoilers } });
      if (result.error) throw result.error;
      if (store.getSnapshot().user?.id === userId) store.setUser(result.data.user);
    } catch {
      setError("No se pudo guardar tu preferencia. Inténtalo de nuevo.");
    } finally { setBusy(false); }
  }
  return <div className="account-form">
    <label className="account-checkbox"><input type="checkbox" checked={user?.user_metadata?.avoid_spoilers !== false} disabled={busy} onChange={(event) => void change(event.target.checked)} aria-describedby="spoiler-preference-hint" /><span>Evitar spoilers</span></label>
    <small id="spoiler-preference-hint">{user?.user_metadata?.avoid_spoilers === false ? "Ves el contenido con spoilers. Tu progreso se conserva si vuelves a activar la protección." : "El contenido protegido se adapta a las obras que has visto."}</small>
    {busy && <p role="status">Guardando preferencia…</p>}
    {error && <p role="alert">{error}</p>}
  </div>;
}
