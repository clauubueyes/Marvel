import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types/character";

export function TitleCast({ characters }: { characters: Character[] }) {
  return <section className="title-cast profile-section">
    <div data-reveal><p className="section-label">02 / PERSONAJES CONECTADOS</p><h2>QUIÉN ESTÁ<br /><em>IMPLICADO</em></h2><p>Personajes con expediente NEXUS cuya historia pasa por este título.</p></div>
    {characters.length ? <div className="title-cast-grid">{characters.map((character) => <Link href={`/personajes/${character.id}`} key={character.id} data-reveal><Image src={character.image} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" /><span>{character.role}</span><h3>{character.name}</h3><b>ABRIR EXPEDIENTE ↗</b></Link>)}</div> : <p className="title-cast-empty">Todavía no hay personajes enlazados a este expediente.</p>}
  </section>;
}
