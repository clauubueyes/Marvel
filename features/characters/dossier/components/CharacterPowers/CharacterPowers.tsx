import Image from "next/image";
import type { Character } from "@/types/character";

export function CharacterPowers({ character }: { character: Character }) {
  return <section className="profile-power profile-section" data-scroll-section data-section-index="05">
    <div className="power-heading" data-reveal><p className="section-label">05 / CAPACIDADES</p><h2>MEDIR LO<br/><em>IMPOSIBLE</em></h2><span>LECTURA DE ENERGÍA / NEXUS</span></div>
    <div className="power-core" data-reveal aria-hidden="true"><div className="core-rings"><i /><i /><i /></div><Image src={character.image} alt="" fill sizes="(max-width: 560px) 88vw, 45vw" /><strong>{character.symbol}</strong><span>NIVEL<br/>OMEGA</span></div>
    <div className="stat-list" data-reveal>{character.stats.map((stat) => <div className="stat" key={stat.label}><div><span>{stat.label}</span><b>{stat.value}</b></div><div className="stat-track"><i style={{ width: `${stat.value}%` }} /></div></div>)}</div>
    <div className="ability-list">{character.abilities.map((ability, index) => <div key={ability} data-reveal style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}><b>0{index + 1}</b><span>{ability}</span><i>{character.symbol}</i></div>)}</div>
  </section>;
}
