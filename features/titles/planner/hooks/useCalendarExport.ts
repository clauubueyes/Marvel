"use client";

import { useCallback, useMemo, useState } from "react";
import { addPlanToGoogleCalendar } from "@/services/googleCalendarService";
import { requestGoogleCalendarToken } from "@/services/googleIdentityService";
import { trackPlannerIcsExport } from "@/services/analytics";
import type { PlannerTitle } from "@/types/planner";
import { createIcsCalendar, createViewingPlan, isPlannableTitle } from "@/utils/viewingPlanner";
import { localDateValue } from "../utils/plannerFormatters";

export type CalendarExportStatus = "idle" | "authorizing" | "syncing" | "done" | "error";

/**
 * Exporta a Google Calendar o a `.ics` un conjunto de titulos ya decidido, sin abrir
 * el planificador.
 *
 * Es el caso de la ficha de un titulo y de la de una ruta: el usuario ya tiene claro
 * que quiere ver eso, asi que basta con una fecha y hora de arranque. El planificador
 * sigue siendo el sitio donde se ajusta la cadencia; aqui se ofrece el atajo.
 *
 * Reutiliza `addPlanToGoogleCalendar()` y `createIcsCalendar()` tal cual, de modo que
 * el calendario NEXUS es el mismo y los eventos se deduplican con el mismo `eventId`.
 */
export function useCalendarExport(titles: PlannerTitle[]) {
  const plannable = useMemo(() => titles.filter(isPlannableTitle), [titles]);
  const plan = useMemo(
    () =>
      createViewingPlan(plannable, {
        startDate: localDateValue(),
        weekDays: [6],
        titlesPerWeek: plannable.length || 1,
        startTime: "21:00",
        endTime: "00:00",
      }),
    [plannable],
  );
  const [status, setStatus] = useState<CalendarExportStatus>("idle");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const isBusy = status === "authorizing" || status === "syncing";

  const runAuthorized = useCallback(async (action: (accessToken: string) => Promise<void>) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setStatus("error");
      setMessage("Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID en .env.local.");
      return;
    }
    setStatus("authorizing");
    setMessage("Abriendo autorizacion de Google…");
    try {
      const accessToken = await requestGoogleCalendarToken(clientId);
      await action(accessToken);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "No se pudo completar la sincronizacion.",
      );
    }
  }, []);

  const addToGoogle = useCallback(() => {
    void runAuthorized(async (accessToken) => {
      setStatus("syncing");
      setMessage("Creando sesiones…");
      setProgress(0);
      const result = await addPlanToGoogleCalendar(accessToken, plan, setProgress);
      setStatus("done");
      setMessage(`${result.created} sesiones anadidas a Google Calendar.`);
    });
  }, [plan, runAuthorized]);

  const downloadIcs = useCallback(() => {
    if (!plan.length) return;
    const absolutePlan = plan.map((item) => ({
      ...item,
      url: new URL(item.url, window.location.origin).toString(),
    }));
    const blob = new Blob([createIcsCalendar("Mi seleccion", absolutePlan)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "nexus-plan.ics";
    anchor.click();
    URL.revokeObjectURL(url);
    trackPlannerIcsExport(plannable.length, plan.length);
  }, [plan, plannable.length]);

  return { addToGoogle, downloadIcs, isBusy, message, plan, progress, status };
}
