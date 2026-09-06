import Image from "next/image";
import { CharacterMotionField } from "@/features/characters/dossier/components/CharacterMotionField";
import { IronManCluster } from "@/features/characters/dossier/components/IronManCluster";
import type { Character } from "@/types/character";
import type { CharacterMotionProfile } from "@/utils/characterMotion";
import { CharacterFavorite } from "@/features/characters/favorites/CharacterFavorite";

type CharacterHeroProps = { character: Character; motion: CharacterMotionProfile };

export function CharacterHero({ character, motion }: CharacterHeroProps) {
  const nameLines = character.nameLines ?? [character.name];

  return <section className="profile-hero">
    <div className="profile-grid" aria-hidden="true" />
    <CharacterMotionField profile={motion} symbol={character.symbol} />
    {character.id === "iron" && <IronManCluster />}
    <div className="profile-title profile-title-arrival">
      <p className="eyebrow"><span /> {character.role}</p>
      <h1 aria-label={character.name}>{nameLines.map((line, lineIndex) => <span className="profile-name-line" aria-hidden="true" key={`${line}-${lineIndex}`}>{Array.from(line).map((letter, letterIndex) => <span className="profile-name-letter" style={{ "--letter": letterIndex } as React.CSSProperties} key={`${letter}-${letterIndex}`}>{letter === " " ? "\u00a0" : letter}</span>)}</span>)}</h1>
      <div className="profile-meta"><span>{character.alias}</span><span>{character.universe}</span><span>{character.origin}</span></div>
    </div>
    <div className={`profile-figure profile-arrival profile-arrival-${character.id}`} aria-hidden="true">
      <div className="arrival-trail"><i /><i /><i /><i /><i /></div>
      <div className="profile-rings"><i /><i /><i /></div>
      <div className="profile-body"><Image src={character.image} alt={character.name} fill priority sizes="(max-width: 900px) 290px, 32vw" style={{ objectPosition: character.imagePosition ?? "center top" }} /></div>
      <b>{character.symbol}</b>
    </div>
    <blockquote className="profile-quote-arrival">“{character.quote}”</blockquote>
    <div className="scroll-cue">DESPLAZA PARA EXPLORAR <span>↓</span></div>
    <CharacterFavorite characterId={character.id} name={character.name} />
  </section>;
}
