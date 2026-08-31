import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types/character";

export function CharacterDirectoryCard({ character, index }: { character: Character; index: number }) {
  return <Link href={`/personajes/${character.id}`} className="character-directory-card" data-reveal data-tilt style={{ "--card-accent": character.color, "--delay": `${Math.min(index, 11) * 45}ms` } as React.CSSProperties}>
    <Image src={character.image} alt="" fill quality={90} sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 25vw" style={{ objectPosition: character.imagePosition ?? "center top" }} />
    <i className="character-card-light" aria-hidden="true" /><span>{character.number} · {character.role}</span><h2>{character.name}</h2><p>{character.alias}</p><b>ABRIR EXPEDIENTE <i>↗</i></b>
  </Link>;
}
