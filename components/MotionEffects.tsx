"use client";

import { useEffect } from "react";

export function MotionEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));

    const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
    const cleanups = Array.from(cards).map((card) => {
      const move = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty("--tilt-x", `${y * -4}deg`);
        card.style.setProperty("--tilt-y", `${x * 5}deg`);
        card.style.setProperty("--light-x", `${(x + 0.5) * 100}%`);
        card.style.setProperty("--light-y", `${(y + 0.5) * 100}%`);
      };
      const leave = () => { card.style.removeProperty("--tilt-x"); card.style.removeProperty("--tilt-y"); };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
    });

    return () => { observer.disconnect(); cleanups.forEach((cleanup) => cleanup()); };
  }, []);

  return null;
}
