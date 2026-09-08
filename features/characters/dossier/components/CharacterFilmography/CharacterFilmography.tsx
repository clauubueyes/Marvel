"use client";

import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler } from "@/services/progress/spoilerPolicy";
import { SpoilerNotice } from "@/features/spoilers/SpoilerNotice";
import Link from "next/link";
import type { Character } from "@/types/character";

export function CharacterFilmography({ appearances }: { appearances: Character["appearances"] }) {
  const progress = useSpoilerProgress();
  if (!appearances.length) return null;
  return <section className="filmography profile-section" data-scroll-section data-section-index="05">
    <div className="film-heading" data-reveal><p className="section-label">05 / EN PANTALLA</p><h2>SU HISTORIA<br/><em>EN CINE</em></h2><p>Una selección de los capítulos que definieron su recorrido audiovisual.</p></div>
    <div className="film-reel" data-reveal>{appearances.map((appearance, index) => canRevealSpoiler({ allOf: [appearance.titleId] }, progress)
      ? <Link href={`/titulos/${appearance.titleId}`} key={appearance.title}><b>{String(index + 1).padStart(2, "0")}</b><div><span>{appearance.type}</span><h3>{appearance.title}</h3></div><strong>{appearance.year}</strong><i>↗</i></Link>
      : <article className="film-locked" key={appearance.title}><SpoilerNotice /></article>)}</div>
  </section>;
}
