export const WEEK_DAYS = [
  { value: 0, label: "DOM" },
  { value: 1, label: "LUN" },
  { value: 2, label: "MAR" },
  { value: 3, label: "MIÉ" },
  { value: 4, label: "JUE" },
  { value: 5, label: "VIE" },
  { value: 6, label: "SÁB" },
] as const;

export type PlannerTitle = { id: string; title: string; url: string };

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
  return titles.map((title, index) => {
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
    const end = new Date(Math.min(start.getTime() + slotLength, windowEnd.getTime()));

    return { ...title, start, end, part: part + 1, partsOnDay };
  });
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
