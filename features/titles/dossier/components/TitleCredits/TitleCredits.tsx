import Image from "next/image";
import type { TitleDetails, TitleDossier } from "@/types/title";

export function TitleCredits({ title, details }: { title: TitleDossier; details: TitleDetails }) {
  return <section className="title-credits profile-section">
    <header data-reveal><p className="section-label">02 / FICHA TÉCNICA</p><h2>QUIÉN LE DIO<br /><em>FORMA</em></h2></header>
    <div className="title-credit-columns" data-reveal><article><span>DIRECCIÓN</span>{details.directors.length ? details.directors.map((name) => <b key={name}>{name}</b>) : <b>POR CONFIRMAR</b>}</article><article><span>GUION</span>{details.writers.length ? details.writers.map((name) => <b key={name}>{name}</b>) : <b>POR CONFIRMAR</b>}</article><article><span>REPARTO PRINCIPAL</span>{details.cast.map((name) => <b key={name}>{name}</b>)}</article></div>
    {details.trailerId && <a className="title-trailer" href={`https://www.youtube.com/watch?v=${details.trailerId}`} target="_blank" rel="noreferrer" data-reveal><Image src={`/trailers/${title.slug}.webp`} alt={`Tráiler oficial de ${title.title}`} fill sizes="(max-width: 800px) 100vw, 55vw" /><span>TRÁILER OFICIAL</span><strong>▶</strong><b>VER EN YOUTUBE ↗</b></a>}
  </section>;
}
