"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertPublicSupabaseKey } from "@/config/supabaseEnvironment";

let client: SupabaseClient | undefined;

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  assertPublicSupabaseKey(key);
  client ??= createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}
