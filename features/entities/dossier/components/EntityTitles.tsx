import Link from "next/link";
import type { MCUEntry } from "@/types/title";

export function EntityTitles({ titles }: { titles: MCUEntry[] }) {
  return <section className="entity-titles profile-section"><header><p className="section-label">02 / PRODUCCIONES</p><h2>DÓNDE<br /><em>OCURRE</em></h2></header><div>{titles.map((title, index) => <Link href={`/titulos/${title.slug}`} key={title.slug}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{title.type} · {title.period}</small><h3>{title.title}</h3><p>{title.event}</p></div><i>↗</i></Link>)}</div></section>;
}
