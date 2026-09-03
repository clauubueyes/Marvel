"use client";

import { useEffect, useRef } from "react";
import { ANALYTICS_READY_EVENT } from "@/services/analytics/consent";
import { trackCharacterView, trackPlannerOpened, trackPlannerPlanGenerated, trackRouteView, trackTitleView } from "@/services/analytics";

type AnalyticsViewProps =
  | { kind: "character"; id: string; name: string }
  | { kind: "title"; slug: string; name: string; titleType: string }
  | { kind: "route"; slug: string; name: string }
  | { kind: "planner" }
  | { kind: "planner_generated"; titleCount: number; sessionCount: number };

export function AnalyticsView(props: AnalyticsViewProps) {
  const tracked = useRef(false);
  useEffect(() => {
    const send = () => {
      if (tracked.current) return;
      if (props.kind === "character") trackCharacterView(props.id, props.name);
      if (props.kind === "title") trackTitleView(props.slug, props.name, props.titleType);
      if (props.kind === "route") trackRouteView(props.slug, props.name);
      if (props.kind === "planner") trackPlannerOpened();
      if (props.kind === "planner_generated") trackPlannerPlanGenerated(props.titleCount, props.sessionCount);
      if (window.__nexusAnalyticsReady) tracked.current = true;
    };
    send();
    window.addEventListener(ANALYTICS_READY_EVENT, send);
    return () => window.removeEventListener(ANALYTICS_READY_EVENT, send);
  }, [props]);
  return null;
}
