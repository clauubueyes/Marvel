"use client";

import { useCallback, useSyncExternalStore } from "react";
import { parsePersistedStringSet } from "@/utils/persistedStringSet";

type PersistentStringSetOptions = {
  storageKey: string;
  eventName: string;
  validIds: ReadonlySet<string>;
};

export function usePersistentStringSet({ storageKey, eventName, validIds }: PersistentStringSetOptions) {
  const subscribe = useCallback((callback: () => void) => {
    const handleStorage = (event: StorageEvent) => { if (event.key === storageKey) callback(); };
    const handleChange = (event: Event) => {
      if (!(event instanceof CustomEvent) || event.detail === storageKey) callback();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(eventName, handleChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(eventName, handleChange);
    };
  }, [eventName, storageKey]);

  const getSnapshot = useCallback(() => window.localStorage.getItem(storageKey) ?? "[]", [storageKey]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const values = parsePersistedStringSet(snapshot, validIds);

  const persist = useCallback((next: ReadonlySet<string>) => {
    window.localStorage.setItem(storageKey, JSON.stringify([...next]));
    window.dispatchEvent(new CustomEvent(eventName, { detail: storageKey }));
  }, [eventName, storageKey]);

  const setMany = useCallback((ids: string[], enabled: boolean) => {
    const next = parsePersistedStringSet(getSnapshot(), validIds);
    ids.forEach((id) => enabled ? next.add(id) : next.delete(id));
    persist(next);
  }, [getSnapshot, persist, validIds]);

  const toggle = useCallback((id: string) => {
    const next = parsePersistedStringSet(getSnapshot(), validIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    persist(next);
  }, [getSnapshot, persist, validIds]);

  return { values, setMany, toggle };
}
