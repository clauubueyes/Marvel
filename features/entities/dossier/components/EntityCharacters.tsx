import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types/character";

export function EntityCharacters({ characters }: { characters: Character[] }) {
  if (!characters.length) return null;
  return <section className="entity-characters profile-section"><header><p className="section-label">04 / PERSONAJES</p><h2>QUIÉN ESTÁ<br /><em>IMPLICADO</em></h2></header><div>{characters.map((character) => <Link href={`/personajes/${character.id}`} key={character.id}><Image src={character.image} alt="" fill sizes="(max-width: 650px) 50vw, 20vw" /><span>{character.role}</span><h3>{character.name}</h3></Link>)}</div></section>;
}
