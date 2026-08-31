"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const GATE_REVEAL_MS = 7200;

const frames = [
  { src: "/moments/iron.webp", position: "50% 32%" },
  { src: "/moments/captain-america.webp", position: "50% 24%" },
  { src: "/moments/black-panther.webp", position: "50% 24%" },
  { src: "/moments/strange.webp", position: "50% 25%" },
  { src: "/moments/spider.webp", position: "50% 25%" },
  { src: "/moments/doctor-doom.webp", position: "50% 18%" },
];

export function CinematicIntro() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(false);

  const finish = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 700);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      const dismissTimer = window.setTimeout(() => setVisible(false), 0);
      return () => window.clearTimeout(dismissTimer);
    }

    const timer = window.setTimeout(() => setReady(true), GATE_REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || (ready && (event.key === "Enter" || event.key === " "))) finish();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finish, ready, visible]);

  if (!visible) return null;

  return (
    <div className={`cinematic-intro${ready ? " is-ready" : ""}${leaving ? " is-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="Introducción de NEXUS">
      <div className="cinematic-intro-frames" aria-hidden="true">
        {frames.map((frame, index) => (
          <div className="cinematic-intro-frame" key={frame.src} style={{ "--frame": index, "--frame-position": frame.position } as React.CSSProperties}>
            <Image src={frame.src} alt="" fill priority sizes="100vw" />
          </div>
        ))}
      </div>
      <div className="cinematic-intro-shutter" aria-hidden="true" />
      <div className="cinematic-intro-title" aria-hidden="true">
        <span className="cinematic-intro-overline">EL UNIVERSO CINEMATOGRÁFICO</span>
        <strong><i>N</i>NEXUS</strong>
        <span className="cinematic-intro-tagline">TODO ESTÁ CONECTADO</span>
      </div>
      <button className="cinematic-intro-enter" type="button" onClick={finish} tabIndex={ready ? 0 : -1} aria-hidden={!ready}>
        <span>ENTRAR AL UNIVERSO</span><i aria-hidden="true">↓</i>
      </button>
      <button className="cinematic-intro-skip" type="button" onClick={finish}>SALTAR INTRO <span>↗</span></button>
      <div className="cinematic-intro-progress" aria-hidden="true"><i /></div>
    </div>
  );
}
