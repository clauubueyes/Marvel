"use client";

import { useEffect } from "react";

export function MotionEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.setAttribute("data-revealed", "true")),
      { threshold: 0.12 },
    );
    const observeReveals = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches("[data-reveal]")) observer.observe(root);
      root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])").forEach((element) => observer.observe(element));
    };
    observeReveals(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) observeReveals(node);
      }));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const tiltCleanups = new Map<HTMLElement, () => void>();
    const observeTilt = (root: ParentNode) => {
      const cards = [
        ...(root instanceof HTMLElement && root.matches("[data-tilt]") ? [root] : []),
        ...Array.from(root.querySelectorAll<HTMLElement>("[data-tilt]")),
      ];
      cards.forEach((card) => {
        if (tiltCleanups.has(card)) return;
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
        tiltCleanups.set(card, () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); });
      });
    };
    observeTilt(document);

    const tiltMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) observeTilt(node);
      }));
    });
    tiltMutationObserver.observe(document.body, { childList: true, subtree: true });

    const visibilityFallback = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => element.setAttribute("data-revealed", "true"));
    }, 1800);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      tiltMutationObserver.disconnect();
      window.clearTimeout(visibilityFallback);
      document.documentElement.classList.remove("motion-ready");
      tiltCleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
