import { TITLE_CONTINUITIES, TITLE_SAGAS, TITLE_TYPES, type TitleOrderMode, type TitleProgressFilter, type TitleSortMode } from "@/constants/titleDirectory";
import type { ReturnTypeOfUseTitleDirectory } from "../types";
import { trackCatalogFilter } from "@/services/analytics";

export function TitleFilters({ directory }: { directory: ReturnTypeOfUseTitleDirectory }) {
  return <section className="title-filters" aria-label="Filtros del catálogo de títulos">
    <div className="title-filter-types"><span>FORMATO</span>{TITLE_TYPES.map((value) => <button key={value} className={directory.type === value ? "active" : ""} onClick={() => { directory.setType(value); trackCatalogFilter("format", value); }}>{value}</button>)}</div>
    <p className="title-result-count"><strong>{directory.visibleTitles.length}</strong><span>RESULTADOS</span></p>
    <div className="title-view-switch" aria-label="Presentación del catálogo"><button className={directory.viewMode === "CUADRÍCULA" ? "active" : ""} onClick={() => directory.setViewMode("CUADRÍCULA")} aria-pressed={directory.viewMode === "CUADRÍCULA"}>▦ CUADRÍCULA</button><button className={directory.viewMode === "LISTA" ? "active" : ""} onClick={() => directory.setViewMode("LISTA")} aria-pressed={directory.viewMode === "LISTA"}>☰ LISTA</button></div>
    <details className="title-advanced-filters">
      <summary>FILTROS AVANZADOS <b>+</b></summary>
      <div>
        <label><span>FASE</span><select value={directory.phase} onChange={(event) => { directory.setPhase(event.target.value); trackCatalogFilter("phase", event.target.value); }}><option>TODAS</option>{directory.phases.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>SAGA</span><select value={directory.saga} onChange={(event) => { directory.setSaga(event.target.value); trackCatalogFilter("saga", event.target.value); }}><option>TODAS</option>{TITLE_SAGAS.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>CONTINUIDAD</span><select value={directory.continuity} onChange={(event) => { directory.setContinuity(event.target.value); trackCatalogFilter("continuity", event.target.value); }}><option>TODAS</option>{TITLE_CONTINUITIES.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>ESTADO</span><select value={directory.progressFilter} onChange={(event) => { directory.setProgressFilter(event.target.value as TitleProgressFilter); trackCatalogFilter("progress", event.target.value); }}><option>TODOS</option><option>PENDIENTES</option><option>VISTOS</option></select></label>
        <label><span>ORDEN</span><select value={directory.orderMode} onChange={(event) => { directory.setOrderMode(event.target.value as TitleOrderMode); trackCatalogFilter("order", event.target.value); }}><option>NARRATIVO</option><option>ESTRENO</option></select></label>
        <label><span>ORDENAR POR</span><select value={directory.sortMode} onChange={(event) => { directory.setSortMode(event.target.value as TitleSortMode); trackCatalogFilter("sort", event.target.value); }}><option value="ORDEN">ORDEN ACTUAL</option><option value="AÑO">AÑO DE ESTRENO</option><option value="NOMBRE">NOMBRE</option><option value="RELEVANCIA">RELEVANCIA EN RUTAS</option></select></label>
        <button className="filter-reset" onClick={directory.resetFilters}>RESTABLECER FILTROS</button>
      </div>
    </details>
  </section>;
}
