import { SpoilerDisclosure } from "@/components/common/SpoilerDisclosure";
import type { TitleDetails, TitleDossier } from "@/types/title";

export function TitleEventDossier({ title, details }: { title: TitleDossier; details?: TitleDetails }) {
  return <section className="title-dossier profile-section">
    <div className="title-dossier-heading" data-reveal><p className="section-label">01 / EL ACONTECIMIENTO</p><h2>QUÉ CAMBIA<br />EN EL <em>MCU</em></h2></div>
    <div className="title-dossier-event" data-reveal><SpoilerDisclosure label="RESUMEN CON SPOILERS"><p>{title.event}</p></SpoilerDisclosure></div>
    <dl className="title-dossier-meta" data-reveal>
      <div><dt>{details ? "ESTRENO" : "POSICIÓN"}</dt><dd>{details?.releaseDate ?? title.period}</dd></div><div><dt>{details ? "DURACIÓN" : "FORMATO"}</dt><dd>{details?.runtime ?? title.type}</dd></div><div><dt>{details ? "CLASIFICACIÓN" : "ETAPA"}</dt><dd>{details?.certification ?? title.phase}</dd></div><div><dt>{details ? "DISPONIBILIDAD" : "CONTINUIDAD"}</dt><dd>{details ? `${details.availability} · CONSULTAR SEGÚN REGIÓN` : title.continuity}</dd></div>
    </dl>
  </section>;
}
