"use client";

import { UNREVIEWED_SPOILER } from "@/services/progress/spoilerPolicy";

import { useEffect, useRef, useState } from "react";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import type { SpoilerRequirement } from "@/types/spoiler";
import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler } from "@/services/progress/spoilerPolicy";

type StorylineRailProps = {
  beats: { year: string; act: string; spoiler?: SpoilerRequirement }[];
};

export function StorylineRail({ beats: sourceBeats }: StorylineRailProps) {
  const progress = useSpoilerProgress();
  const beats = sourceBeats.filter((beat) =>
    canRevealSpoiler(beat.spoiler ?? UNREVIEWED_SPOILER, progress),
  );
  const beatsKey = beats.map((beat) => beat.act).join(",");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".profile [data-history-step]"),
    );
    if (!sections.length) return;

    // gsap se carga bajo demanda: el rail solo enhancece la navegación, no oculta
    // contenido, así que un chunk asíncrono no puede provocar un flash de layout.
    let triggers: ScrollTriggerInstance[] = [];
    let cancelled = false;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      triggers = sections.map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "top 55%",
          onEnter: () => {
            const current = sections.indexOf(section);
            if (current >= 0) setActive(current);
          },
        }),
      );
    })();

    return () => {
      cancelled = true;
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [beatsKey]);

  if (!beats.length) return null;

  const goTo = (index: number) => {
    setActive(index);
    const target = document.querySelectorAll<HTMLElement>(".profile [data-history-step]")[index];
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <aside className="storyline-rail" ref={rootRef} aria-label="Recorrido de la historia">
      <span className="storyline-rail-track" />
      {beats.map((beat, index) => (
        <button
          type="button"
          key={`${beat.act}-${beat.year}`}
          data-active={index === Math.min(active, beats.length - 1) ? "true" : "false"}
          onClick={() => goTo(index)}
        >
          <i />
          <b>{beat.year}</b>
          <small>{beat.act}</small>
        </button>
      ))}
    </aside>
  );
}
