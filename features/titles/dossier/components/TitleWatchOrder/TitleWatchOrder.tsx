import Link from "next/link";
import type { MCUEntry } from "@/types/title";

type TitleWatchOrderProps = { before: MCUEntry[]; after: MCUEntry[] };

export function TitleWatchOrder({ before, after }: TitleWatchOrderProps) {
  return <section className="title-watch profile-section"><header><p className="section-label">03 / ORDEN DE VISIONADO</p><h2>ANTES Y<br /><em>DESPUÉS</em></h2></header><div className="title-watch-columns"><article><span>VER ANTES</span>{before.length ? before.map((related) => <Link href={`/titulos/${related.slug}`} key={related.slug}><small>{related.type} · {related.period}</small><strong>{related.title}</strong><i>↗</i></Link>) : <p>Esta historia funciona como punto de entrada.</p>}</article><article><span>CONTINUAR CON</span>{after.map((related) => <Link href={`/titulos/${related.slug}`} key={related.slug}><small>{related.type} · {related.period}</small><strong>{related.title}</strong><i>↗</i></Link>)}</article></div></section>;
}
