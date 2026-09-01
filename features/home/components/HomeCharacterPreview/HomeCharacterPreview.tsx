import Image from "next/image";
import type { Character } from "@/types/character";

export function HomeCharacterPreview({ characters }: { characters: Character[] }) {
  return <section className="mcu-characters section" id="personajes">
    <div className="section-backdrop" aria-hidden="true">MCU</div>
    <div className="section-heading" data-reveal><div><p className="eyebrow"><span /> PERSONAJES EN PANTALLA</p><h2>QUIÉN ES<br/><em>QUIÉN</em></h2></div><div className="heading-aside"><b>{String(characters.length).padStart(2, "0")}</b><p>Fichas centradas en su recorrido cinematográfico y televisivo: apariciones, decisiones y relación con el multiverso.</p><span>SOLO CONTINUIDAD MCU</span></div></div>
    <div className="mcu-character-grid">{characters.map((character, index) => <a href={`/personajes/${character.id}`} className="mcu-character" key={character.id} data-reveal style={{ "--delay": `${index * 60}ms`, "--card-accent": character.color } as React.CSSProperties}><Image src={character.image} alt="" fill sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 20vw"/><span>0{index + 1} · {character.role}</span><h3>{character.name}</h3><p>{character.alias}</p><b>ABRIR EXPEDIENTE ↗</b></a>)}</div>
  </section>;
}
