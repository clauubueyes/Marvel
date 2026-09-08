import Link from "next/link";
import { getEntityHref } from "@/data/mcuEntities";
import { SpoilerText } from "@/features/spoilers/SpoilerText";
import type { MCUEntity } from "@/types/entity";
import type { SpoilerRequirement } from "@/types/spoiler";

export function TitleConnections({ entities, requirement }: { entities: MCUEntity[]; requirement: SpoilerRequirement }) {
  if (!entities.length) return null;
  return <section className="context-nodes profile-section"><header><p className="section-label">03 / CONEXIONES</p><h2>MÁS ALLÁ<br /><em>DEL TÍTULO</em></h2></header><div>{entities.map((entity) => <Link href={getEntityHref(entity)} key={`${entity.kind}-${entity.slug}`} style={{ "--node-accent": entity.color } as React.CSSProperties}><span>{entity.kind}</span><strong>{entity.symbol}</strong><h3>{entity.name}</h3><p><SpoilerText text={entity.summary} requirement={requirement} /></p><b>EXPLORAR ↗</b></Link>)}</div></section>;
}