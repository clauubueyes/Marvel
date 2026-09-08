import Link from "next/link";
import { ProgressSpoilerGate } from "@/features/spoilers/ProgressSpoilerGate";
import type { MCUEntry } from "@/types/title";
import type { SpoilerRequirement } from "@/types/spoiler";

type TitleWatchOrderProps = { before: MCUEntry[]; after: MCUEntry[]; requirement: SpoilerRequirement };

export function TitleWatchOrder({ before, after, requirement }: TitleWatchOrderProps) {
  const afterColumn = <article><span>CONTINUAR CON</span>{after.map((related) => <Link href={`/titulos/${related.slug}`} key={related.slug}><small>{related.type} · {related.period}</small><strong>{related.title}</strong><i>↗</i></Link>)}</article>;
  return <section className="title-watch profile-section"><header><p className="section-label">03 / ORDEN DE VISIONADO</p><h2>ANTES Y<br /><em>DESPUÉS</em></h2></header><div className="title-watch-columns"><article><span>VER ANTES</span>{before.length ? before.map((related) => <Link href={`/titulos/${related.slug}`} key={related.slug}><small>{related.type} · {related.period}</small><strong>{related.title}</strong><i>↗</i></Link>) : <p>Esta historia funciona como punto de entrada.</p>}</article>{after.length ? <ProgressSpoilerGate requirement={requirement}>{afterColumn}</ProgressSpoilerGate> : afterColumn}</div></section>;
}