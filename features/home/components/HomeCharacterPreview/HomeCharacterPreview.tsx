import Image from "next/image";
import Link from "next/link";
import type { Character } from "@/types/character";

const HOME_CHARACTER_LIMIT = 10;

/*
 * Produce una muestra variada pero estable para evitar cambios durante la carga.
 * Este es el único selector que habrá que sustituir cuando existan favoritos.
 */
function selectHomeCharacters(characters: Character[]) {
  const scoreId = (id: string) =>
    [...id].reduce(
      (score, character) =>
        (Math.imul(score, 31) + character.charCodeAt(0)) | 0,
      17,
    );

  return [...characters]
    .sort((first, second) => scoreId(first.id) - scoreId(second.id))
    .slice(0, HOME_CHARACTER_LIMIT);
}

export function HomeCharacterPreview({
  characters,
}: {
  characters: Character[];
}) {
  const featuredCharacters = selectHomeCharacters(characters);

  return (
    <section className="mcu-characters section" id="personajes">
      <div className="section-backdrop" aria-hidden="true">
        MCU
      </div>
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">
            <span /> PERSONAJES EN PANTALLA
          </p>
          <h2>
            QUIÉN ES
            <br />
            <em>QUIÉN</em>
          </h2>
        </div>
        <div className="heading-aside">
          <b>{String(featuredCharacters.length).padStart(2, "0")}</b>
          <p>
            Una selección de personajes del MCU: héroes, amenazas y figuras
            clave de sus distintas etapas.
          </p>
          <Link href="/personajes">VER TODOS LOS PERSONAJES ↗</Link>
        </div>
      </div>
      <div className="mcu-character-grid">
        {featuredCharacters.map((character, index) => (
          <Link
            href={`/personajes/${character.id}`}
            className="mcu-character"
            key={character.id}
            data-reveal
            style={
              {
                "--delay": `${index * 60}ms`,
                "--card-accent": character.color,
              } as React.CSSProperties
            }
          >
            <Image
              src={character.image}
              alt=""
              fill
              sizes="(max-width: 560px) 50vw, (max-width: 900px) 50vw, 20vw"
            />
            <span>
              {String(index + 1).padStart(2, "0")} · {character.role}
            </span>
            <h3>{character.name}</h3>
            <p>{character.alias}</p>
            <b>ABRIR EXPEDIENTE ↗</b>
          </Link>
        ))}
      </div>
    </section>
  );
}
