import type { Character } from "@/types/character";

export function CharacterFacts({ facts }: { facts: Character["facts"] }) {
  return <section className="profile-facts profile-section" data-scroll-section data-section-index="03">
    <div className="facts-heading" data-reveal><p className="section-label">03 / DATOS CURIOSOS</p><h2>LO QUE NO<br/><em>SE VE</em></h2><span>TRES FRAGMENTOS DEL EXPEDIENTE QUE CAMBIAN LA FORMA DE ENTENDER AL PERSONAJE.</span></div>
    <div className="facts-grid">{facts.map((fact, index) => <article data-reveal style={{ "--delay": `${index * 100}ms` } as React.CSSProperties} key={fact.label}><span>0{index + 1}</span><strong>{fact.value}</strong><h3>{fact.label}</h3><p>{fact.text}</p></article>)}</div>
  </section>;
}
