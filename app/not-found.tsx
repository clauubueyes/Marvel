import Link from "next/link";
import type { Metadata } from "next";
import { EditorialShell } from "@/components/layout/EditorialShell";

export const metadata: Metadata = {
  title: "Expediente no encontrado — NEXUS",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <EditorialShell className="not-found-page" context="ERROR / 404" motion={false}>
      <section>
        <span>404</span>
        <p className="eyebrow">
          <i /> COORDENADAS DESCONOCIDAS
        </p>
        <h1>
          ESTE UNIVERSO
          <br />
          <em>NO EXISTE</em>
        </h1>
        <p>
          El expediente que buscas ha desaparecido de la línea temporal o nunca formó parte de
          NEXUS.
        </p>
        <div>
          <Link className="primary" href="/">
            VOLVER A DOOMSDAY
          </Link>
          <Link href="/buscar">BUSCAR OTRO EXPEDIENTE ↗</Link>
        </div>
      </section>
    </EditorialShell>
  );
}
