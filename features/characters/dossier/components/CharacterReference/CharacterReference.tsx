"use client";

import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler, UNREVIEWED_SPOILER } from "@/services/progress/spoilerPolicy";
import Link from "next/link";
import type { Character } from "@/types/character";
import type { ViewingRoute } from "@/types/viewingRoute";

type CharacterReferenceProps = { character: Character; routes: ViewingRoute[] };

export function CharacterReference({ character, routes }: CharacterReferenceProps) {
  const progress = useSpoilerProgress();
  const variants = character.variants.filter((_, index) => canRevealSpoiler(character.spoilers?.variants?.[index] ?? UNREVIEWED_SPOILER, progress));
  return <section className="character-reference profile-section" data-scroll-section data-section-index="07">
    <header data-reveal><p className="section-label">07 / EXPEDIENTE EDITORIAL</p><h2>VARIANTES Y<br /><em>RECORRIDOS</em></h2></header>
    <div className="character-reference-grid">
      {variants.length > 0 && <article className="character-reference-variants" data-reveal><span>VARIANTES</span>{variants.map((variant) => <div key={`${variant.name}-${variant.universe}`}><h3>{variant.name}</h3><b>{variant.universe}</b><p>{variant.description}</p></div>)}</article>}
      <article className="character-reference-routes" data-reveal style={{ "--delay": "90ms" } as React.CSSProperties}><span>QUÉ VER PARA CONOCERLE</span><div className="character-reference-route-list">{routes.map((route) => canRevealSpoiler({ allOf: route.steps.map(({ titleId }) => titleId) }, progress)
        ? <Link href={`/rutas/${route.slug}`} key={route.slug}><h3>{route.name}</h3><p>{route.description}</p><b>ABRIR RECORRIDO ↗</b></Link>
        : null)}<Link href="/titulos"><h3>Tu próximo título</h3><p>Explora el catálogo y actualiza lo que has visto.</p><b>CONTINUAR ↗</b></Link></div></article>
      <article className="character-reference-sources" data-reveal style={{ "--delay": "180ms" } as React.CSSProperties}><span>FUENTES Y REVISIÓN</span><div>{character.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}</div><p>Última revisión: <time dateTime={character.reviewedAt}>{character.reviewedAt}</time></p></article>
    </div>
  </section>;
}
