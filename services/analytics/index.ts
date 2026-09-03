import { ANALYTICS_READY_EVENT, readAnalyticsConsent } from "./consent";

export const GA_MEASUREMENT_ID = "G-BVHF42HVE8";

let consentModeInitialized = false;

type GtagArguments =
  | [command: "js", loadedAt: Date]
  | [command: "config", measurementId: string, parameters?: Record<string, unknown>]
  | [command: "event", eventName: string, parameters?: Record<string, unknown>]
  | [command: "consent", action: "default" | "update", parameters: Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArguments) => void;
    __nexusAnalyticsReady?: boolean;
  }
}

type AnalyticsEventMap = {
  search: { search_term: string; result_count: number };
  character_view: { character_id: string; character_name: string };
  title_view: { title_slug: string; title_name: string; title_type: string };
  route_view: { route_slug: string; route_name: string };
  planner_open: Record<string, never>;
  planner_plan_generated: { title_count: number; session_count: number };
  planner_ics_export: { title_count: number; session_count: number };
  title_mark_watched: { title_slug: string; title_name: string };
  catalog_filter: { filter_name: string; filter_value: string };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

function safeText(value: string, maxLength = 100) {
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLength);
}

function safeSearchTerm(value: string) {
  return safeText(value, 80)
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[dato omitido]")
    .replace(/(?:\+?\d[\s().-]*){7,}/g, "[dato omitido]");
}

export function createGtagCommandQueue(dataLayer: unknown[]) {
  const gtag: (...args: GtagArguments) => void = function gtag() {
    // El formato IArguments es el contrato del snippet oficial que consume gtag.js.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  return gtag;
}

export function initializeConsentMode() {
  if (typeof window === "undefined" || consentModeInitialized) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? createGtagCommandQueue(window.dataLayer);
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });
  consentModeInitialized = true;
}

export function updateAnalyticsConsent(granted: boolean) {
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: granted ? "granted" : "denied",
  });
}

export function configureAnalytics() {
  if (typeof window === "undefined" || readAnalyticsConsent() !== "accepted") return;
  window.gtag?.("js", new Date());
  window.gtag?.("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  window.__nexusAnalyticsReady = true;
  window.dispatchEvent(new Event(ANALYTICS_READY_EVENT));
}

export function trackEvent<Name extends AnalyticsEventName>(name: Name, parameters: AnalyticsEventMap[Name]) {
  if (typeof window === "undefined" || !window.__nexusAnalyticsReady || readAnalyticsConsent() !== "accepted") return;
  try { window.gtag?.("event", name, parameters); } catch { /* Analytics nunca debe afectar a la interfaz. */ }
}

export function trackPageView(pathname: string, title = document.title) {
  if (typeof window === "undefined" || !window.__nexusAnalyticsReady || readAnalyticsConsent() !== "accepted") return;
  const safePath = pathname.startsWith("/") ? pathname.split(/[?#]/, 1)[0] : "/";
  try {
    window.gtag?.("event", "page_view", { page_location: `${window.location.origin}${safePath}`, page_path: safePath, page_title: safeText(title, 150) });
  } catch { /* Analytics nunca debe afectar a la interfaz. */ }
}

export const trackSearch = (searchTerm: string, resultCount: number) => trackEvent("search", { search_term: safeSearchTerm(searchTerm), result_count: resultCount });
export const trackCharacterView = (characterId: string, characterName: string) => trackEvent("character_view", { character_id: safeText(characterId), character_name: safeText(characterName) });
export const trackTitleView = (titleSlug: string, titleName: string, titleType: string) => trackEvent("title_view", { title_slug: safeText(titleSlug), title_name: safeText(titleName), title_type: safeText(titleType) });
export const trackRouteView = (routeSlug: string, routeName: string) => trackEvent("route_view", { route_slug: safeText(routeSlug), route_name: safeText(routeName) });
export const trackPlannerOpened = () => trackEvent("planner_open", {});
export const trackPlannerPlanGenerated = (titleCount: number, sessionCount: number) => trackEvent("planner_plan_generated", { title_count: titleCount, session_count: sessionCount });
export const trackPlannerIcsExport = (titleCount: number, sessionCount: number) => trackEvent("planner_ics_export", { title_count: titleCount, session_count: sessionCount });
export const trackTitleMarkedWatched = (titleSlug: string, titleName: string) => trackEvent("title_mark_watched", { title_slug: safeText(titleSlug), title_name: safeText(titleName) });
export const trackCatalogFilter = (filterName: string, filterValue: string) => trackEvent("catalog_filter", { filter_name: safeText(filterName), filter_value: safeText(filterValue) });
