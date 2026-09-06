"use client";

import Image from "next/image";
import { useRef } from "react";
import type { StoryChapter } from "@/types/character";

type CharacterChapterProps = {
  chapter: StoryChapter;
  act: string;
  actNumeral: string;
  position: "left" | "right";
  index: number;
  total: number;
  portrait?: string;
  portraitPosition?: string;
  nextAct?: string;
  nextYear?: string;
};

const MOOD_BY_ACT: Record<string, string> = {
  I: "origin",
  II: "power",
  III: "crisis",
  IV: "resolution",
};

export function CharacterChapter({ chapter, act, actNumeral, position, index, total, portrait, portraitPosition, nextAct, nextYear }: CharacterChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isLast = index === total - 1;
  const mood = MOOD_BY_ACT[actNumeral] ?? "origin";
  const numbers = `${String(index + 1).padStart(2, "0")} · ${String(total).padStart(2, "0")}`;
  const titleLetters = Array.from(chapter.title);

  const handleScenePointer = (event: React.PointerEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = section.getBoundingClientRect();
    section.style.setProperty("--mx", String((event.clientX - rect.left) / rect.width - 0.5));
    section.style.setProperty("--my", String((event.clientY - rect.top) / rect.height - 0.5));
  };

  const continueStory = () => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".profile [data-beat]"));
    const current = sections.indexOf(sectionRef.current as HTMLElement);
    const next = sections[current + 1];
    (next ?? document.querySelector<HTMLElement>(".profile .context-nodes"))?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return <section ref={sectionRef} className="profile-section story-beat" onPointerMove={handleScenePointer} data-scroll-section data-section-index={actNumeral} data-beat={position} data-mood={mood} aria-label={`${act} · ${chapter.title}`}>
    <div className="story-beat-atmosphere" aria-hidden="true">
      {portrait && <div className="story-beat-backdrop"><Image src={portrait} alt="" fill sizes="(max-width: 900px) 100vw, 62vw" style={portraitPosition ? { objectPosition: portraitPosition } : undefined} /></div>}
      <div className="story-beat-aura" aria-hidden="true" />
      <div className="story-beat-grain" />
      <div className="story-beat-beam" />
      <div className="story-beat-orbit"><i /><i /><i />{["✦", "☉", "♆", "✧", "≋", "☄"].map((rune, runeIndex) => <b key={runeIndex} style={{ "--angle": `${runeIndex * 60}deg`, "--dly": `${-(runeIndex % 6) * 1.1}s` } as React.CSSProperties}>{rune}</b>)}</div>
      <div className="story-beat-particles">{Array.from({ length: 18 }, (_, particle) => {
        const seed = particle * 47 + (index + 1) * 31;
        const kind = particle % 4 === 0 ? "story-beat-particle-mote" : particle % 3 === 0 ? "story-beat-particle-shard" : "";
        return <i key={particle} className={kind} style={{ left: `${8 + (seed % 84)}%`, top: `${3 + ((seed * 13) % 90)}%`, transform: `rotate(${(seed * 7) % 180}deg) scale(${0.5 + (seed % 5) * 0.15})`, "--sway": `${8 + (seed % 9) * 2}px`, "--dly": `${-(particle % 9) * 0.7}s` } as React.CSSProperties} />;
      })}</div>
      <div className="story-beat-sparks" aria-hidden="true">{Array.from({ length: 8 }, (_, spark) => {
        const seed = spark * 61 + (index + 1) * 17;
        return <b key={spark} style={{ left: `${6 + (seed % 88)}%`, top: `${8 + ((seed * 7) % 80)}%`, "--dly": `${(spark % 8) * 0.9}s`, "--float": `${9 + (seed % 7) * 3}px` } as React.CSSProperties}>✦</b>;
      })}</div>
      <strong className="story-beat-watermark">{actNumeral}</strong>
      <b className="story-beat-year">{chapter.year}</b>
    </div>
    <div className="story-beat-node" aria-hidden="true"><i /></div>
    <article className="story-beat-card" data-reveal>
      <div className="story-beat-meta"><span>{act}</span><b>{chapter.year}</b><em>{numbers}</em></div>
      <h2><em>{chapter.kicker}</em><span className="story-beat-title" aria-label={chapter.title}>{titleLetters.map((letter, letterIndex) => letter === " " ? <span className="story-beat-space" key={letterIndex} aria-hidden="true">{" "}</span> : <i className="story-beat-title-letter" style={{ "--letter": letterIndex } as React.CSSProperties} key={letterIndex} aria-hidden="true">{letter}</i>)}</span></h2>
      <p>{chapter.text}</p>
      <button type="button" className="story-beat-cta" onClick={continueStory}>
        <span className="story-beat-cta-copy">
          <strong>{isLast ? "SIGUE EL RECORRIDO DEL NEXO" : "CONTINUAR LA HISTORIA"}</strong>
          {!isLast && nextAct ? <em>{nextAct} · {nextYear}</em> : null}
        </span>
        <b aria-hidden="true">{isLast ? "↘" : "↓"}</b>
      </button>
    </article>
  </section>;
}