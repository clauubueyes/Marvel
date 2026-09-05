"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { getSupabaseClient } from "@/services/supabase/client";
import { createMovieProgressRepository } from "@/repositories/movieProgressRepository";
import { MovieProgressStore } from "@/services/progress/movieProgressStore";

const AccountContext = createContext<MovieProgressStore | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => new MovieProgressStore({
    load: (id) => createMovieProgressRepository(getSupabaseClient()!).load(id),
    save: (id, changes) => createMovieProgressRepository(getSupabaseClient()!).save(id, changes),
  }));
  useEffect(() => {
    let client;
    try { client = getSupabaseClient(); } catch { store.setUser(null); return; }
    if (!client) { store.setUser(null); return; }
    let timer: ReturnType<typeof setTimeout>;
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const previous = store.getSnapshot();
      store.setUser(session?.user ?? null);
      if (!previous.initialized || previous.user?.id !== session?.user.id || (!previous.ready && !previous.error)) {
        clearTimeout(timer);
        // Keep Supabase calls outside the auth callback's internal lock.
        timer = setTimeout(() => { void store.load(); }, 0);
      }
    });
    return () => { clearTimeout(timer); subscription.unsubscribe(); };
  }, [store]);
  return <AccountContext.Provider value={store}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const store = useContext(AccountContext);
  if (!store) throw new Error("AccountProvider no está disponible.");
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { ...state, store };
}
