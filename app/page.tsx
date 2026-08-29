"use client";

import { useEffect, useMemo, useState } from "react";
import { characters } from "@/lib/characters";
import { NewsFeed } from "@/components/NewsFeed";

export default function Home() {
  const [activeId, setActiveId] = useState(characters[0].id);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = characters.find((character) => character.id === activeId) ?? characters[0];

  useEffect(() => {
    const savedVotes = localStorage.getItem("nexus-votes");
    const savedChoice = localStorage.getItem("nexus-choice");
    if (savedVotes) setVotes(JSON.parse(savedVotes));
    if (savedChoice) setVoted(savedChoice);
  }, []);

  const ranking = useMemo(() => [...characters].sort((a, b) => (b.votes + (votes[b.id] ?? 0)) - (a.votes + (votes[a.id] ?? 0))), [votes]);

  function vote() {
    if (voted) return;
    const nextVotes = { ...votes, [active.id]: (votes[active.id] ?? 0) + 1 };
    setVotes(nextVotes);
    setVoted(active.id);
    localStorage.setItem("nexus-votes", JSON.stringify(nextVotes));
    localStorage.setItem("nexus-choice", active.id);
  }

  return (
    <main style={{ "--accent": active.color, "--accent-2": active.color2 } as React.CSSProperties}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Nexus inicio"><span>N</span>NEXUS</a>
        <nav className={menuOpen ? "nav open" : "nav"}>
          <a href="#characters" onClick={() => setMenuOpen(false)}>PERSONAJES</a>
          <a href="#ranking" onClick={() => setMenuOpen(false)}>RANKING</a>
          <a href="#stories" onClick={() => setMenuOpen(false)}>HISTORIAS</a>
        </nav>
        <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">{menuOpen ? "×" : "☰"}</button>
        <div className="issue">EDICIÓN <b>001</b></div>
      </header>

      <section className={`hero theme-${active.id}`} id="top">
        <div className="grain" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> EL ARCHIVO DEL HÉROE</p>
          <h1>{active.name.split("-").map((part, i) => <span key={part} className={i ? "outline" : ""}>{part}{i === 0 && active.name.includes("-") ? "-" : ""}</span>)}</h1>
          <p className="alias">{active.alias} · {active.universe}</p>
          <p className="quote">“{active.quote}”</p>
          <div className="hero-actions">
            <a href="#characters" className="primary">DESCUBRIR <b>↘</b></a>
            <button className={voted ? "vote voted" : "vote"} onClick={vote}>
              <span>{voted === active.id ? "♥" : "♡"}</span> {voted ? (voted === active.id ? "TU FAVORITO" : "VOTO REGISTRADO") : "VOTAR FAVORITO"}
            </button>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="symbol">{active.symbol}</div>
          <div className="silhouette"><img src={active.image} alt="" /></div>
          <div className="power-tag"><small>HABILIDAD CLAVE</small><strong>{active.power}</strong></div>
        </div>

        <div className="hero-index"><b>{active.number}</b><span>/ 05</span></div>
        <div className="selector" aria-label="Seleccionar personaje">
          {characters.map((character) => (
            <button key={character.id} className={character.id === active.id ? "active" : ""} onClick={() => setActiveId(character.id)} aria-label={`Ver ${character.name}`}>
              <span>{character.number}</span><i style={{ background: character.color }} />
            </button>
          ))}
        </div>
        <div className="ticker"><span>NUEVAS HISTORIAS CADA SEMANA</span><b>✦</b><span>EL MULTIVERSO TE ESPERA</span><b>✦</b><span>TU VOTO CAMBIA EL RANKING</span></div>
      </section>

      <section className="characters section" id="characters">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> ARCHIVO NEXUS</p><h2>ELIGE TU<br/><em>ICONO</em></h2></div>
          <p>No todos llevan capa. Todos dejaron una marca. Explora sus poderes, contradicciones y momentos definitivos.</p>
        </div>
        <div className="character-grid">
          {characters.map((character, index) => (
            <article key={character.id} className={`character-card card-${character.id}`} style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,.88), transparent 75%), url(${character.image})` }}>
              <div className="card-number">{character.number}</div>
              <div className="card-symbol">{character.symbol}</div>
              <div className="card-content"><small>{character.alias}</small><h3>{character.name}</h3><p>{character.power}</p></div>
              <a className="card-link" href={`/personajes/${character.id}`} aria-label={`Abrir ficha de ${character.name}`}>↗</a>
              {index === 0 && <span className="featured">DESTACADO</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="ranking section" id="ranking">
        <div className="rank-title"><p className="eyebrow"><span /> PULSO DE LA COMUNIDAD</p><h2>¿QUIÉN MANDA<br/>ESTA SEMANA?</h2></div>
        <div className="rank-list">
          {ranking.slice(0, 4).map((character, index) => {
            const total = character.votes + (votes[character.id] ?? 0);
            return <div className="rank-row" key={character.id}>
              <b>0{index + 1}</b><span className="rank-dot" style={{ background: character.color }}>{character.symbol}</span>
              <div><strong>{character.name}</strong><small>{character.alias}</small></div>
              <div className="bar"><i style={{ width: `${100 - index * 13}%`, background: character.color }} /></div>
              <span className="vote-count">{total.toLocaleString("es-ES")} <small>VOTOS</small></span>
            </div>;
          })}
        </div>
      </section>

      <section className="stories section" id="stories">
        <NewsFeed />
      </section>

      <footer><a className="brand" href="#top"><span>N</span>NEXUS</a><p>HECHO POR FANS, PARA FANS · PROTOTIPO NO OFICIAL</p><a href="#top">VOLVER ARRIBA ↑</a></footer>
    </main>
  );
}
