import Link from "next/link";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { MotionEffects } from "@/components/MotionEffects";
import { getEntityHref, type MCUEntity } from "@/lib/mcuEntities";

export function EntityDirectory({ entities, eyebrow, title, outline, description }: { entities: MCUEntity[]; eyebrow: string; title: string; outline: string; description: string }) {
  return <main className="entity-index" style={{ "--accent": entities[0]?.color ?? "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <MotionEffects />
    <GlobalNavigation context={`${String(entities.length).padStart(2, "0")} EXPEDIENTES`} />
    <nav className="entity-section-tabs" aria-label="Explorar conexiones"><Link href="/eventos">EVENTOS</Link><Link href="/universos">UNIVERSOS</Link><Link href="/equipos">EQUIPOS</Link></nav>
    <section className="entity-index-hero"><p className="eyebrow"><span /> {eyebrow}</p><h1>{title}<br /><em>{outline}</em></h1><p>{description}</p></section>
    <section className="entity-directory">
      {entities.map((entity, index) => <Link href={getEntityHref(entity)} className="entity-directory-card" key={entity.slug} data-reveal style={{ "--entity-accent": entity.color, "--delay": `${index * 75}ms` } as React.CSSProperties}>
        <span>{String(index + 1).padStart(2, "0")}</span><i>{entity.symbol}</i><small>{entity.kicker}</small><h2>{entity.name}</h2><p>{entity.summary}</p><div><b>{entity.status}</b><b>{entity.titleIds.length} TÍTULOS</b></div><strong>EXPLORAR CONEXIONES ↗</strong>
      </Link>)}
    </section>
  </main>;
}
