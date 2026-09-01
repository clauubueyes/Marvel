import type { ReturnTypeOfUseTitleDirectory } from "../types";

export function TitleLibraryToolbar({ directory }: { directory: ReturnTypeOfUseTitleDirectory }) {
  const { pendingTitles, query, selectForPlan, setQuery, titles, watched } = directory;
  return <section className="title-library-toolbar" aria-label="Gestión de la biblioteca">
    <label className="title-search"><span>BUSCAR EN EL ARCHIVO</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título, acontecimiento, año…" /></label>
    <div className="title-library-progress"><strong>{watched.size}<small>/ {titles.length}</small></strong><span>VISTOS</span><i><b style={{ width: `${Math.round(watched.size / titles.length * 100)}%` }} /></i></div>
    <button className="title-primary-plan" type="button" onClick={() => selectForPlan(pendingTitles)}>PLANIFICAR TODO LO PENDIENTE <b>{pendingTitles.length}</b></button>
  </section>;
}
