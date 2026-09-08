"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAccount } from "@/features/account/AccountProvider";
import { useMovieProgress } from "@/hooks/useMovieProgress";
import { buildSpoilerProgress } from "@/services/progress/spoilerProgressState";
import { TITLE_PROGRESS_EVENT, TITLE_PROGRESS_STORAGE_KEY } from "@/constants/titleDirectory";
import { mcuCatalog } from "@/data/mcuCatalog";
import type { SpoilerProgress } from "@/types/spoiler";

const validIds = new Set(mcuCatalog.map(({ slug }) => slug));

const SpoilerContext = createContext<SpoilerProgress | null>(null);

/**
 * Computes `useSpoilerProgress()` a single time per tree and exposes it to every
 * descendant, so the dossier components (story, rail, powers, facts, connections,
 * screen moment, reference, filmography) and the inline spoiler helpers share one
 * source of truth instead of running their own hook (and its subscriptions) each.
 */
export function SpoilerProgressProvider({ children }: { children: ReactNode }) {
  const account = useAccount();
  const progress = useMovieProgress({ storageKey: TITLE_PROGRESS_STORAGE_KEY, eventName: TITLE_PROGRESS_EVENT, validIds });
  const value = buildSpoilerProgress(account, { ready: progress.ready, values: progress.values });
  return <SpoilerContext.Provider value={value}>{children}</SpoilerContext.Provider>;
}

/** Must be rendered below a `<SpoilerProgressProvider>` (mounted at the app root). */
export function useSpoilerProgress(): SpoilerProgress {
  const value = useContext(SpoilerContext);
  if (!value) throw new Error("useSpoilerProgress debe usarse dentro de SpoilerProgressProvider.");
  return value;
}
