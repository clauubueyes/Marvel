"use client";

import { useCalendarExport } from "../hooks/useCalendarExport";
import type { PlannerTitle } from "@/types/planner";

/**
 * Par de botones de exportacion para contextos que ya tienen decidido el contenido:
 * ficha de titulo y ficha de ruta. El planificador mantiene su propia UI porque ademas
 * ofrece reemplazar y eliminar el calendario.
 */
export function CalendarExportActions({
  titles,
  calendarLabel = "AÑADIR A GOOGLE",
  compact = false,
}: {
  titles: PlannerTitle[];
  calendarLabel?: string;
  compact?: boolean;
}) {
  const exportState = useCalendarExport(titles);

  if (!exportState.plan.length) return null;

  return (
    <div className={compact ? "export-actions compact" : "export-actions"}>
      <button
        type="button"
        className="google-calendar-button"
        onClick={exportState.addToGoogle}
        disabled={exportState.isBusy}
      >
        {exportState.status === "syncing" && exportState.progress
          ? `AÑADIENDO ${exportState.progress}/${exportState.plan.length}`
          : calendarLabel}
      </button>
      <button type="button" onClick={exportState.downloadIcs} disabled={exportState.isBusy}>
        DESCARGAR .ICS ↓
      </button>
      {exportState.message && (
        <p className={`google-calendar-status ${exportState.status}`} role="status">
          {exportState.message}
        </p>
      )}
    </div>
  );
}
