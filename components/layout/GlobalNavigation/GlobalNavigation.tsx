"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type GlobalNavigationProps = {
  home?: boolean;
  context?: string;
};

export function GlobalNavigation({ home = false, context }: GlobalNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    const closeOnOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("touchstart", closeOnOutside, { passive: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("touchstart", closeOnOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const active = (href: string) => href !== "/#doom" && pathname.startsWith(href);

  return (
    <header ref={headerRef} className={`${home ? "topbar" : "profile-nav"} global-navigation`}>
      {menuOpen && (
        <button
          className="global-navigation-backdrop"
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={closeMenu}
        />
      )}
      <Link className="brand" href={home ? "#inicio" : "/"} aria-label="Nexus inicio" onClick={closeMenu}><span>N</span>NEXUS</Link>
      <nav id="global-navigation-menu" className={menuOpen ? "nav global-links open" : "nav global-links"} aria-label="Navegación principal">
        <Link href="/#doom" onClick={closeMenu}>RUTA DOOMSDAY</Link>
        <Link href="/rutas" onClick={closeMenu} aria-current={active("/rutas") ? "page" : undefined}>RUTAS</Link>
        <Link href="/eventos" onClick={closeMenu} aria-current={active("/eventos") || active("/universos") || active("/equipos") ? "page" : undefined}>CONEXIONES</Link>
        <Link href="/titulos" onClick={closeMenu} aria-current={active("/titulos") ? "page" : undefined}>TÍTULOS</Link>
        <Link href="/personajes" onClick={closeMenu} aria-current={active("/personajes") ? "page" : undefined}>PERSONAJES</Link>
        <Link className="global-search-link" href="/buscar" onClick={closeMenu} aria-current={active("/buscar") ? "page" : undefined}>BUSCAR <span aria-hidden="true">⌕</span></Link>
        <Link href="/cuenta" onClick={closeMenu} aria-current={active("/cuenta") ? "page" : undefined}>MI CUENTA</Link>
      </nav>
      <div className="global-navigation-context">{context ?? "ARCHIVO MCU"}</div>
      <button className="menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="global-navigation-menu">{menuOpen ? "×" : "☰"}</button>
    </header>
  );
}
