import type { SpoilerProgress, SpoilerRequirement } from "@/types/spoiler";

/** Sensitive content without an editorial review must never default to public. */
export const UNREVIEWED_SPOILER: SpoilerRequirement = { allOf: [] };

export function canRevealSpoiler(requirement: SpoilerRequirement | undefined, progress: SpoilerProgress): boolean {
  if (!requirement) return true;
  if (progress.ready && progress.allowSpoilers) return true;
  return progress.ready && requirement.allOf.length > 0
    && requirement.allOf.every((id) => progress.watched.has(id));
}

/**
 * Personalized progress toward a locked requirement, without revealing which
 * works are missing. Returns null when there is no concrete requirement to
 * measure (unreviewed content) or when the content would already be revealed.
 */
export function spoilerProgressHint(requirement: SpoilerRequirement | undefined, progress: SpoilerProgress): { watched: number; required: number } | null {
  const allOf = requirement?.allOf ?? [];
  if (!allOf.length || canRevealSpoiler(requirement, progress)) return null;
  return { watched: allOf.filter((id) => progress.watched.has(id)).length, required: allOf.length };
}

/** Return only a safe replacement when locked, never a partially redacted object. */
export function protectContent<T>(content: T, requirement: SpoilerRequirement | undefined, progress: SpoilerProgress, locked: T): T {
  return canRevealSpoiler(requirement, progress) ? content : locked;
}
