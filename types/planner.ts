export type PlannerTitle = { id: string; title: string; url: string; runtime?: string; type?: string };
export type PlannerPreferences = { startDate: string; weekDays: number[]; titlesPerWeek: number; startTime: string; endTime: string };
export type PlannedViewing = PlannerTitle & { start: Date; end: Date; part: number; partsOnDay: number; durationMinutes: number; episodeLabel?: string; estimated: boolean };
