import type { Dispatch, SetStateAction } from "react";
import type { CharacterCategoryFilter, CharacterStatusFilter } from "../hooks/useCharacterFilters";

const categories: CharacterCategoryFilter[] = ["TODOS", "HÉROE", "ANTI-HÉROE", "VILLANO", "SECUNDARIO"];

type CharacterFiltersProps = {
  category: CharacterCategoryFilter;
  status: CharacterStatusFilter;
  universe: string;
  affiliation: string;
  universes: string[];
  affiliations: string[];
  resultCount: number;
  setCategory: Dispatch<SetStateAction<CharacterCategoryFilter>>;
  setStatus: Dispatch<SetStateAction<CharacterStatusFilter>>;
  setUniverse: Dispatch<SetStateAction<string>>;
  setAffiliation: Dispatch<SetStateAction<string>>;
  onReset: () => void;
};

export function CharacterFilters(props: CharacterFiltersProps) {
  return <section className="character-filters" aria-label="Filtros de personajes">
    <div><span>FUNCIÓN</span>{categories.map((value) => <button key={value} className={props.category === value ? "active" : ""} onClick={() => props.setCategory(value)}>{value}</button>)}</div>
    <label><span>ESTADO</span><select value={props.status} onChange={(event) => props.setStatus(event.target.value as CharacterStatusFilter)}><option>TODOS</option><option>ACTIVO</option><option>INACTIVO</option><option>DESCONOCIDO</option></select></label>
    <label><span>UNIVERSO</span><select value={props.universe} onChange={(event) => props.setUniverse(event.target.value)}><option>TODOS</option>{props.universes.map((value) => <option key={value}>{value}</option>)}</select></label>
    <label><span>AFILIACIÓN</span><select value={props.affiliation} onChange={(event) => props.setAffiliation(event.target.value)}><option>TODAS</option>{props.affiliations.map((value) => <option key={value}>{value}</option>)}</select></label>
    <p><strong>{props.resultCount}</strong> RESULTADOS</p><button className="filter-reset" onClick={props.onReset}>LIMPIAR</button>
  </section>;
}
