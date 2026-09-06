"use client";

import { useAccount } from "@/features/account/AccountProvider";
import { usePersistentStringSet } from "@/hooks/usePersistentStringSet";
import { playMovieProgressSound } from "@/services/audio";

export function useMovieProgress(options: Parameters<typeof usePersistentStringSet>[0]) {
  const account = useAccount();
  const guest = usePersistentStringSet(options);
  const values = !account.initialized ? new Set<string>() : account.user
    ? new Set([...account.watched].filter((id) => options.validIds.has(id))) : guest.values;
  const setMany = (ids: string[], enabled: boolean) => {
    if (!account.initialized) return;
    const valid = ids.filter((id) => options.validIds.has(id));
    if (account.user) account.store.setMany(valid, enabled);
    else guest.setMany(valid, enabled);
  };
  const toggle = (id: string) => {
    if (!account.initialized || !account.ready || !options.validIds.has(id)) return;
    const watched = !(account.user ? account.store.getSnapshot().watched : guest.values).has(id);
    if (account.user) setMany([id], watched);
    else guest.toggle(id);
    playMovieProgressSound(watched);
  };
  return { values, setMany, toggle, ready: account.initialized && account.ready };
}
