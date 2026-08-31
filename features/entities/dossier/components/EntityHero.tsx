import Image from "next/image";
import type { MCUEntity } from "@/types/entity";
import type { MCUEntry } from "@/types/title";

export function EntityHero({ entity, imageTitle }: { entity: MCUEntity; imageTitle?: MCUEntry }) {
  return <section className="entity-profile-hero">
    {imageTitle && <div className="entity-profile-art" aria-hidden="true"><Image src={`/api/title-image?title=${encodeURIComponent(imageTitle.title)}&type=${encodeURIComponent(imageTitle.type)}`} alt="" fill priority sizes="60vw" /></div>}
    <div><p className="eyebrow"><span /> {entity.kicker}</p><h1>{entity.name}</h1><p>{entity.summary}</p><span className="entity-status">{entity.status}</span></div><strong>{entity.symbol}</strong>
  </section>;
}
