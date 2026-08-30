"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { IronManFlight } from "@/components/IronManFlight";

export function IronManCinematic() {
  const sequenceRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sequence = sequenceRef.current;
    if (!sequence || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const updatePointer = (event: PointerEvent) => {
      const bounds = sequence.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      sequence.style.setProperty("--look-x", `${x * 12}px`);
      sequence.style.setProperty("--look-y", `${y * 9}px`);
    };
    const resetPointer = () => {
      sequence.style.setProperty("--look-x", "0px");
      sequence.style.setProperty("--look-y", "0px");
    };

    sequence.addEventListener("pointermove", updatePointer);
    sequence.addEventListener("pointerleave", resetPointer);
    return () => {
      sequence.removeEventListener("pointermove", updatePointer);
      sequence.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <main className="ironman-cinematic" ref={sequenceRef}>
      <div className="ironman-grain" aria-hidden="true" />
      <div className="ironman-grid" aria-hidden="true" />
      <div className="ironman-particles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
      </div>
      <div className="ironman-orbit orbit-a" aria-hidden="true" />
      <div className="ironman-orbit orbit-b" aria-hidden="true" />

      <header className="ironman-header">
        <Link href="/" aria-label="Volver a Marvel Nexus"><span>◈</span> NEXUS</Link>
        <p>STARK INDUSTRIES · ARMOR PROTOCOL</p>
        <b>MK LXXXV</b>
      </header>

      <section className="ironman-shot" aria-labelledby="ironman-title">
        <div className="ironman-copy">
          <p className="ironman-kicker"><i /> SECUENCIA DE ACTIVACIÓN</p>
          <h1 id="ironman-title">I AM<br /><em>IRON MAN</em></h1>
          <p className="ironman-deck">Un retrato cinematográfico: energía encendida, sistemas en línea y una entrada construida para la pantalla.</p>
          <div className="ironman-status"><span>ARC REACTOR</span><b>100%</b><i /></div>
        </div>

        <IronManFlight />

        <aside className="ironman-readout" aria-label="Estado del sistema">
          <span>01 / 01</span>
          <strong>FLIGHT<br />SYSTEM</strong>
          <p>ONLINE<br />REPULSORS ARMED</p>
        </aside>
      </section>

      <footer className="ironman-footer"><span>SCROLL TO ENGAGE</span><i /><span>JARVIS // READY</span></footer>
    </main>
  );
}
