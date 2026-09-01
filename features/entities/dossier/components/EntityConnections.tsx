import Link from "next/link";
import { getEntityHref } from "@/data/mcuEntities";
import type { MCUEntityDossier } from "@/types/entity";

export function EntityConnections({ connections }: { connections: MCUEntityDossier["connections"] }) {
  return <section className="entity-connections profile-section"><header><p className="section-label">03 / MAPA NEXUS</p><h2>CONEXIONES<br /><em>DIRECTAS</em></h2></header><div className="entity-connection-grid">{connections.map(({ entity, label }) => <Link href={getEntityHref(entity)} key={`${entity.kind}-${entity.slug}`} style={{ "--connection-accent": entity.color } as React.CSSProperties}><span>{entity.kind}</span><strong>{entity.symbol}</strong><h3>{entity.name}</h3><p>{label}</p><b>ABRIR NODO ↗</b></Link>)}</div></section>;
}
