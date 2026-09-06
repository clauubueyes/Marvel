"use client";

import { useRef } from "react";
import type { StoryChapter } from "@/types/character";

type CharacterChapterProps = {
  chapter: StoryChapter;
  act: string;
  actNumeral: string;
  position: "left" | "right";
  index: number;
  total: number;
};

const MOOD_BY_ACT: Record<string, string> = {
  I: "origin",
  II: "power",
  III: "crisis",
  IV: "resolution",
};

export function CharacterChapter({ chapter, act, actNumeral, position, index, total }: CharacterChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isLast = index === total - 1;
  const mood = MOOD_BY_ACT[actNumeral] ?? "origin";
  const numbers = `${String(index + 1).padStart(2, "0")} · ${String(total).padStart(2, "0")}`;
  const titleLetters = Array.from(chapter.title);

  const continueStory = () => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".profile [data-beat]"));
    const current = sections.indexOf(sectionRef.current as HTMLElement);
    const next = sections[current + 1];
    (next ?? document.querySelector<HTMLElement>(".profile .context-nodes"))?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return <section ref={sectionRef} className="profile-section story-beat" data-scroll-section data-section-index={actNumeral} data-beat={position} data-mood={mood} aria-label={`${act} · ${chapter.title}`}>
    <div className="story-beat-atmosphere" aria-hidden="true">
      <div className="story-beat-beam" />
      <div className="story-beat-orbit"><i /><i /><i /></div>
      <div className="story-beat-particles">{Array.from({ length: 9 }, (_, particle) => {
        const seed = particle * 47 + (index + 1) * 31;
        return <i key={particle} style={{ left: `${10 + (seed % 78)}%`, top: `${4 + ((seed * 13) % 88)}%`, transform: `rotate(${(seed * 7) % 180}deg) scale(${0.5 + (seed % 5) * 0.15})`, "--sway": `${8 + (seed % 9) * 2}px`, "--dly": `${-(particle % 9) * 0.85}s` } as React.CSSProperties} />;
      })}</div>
      <strong className="story-beat-watermark">{actNumeral}</strong>
      <b className="story-beat-year">{chapter.year}</b>
    </div>
    <div className="story-beat-node" aria-hidden="true"><i /></div>
    <article className="story-beat-card" data-reveal>
      <div className="story-beat-meta"><span>{act}</span><b>{chapter.year}</b><em>{numbers}</em></div>
      <h2><em>{chapter.kicker}</em><span className="story-beat-title" aria-label={chapter.title}>{titleLetters.map((letter, letterIndex) => letter === " " ? <span className="story-beat-space" key={letterIndex} aria-hidden="true">{" "}</span> : <i className="story-beat-title-letter" style={{ "--letter": letterIndex } as React.CSSProperties} key={letterIndex} aria-hidden="true">{letter}</i>)}</span></h2>
      <p>{chapter.text}</p>
      <button type="button" className="story-beat-cta" onClick={continueStory}><span>{isLast ? "SIGUE EL RECORRIDO DEL NEXO" : "CONTINUAR LA HISTORIA"}</span><b aria-hidden="true">{isLast ? "↘" : "↓"}</b></button>
    </article>
  </section>;
}