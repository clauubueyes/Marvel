import type { TitleDetails, TitleDossier } from "@/types/title";
import { TitleTrailer } from "../TitleTrailer/TitleTrailer";

export function TitleCredits({ title, details }: { title: TitleDossier; details: TitleDetails }) {
  return <section className="title-credits profile-section">
    <header data-reveal><p className="section-label">02 / FICHA TÉCNICA</p><h2>QUIÉN LE DIO<br /><em>FORMA</em></h2></header>
    <div className="title-credit-columns" data-reveal><article><span>DIRECCIÓN</span>{details.directors.length ? details.directors.map((name) => <b key={name}>{name}</b>) : <b>POR CONFIRMAR</b>}</article><article><span>GUION</span>{details.writers.length ? details.writers.map((name) => <b key={name}>{name}</b>) : <b>POR CONFIRMAR</b>}</article><article><span>REPARTO PRINCIPAL</span>{details.cast.map((name) => <b key={name}>{name}</b>)}</article></div>
    {details.trailerId && <TitleTrailer title={title} videoId={details.trailerId} />}
  </section>;
}
