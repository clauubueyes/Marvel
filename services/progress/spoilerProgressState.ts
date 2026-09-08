import type { SpoilerProgress } from "@/types/spoiler";

/**
 * Combine the account snapshot and the base movie-progress state into the
 * spoiler-aware decision, without depending on React.
 *
 * The optimistic-invariant: protected content is only revealed once the write
 * is confirmed. A pending save (`pending > 0`) or a failed load (`error`) must
 * keep everything locked, even if `values` already reflects an optimistic edit.
 * An explicit spoiler opt-out (`avoid_spoilers === false`) reveals as soon as
 * the account is initialized, since protection is then disabled on purpose.
 */
export type SpoilerAccountState = {
  initialized: boolean;
  user: { user_metadata?: { avoid_spoilers?: unknown } } | null;
  pending: number;
  error: string | null;
};

type BaseProgressState = { ready: boolean; values: ReadonlySet<string> };

export function buildSpoilerProgress(account: SpoilerAccountState, progress: BaseProgressState): SpoilerProgress {
  const allowSpoilers = account.initialized && !!account.user && account.user.user_metadata?.avoid_spoilers === false;
  const ready = allowSpoilers || (progress.ready && account.pending === 0 && !account.error);
  return { watched: progress.values, allowSpoilers, ready };
}
