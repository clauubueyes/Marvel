"use client";

import { useMemo, useState } from "react";
import { createIcsCalendar, createViewingPlan, type PlannerTitle, WEEK_DAYS } from "@/lib/viewingPlanner";

function localDateValue(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "2-digit", month: "short" }).format(date).toUpperCase();
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function TitleViewingPlanner({ titles, onClose }: { titles: PlannerTitle[]; onClose: () => void }) {
  const [startDate, setStartDate] = useState(() => localDateValue());
  const [weekDays, setWeekDays] = useState<number[]>([6]);
  const [titlesPerWeek, setTitlesPerWeek] = useState(2);
  const [startTime, setStartTime] = useState("21:00");
  const [endTime, setEndTime] = useState("00:00");
  const plan = useMemo(() => createViewingPlan(titles, { startDate, weekDays, titlesPerWeek, startTime, endTime }), [endTime, startDate, startTime, titles, titlesPerWeek, weekDays]);

  function toggleWeekDay(day: number) {
    setWeekDays((current) => current.includes(day) ? current.length === 1 ? current : current.filter((value) => value !== day) : [...current, day]);
  }

  function downloadPlan() {
    const absolutePlan = plan.map((item) => ({ ...item, url: new URL(item.url, window.location.origin).toString() }));
    const blob = new Blob([createIcsCalendar("Mi selección", absolutePlan)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nexus-mi-plan.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return <section className="route-planner title-planner" aria-labelledby="title-planner-heading" style={{ "--route-accent": "#b9d737" } as React.CSSProperties}>
    <div className="route-planner-intro">
      <div><p className="eyebrow"><span /> PLAN PERSONAL</p><h2 id="title-planner-heading">ORGANIZA TU SELECCIÓN</h2><p>Selecciona títulos del archivo y NEXUS los distribuirá según tu disponibilidad.</p></div>
      <button type="button" onClick={onClose}>CERRAR PLANIFICADOR</button>
    </div>
    <div className="route-planner-workspace">
      <form className="route-planner-form" onSubmit={(event) => event.preventDefault()}>
        <label><span>EMPEZAR A PARTIR DE</span><input type="date" value={startDate} min={localDateValue()} onChange={(event) => setStartDate(event.target.value)} /></label>
        <fieldset><legend>DÍAS DISPONIBLES</legend><div>{WEEK_DAYS.map((day) => <button type="button" key={day.value} className={weekDays.includes(day.value) ? "active" : ""} aria-pressed={weekDays.includes(day.value)} onClick={() => toggleWeekDay(day.value)}>{day.label}</button>)}</div></fieldset>
        <label><span>TÍTULOS POR SEMANA</span><input type="number" min="1" max="7" value={titlesPerWeek} onChange={(event) => setTitlesPerWeek(Math.max(1, Math.min(7, Number(event.target.value))))} /></label>
        <div className="route-planner-times"><label><span>DESDE</span><input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label><label><span>HASTA</span><input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label></div>
      </form>
      <div className="route-plan-preview">
        <header><div><span>{plan.length} TÍTULOS SELECCIONADOS</span><strong>{plan.length ? `FINAL: ${formatDate(plan[plan.length - 1].end)}` : "SELECCIONA TÍTULOS ABAJO"}</strong></div><button type="button" onClick={downloadPlan} disabled={!plan.length}>AÑADIR AL CALENDARIO ↓</button></header>
        {plan.length ? <ol>{plan.map((item, index) => <li key={`${item.id}-${item.start.toISOString()}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{formatDate(item.start)} · {formatTime(item.start)}–{formatTime(item.end)}</small><strong>{item.title}</strong></div></li>)}</ol> : <p className="route-plan-empty">Activa “Añadir al plan” en los títulos que quieras organizar.</p>}
      </div>
    </div>
  </section>;
}
