"use client";

import { useEffect, useRef, useState } from "react";

type StorylineRailProps = {
  beats: { year: string; act: string }[];
};

export function StorylineRail({ beats }: StorylineRailProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".profile [data-beat]"));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const current = sections.indexOf(entry.target as HTMLElement);
          if (current >= 0) setActive(current);
        }
      }),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  if (!beats.length) return null;

  return <aside className="storyline-rail" ref={rootRef} aria-label="Recorrido de la historia">
    <span className="storyline-rail-track" />
    {beats.map((beat, index) => <button
      type="button"
      key={`${beat.act}-${beat.year}`}
      data-active={index === active ? "true" : "false"}
      onClick={() => document.querySelectorAll<HTMLElement>(".profile [data-beat]")[index]?.scrollIntoView({ behavior: "smooth", block: "center" })}
    ><i /><b>{beat.year}</b><small>{beat.act}</small></button>)}
  </aside>;
}