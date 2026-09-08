"use client";

import { useState } from "react";
import { useMovieProgress } from "@/hooks/useMovieProgress";
import { TITLE_PROGRESS_EVENT, TITLE_PROGRESS_STORAGE_KEY } from "@/constants/titleDirectory";
import { normalizeSearchText } from "@/utils/text";
import { useAccount } from "./AccountProvider";
import { SpoilerPreference } from "./SpoilerPreference";

type Props = {
  titles: { slug: string; title: string; type: string }[];
  characters: { id: string; name: string; titleIds: string[] }[];
};

export function SpoilerProgressSettings({ titles, characters }: Props) {
  const [query, setQuery] = useState("");
  const [character, setCharacter] = useState("");
  const { user, pending, error, store } = useAccount();
  const progress = useMovieProgress({ storageKey: TITLE_PROGRESS_STORAGE_KEY, eventName: TITLE_PROGRESS_EVENT, validIds: new Set(titles.map(({ slug }) => slug)) });
  const characterTitles = characters.find(({ id }) => id === character)?.titleIds;
  const visible = titles.filter((title) => (!characterTitles || characterTitles.includes(title.slug))
    && normalizeSearchText(title.title).includes(normalizeSearchText(query.trim())));
  if (!user) return null;
  return <section id="spoilers" className="account-spoilers" aria-labelledby="spoilers-heading">
    <header className="account-panel-heading">
      <p className="account-kicker">TU RECORRIDO</p>
      <h2 id="spoilers-heading">SPOILERS / PROGRESO</h2>
      <p>Marca las obras que has visto completas. Las historias de todos los personajes se adaptan a tu progreso: cada fragmento se desbloquea cuando has visto todas las obras que requiere.</p>
    </header>
    <SpoilerPreference key={user.id} />
    <p className="account-message" role="status">{!progress.ready ? "Recuperando progreso…" : pending ? "Guardando cambios…" : `${progress.values.size} títulos vistos.`} Se guarda en tu cuenta.</p>
    {error && <div className="account-message" role="alert"><p>{error}</p><button type="button" className="account-text-button" disabled={!!pending} onClick={() => void store.load()}>RECARGAR PROGRESO</button></div>}
    <div className="account-form">
      <label><span>BUSCAR PELÍCULA O SERIE</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <label><span>OBRAS DEL PERSONAJE</span><select value={character} onChange={(event) => setCharacter(event.target.value)}><option value="">Todos los personajes</option>{characters.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}</select></label>
    </div>
    <p className="account-footnote">El filtro de personaje incluye las obras relacionadas con su historia y su ficha. Una serie se marca cuando has terminado las temporadas indicadas.</p>
    <div className="account-session-footer">
      <button type="button" className="account-text-button" disabled={!progress.ready || !visible.length} onClick={() => progress.setMany(visible.map(({ slug }) => slug), true)}>MARCAR {visible.length} RESULTADOS COMO VISTOS</button>
      <button type="button" className="account-text-button" disabled={!progress.ready || !visible.length} onClick={() => progress.setMany(visible.map(({ slug }) => slug), false)}>MARCAR RESULTADOS COMO PENDIENTES</button>
    </div>
    <div className="account-spoiler-titles" aria-label="Progreso por título">
      {visible.map((title) => <label key={title.slug}><input type="checkbox" checked={progress.values.has(title.slug)} disabled={!progress.ready} onChange={() => progress.toggle(title.slug)} /><span>{title.title}<small>{title.type}</small></span></label>)}
      {!visible.length && <p>No hay títulos con estos filtros.</p>}
    </div>
  </section>;
}
