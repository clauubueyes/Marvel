"use client";

import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { canRevealSpoiler, UNREVIEWED_SPOILER } from "@/services/progress/spoilerPolicy";
import { SpoilerNotice } from "@/features/spoilers/SpoilerNotice";
import Link from "next/link";
import { getEntityHref } from "@/data/mcuEntities";
import type { MCUEntity } from "@/types/entity";

export function CharacterConnections({ entities }: { entities: MCUEntity[] }) {
  const progress = useSpoilerProgress();
  if (!canRevealSpoiler(UNREVIEWED_SPOILER, progress)) return <section className="profile-section"><SpoilerNotice /></section>;
  if (!entities.length) return null;
  return <section className="context-nodes profile-section" data-scroll-section data-section-index="06"><header data-reveal><p className="section-label">06 / CONEXIONES</p><h2>SU LUGAR<br /><em>EN EL NEXUS</em></h2></header><div>{entities.map((entity, index) => <Link href={getEntityHref(entity)} key={`${entity.kind}-${entity.slug}`} data-reveal data-tilt style={{ "--node-accent": entity.color, "--delay": `${index * 90}ms` } as React.CSSProperties}><span>{entity.kind}</span><strong>{entity.symbol}</strong><h3>{entity.name}</h3><p>{entity.summary}</p><b>EXPLORAR ↗</b></Link>)}</div></section>;
}
