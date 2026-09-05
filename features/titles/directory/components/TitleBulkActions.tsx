import type { ReturnTypeOfUseTitleDirectory } from "../types";

export function TitleBulkActions({ directory }: { directory: ReturnTypeOfUseTitleDirectory }) {
  const visibleIds = directory.visibleTitles.map(({ slug }) => slug);
  return <section className="title-bulk-actions" aria-label="Acciones sobre los resultados">
    <p><strong>{directory.visibleTitles.length}</strong> títulos en esta vista · <b>{directory.visiblePending.length}</b> pendientes</p>
    <div><button type="button" onClick={() => directory.selectForPlan(directory.visiblePending)} disabled={!directory.visiblePending.length}>PLANIFICAR ESTOS RESULTADOS</button><button type="button" onClick={() => directory.setTitlesWatched(visibleIds, true)} disabled={!directory.visibleTitles.length || !directory.progressReady}>MARCAR RESULTADOS COMO VISTOS</button><button type="button" onClick={() => directory.setTitlesWatched(visibleIds, false)} disabled={!directory.visibleTitles.length || !directory.progressReady}>MARCAR COMO PENDIENTES</button><button type="button" onClick={() => directory.setPlanning((value) => !value)}>{directory.planning ? "CERRAR PLAN" : `SELECCIÓN MANUAL · ${directory.selectedTitles.size}`}</button></div>
  </section>;
}
