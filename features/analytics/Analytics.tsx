"use client";

import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { configureAnalytics, GA_MEASUREMENT_ID, initializeConsentMode, trackPageView, updateAnalyticsConsent } from "@/services/analytics";
import { ANALYTICS_SETTINGS_EVENT, persistAnalyticsConsent, readAnalyticsConsent, subscribeAnalyticsConsent } from "@/services/analytics/consent";
import { CINEMATIC_INTRO_EVENT } from "@/constants/uiEvents";

export function Analytics() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeAnalyticsConsent, readAnalyticsConsent, () => null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [cinematicIntroActive, setCinematicIntroActive] = useState(pathname === "/");
  const lastPage = useRef("");
  const settingsFocus = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    initializeConsentMode();
    const openSettings = () => { setAnalyticsEnabled(readAnalyticsConsent() === "accepted"); setPreferencesOpen(true); };
    window.addEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    const handleIntro = (event: Event) => {
      if (event instanceof CustomEvent) setCinematicIntroActive(event.detail === true);
    };
    window.addEventListener(CINEMATIC_INTRO_EVENT, handleIntro);
    return () => window.removeEventListener(CINEMATIC_INTRO_EVENT, handleIntro);
  }, []);

  useEffect(() => { updateAnalyticsConsent(consent === "accepted"); }, [consent]);

  useEffect(() => {
    if (!preferencesOpen) return;
    settingsFocus.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setPreferencesOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [preferencesOpen]);

  useEffect(() => {
    if (!ready || !pathname || lastPage.current === pathname) return;
    lastPage.current = pathname;
    trackPageView(pathname);
  }, [pathname, ready]);

  const choose = useCallback((accepted: boolean) => {
    const value = accepted ? "accepted" : "rejected";
    persistAnalyticsConsent(value);
    updateAnalyticsConsent(accepted);
    if (!accepted) { window.__nexusAnalyticsReady = false; setReady(false); }
    setAnalyticsEnabled(accepted);
    setPreferencesOpen(false);
  }, []);

  const showBanner = consent === null && !preferencesOpen && !cinematicIntroActive;
  return <>
    {consent === "accepted" && <Script id="nexus-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" onLoad={() => { configureAnalytics(); setReady(true); }} />}
    {showBanner && <section className="consent-banner" role="dialog" aria-modal="false" aria-labelledby="consent-title" aria-describedby="consent-description">
      <div><strong id="consent-title">TU PRIVACIDAD EN NEXUS</strong><p id="consent-description">Usamos almacenamiento necesario para tus preferencias. Con tu permiso, Google Analytics nos ayuda a entender el uso de la guía sin recibir nombres, correos ni tokens.</p><Link href="/privacidad">MÁS INFORMACIÓN</Link></div>
      <div className="consent-actions"><button type="button" className="consent-secondary" onClick={() => choose(false)}>RECHAZAR</button><button type="button" className="consent-secondary" onClick={() => setPreferencesOpen(true)}>CONFIGURAR</button><button type="button" className="consent-primary" onClick={() => choose(true)}>ACEPTAR</button></div>
    </section>}
    {preferencesOpen && <div className="consent-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && consent !== null) setPreferencesOpen(false); }}>
      <section className="consent-settings" role="dialog" aria-modal="true" aria-labelledby="consent-settings-title">
        <p className="eyebrow"><span /> PREFERENCIAS</p><h2 id="consent-settings-title">CONFIGURAR COOKIES</h2>
        <div className="consent-choice"><div><strong>ALMACENAMIENTO NECESARIO</strong><p>Conserva tus decisiones y progreso local. No puede desactivarse desde este panel.</p></div><span>SIEMPRE ACTIVO</span></div>
        <label className="consent-choice"><div><strong>ANALÍTICA</strong><p>Permite medir páginas e interacciones mediante Google Analytics 4.</p></div><input type="checkbox" checked={analyticsEnabled} onChange={(event) => setAnalyticsEnabled(event.target.checked)} /></label>
        <p className="consent-review">El texto informativo debe revisarse conforme a las obligaciones legales aplicables al responsable del sitio.</p>
        <div className="consent-actions"><button ref={settingsFocus} type="button" className="consent-secondary" onClick={() => setPreferencesOpen(false)}>CANCELAR</button><button type="button" className="consent-primary" onClick={() => choose(analyticsEnabled)}>GUARDAR PREFERENCIAS</button></div>
      </section>
    </div>}
  </>;
}
