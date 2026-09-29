import Link from "next/link";
import { EditorialShell } from "@/components/layout/EditorialShell";
import { createPageMetadata } from "@/config/seo";
import { formatRouteDuration, viewingRoutes } from "@/data/viewingRoutes";

export const metadata = createPageMetadata({
  title: "Rutas de visionado del MCU — NEXUS",
  description:
    "Recorridos temáticos para entender Doomsday, el multiverso, la TVA, las incursiones y sus personajes esenciales.",
  path: "/rutas",
});

export default function RoutesPage() {
  return (
    <EditorialShell
      className="routes-index"
      context={`${String(viewingRoutes.length).padStart(2, "0")} RUTAS`}
    >
      <section className="routes-index-hero">
        <p className="eyebrow">
          <span /> RECORRIDOS EDITORIALES
        </p>
        <h1>
          ELIGE TU
          <br />
          <em>CAMINO</em>
        </h1>
        <p>
          No hace falta verlo todo. Cada ruta reúne las historias que necesitas para comprender un
          tema concreto del MCU.
        </p>
      </section>
      <section className="routes-directory" aria-label="Rutas de visionado">
        {viewingRoutes.map((route, index) => (
          <Link
            href={`/rutas/${route.slug}`}
            className="route-directory-card"
            key={route.slug}
            data-reveal
            style={
              {
                "--route-accent": route.accent,
                "--delay": `${index * 70}ms`,
              } as React.CSSProperties
            }
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <small>{route.kicker}</small>
            <h2>{route.name}</h2>
            <p>{route.description}</p>
            <div>
              <b>{route.steps.length} CAPÍTULOS</b>
              <b>{formatRouteDuration(route.estimatedMinutes)}</b>
            </div>
            <strong>ABRIR RUTA ↗</strong>
          </Link>
        ))}
      </section>
    </EditorialShell>
  );
}
