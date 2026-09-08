"use client";

import { useAccount } from "@/features/account/AccountProvider";
import { useMovieProgress } from "@/hooks/useMovieProgress";
import { buildSpoilerProgress } from "@/services/progress/spoilerProgressState";
import { TITLE_PROGRESS_EVENT, TITLE_PROGRESS_STORAGE_KEY } from "@/constants/titleDirectory";
import { mcuCatalog } from "@/data/mcuCatalog";

const validIds = new Set(mcuCatalog.map(({ slug }) => slug));

export function useSpoilerProgress() {
  const account = useAccount();
  const progress = useMovieProgress({ storageKey: TITLE_PROGRESS_STORAGE_KEY, eventName: TITLE_PROGRESS_EVENT, validIds });
  return buildSpoilerProgress(account, { ready: progress.ready, values: progress.values });
}
