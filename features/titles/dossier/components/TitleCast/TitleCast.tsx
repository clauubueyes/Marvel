import Image from "next/image";
import Link from "next/link";
import { ProgressSpoilerGate } from "@/features/spoilers/ProgressSpoilerGate";
import type { Character } from "@/types/character";
import type { SpoilerRequirement } from "@/types/spoiler";

export function TitleCast({ characters, requirement }: { characters: Character[]; requirement: SpoilerRequirement }) {
  return <section className="title-cast profile-section">
    <div data-reveal><p className="section-label">02 / PERSONAJES CONECTADOS</p><h2>QUIÉN ESTÁ<br /><em>IMPLICADO</em></h2><p>Personajes con expediente NEXUS cuya historia pasa por este título.</p></div>
    {characters.length
      ? <ProgressSpoilerGate requirement={requirement}><div className="title-cast-grid">{characters.map((character) => <Link href={`/personajes/${character.id}`} key={character.id} data-reveal><Image src={character.image} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" /><span>{character.role}</span><h3>{character.name}</h3><b>ABRIR EXPEDIENTE ↗</b></Link>)}</div></ProgressSpoilerGate>
      : <p className="title-cast-empty">Todavía no hay personajes enlazados a este expediente.</p>}
  </section>;
}