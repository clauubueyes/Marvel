import type { PlannedViewing } from "@/lib/viewingPlanner";

const API_ROOT = "https://www.googleapis.com/calendar/v3";
const calendarStorageKey = "nexus:google-calendar-id";
export const googleCalendarEvent = "nexus-google-calendar-change";

type GoogleApiError = { error?: { message?: string } };

async function googleRequest<T>(accessToken: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({})) as GoogleApiError;
    throw new Error(payload.error?.message ?? `Google Calendar respondió con ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function getOrCreateNexusCalendar(accessToken: string) {
  const storedId = window.localStorage.getItem(calendarStorageKey);
  if (storedId) {
    try {
      await googleRequest(accessToken, `/calendars/${encodeURIComponent(storedId)}`);
      return storedId;
    } catch {
      window.localStorage.removeItem(calendarStorageKey);
    }
  }

  const calendar = await googleRequest<{ id: string }>(accessToken, "/calendars", {
    method: "POST",
    body: JSON.stringify({ summary: "NEXUS · Plan de visionado", description: "Sesiones planificadas desde NEXUS." }),
  });
  window.localStorage.setItem(calendarStorageKey, calendar.id);
  window.dispatchEvent(new Event(googleCalendarEvent));
  return calendar.id;
}

export function googleCalendarSnapshot() {
  return window.localStorage.getItem(calendarStorageKey) ?? "";
}

export function subscribeGoogleCalendar(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === calendarStorageKey) callback();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(googleCalendarEvent, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(googleCalendarEvent, callback);
  };
}

export async function deleteNexusGoogleCalendar(accessToken: string) {
  const calendarId = window.localStorage.getItem(calendarStorageKey);
  if (!calendarId) return false;
  const response = await fetch(`${API_ROOT}/calendars/${encodeURIComponent(calendarId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok && response.status !== 404 && response.status !== 410) {
    const payload = await response.json().catch(() => ({})) as GoogleApiError;
    throw new Error(payload.error?.message ?? "No se pudo eliminar el calendario NEXUS.");
  }
  window.localStorage.removeItem(calendarStorageKey);
  window.dispatchEvent(new Event(googleCalendarEvent));
  return true;
}

export async function replaceNexusGoogleCalendar(accessToken: string, plan: PlannedViewing[], onProgress: (created: number) => void) {
  await deleteNexusGoogleCalendar(accessToken);
  return addPlanToGoogleCalendar(accessToken, plan, onProgress);
}

function eventId(item: PlannedViewing, index: number) {
  const source = `${item.id}-${item.start.getTime()}-${index}`;
  let hash = 2166136261;
  for (let position = 0; position < source.length; position += 1) {
    hash ^= source.charCodeAt(position);
    hash = Math.imul(hash, 16777619);
  }
  return `nexus${(hash >>> 0).toString(16)}${item.start.getTime().toString(16)}`.replace(/[^a-v0-9]/g, "");
}

export async function addPlanToGoogleCalendar(accessToken: string, plan: PlannedViewing[], onProgress: (created: number) => void) {
  const calendarId = await getOrCreateNexusCalendar(accessToken);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let completed = 0;

  for (const [index, item] of plan.entries()) {
    const response = await fetch(`${API_ROOT}/calendars/${encodeURIComponent(calendarId)}/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        id: eventId(item, index),
        summary: `NEXUS · ${item.title}`,
        description: `Plan de visionado NEXUS\n${new URL(item.url, window.location.origin)}`,
        start: { dateTime: item.start.toISOString(), timeZone },
        end: { dateTime: item.end.toISOString(), timeZone },
        reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] },
      }),
    });
    if (!response.ok && response.status !== 409) {
      const payload = await response.json().catch(() => ({})) as GoogleApiError;
      throw new Error(payload.error?.message ?? `No se pudo crear ${item.title}`);
    }
    completed += 1;
    onProgress(completed);
  }

  return { calendarId, created: completed };
}
