"use client";

import Link from "next/link";
import { useState } from "react";

type GlobalNavigationProps = {
  home?: boolean;
  context?: string;
};

export function GlobalNavigation({ home = false, context }: GlobalNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${home ? "topbar" : "profile-nav"} global-navigation`}>
      <Link className="brand" href={home ? "#inicio" : "/"} aria-label="Nexus inicio" onClick={closeMenu}><span>N</span>NEXUS</Link>
      <nav className={menuOpen ? "nav global-links open" : "nav global-links"} aria-label="Navegación principal">
        <Link href="/#doom" onClick={closeMenu}>RUTA DOOMSDAY</Link>
        <Link href="/rutas" onClick={closeMenu}>RUTAS</Link>
        <Link href="/eventos" onClick={closeMenu}>CONEXIONES</Link>
        <Link href="/titulos" onClick={closeMenu}>TÍTULOS</Link>
        <Link href="/personajes" onClick={closeMenu}>PERSONAJES</Link>
        <Link className="global-search-link" href="/buscar" onClick={closeMenu}>BUSCAR <span>⌕</span></Link>
      </nav>
      <div className="global-navigation-context">{context ?? "ARCHIVO MCU"}</div>
      <button className="menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen}>{menuOpen ? "×" : "☰"}</button>
    </header>
  );
}
