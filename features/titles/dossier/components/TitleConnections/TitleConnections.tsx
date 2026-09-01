import Link from "next/link";
import { getEntityHref } from "@/data/mcuEntities";
import type { MCUEntity } from "@/types/entity";

export function TitleConnections({ entities }: { entities: MCUEntity[] }) {
  if (!entities.length) return null;
  return <section className="context-nodes profile-section"><header><p className="section-label">03 / CONEXIONES</p><h2>MÁS ALLÁ<br /><em>DEL TÍTULO</em></h2></header><div>{entities.map((entity) => <Link href={getEntityHref(entity)} key={`${entity.kind}-${entity.slug}`} style={{ "--node-accent": entity.color } as React.CSSProperties}><span>{entity.kind}</span><strong>{entity.symbol}</strong><h3>{entity.name}</h3><p>{entity.summary}</p><b>EXPLORAR ↗</b></Link>)}</div></section>;
}
