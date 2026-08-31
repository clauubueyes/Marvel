export const WEEK_DAYS = [
  { value: 0, label: "DOM" },
  { value: 1, label: "LUN" },
  { value: 2, label: "MAR" },
  { value: 3, label: "MIÉ" },
  { value: 4, label: "JUE" },
  { value: 5, label: "VIE" },
  { value: 6, label: "SÁB" },
] as const;

export type PlannerTitle = { id: string; title: string; url: string; runtime?: string; type?: string };

export type PlannerPreferences = {
  startDate: string;
  weekDays: number[];
  titlesPerWeek: number;
  startTime: string;
  endTime: string;
};

export type PlannedViewing = PlannerTitle & {
  start: Date;
  end: Date;
  part: number;
  partsOnDay: number;
  durationMinutes: number;
  episodeLabel?: string;
  estimated: boolean;
};

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function setTime(date: Date, value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function createViewingPlan(titles: PlannerTitle[], preferences: PlannerPreferences): PlannedViewing[] {
  if (!titles.length || !preferences.weekDays.length || !preferences.startDate) return [];

  const firstDate = parseLocalDate(preferences.startDate);
  const selectedDays = [...new Set(preferences.weekDays)].sort((a, b) => a - b);
  const weeklyLimit = Math.max(1, preferences.titlesPerWeek);
  function slot(index: number) {
    const week = Math.floor(index / weeklyLimit);
    const position = index % weeklyLimit;
    const dayIndex = position % selectedDays.length;
    const selectedDay = selectedDays[dayIndex];
    const firstOccurrence = (selectedDay - firstDate.getDay() + 7) % 7;
    const date = addDays(firstDate, firstOccurrence + week * 7);

    const partsOnDay = Math.ceil(weeklyLimit / selectedDays.length);
    const part = Math.floor(position / selectedDays.length);
    const windowStart = setTime(date, preferences.startTime);
    let windowEnd = setTime(date, preferences.endTime);
    if (windowEnd <= windowStart) windowEnd = addDays(windowEnd, 1);
    const slotLength = (windowEnd.getTime() - windowStart.getTime()) / partsOnDay;
    const start = new Date(windowStart.getTime() + slotLength * part);

    return { start, windowEnd, slotMinutes: Math.floor(slotLength / 60_000), part: part + 1, partsOnDay };
  }

  const plan: PlannedViewing[] = [];
  let sessionIndex = 0;
  for (const title of titles) {
    const episodeMatch = title.runtime?.match(/(\d+)\s+(?:EPISODIOS|CORTOS)/i);
    if (episodeMatch) {
      const episodeCount = Number(episodeMatch[1]);
      const episodeMinutes = estimatedEpisodeMinutes(title.id, title.runtime ?? "");
      let firstEpisode = 1;
      while (firstEpisode <= episodeCount) {
        const currentSlot = slot(sessionIndex);
        const episodesInSession = Math.max(1, Math.floor(currentSlot.slotMinutes / episodeMinutes));
        const lastEpisode = Math.min(episodeCount, firstEpisode + episodesInSession - 1);
        const durationMinutes = (lastEpisode - firstEpisode + 1) * episodeMinutes;
        const episodeLabel = firstEpisode === lastEpisode ? `Episodio ${firstEpisode}` : `Episodios ${firstEpisode}–${lastEpisode}`;
        plan.push({ ...title, title: `${title.title} · ${episodeLabel}`, start: currentSlot.start, end: new Date(currentSlot.start.getTime() + durationMinutes * 60_000), part: currentSlot.part, partsOnDay: currentSlot.partsOnDay, durationMinutes, episodeLabel, estimated: true });
        firstEpisode = lastEpisode + 1;
        sessionIndex += 1;
      }
      continue;
    }

    const currentSlot = slot(sessionIndex);
    const exactMinutes = Number(title.runtime?.match(/(\d+)\s+MIN/i)?.[1]);
    const durationMinutes = exactMinutes || currentSlot.slotMinutes;
    plan.push({ ...title, start: currentSlot.start, end: new Date(currentSlot.start.getTime() + durationMinutes * 60_000), part: currentSlot.part, partsOnDay: currentSlot.partsOnDay, durationMinutes, estimated: !exactMinutes });
    sessionIndex += 1;
  }
  return plan;
}

function estimatedEpisodeMinutes(titleId: string, runtime: string) {
  if (/CORTOS/i.test(runtime) || titleId.includes("i-am-groot")) return 8;
  if (["what-if-temporadas-1-3", "x-men-97", "tu-amigo-y-vecino-spider-man", "marvel-zombies", "eyes-of-wakanda"].includes(titleId)) return 30;
  if (["wandavision", "she-hulk-abogada-hulka", "ms-marvel", "agatha-quien-si-no"].includes(titleId)) return 40;
  if (titleId.startsWith("daredevil-") || titleId.startsWith("jessica-jones-") || titleId.startsWith("the-punisher-")) return 52;
  return 45;
}

function icsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function createIcsCalendar(routeName: string, plan: PlannedViewing[]) {
  const stamp = icsDate(new Date());
  const events = plan.map((item, index) => [
    "BEGIN:VEVENT",
    `UID:${escapeIcs(`${item.id}-${item.start.getTime()}-${index}@nexus`)}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${icsDate(item.start)}`,
    `DTEND:${icsDate(item.end)}`,
    `SUMMARY:${escapeIcs(`NEXUS · ${item.title}`)}`,
    `DESCRIPTION:${escapeIcs(`Ruta: ${routeName}\nAbre el expediente en NEXUS: ${item.url}`)}`,
    `URL:${escapeIcs(item.url)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcs(`En 30 minutos: ${item.title}`)}`,
    "END:VALARM",
    "END:VEVENT",
  ].join("\r\n"));

  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NEXUS//Plan de visionado//ES", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${escapeIcs(`NEXUS · ${routeName}`)}`, ...events, "END:VCALENDAR", ""].join("\r\n");
}
