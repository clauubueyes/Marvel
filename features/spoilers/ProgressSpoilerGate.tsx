"use client";

import type { ReactNode } from "react";
import type { SpoilerRequirement } from "@/types/spoiler";
import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler } from "@/services/progress/spoilerPolicy";
import { SpoilerNotice } from "./SpoilerNotice";

export function ProgressSpoilerGate({ requirement, children, fallback }: {
  requirement: SpoilerRequirement;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const progress = useSpoilerProgress();
  if (!canRevealSpoiler(requirement, progress)) return fallback ?? <SpoilerNotice requirement={requirement} />;
  return <>{children}</>;
}
