"use client";

import { openAnalyticsSettings } from "@/services/analytics/consent";

export function CookieSettingsButton() {
  return <button type="button" onClick={openAnalyticsSettings}>CONFIGURAR COOKIES</button>;
}
