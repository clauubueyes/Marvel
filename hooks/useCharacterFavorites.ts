"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useFavoritesStore } from "@/features/account/AccountProvider";

export function useCharacterFavorites() {
  const store = useFavoritesStore();
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  useEffect(() => { store.ensureLoaded(); }, [store, state.initialized, state.userId]);
  return { ...state, store };
}
