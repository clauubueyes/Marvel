"use client";

import Image from "next/image";
import Link from "next/link";
import { useCharacterFavorites } from "@/hooks/useCharacterFavorites";
import { rankCommunityTop, type CommunityCandidate } from "@/utils/communityTop";

const formatFans = new Intl.NumberFormat("es-ES", { useGrouping: true });
const TOP_LIMIT = 10;

/**
 * "TOP DE LA COMUNIDAD": ranking real construido sobre los conteos agregados que
 * devuelve `get_character_favorites()`.
 *
 * No hace falta una RPC `top_characters()` propia: la existente ya expone
 * únicamente agregados (nunca user_id ni votos individuales) y está concedida a
 * `anon` y `authenticated`, así que el ranking se puede pintar también para
 * visitantes sin cuenta. Añadir una segunda función SQL ampliaría la superficie
 * RLS sin aportar ningún dato nuevo.
 *
 * La lista es un ranking leyendo, no un formulario: no hay selección ni voto aquí,
 * eso vive en el dossier de cada personaje.
 */
export function CommunityTop({ candidates }: { candidates: CommunityCandidate[] }) {
  const { counts, ready, error, store } = useCharacterFavorites();
  const top = rankCommunityTop(candidates, counts, TOP_LIMIT);

  return (
    <section className="mcu-community section" id="comunidad">
      <div className="section-heading" data-reveal>
        <div>
          <p className="eyebrow">
            <span /> FAVORITOS DE LA COMUNIDAD
          </p>
          <h2>
            TOP DE LA
            <br />
            <em>COMUNIDAD</em>
          </h2>
        </div>
        <div className="heading-aside">
          <b>{ready && top.length ? String(top.length).padStart(2, "0") : "—"}</b>
          <p>
            El ranking se calcula con los votos de la comunidad, sin exponer quién ha preferido a
            cada personaje.
          </p>
        </div>
      </div>
      <div className="mcu-community-list" aria-busy={!ready && !error}>
        {error ? (
          <p className="mcu-community-empty" role="alert">
            No se pudo cargar el ranking.{" "}
            <button type="button" onClick={() => void store.load()}>
              REINTENTAR
            </button>
          </p>
        ) : ready && !top.length ? (
          <p className="mcu-community-empty">
            Todavía no hay votos. Abre el expediente de un personaje y elige tu favorito para
            aparecer aquí.
          </p>
        ) : (
          <ol>
            {top.map(({ id, name, alias, color, image, fans, position }) => (
              <li key={id} data-reveal style={{ "--rank-accent": color } as React.CSSProperties}>
                <span className="mcu-community-position">{String(position).padStart(2, "0")}</span>
                <span className="mcu-community-portrait" aria-hidden="true">
                  <Image src={image} alt="" fill sizes="(max-width: 700px) 56px, 72px" />
                </span>
                <span className="mcu-community-identity">
                  <b>{name}</b>
                  <small>{alias}</small>
                </span>
                <span className="mcu-community-fans">
                  {formatFans.format(fans)} {fans === 1 ? "fan" : "fans"}
                </span>
                <Link href={`/personajes/${id}`}>ABRIR EXPEDIENTE ↗</Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
