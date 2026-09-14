"use client";

import { useEffect, useRef } from "react";
import type { ReturnTypeOfUseTitleDirectory } from "../types";

export function TitleLibraryToolbar({ directory }: { directory: ReturnTypeOfUseTitleDirectory }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { pendingTitles, query, selectForPlan, setQuery, titles, watched } = directory;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/") return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      event.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return <section className="title-library-toolbar" aria-label="Gestión de la biblioteca">
    <label className="title-search"><span>BUSCAR EN EL ARCHIVO · <kbd>/</kbd></span><input ref={inputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título, acontecimiento, año…" /></label>
    <div className="title-library-progress"><strong>{watched.size}<small>/ {titles.length}</small></strong><span>VISTOS</span><i><b style={{ width: `${Math.round(watched.size / titles.length * 100)}%` }} /></i></div>
    <button className="title-primary-plan" type="button" onClick={() => selectForPlan(pendingTitles)}>PLANIFICAR <b>{pendingTitles.length}</b></button>
  </section>;
}