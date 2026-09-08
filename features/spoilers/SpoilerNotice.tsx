"use client";

import Link from "next/link";
import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { spoilerProgressHint } from "@/services/progress/spoilerPolicy";
import type { SpoilerRequirement } from "@/types/spoiler";

export function SpoilerNotice({ requirement }: { requirement?: SpoilerRequirement }) {
  const progress = useSpoilerProgress();
  const hint = spoilerProgressHint(requirement, progress);
  return <div className="spoiler-notice" role="status" aria-live="polite">
    <p>🔒 Contenido bloqueado por spoilers</p>
    <p>{hint ? `Has visto ${hint.watched} de ${hint.required} ${hint.required === 1 ? "obra" : "obras"} necesarias.` : "Continúa viendo el UCM para desbloquear esta parte."}</p>
    <Link href="/cuenta#spoilers">ACTUALIZAR MI PROGRESO ↗</Link>
  </div>;
}