import Image from "next/image";
import type { Character } from "@/types/character";

export function CharacterIdentity({ character }: { character: Character }) {
  return <section className="profile-intro profile-section" data-scroll-section data-section-index="01">
    <div className="identity-title" data-reveal><p className="section-label">01 / IDENTIDAD</p><h2>DETRÁS<br />DEL <em>SÍMBOLO</em></h2><div className="identity-status"><i /> EXPEDIENTE ACTIVO <b>NXS-{character.number}616</b></div></div>
    <div className="identity-portrait" data-reveal data-tilt aria-hidden="true">
      <div className="portrait-orbit"><i /><i /></div>
      <span className="portrait-symbol">{character.symbol}</span>
      <Image src={character.image} alt="" fill sizes="(max-width: 560px) 86vw, 520px" style={{ objectPosition: character.imagePosition ?? "center top" }} />
      <b className="portrait-index">{character.number}</b>
      <small>{character.alias} / {character.role}</small>
    </div>
    <div className="intro-copy" data-reveal><p>{character.description}</p><dl><div><dt>IDENTIDAD</dt><dd>{character.alias}</dd></div><div><dt>ORIGEN</dt><dd>{character.origin}</dd></div><div><dt>UNIVERSO</dt><dd>{character.universe}</dd></div><div><dt>FUNCIÓN</dt><dd>{character.category}</dd></div><div><dt>ESTADO</dt><dd>{character.status}</dd></div><div><dt>AFILIACIONES</dt><dd>{character.affiliations.join(" · ")}</dd></div></dl><a className="image-credit" href={character.sourceUrl} target="_blank" rel="noreferrer">IMAGEN Y PERSONAJE © MARVEL · VER FUENTE ↗</a></div>
  </section>;
}
