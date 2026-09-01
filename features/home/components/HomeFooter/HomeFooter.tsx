import Link from "next/link";

export function HomeFooter() {
  return <footer><a className="brand" href="#inicio"><span>N</span>NEXUS</a><p>GUÍA EDITORIAL DEL MCU · PROYECTO NO OFICIAL</p><Link href="/titulos">ARCHIVO DE TÍTULOS ↗</Link><a href="#inicio">VOLVER ARRIBA ↑</a></footer>;
}
