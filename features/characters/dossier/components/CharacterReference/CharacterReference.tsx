import Link from "next/link";
import type { Character } from "@/types/character";
import type { ViewingRoute } from "@/types/viewingRoute";

type CharacterReferenceProps = { character: Character; routes: ViewingRoute[] };

export function CharacterReference({ character, routes }: CharacterReferenceProps) {
  return <section className="character-reference profile-section" data-scroll-section data-section-index="08">
    <header data-reveal><p className="section-label">08 / EXPEDIENTE EDITORIAL</p><h2>VARIANTES Y<br /><em>RECORRIDOS</em></h2></header>
    <div className="character-reference-grid">
      <article data-reveal><span>VARIANTES</span>{character.variants.length ? character.variants.map((variant) => <div key={`${variant.name}-${variant.universe}`}><h3>{variant.name}</h3><b>{variant.universe}</b><p>{variant.description}</p></div>) : <p>No hay variantes audiovisuales relevantes documentadas.</p>}</article>
      <article data-reveal style={{ "--delay": "90ms" } as React.CSSProperties}><span>QUÉ VER PARA CONOCERLE</span>{routes.map((route) => <Link href={`/rutas/${route.slug}`} key={route.slug}><h3>{route.name}</h3><p>{route.description}</p><b>ABRIR RECORRIDO ↗</b></Link>)}</article>
      <article data-reveal style={{ "--delay": "180ms" } as React.CSSProperties}><span>FUENTES Y REVISIÓN</span>{character.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}<p>Última revisión: <time dateTime={character.reviewedAt}>{character.reviewedAt}</time></p></article>
    </div>
  </section>;
}
