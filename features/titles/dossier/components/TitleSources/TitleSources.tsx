import type { TitleDetails } from "@/types/title";

export function TitleSources({ details }: { details: TitleDetails }) {
  return <section className="title-sources"><div><span>ÚLTIMA REVISIÓN</span><strong>{details.reviewedAt}</strong></div><div><span>FUENTES OFICIALES</span>{details.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label} ↗</a>)}</div><p>Los datos técnicos proceden de las fuentes enlazadas. Las explicaciones argumentales y relaciones son síntesis editoriales de NEXUS.</p></section>;
}
