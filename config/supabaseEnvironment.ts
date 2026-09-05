export function assertPublicSupabaseKey(key: string) {
  if (key.startsWith("sb_publishable_")) return;
  try {
    const payload = JSON.parse(atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.role === "anon") return;
  } catch { /* Reject malformed keys without including their contents in errors. */ }
  throw new Error("Supabase requiere una clave publishable o anon válida; las claves privadas no están permitidas.");
}
