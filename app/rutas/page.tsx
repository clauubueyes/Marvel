import type { Metadata } from "next";
import Link from "next/link";
import { GlobalNavigation } from "@/components/GlobalNavigation";
import { MotionEffects } from "@/components/MotionEffects";
import { formatRouteDuration, viewingRoutes } from "@/lib/viewingRoutes";

export const metadata: Metadata = {
  title: "Rutas de visionado del MCU — NEXUS",
  description: "Recorridos temáticos para entender Doomsday, el multiverso, la TVA, las incursiones y sus personajes esenciales.",
  alternates: { canonical: "/rutas" },
};

export default function RoutesPage() {
  return <main className="routes-index" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <MotionEffects />
    <GlobalNavigation context={`${String(viewingRoutes.length).padStart(2, "0")} RUTAS`} />
    <section className="routes-index-hero"><p className="eyebrow"><span /> RECORRIDOS EDITORIALES</p><h1>ELIGE TU<br /><em>CAMINO</em></h1><p>No hace falta verlo todo. Cada ruta reúne las historias que necesitas para comprender un tema concreto del MCU.</p></section>
    <section className="routes-directory" aria-label="Rutas de visionado">
      {viewingRoutes.map((route, index) => <Link href={`/rutas/${route.slug}`} className="route-directory-card" key={route.slug} data-reveal style={{ "--route-accent": route.accent, "--delay": `${index * 70}ms` } as React.CSSProperties}>
        <span>{String(index + 1).padStart(2, "0")}</span><small>{route.kicker}</small><h2>{route.name}</h2><p>{route.description}</p><div><b>{route.steps.length} CAPÍTULOS</b><b>{formatRouteDuration(route.estimatedMinutes)}</b></div><strong>ABRIR RUTA ↗</strong>
      </Link>)}
    </section>
  </main>;
}
