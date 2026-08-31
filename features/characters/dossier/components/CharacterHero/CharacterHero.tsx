import Image from "next/image";
import { CharacterMotionField } from "@/features/characters/dossier/components/CharacterMotionField";
import { IronManCluster } from "@/features/characters/dossier/components/IronManCluster";
import type { Character } from "@/types/character";
import type { CharacterMotionProfile } from "@/utils/characterMotion";

type CharacterHeroProps = { character: Character; motion: CharacterMotionProfile };

export function CharacterHero({ character, motion }: CharacterHeroProps) {
  return <section className="profile-hero">
    <div className="profile-grid" aria-hidden="true" />
    <CharacterMotionField profile={motion} symbol={character.symbol} />
    {character.id === "iron" && <IronManCluster />}
    <div className="profile-title profile-title-arrival">
      <p className="eyebrow"><span /> {character.role}</p>
      <h1 aria-label={character.name}>{Array.from(character.name).map((letter, index) => <span aria-hidden="true" style={{ "--letter": index } as React.CSSProperties} key={`${letter}-${index}`}>{letter === " " ? "\u00a0" : letter}</span>)}</h1>
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
  </section>;
}
