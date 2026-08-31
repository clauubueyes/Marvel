"use client";

import Script from "next/script";
import { WEEK_DAYS } from "@/utils/viewingPlanner";
import type { PlannerTitle } from "@/types/planner";
import { useTitleViewingPlanner } from "./hooks/useTitleViewingPlanner";
import { formatMinutes, formatPlannerDate, formatPlannerTime, localDateValue } from "./utils/plannerFormatters";

export function TitleViewingPlanner({ titles, onClose }: { titles: PlannerTitle[]; onClose: () => void }) {
  const planner = useTitleViewingPlanner(titles);
  const isSyncing = planner.googleStatus === "authorizing" || planner.googleStatus === "syncing";

  return <section className="route-planner title-planner" aria-labelledby="title-planner-heading" style={{ "--route-accent": "#b9d737" } as React.CSSProperties}>
    <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => planner.setGoogleReady(true)} />
    <div className="route-planner-intro">
      <div><p className="eyebrow"><span /> PLAN PERSONAL</p><h2 id="title-planner-heading">ORGANIZA TU SELECCIÓN</h2><p>Selecciona títulos del archivo y NEXUS los distribuirá según tu disponibilidad.</p></div>
      <button type="button" onClick={onClose}>CERRAR PLANIFICADOR</button>
    </div>
    <div className="route-planner-workspace">
      <form className="route-planner-form" onSubmit={(event) => event.preventDefault()}>
        <fieldset className="planner-content-mode"><legend>QUÉ QUIERES VER</legend><div><button type="button" className={planner.contentMode === "TODO" ? "active" : ""} onClick={() => planner.setContentMode("TODO")}>TODO</button><button type="button" className={planner.contentMode === "PELÍCULAS" ? "active" : ""} onClick={() => planner.setContentMode("PELÍCULAS")}>PELÍCULAS</button><button type="button" className={planner.contentMode === "SERIES" ? "active" : ""} onClick={() => planner.setContentMode("SERIES")}>SERIES</button></div><small>Los one-shots y cortos quedan fuera del plan automático.</small></fieldset>
        <label><span>EMPEZAR A PARTIR DE</span><input type="date" value={planner.startDate} min={localDateValue()} onChange={(event) => planner.setStartDate(event.target.value)} /></label>
        <fieldset><legend>DÍAS DISPONIBLES</legend><div>{WEEK_DAYS.map((day) => <button type="button" key={day.value} className={planner.weekDays.includes(day.value) ? "active" : ""} aria-pressed={planner.weekDays.includes(day.value)} onClick={() => planner.toggleWeekDay(day.value)}>{day.label}</button>)}</div></fieldset>
        <label><span>SESIONES POR SEMANA</span><input type="number" min="1" max="7" value={planner.titlesPerWeek} onChange={(event) => planner.setTitlesPerWeek(Math.max(1, Math.min(7, Number(event.target.value))))} /></label>
        <div className="route-planner-times"><label><span>DESDE</span><input type="time" value={planner.startTime} onChange={(event) => planner.setStartTime(event.target.value)} /></label><label><span>HASTA</span><input type="time" value={planner.endTime} onChange={(event) => planner.setEndTime(event.target.value)} /></label></div>
      </form>
      <div className="route-plan-preview">
        <header><div><span>{planner.activeTitles.length} TÍTULOS · {planner.plan.length} SESIONES</span><strong>{planner.plan.length ? `FINAL: ${formatPlannerDate(planner.plan[planner.plan.length - 1].end)}` : "NO HAY TÍTULOS EN ESTE MODO"}</strong>{planner.syncedCalendarId && <small className="google-calendar-linked">● CALENDARIO NEXUS CONECTADO</small>}</div><div className="calendar-actions">{planner.syncedCalendarId ? <><button type="button" className="google-calendar-button" onClick={planner.replaceGoogleCalendarPlan} disabled={!planner.plan.length || isSyncing}>{planner.googleStatus === "syncing" && planner.googleProgress ? `ACTUALIZANDO ${planner.googleProgress}/${planner.plan.length}` : "ACTUALIZAR GOOGLE"}</button><button type="button" className="google-calendar-remove" onClick={planner.removeGoogleCalendar} disabled={isSyncing}>ELIMINAR DE GOOGLE</button></> : <button type="button" className="google-calendar-button" onClick={planner.connectGoogleCalendar} disabled={!planner.plan.length || isSyncing}>{planner.googleStatus === "syncing" ? `AÑADIENDO ${planner.googleProgress}/${planner.plan.length}` : planner.googleReady ? "GOOGLE CALENDAR ↗" : "CONECTAR GOOGLE"}</button>}<button type="button" onClick={planner.downloadPlan} disabled={!planner.plan.length}>DESCARGAR .ICS ↓</button></div></header>
        {planner.googleMessage && <p className={`google-calendar-status ${planner.googleStatus}`}>{planner.googleMessage}</p>}
        {planner.plan.length ? <ol>{planner.plan.map((item, index) => <li key={`${item.id}-${item.start.toISOString()}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{formatPlannerDate(item.start)} · {formatPlannerTime(item.start)}–{formatPlannerTime(item.end)} · {formatMinutes(item.durationMinutes)}{item.estimated ? " EST." : ""}</small><strong>{item.title}</strong></div></li>)}</ol> : <p className="route-plan-empty">Activa “Añadir al plan” en los títulos que quieras organizar.</p>}
      </div>
    </div>
  </section>;
}
