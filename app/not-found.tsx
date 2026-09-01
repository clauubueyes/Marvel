import Link from "next/link";
import type { Metadata } from "next";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";

export const metadata: Metadata = { title: "Expediente no encontrado — NEXUS", robots: { index: false, follow: false } };

export default function NotFound() {
  return <main className="not-found-page" style={{ "--accent": "#b9d737" } as React.CSSProperties}><GlobalNavigation context="ERROR / 404" /><section><span>404</span><p className="eyebrow"><i /> COORDENADAS DESCONOCIDAS</p><h1>ESTE UNIVERSO<br /><em>NO EXISTE</em></h1><p>El expediente que buscas ha desaparecido de la línea temporal o nunca formó parte de NEXUS.</p><div><Link className="primary" href="/">VOLVER A DOOMSDAY</Link><Link href="/buscar">BUSCAR OTRO EXPEDIENTE ↗</Link></div></section></main>;
}
