import Image from "next/image";
import Link from "next/link";
import { HOME_CATALOG_IMAGES } from "@/constants/homeCatalog";
import type { MCUEntry } from "@/types/title";
import { getTitleImage } from "@/utils/titleImages";

export function MCUCatalogEntry({ entry }: { entry: MCUEntry }) {
  return <details className="catalog-entry watch-entry" data-reveal>
    <summary>
      <span className="watch-order">{String(entry.order).padStart(2, "0")}</span>
      <div className={`catalog-art catalog-art-${entry.continuity.toLowerCase().replaceAll(" ", "-")} has-image`} aria-hidden="true"><Image src={HOME_CATALOG_IMAGES[entry.title] ?? getTitleImage(entry.slug)} alt="" fill sizes="(max-width: 560px) 80vw, 245px" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.parentElement?.classList.remove("has-image"); }}/><b>{entry.title.split(" ").slice(0, 2).map((word) => word[0]).join("")}</b><small>{entry.phase}</small><span>MARVEL STUDIOS · ARCHIVO {String(entry.order).padStart(2, "0")}</span></div>
      <div className="watch-main"><small>{entry.period} · {entry.type}</small><h3>{entry.title}</h3><p>{entry.event}</p><b>{entry.continuity}</b></div><span className="expand-label"><i>+</i> VER SUCESO</span>
    </summary>
    <div className="event-dossier catalog-event"><div><span>EL SUCESO CLAVE</span><p>{entry.event}</p><Link className="dossier-link" href={`/titulos/${entry.slug}`}>ABRIR EXPEDIENTE COMPLETO ↗</Link></div><div><span>POSICIÓN EN LA HISTORIA</span><p>{entry.period}</p><strong>{entry.phase} · {entry.continuity}</strong></div><div><span>FORMATO</span><article><b>{entry.type}</b><small>PRODUCCIÓN AUDIOVISUAL</small></article></div></div>
  </details>;
}
