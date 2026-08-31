"use client";

import { useState, type ReactNode } from "react";

export function SpoilerDisclosure({ label, children }: { label: string; children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  return <div className={revealed ? "spoiler-disclosure revealed" : "spoiler-disclosure"}>
    <button type="button" onClick={() => setRevealed((visible) => !visible)} aria-expanded={revealed}><span>{revealed ? "OCULTAR" : "REVELAR"}</span><strong>{label}</strong><i>{revealed ? "×" : "+"}</i></button>
    {revealed && <div>{children}</div>}
  </div>;
}
