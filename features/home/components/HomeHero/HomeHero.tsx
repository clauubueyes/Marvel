"use client";

import { useEffect, useRef } from "react";

const SPOTLIGHT_SHAPE = [
  [0, -96], [34, -91], [65, -82], [92, -69],
  [115, -48], [126, -24], [136, 0], [128, 23],
  [118, 46], [89, 70], [62, 86], [33, 93],
  [0, 103], [-31, 95], [-63, 83], [-95, 71],
  [-117, 49], [-129, 25], [-135, 0], [-125, -23],
  [-112, -46], [-92, -68], [-65, -84], [-34, -94],
] as const;

function createSpotlightClip(x: number, y: number, scale = 1) {
  const points = SPOTLIGHT_SHAPE.map(
    ([offsetX, offsetY]) => `${x + offsetX * scale}px ${y + offsetY * scale}px`,
  );

  return `polygon(${points.join(", ")})`;
}

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    const hero = heroRef.current;

    if (!canvas || !reveal || !hero) return;

    let animationFrame: number | null = null;
    let ambientFrame: number | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let hasPointerPosition = false;
    let strokePhase = 0;
    let trailX = 0;
    let trailY = 0;
    let hasTrailPosition = false;
    const trailElements = new Set<HTMLDivElement>();
    let ambientX = 0;
    let ambientY = 0;
    let targetX = 0;
    let targetY = 0;

    const applyOrganicShape = (element: HTMLElement, x: number, y: number) => {
      element.style.setProperty("--spotlight-x", `${x}px`);
      element.style.setProperty("--spotlight-y", `${y}px`);
      element.style.setProperty("--spotlight-width", `${70 + Math.sin(strokePhase) * 7}px`);
      element.style.setProperty("--spotlight-height", `${60 + Math.cos(strokePhase * 1.17) * 7}px`);
      element.style.setProperty("--spotlight-left-x", `${-42 + Math.sin(strokePhase * .83) * 7}px`);
      element.style.setProperty("--spotlight-right-x", `${44 + Math.cos(strokePhase * 1.31) * 7}px`);
      element.style.setProperty("--spotlight-lower-y", `${34 + Math.sin(strokePhase * 1.53) * 6}px`);
    };

    const createTrailMark = (x: number, y: number) => {
      const trail = document.createElement("div");
      trail.className = "doom-hero-trail";
      applyOrganicShape(trail, x, y);
      canvas.insertBefore(trail, reveal);
      trailElements.add(trail);

      if (trailElements.size > 40) {
        const oldestTrail = trailElements.values().next().value;
        if (oldestTrail) {
          trailElements.delete(oldestTrail);
          oldestTrail.remove();
        }
      }

      trail.addEventListener(
        "animationend",
        () => {
          trailElements.delete(trail);
          trail.remove();
        },
        { once: true },
      );
    };

    const renderSpotlight = () => {
      applyOrganicShape(reveal, pointerX, pointerY);
      canvas.style.setProperty("--spotlight-x", `${pointerX}px`);
      canvas.style.setProperty("--spotlight-y", `${pointerY}px`);
      animationFrame = null;
    };

    const renderAmbientLight = () => {
      ambientX += (targetX - ambientX) * 0.12;
      ambientY += (targetY - ambientY) * 0.12;
      hero.style.setProperty("--ambient-clip", createSpotlightClip(ambientX, ambientY, 3));

      if (Math.abs(targetX - ambientX) + Math.abs(targetY - ambientY) > 0.1) {
        ambientFrame = requestAnimationFrame(renderAmbientLight);
      } else {
        ambientFrame = null;
      }
    };

    const handleHeroPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const bounds = hero.getBoundingClientRect();
      targetX = event.clientX - bounds.left;
      targetY = event.clientY - bounds.top;

      if (hero.dataset.pointerActive !== "true") {
        ambientX = targetX;
        ambientY = targetY;
        hero.dataset.pointerActive = "true";
      }

      if (ambientFrame === null) ambientFrame = requestAnimationFrame(renderAmbientLight);
    };

    const hideAmbientLight = () => {
      hero.dataset.pointerActive = "false";
      canvas.dataset.exploring = "false";
    };

    const activateSpotlight = () => {
      canvas.dataset.exploring = "true";
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;

      if (hasPointerPosition) {
        const travelledDistance = Math.hypot(
          pointerX - previousPointerX,
          pointerY - previousPointerY,
        );
        strokePhase += Math.min(travelledDistance * .045, .65);
      } else {
        hasPointerPosition = true;
      }

      previousPointerX = pointerX;
      previousPointerY = pointerY;
      reveal.dataset.visible = "true";

      if (!hasTrailPosition) {
        trailX = pointerX;
        trailY = pointerY;
        hasTrailPosition = true;
        createTrailMark(pointerX, pointerY);
      } else {
        const trailDistance = Math.hypot(pointerX - trailX, pointerY - trailY);
        const markCount = Math.min(12, Math.floor(trailDistance / 42));

        for (let index = 1; index <= markCount; index += 1) {
          const progress = index / markCount;
          createTrailMark(
            trailX + (pointerX - trailX) * progress,
            trailY + (pointerY - trailY) * progress,
          );
        }

        if (markCount > 0) {
          trailX = pointerX;
          trailY = pointerY;
        }
      }

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(renderSpotlight);
      }
    };

    const hideSpotlight = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      reveal.dataset.visible = "false";
      canvas.dataset.exploring = "false";
      hasPointerPosition = false;
      hasTrailPosition = false;
    };

    hero.addEventListener("pointermove", handleHeroPointerMove, { passive: true });
    hero.addEventListener("pointerleave", hideAmbientLight);
    canvas.addEventListener("pointerenter", activateSpotlight);
    canvas.addEventListener("pointermove", handlePointerMove, { passive: true });
    canvas.addEventListener("pointerleave", hideSpotlight);
    canvas.addEventListener("pointercancel", hideSpotlight);

    return () => {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      if (ambientFrame !== null) cancelAnimationFrame(ambientFrame);
      hero.removeEventListener("pointermove", handleHeroPointerMove);
      hero.removeEventListener("pointerleave", hideAmbientLight);
      canvas.removeEventListener("pointerenter", activateSpotlight);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", hideSpotlight);
      canvas.removeEventListener("pointercancel", hideSpotlight);
      trailElements.forEach((trail) => trail.remove());
      trailElements.clear();
    };
  }, []);

  return (
    <section ref={heroRef} className="doom-hero" id="inicio" data-pointer-active="false">
      <div
        ref={canvasRef}
        className="doom-hero-canvas"
        data-exploring="false"
        aria-hidden="true"
      >
        <div className="doom-hero-layer doom-hero-masked" />
        <div
          ref={revealRef}
          className="doom-hero-layer doom-hero-unmasked"
          data-visible="false"
        />
        
      </div>
      <div className="doom-hero-grid" aria-hidden="true" />
      <div className="doom-hero-copy">
        <p className="eyebrow">
          <span /> MARVEL STUDIOS · GUÍA SIN CÓMICS
        </p>
        <h1>
          ANTES DE
          <br />
          <em>DOOMSDAY</em>
        </h1>
        <p className="doom-deck">
          Todo lo que el MCU ya te ha contado para entender a Victor von Doom, el multiverso y la colisión que viene.
        </p>
        <div className="hero-actions">
          <a className="primary" href="#doom">
            EMPEZAR DESDE CERO <b>↓</b>
          </a>
          <a className="ghost-action" href="#cronologia">
            VER TODO EL MCU
          </a>
        </div>
      </div>
      <div className="doom-hero-fact">
        <span>OBJETIVO</span>
        <b>06 TÍTULOS</b>
        <p>Una ruta directa. Sin relleno. Solo películas y series del MCU.</p>
      </div>
      <div className="ticker">
        <span>MULTIVERSO</span>
        <b>✦</b>
        <span>INCURSIONES</span>
        <b>✦</b>
        <span>VARIANTES</span>
        <b>✦</b>
        <span>VICTOR VON DOOM</span>
      </div>
    </section>
  );
}
