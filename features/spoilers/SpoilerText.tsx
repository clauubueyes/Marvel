"use client";

import type { SpoilerRequirement } from "@/types/spoiler";
import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler } from "@/services/progress/spoilerPolicy";

export function SpoilerText({ text, requirement }: { text: string; requirement?: SpoilerRequirement }) {
  const progress = useSpoilerProgress();
  return canRevealSpoiler(requirement, progress) ? text : "🔒 Bloqueado por spoilers";
}
