"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StorylineRailProps = {
  beats: { year: string; act: string }[];
};

export function StorylineRail({ beats }: StorylineRailProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".profile [data-history-step]"));
    if (!sections.length) return;

    const triggers: ScrollTrigger[] = sections.map((section) =>
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

    return () => triggers.forEach((trigger) => trigger.kill());
  }, []);

  if (!beats.length) return null;

  const goTo = (index: number) => {
    setActive(index);
    const target = document.querySelectorAll<HTMLElement>(".profile [data-history-step]")[index];
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return <aside className="storyline-rail" ref={rootRef} aria-label="Recorrido de la historia">
    <span className="storyline-rail-track" />
    {beats.map((beat, index) => <button
      type="button"
      key={`${beat.act}-${beat.year}`}
      data-active={index === active ? "true" : "false"}
      onClick={() => goTo(index)}
    ><i /><b>{beat.year}</b><small>{beat.act}</small></button>)}
  </aside>;
}