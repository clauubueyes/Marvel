"use client";

import { HOME_CATALOG_PAGE_SIZE } from "@/constants/homeCatalog";
import { mcuCatalog } from "@/data/mcuCatalog";
import { MCUCatalogEntry } from "./components/MCUCatalogEntry";
import { useMCUCatalog, type MCUCatalogFilter } from "./hooks/useMCUCatalog";

const filters: MCUCatalogFilter[] = ["TODO", "PELÍCULA", "SERIE", "ESPECIAL", "SAGA PRINCIPAL", "MARVEL TELEVISION", "MULTIVERSO"];

export function MCUCatalog() {
  const catalog = useMCUCatalog();
  return <section className="doom-guide mcu-catalog" id="cronologia">
    <header className="doom-heading catalog-heading" data-reveal><div><p className="eyebrow"><span /> ORDEN DE VISIONADO</p><h2>LA CRONOLOGÍA<br/>DEL <em>MCU</em></h2></div><div className="doom-release catalog-count"><span>ARCHIVO COMPLETO</span><strong>{String(mcuCatalog.length).padStart(2, "0")} TÍTULOS</strong><p>PELÍCULAS · SERIES · ESPECIALES</p></div></header>
    <div className="doom-intro catalog-intro" data-reveal><p>De los orígenes de Wakanda al choque de universos: toda la historia audiovisual en un único recorrido.</p><span>ORDEN CRONOLÓGICO <i /> CONTINUIDAD IDENTIFICADA</span></div>
    <div className="catalog-tools" data-reveal>
      <label><span>BUSCAR UN TÍTULO</span><input value={catalog.query} onChange={(event) => catalog.changeQuery(event.target.value)} placeholder="Ej. Daredevil, Wanda, Thor…" /></label>
      <div className="catalog-filters" aria-label="Filtrar cronología">{filters.map((item) => <button key={item} className={catalog.filter === item ? "active" : ""} onClick={() => catalog.changeFilter(item)}>{item}</button>)}</div>
    </div>
    <div className="catalog-result"><span>{catalog.visibleEntries.length} TÍTULOS</span><span>ORDEN CRONOLÓGICO APROXIMADO</span></div>
    <div className="catalog-list watch-timeline">{catalog.displayedEntries.map((entry) => <MCUCatalogEntry entry={entry} key={`${entry.order}-${entry.title}`} />)}{!catalog.visibleEntries.length && <div className="catalog-empty"><b>NO HAY RESULTADOS</b><p>Prueba con otro título o elimina los filtros.</p></div>}</div>
    {catalog.displayedEntries.length < catalog.visibleEntries.length && <div className="catalog-more"><p>HAS VISTO <b>{catalog.displayedEntries.length}</b> DE <b>{catalog.visibleEntries.length}</b></p><button onClick={catalog.loadMore}>CARGAR {HOME_CATALOG_PAGE_SIZE} MÁS <span>↓</span></button></div>}
    <p className="catalog-source">Orden editorial basado en la cronología de Xataka. Las fechas discutidas, el multiverso y las producciones heredadas de Marvel Television están identificadas de forma separada.</p>
  </section>;
}
