export const ANALYTICS_CONSENT_STORAGE_KEY = "nexus:analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "nexus-analytics-consent-change";
export const ANALYTICS_SETTINGS_EVENT = "nexus-open-cookie-settings";
export const ANALYTICS_READY_EVENT = "nexus-analytics-ready";

export type AnalyticsConsent = "accepted" | "rejected" | null;

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function persistAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }));
}

export function subscribeAnalyticsConsent(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === ANALYTICS_CONSENT_STORAGE_KEY) callback(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(ANALYTICS_CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, callback);
  };
}

export function openAnalyticsSettings() {
  window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT));
}
