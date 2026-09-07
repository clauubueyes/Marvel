import type { SpoilerProgress, SpoilerRequirement } from "@/types/spoiler";

export function canRevealSpoiler(requirement: SpoilerRequirement | undefined, progress: SpoilerProgress): boolean {
  if (!requirement) return true;
  if (progress.ready && progress.allowSpoilers) return true;
  return progress.ready && requirement.allOf.length > 0
    && requirement.allOf.every((id) => progress.watched.has(id));
}

/** Return only a safe replacement when locked, never a partially redacted object. */
export function protectContent<T>(content: T, requirement: SpoilerRequirement | undefined, progress: SpoilerProgress, locked: T): T {
  return canRevealSpoiler(requirement, progress) ? content : locked;
}
