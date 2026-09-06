"use client";

import Link from "next/link";
import { useCharacterFavorites } from "@/hooks/useCharacterFavorites";

const formatFans = new Intl.NumberFormat("es-ES", { useGrouping: true });

export function CharacterFavorite({ characterId, name }: { characterId: string; name: string }) {
  const { favorite, counts, initialized, userId, ready, pending, error, store } = useCharacterFavorites();
  const selected = favorite === characterId;
  const count = counts[characterId] ?? 0;
  return <div className="character-favorite" aria-busy={pending}>
    {!userId && initialized
      ? <Link className="character-favorite-control" href="/cuenta" aria-label={`Inicia sesión para elegir a ${name} como favorito`}>☆ FAVORITO</Link>
      : <button className="character-favorite-control" type="button" aria-pressed={selected}
        aria-label={`${selected ? "Quitar a" : "Elegir a"} ${name} como favorito`}
        disabled={!initialized || !ready || pending} onClick={() => void store.toggle(characterId)}>{selected ? "★" : "☆"} FAVORITO</button>}
    <small aria-live="polite">{ready || pending ? `${formatFans.format(count)} ${count === 1 ? "fan" : "fans"}` : "— fans"}</small>
    {error && <button className="character-favorite-retry" type="button" title={error} aria-label={`${error} Reintentar favoritos de ${name}`} onClick={() => void store.load()}>REINTENTAR</button>}
  </div>;
}
