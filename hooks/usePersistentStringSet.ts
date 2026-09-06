"use client";

import { useCallback, useSyncExternalStore } from "react";
import { parsePersistedStringSet } from "@/utils/persistedStringSet";

type PersistentStringSetOptions = {
  storageKey: string;
  eventName: string;
  validIds: ReadonlySet<string>;
};

const memoryFallback = new Map<string, string>();

export function usePersistentStringSet({ storageKey, eventName, validIds }: PersistentStringSetOptions) {
  const subscribe = useCallback((callback: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) { memoryFallback.delete(storageKey); callback(); }
    };
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

  const getSnapshot = useCallback(() => {
    if (memoryFallback.has(storageKey)) return memoryFallback.get(storageKey)!;
    try { return window.localStorage.getItem(storageKey) ?? "[]"; }
    catch { return memoryFallback.get(storageKey) ?? "[]"; }
  }, [storageKey]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const values = parsePersistedStringSet(snapshot, validIds);

  const persist = useCallback((next: ReadonlySet<string>) => {
    const serialized = JSON.stringify([...next]);
    try { window.localStorage.setItem(storageKey, serialized); memoryFallback.delete(storageKey); }
    catch { memoryFallback.set(storageKey, serialized); }
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
