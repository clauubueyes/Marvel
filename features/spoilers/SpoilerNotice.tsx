"use client";

import Link from "next/link";
import { useSpoilerProgress } from "@/hooks/useSpoilerProgress";
import { spoilerProgressHint } from "@/services/progress/spoilerPolicy";
import type { SpoilerRequirement } from "@/types/spoiler";

export function SpoilerNotice({ requirement }: { requirement?: SpoilerRequirement }) {
  const progress = useSpoilerProgress();
  const hint = spoilerProgressHint(requirement, progress);
  return <div className="spoiler-notice" role="status" aria-live="polite">
    <p>Tu recorrido continúa</p>
    <p>{hint ? `Ya has visto ${hint.watched} de ${hint.required} títulos de esta parte. La historia se ampliará con tu progreso.` : "Explora el catálogo y marca lo que has visto para seguir descubriendo el UCM."}</p>
    <Link href="/titulos">CONTINUAR MI RECORRIDO ↗</Link>
  </div>;
}
