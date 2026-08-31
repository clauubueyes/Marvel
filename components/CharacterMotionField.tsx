"use client";

import { useEffect, useRef } from "react";
import type { CharacterMotionProfile } from "@/lib/characterMotion";

type Props = { profile: CharacterMotionProfile; symbol: string };

export function CharacterMotionField({ profile, symbol }: Props) {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const hero = field?.closest<HTMLElement>(".profile-hero");
    if (!field || !hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const render = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      hero.style.setProperty("--hero-pointer-x", currentX.toFixed(3));
      hero.style.setProperty("--hero-pointer-y", currentY.toFixed(3));
      frame = window.requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    const leave = () => { targetX = 0; targetY = 0; };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    render();
    return () => {
      window.cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      hero.style.removeProperty("--hero-pointer-x");
      hero.style.removeProperty("--hero-pointer-y");
    };
  }, []);

  return <div ref={fieldRef} className="character-motion-field" aria-hidden="true">
    <div className="motion-emblem"><span>{symbol}</span><i /><i /><i /></div>
    <div className="motion-elements">
      {Array.from({ length: 14 }, (_, index) => {
        const value = (profile.seed + index * 37) % 101;
        return <i key={index} style={{
          "--i": index,
          "--x": `${8 + ((value * 17) % 84)}%`,
          "--y": `${6 + ((value * 29) % 88)}%`,
          "--r": `${(value * 13) % 180}deg`,
          "--s": `${0.55 + (value % 8) * 0.1}`,
        } as React.CSSProperties} />;
      })}
    </div>
    <div className="motion-sweep" />
  </div>;
}
