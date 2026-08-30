"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { MCUContinuity, MCUType } from "@/lib/mcuCatalog";

export type TitleDirectoryEntry = {
  slug: string;
  order: number;
  title: string;
  period: string;
  type: MCUType;
  continuity: MCUContinuity;
  phase: string;
  event: string;
  releaseDateISO: string;
  coverage: string;
  routes: { slug: string; name: string }[];
};

type Props = { titles: TitleDirectoryEntry[] };
type OrderMode = "NARRATIVO" | "ESTRENO";
type SortMode = "ORDEN" | "AÑO" | "NOMBRE" | "RELEVANCIA";

const TITLE_TYPES = ["TODOS", "PELÍCULA", "SERIE", "ESPECIAL", "ONE-SHOT"];
const SAGAS = ["SAGA DEL INFINITO", "SAGA DEL MULTIVERSO", "OTRAS HISTORIAS"];
const CONTINUITIES: MCUContinuity[] = ["SAGA PRINCIPAL", "MARVEL TELEVISION", "MULTIVERSO"];

// Deriva la saga desde la fase para no duplicar este dato en los expedientes.
function getSaga(phase: string) {
  const phaseNumber = Number(phase.match(/\d+/)?.[0]);

  if (phaseNumber >= 1 && phaseNumber <= 3) return "SAGA DEL INFINITO";
  if (phaseNumber >= 4 && phaseNumber <= 6) return "SAGA DEL MULTIVERSO";
  return "OTRAS HISTORIAS";
}

export function TitleDirectory({ titles }: Props) {
  // Estado de los filtros y del modo de presentación.
  const [type, setType] = useState("TODOS");
  const [phase, setPhase] = useState("TODAS");
  const [saga, setSaga] = useState("TODAS");
  const [continuity, setContinuity] = useState("TODAS");
  const [orderMode, setOrderMode] = useState<OrderMode>("NARRATIVO");
  const [sortMode, setSortMode] = useState<SortMode>("ORDEN");
  const [compact, setCompact] = useState(false);

  // Obtiene las fases disponibles directamente del catálogo.
  const phases = useMemo(
    () => [...new Set(titles.map((title) => title.phase))].sort(),
    [titles],
  );

  // Filtra y ordena una copia sin modificar los datos originales.
  const visibleTitles = useMemo(() => {
    return titles
      .filter((title) => {
        const matchesType = type === "TODOS" || title.type === type;
        const matchesPhase = phase === "TODAS" || title.phase === phase;
        const matchesSaga = saga === "TODAS" || getSaga(title.phase) === saga;
        const matchesContinuity = continuity === "TODAS" || title.continuity === continuity;

        return matchesType && matchesPhase && matchesSaga && matchesContinuity;
      })
      .sort((left, right) => {
        if (sortMode === "NOMBRE") return left.title.localeCompare(right.title, "es");

        if (sortMode === "RELEVANCIA") {
          return right.routes.length - left.routes.length || left.order - right.order;
        }

        if (sortMode === "AÑO" || orderMode === "ESTRENO") {
          return left.releaseDateISO.localeCompare(right.releaseDateISO) || left.order - right.order;
        }

        return left.order - right.order;
      });
  }, [titles, type, phase, saga, continuity, orderMode, sortMode]);

  // Restaura la configuración editorial inicial.
  function resetFilters() {
    setType("TODOS");
    setPhase("TODAS");
    setSaga("TODAS");
    setContinuity("TODAS");
    setOrderMode("NARRATIVO");
    setSortMode("ORDEN");
  }

  return (
    <>
      {/* Controles combinables del catálogo. */}
      <section className="title-filters" aria-label="Filtros del catálogo de títulos">
        <div className="title-filter-types">
          <span>FORMATO</span>
          {TITLE_TYPES.map((value) => (
            <button key={value} className={type === value ? "active" : ""} onClick={() => setType(value)}>
              {value}
            </button>
          ))}
        </div>

        <label>
          <span>FASE</span>
          <select value={phase} onChange={(event) => setPhase(event.target.value)}>
            <option>TODAS</option>
            {phases.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>

        <label>
          <span>SAGA</span>
          <select value={saga} onChange={(event) => setSaga(event.target.value)}>
            <option>TODAS</option>
            {SAGAS.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>

        <label>
          <span>CONTINUIDAD</span>
          <select value={continuity} onChange={(event) => setContinuity(event.target.value)}>
            <option>TODAS</option>
            {CONTINUITIES.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>

        <label>
          <span>ORDEN</span>
          <select value={orderMode} onChange={(event) => setOrderMode(event.target.value as OrderMode)}>
            <option>NARRATIVO</option>
            <option>ESTRENO</option>
          </select>
        </label>

        <label>
          <span>ORDENAR POR</span>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
            <option value="ORDEN">ORDEN ACTUAL</option>
            <option value="AÑO">AÑO DE ESTRENO</option>
            <option value="NOMBRE">NOMBRE</option>
            <option value="RELEVANCIA">RELEVANCIA EN RUTAS</option>
          </select>
        </label>

        <p className="title-result-count"><strong>{visibleTitles.length}</strong>RESULTADOS</p>
        <button className="filter-reset" onClick={resetFilters}>LIMPIAR</button>
        <button
          className={`view-toggle ${compact ? "active" : ""}`}
          onClick={() => setCompact((value) => !value)}
          aria-pressed={compact}
        >
          {compact ? "VISTA AMPLIA" : "VISTA COMPACTA"}
        </button>
      </section>

      {/* Lista de resultados en formato amplio o compacto. */}
      <section
        className={`titles-directory ${compact ? "is-compact" : ""}`}
        aria-label="Archivo de títulos"
        aria-live="polite"
      >
        {visibleTitles.map((title) => (
          <Link className="title-directory-card" href={`/titulos/${title.slug}`} key={title.slug} data-reveal>
            <span>{String(title.order).padStart(2, "0")}</span>

            <div>
              <small>{title.period} · {title.type} · {title.coverage}</small>
              <h2>{title.title}</h2>
              <p>{title.event}</p>

              {title.routes.length > 0 && (
                <div className="title-route-tags" aria-label="Recorridos relacionados">
                  {title.routes.map((route) => <b key={route.slug}>{route.name}</b>)}
                </div>
              )}
            </div>

            <aside>
              <b>{title.phase}</b>
              <small>{getSaga(title.phase)}</small>
              <small>{title.continuity}</small>
              <small>{title.releaseDateISO.slice(0, 4)}</small>
            </aside>

            <i>↗</i>
          </Link>
        ))}

        {/* Estado vacío para combinaciones sin resultados. */}
        {!visibleTitles.length && (
          <div className="title-directory-empty">
            <strong>SIN COINCIDENCIAS</strong>
            <p>Prueba otra combinación de filtros.</p>
            <button onClick={resetFilters}>MOSTRAR TODO</button>
          </div>
        )}
      </section>
    </>
  );
}
