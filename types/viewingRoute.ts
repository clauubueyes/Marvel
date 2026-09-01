export type ViewingPriority = "ESENCIAL" | "RECOMENDADO" | "OPCIONAL" | "DESTINO";
export type ViewingRouteStep = { titleId: string; priority: ViewingPriority; contribution: string; spoiler: string };
export type ViewingRoute = { slug: string; name: string; kicker: string; description: string; accent: string; estimatedMinutes: number; steps: ViewingRouteStep[] };
