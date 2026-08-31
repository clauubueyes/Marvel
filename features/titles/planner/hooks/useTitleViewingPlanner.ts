"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { addPlanToGoogleCalendar, deleteNexusGoogleCalendar, googleCalendarSnapshot, replaceNexusGoogleCalendar, subscribeGoogleCalendar } from "@/services/googleCalendarService";
import { requestGoogleCalendarToken } from "@/services/googleIdentityService";
import type { PlannerTitle } from "@/types/planner";
import { createIcsCalendar, createViewingPlan } from "@/utils/viewingPlanner";
import { localDateValue } from "../utils/plannerFormatters";

export type PlannerContentMode = "TODO" | "PELÍCULAS" | "SERIES";
export type GoogleSyncStatus = "idle" | "authorizing" | "syncing" | "done" | "error";

export function useTitleViewingPlanner(titles: PlannerTitle[]) {
  const [startDate, setStartDate] = useState(() => localDateValue());
  const [weekDays, setWeekDays] = useState<number[]>([6]);
  const [titlesPerWeek, setTitlesPerWeek] = useState(2);
  const [startTime, setStartTime] = useState("21:00");
  const [endTime, setEndTime] = useState("00:00");
  const [contentMode, setContentMode] = useState<PlannerContentMode>("TODO");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleStatus, setGoogleStatus] = useState<GoogleSyncStatus>("idle");
  const [googleProgress, setGoogleProgress] = useState(0);
  const [googleMessage, setGoogleMessage] = useState("");
  const subscribeCalendar = useCallback((callback: () => void) => subscribeGoogleCalendar(callback), []);
  const syncedCalendarId = useSyncExternalStore(subscribeCalendar, googleCalendarSnapshot, () => "");
  const activeTitles = useMemo(() => titles.filter((title) => {
    if (title.type === "ONE-SHOT" || /CORTOS/i.test(title.runtime ?? "")) return false;
    if (contentMode === "PELÍCULAS") return title.type === "PELÍCULA";
    if (contentMode === "SERIES") return title.type === "SERIE";
    return true;
  }), [contentMode, titles]);
  const plan = useMemo(() => createViewingPlan(activeTitles, { startDate, weekDays, titlesPerWeek, startTime, endTime }), [activeTitles, endTime, startDate, startTime, titlesPerWeek, weekDays]);

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

  async function authorizeGoogle(action: (accessToken: string) => Promise<void>) {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleStatus("error");
      setGoogleMessage("Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID en .env.local.");
      return;
    }
    setGoogleStatus("authorizing");
    setGoogleMessage("Abriendo autorización de Google…");
    try {
      const accessToken = await requestGoogleCalendarToken(clientId);
      await action(accessToken);
    } catch (error) {
      setGoogleStatus("error");
      setGoogleMessage(error instanceof Error ? error.message : "No se pudo completar la sincronización.");
    }
  }

  function connectGoogleCalendar() {
    void authorizeGoogle(async (accessToken) => {
      setGoogleStatus("syncing"); setGoogleMessage("Creando sesiones…"); setGoogleProgress(0);
      const result = await addPlanToGoogleCalendar(accessToken, plan, setGoogleProgress);
      setGoogleStatus("done"); setGoogleMessage(`${result.created} sesiones añadidas a Google Calendar.`);
    });
  }

  function replaceGoogleCalendarPlan() {
    if (!window.confirm("Se eliminará el calendario NEXUS actual y se creará de nuevo con este plan. ¿Continuar?")) return;
    void authorizeGoogle(async (accessToken) => {
      setGoogleStatus("syncing"); setGoogleMessage("Reemplazando el plan anterior…"); setGoogleProgress(0);
      const result = await replaceNexusGoogleCalendar(accessToken, plan, setGoogleProgress);
      setGoogleStatus("done"); setGoogleMessage(`Plan actualizado: ${result.created} sesiones sincronizadas.`);
    });
  }

  function removeGoogleCalendar() {
    if (!window.confirm("Se eliminará de Google Calendar el calendario NEXUS y todas sus sesiones. Esta acción no se puede deshacer. ¿Continuar?")) return;
    void authorizeGoogle(async (accessToken) => {
      setGoogleStatus("syncing"); setGoogleMessage("Eliminando el calendario NEXUS…");
      await deleteNexusGoogleCalendar(accessToken);
      setGoogleStatus("done"); setGoogleMessage("El calendario NEXUS se ha eliminado de Google Calendar.");
    });
  }

  return { activeTitles, connectGoogleCalendar, contentMode, downloadPlan, endTime, googleMessage, googleProgress, googleReady, googleStatus, plan, removeGoogleCalendar, replaceGoogleCalendarPlan, setContentMode, setEndTime, setGoogleReady, setStartDate, setStartTime, setTitlesPerWeek, startDate, startTime, syncedCalendarId, titlesPerWeek, toggleWeekDay, weekDays };
}
