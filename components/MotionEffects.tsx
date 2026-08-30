"use client";

import { useEffect } from "react";

export function MotionEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    const observeReveals = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches("[data-reveal]")) observer.observe(root);
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((element) => observer.observe(element));
    };
    observeReveals(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) observeReveals(node);
      }));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

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

    const visibilityFallback = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
    }, 1800);

    const ironProfile = document.querySelector<HTMLElement>(".profile-iron");
    let scrollFrame = 0;
    const updateIronScroll = () => {
      scrollFrame = 0;
      if (!ironProfile) return;
      const hero = ironProfile.querySelector<HTMLElement>(".profile-hero");
      if (!hero) return;
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(hero.offsetHeight, 1)));
      ironProfile.style.setProperty("--iron-scroll", progress.toFixed(3));
      ironProfile.style.setProperty("--iron-figure-shift", `${(-progress * 26).toFixed(1)}px`);
      ironProfile.style.setProperty("--iron-hud-shift", `${(-progress * 18).toFixed(1)}px`);
      ironProfile.style.setProperty("--iron-hud-scale", (1 + progress * .08).toFixed(3));
      ironProfile.style.setProperty("--iron-readout-shift", `${(progress * 18).toFixed(1)}px`);
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateIronScroll); };
    updateIronScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      window.clearTimeout(visibilityFallback);
      document.documentElement.classList.remove("motion-ready");
      cleanups.forEach((cleanup) => cleanup());
      window.removeEventListener("scroll", onScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      ironProfile?.style.removeProperty("--iron-scroll");
      ironProfile?.style.removeProperty("--iron-figure-shift");
      ironProfile?.style.removeProperty("--iron-hud-shift");
      ironProfile?.style.removeProperty("--iron-hud-scale");
      ironProfile?.style.removeProperty("--iron-readout-shift");
    };
  }, []);

  return null;
}
