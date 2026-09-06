import Image from "next/image";
import Link from "next/link";
import type { TitleDirectoryEntry } from "@/types/title";
import type { TitleViewMode } from "@/constants/titleDirectory";
import { getTitleImage } from "@/utils/titleImages";
import { getTitleSaga } from "@/utils/title";

type TitleDirectoryCardProps = {
  title: TitleDirectoryEntry;
  viewMode: TitleViewMode;
  planning: boolean;
  isSelected: boolean;
  isWatched: boolean;
  progressReady: boolean;
  onToggleSelected: () => void;
  onToggleWatched: () => void;
};

export function TitleDirectoryCard({ title, viewMode, planning, isSelected, isWatched, progressReady, onToggleSelected, onToggleWatched }: TitleDirectoryCardProps) {
  return <div className={`title-directory-row ${planning ? "is-planning" : ""} ${isSelected ? "is-selected" : ""} ${isWatched ? "is-watched" : ""}`}>
    <Link className="title-directory-card" href={`/titulos/${title.slug}`} data-reveal>
      <div className="title-card-art"><Image src={getTitleImage(title.slug)} alt={`Cartel de ${title.title}`} fill sizes={viewMode === "CUADRÍCULA" ? "(max-width: 700px) 90vw, (max-width: 1200px) 45vw, 30vw" : "180px"} /><span>{isWatched ? "✓" : String(title.order).padStart(2, "0")}</span><small>{title.type}</small></div>
      <div className="title-card-copy"><small>{title.period} · {title.coverage}</small><h2>{title.title}</h2><p>{title.event}</p>{title.routes.length > 0 && <div className="title-route-tags" aria-label="Recorridos relacionados">{title.routes.map((route) => <b key={route.slug}>{route.name}</b>)}</div>}</div>
      <aside><b>{title.phase}</b><small>{getTitleSaga(title.phase)}</small><small>{title.continuity}</small><small>{title.releaseDateISO.slice(0, 4)}</small></aside><i>↗</i>
    </Link>
    <div className="title-card-actions">
      <button type="button" className="title-watch-toggle" disabled={!progressReady} onClick={onToggleWatched} aria-pressed={isWatched}>{isWatched ? "✓ VISTO" : "MARCAR VISTO"}</button>
      {planning && <button type="button" className="title-plan-select" onClick={onToggleSelected} aria-pressed={isSelected}><span>{isSelected ? "✓" : "+"}</span>{isSelected ? "EN EL PLAN" : "AÑADIR AL PLAN"}</button>}
    </div>
  </div>;
}
