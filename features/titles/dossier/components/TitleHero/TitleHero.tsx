import Image from "next/image";
import { getEditorialCoverage } from "@/data/titles";
import type { TitleDetails, TitleDossier } from "@/types/title";

type TitleHeroProps = { title: TitleDossier; details?: TitleDetails; imageUrl: string };

export function TitleHero({ title, details, imageUrl }: TitleHeroProps) {
  return <section className="title-profile-hero">
    <div className="title-profile-art" aria-hidden="true"><Image src={imageUrl} alt="" fill priority sizes="(max-width: 800px) 100vw, 50vw" /></div>
    <div className="title-profile-copy"><p className="eyebrow"><span /> {title.type} · {title.phase}</p><h1>{title.title}</h1><p>{details?.spoilerFreeSynopsis ?? title.event}</p><div className="title-profile-tags"><span>{details?.status ?? title.period}</span><span>{getEditorialCoverage(title.slug)}</span><span>{title.continuity}</span><span>ORDEN {String(title.order).padStart(2, "0")}</span></div></div>
    <span className="title-profile-number">{String(title.order).padStart(2, "0")}</span>
  </section>;
}
