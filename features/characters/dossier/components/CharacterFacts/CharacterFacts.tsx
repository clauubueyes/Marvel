"use client";

import { UNREVIEWED_SPOILER } from "@/services/progress/spoilerPolicy";

import type { Character } from "@/types/character";
import type { SpoilerRequirement } from "@/types/spoiler";
import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler } from "@/services/progress/spoilerPolicy";

export function CharacterFacts({ facts: sourceFacts, requirements }: { facts: Character["facts"]; requirements?: SpoilerRequirement[] }) {
  const progress = useSpoilerProgress();
  const facts = sourceFacts.filter((_, index) => canRevealSpoiler(requirements?.[index] ?? UNREVIEWED_SPOILER, progress));
  if (!facts.length) return null;
  return <section className="profile-facts profile-section" data-scroll-section data-section-index="04">
    <div className="facts-heading" data-reveal><p className="section-label">04 / DATOS CURIOSOS</p><h2>LO QUE NO<br/><em>SE VE</em></h2><span>LOS DETALLES QUE YA PUEDES EXPLORAR EN SU HISTORIA.</span></div>
    <div className="facts-grid">{facts.map((fact, index) => <article data-reveal style={{ "--delay": `${index * 100}ms` } as React.CSSProperties} key={index}><span>0{index + 1}</span><strong>{fact.value}</strong><h3>{fact.label}</h3><p>{fact.text}</p></article>)}</div>
  </section>;
}
