"use client";

import { useAccount } from "@/features/account/AccountProvider";
import { useMovieProgress } from "@/hooks/useMovieProgress";
import { TITLE_PROGRESS_EVENT, TITLE_PROGRESS_STORAGE_KEY } from "@/constants/titleDirectory";
import { mcuCatalog } from "@/data/mcuCatalog";

const validIds = new Set(mcuCatalog.map(({ slug }) => slug));

export function useSpoilerProgress() {
  const account = useAccount();
  const progress = useMovieProgress({ storageKey: TITLE_PROGRESS_STORAGE_KEY, eventName: TITLE_PROGRESS_EVENT, validIds });
  // Do not reveal optimistic additions or data whose persistence is uncertain.
  const allowSpoilers = account.initialized && !!account.user && account.user.user_metadata?.avoid_spoilers === false;
  return { watched: progress.values, allowSpoilers, ready: allowSpoilers || (progress.ready && !account.pending && !account.error) };
}
