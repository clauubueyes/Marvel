"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { addPlanToGoogleCalendar, deleteNexusGoogleCalendar, googleCalendarSnapshot, replaceNexusGoogleCalendar, subscribeGoogleCalendar } from "@/lib/googleCalendar";
import { createIcsCalendar, createViewingPlan, type PlannerTitle, WEEK_DAYS } from "@/lib/viewingPlanner";

type GoogleTokenResponse = { access_token?: string; error?: string };
type GoogleTokenClient = { requestAccessToken: (options?: { prompt?: string }) => void };

declare global {
  interface Window {
    google?: { accounts: { oauth2: { initTokenClient: (config: { client_id: string; scope: string; callback: (response: GoogleTokenResponse) => void; error_callback?: () => void }) => GoogleTokenClient } } };
  }
}

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

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours ? `${hours} H${rest ? ` ${rest} MIN` : ""}` : `${rest} MIN`;
}

export function TitleViewingPlanner({ titles, onClose }: { titles: PlannerTitle[]; onClose: () => void }) {
  const [startDate, setStartDate] = useState(() => localDateValue());
  const [weekDays, setWeekDays] = useState<number[]>([6]);
  const [titlesPerWeek, setTitlesPerWeek] = useState(2);
  const [startTime, setStartTime] = useState("21:00");
  const [endTime, setEndTime] = useState("00:00");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<"idle" | "authorizing" | "syncing" | "done" | "error">("idle");
  const [googleProgress, setGoogleProgress] = useState(0);
  const [googleMessage, setGoogleMessage] = useState("");
  const subscribeCalendar = useCallback((callback: () => void) => subscribeGoogleCalendar(callback), []);
  const syncedCalendarId = useSyncExternalStore(subscribeCalendar, googleCalendarSnapshot, () => "");
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

  function authorizeGoogle(action: (accessToken: string) => Promise<void>) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google) {
      setGoogleStatus("error");
      setGoogleMessage(clientId ? "Google todavía no ha terminado de cargar." : "Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID en .env.local.");
      return;
    }
    setGoogleStatus("authorizing");
    setGoogleMessage("Abriendo autorización de Google…");
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "https://www.googleapis.com/auth/calendar.app.created",
      callback: async (response) => {
        if (!response.access_token) {
          setGoogleStatus("error");
          setGoogleMessage("Google no concedió acceso al calendario.");
          return;
        }
        try {
          await action(response.access_token);
        } catch (error) {
          setGoogleStatus("error");
          setGoogleMessage(error instanceof Error ? error.message : "No se pudo completar la sincronización.");
        }
      },
      error_callback: () => {
        setGoogleStatus("error");
        setGoogleMessage("La ventana de autorización se cerró o fue bloqueada.");
      },
    });
    tokenClient.requestAccessToken({ prompt: "consent" });
  }

  function connectGoogleCalendar() {
    authorizeGoogle(async (accessToken) => {
      setGoogleStatus("syncing"); setGoogleMessage("Creando sesiones…"); setGoogleProgress(0);
      const result = await addPlanToGoogleCalendar(accessToken, plan, setGoogleProgress);
      setGoogleStatus("done"); setGoogleMessage(`${result.created} sesiones añadidas a Google Calendar.`);
    });
  }

  function replaceGoogleCalendar() {
    if (!window.confirm("Se eliminará el calendario NEXUS actual y se creará de nuevo con este plan. ¿Continuar?")) return;
    authorizeGoogle(async (accessToken) => {
      setGoogleStatus("syncing"); setGoogleMessage("Reemplazando el plan anterior…"); setGoogleProgress(0);
      const result = await replaceNexusGoogleCalendar(accessToken, plan, setGoogleProgress);
      setGoogleStatus("done"); setGoogleMessage(`Plan actualizado: ${result.created} sesiones sincronizadas.`);
    });
  }

  function removeGoogleCalendar() {
    if (!window.confirm("Se eliminará de Google Calendar el calendario NEXUS y todas sus sesiones. Esta acción no se puede deshacer. ¿Continuar?")) return;
    authorizeGoogle(async (accessToken) => {
      setGoogleStatus("syncing"); setGoogleMessage("Eliminando el calendario NEXUS…");
      await deleteNexusGoogleCalendar(accessToken);
      setGoogleStatus("done"); setGoogleMessage("El calendario NEXUS se ha eliminado de Google Calendar.");
    });
  }

  return <section className="route-planner title-planner" aria-labelledby="title-planner-heading" style={{ "--route-accent": "#b9d737" } as React.CSSProperties}>
    <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setGoogleReady(true)} />
    <div className="route-planner-intro">
      <div><p className="eyebrow"><span /> PLAN PERSONAL</p><h2 id="title-planner-heading">ORGANIZA TU SELECCIÓN</h2><p>Selecciona títulos del archivo y NEXUS los distribuirá según tu disponibilidad.</p></div>
      <button type="button" onClick={onClose}>CERRAR PLANIFICADOR</button>
    </div>
    <div className="route-planner-workspace">
      <form className="route-planner-form" onSubmit={(event) => event.preventDefault()}>
        <label><span>EMPEZAR A PARTIR DE</span><input type="date" value={startDate} min={localDateValue()} onChange={(event) => setStartDate(event.target.value)} /></label>
        <fieldset><legend>DÍAS DISPONIBLES</legend><div>{WEEK_DAYS.map((day) => <button type="button" key={day.value} className={weekDays.includes(day.value) ? "active" : ""} aria-pressed={weekDays.includes(day.value)} onClick={() => toggleWeekDay(day.value)}>{day.label}</button>)}</div></fieldset>
        <label><span>SESIONES POR SEMANA</span><input type="number" min="1" max="7" value={titlesPerWeek} onChange={(event) => setTitlesPerWeek(Math.max(1, Math.min(7, Number(event.target.value))))} /></label>
        <div className="route-planner-times"><label><span>DESDE</span><input type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label><label><span>HASTA</span><input type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label></div>
      </form>
      <div className="route-plan-preview">
        <header><div><span>{titles.length} TÍTULOS · {plan.length} SESIONES</span><strong>{plan.length ? `FINAL: ${formatDate(plan[plan.length - 1].end)}` : "SELECCIONA TÍTULOS ABAJO"}</strong>{syncedCalendarId && <small className="google-calendar-linked">● CALENDARIO NEXUS CONECTADO</small>}</div><div className="calendar-actions">{syncedCalendarId ? <><button type="button" className="google-calendar-button" onClick={replaceGoogleCalendar} disabled={!plan.length || googleStatus === "authorizing" || googleStatus === "syncing"}>{googleStatus === "syncing" && googleProgress ? `ACTUALIZANDO ${googleProgress}/${plan.length}` : "ACTUALIZAR GOOGLE"}</button><button type="button" className="google-calendar-remove" onClick={removeGoogleCalendar} disabled={googleStatus === "authorizing" || googleStatus === "syncing"}>ELIMINAR DE GOOGLE</button></> : <button type="button" className="google-calendar-button" onClick={connectGoogleCalendar} disabled={!plan.length || googleStatus === "authorizing" || googleStatus === "syncing"}>{googleStatus === "syncing" ? `AÑADIENDO ${googleProgress}/${plan.length}` : googleReady ? "GOOGLE CALENDAR ↗" : "CONECTAR GOOGLE"}</button>}<button type="button" onClick={downloadPlan} disabled={!plan.length}>DESCARGAR .ICS ↓</button></div></header>
        {googleMessage && <p className={`google-calendar-status ${googleStatus}`}>{googleMessage}</p>}
        {plan.length ? <ol>{plan.map((item, index) => <li key={`${item.id}-${item.start.toISOString()}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{formatDate(item.start)} · {formatTime(item.start)}–{formatTime(item.end)} · {formatMinutes(item.durationMinutes)}{item.estimated ? " EST." : ""}</small><strong>{item.title}</strong></div></li>)}</ol> : <p className="route-plan-empty">Activa “Añadir al plan” en los títulos que quieras organizar.</p>}
      </div>
    </div>
  </section>;
}
