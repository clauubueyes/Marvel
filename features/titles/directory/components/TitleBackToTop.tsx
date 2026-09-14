"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 600;

export function TitleBackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return <button type="button" className="title-back-to-top" aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>;
}