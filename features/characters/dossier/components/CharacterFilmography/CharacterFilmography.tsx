"use client";

import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler } from "@/services/progress/spoilerPolicy";
import Link from "next/link";
import type { Character } from "@/types/character";

export function CharacterFilmography({ appearances }: { appearances: Character["appearances"] }) {
  const progress = useSpoilerProgress();
  const visibleAppearances = appearances.filter(({ titleId }) => canRevealSpoiler({ allOf: [titleId] }, progress));
  if (!visibleAppearances.length) return null;
  return <section className="filmography profile-section" data-scroll-section data-section-index="05">
    <div className="film-heading" data-reveal><p className="section-label">05 / EN PANTALLA</p><h2>SU HISTORIA<br/><em>EN CINE</em></h2><p>Una selección de los capítulos que definieron su recorrido audiovisual.</p></div>
    <div className="film-reel" data-reveal>{visibleAppearances.map((appearance, index) => <Link href={`/titulos/${appearance.titleId}`} key={appearance.title}><b>{String(index + 1).padStart(2, "0")}</b><div><span>{appearance.type}</span><h3>{appearance.title}</h3></div><strong>{appearance.year}</strong><i>↗</i></Link>)}</div>
  </section>;
}
