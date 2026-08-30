import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MotionEffects } from "@/components/MotionEffects";
import { getTitleDossier } from "@/lib/contentRepository";
import { mcuCatalog } from "@/lib/mcuCatalog";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return mcuCatalog.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = getTitleDossier((await params).slug);
  return title
    ? { title: `${title.title} — Archivo NEXUS`, description: title.event }
    : { title: "Título no encontrado — NEXUS" };
}

export default async function TitlePage({ params }: PageProps) {
  const title = getTitleDossier((await params).slug);
  if (!title) notFound();

  const imageUrl = `/api/title-image?title=${encodeURIComponent(title.title)}&type=${encodeURIComponent(title.type)}`;

  return (
    <main className="title-profile" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
      <MotionEffects />
      <header className="profile-nav">
        <Link className="brand" href="/"><span>N</span>NEXUS</Link>
        <p>ARCHIVO / {String(title.order).padStart(2, "0")}</p>
        <Link href="/titulos">TÍTULOS <b>×</b></Link>
      </header>

      <section className="title-profile-hero">
        <div className="title-profile-art" aria-hidden="true">
          <Image src={imageUrl} alt="" fill priority sizes="(max-width: 800px) 100vw, 50vw" unoptimized />
        </div>
        <div className="title-profile-copy">
          <p className="eyebrow"><span /> {title.type} · {title.phase}</p>
          <h1>{title.title}</h1>
          <p>{title.event}</p>
          <div className="title-profile-tags"><span>{title.period}</span><span>{title.continuity}</span><span>ORDEN {String(title.order).padStart(2, "0")}</span></div>
        </div>
        <span className="title-profile-number">{String(title.order).padStart(2, "0")}</span>
      </section>

      <section className="title-dossier profile-section">
        <div className="title-dossier-heading" data-reveal>
          <p className="section-label">01 / EL ACONTECIMIENTO</p>
          <h2>QUÉ CAMBIA<br />EN EL <em>MCU</em></h2>
        </div>
        <div className="title-dossier-event" data-reveal>
          <span>RESUMEN CON SPOILERS</span>
          <p>{title.event}</p>
        </div>
        <dl className="title-dossier-meta" data-reveal>
          <div><dt>POSICIÓN</dt><dd>{title.period}</dd></div>
          <div><dt>FORMATO</dt><dd>{title.type}</dd></div>
          <div><dt>ETAPA</dt><dd>{title.phase}</dd></div>
          <div><dt>CONTINUIDAD</dt><dd>{title.continuity}</dd></div>
        </dl>
      </section>

      <section className="title-cast profile-section">
        <div data-reveal>
          <p className="section-label">02 / PERSONAJES CONECTADOS</p>
          <h2>QUIÉN ESTÁ<br /><em>IMPLICADO</em></h2>
          <p>Personajes con expediente NEXUS cuya historia pasa por este título.</p>
        </div>
        {title.characters.length ? (
          <div className="title-cast-grid">
            {title.characters.map((character) => (
              <Link href={`/personajes/${character.id}`} key={character.id} data-reveal>
                <Image src={character.image} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" unoptimized />
                <span>{character.role}</span><h3>{character.name}</h3><b>ABRIR EXPEDIENTE ↗</b>
              </Link>
            ))}
          </div>
        ) : <p className="title-cast-empty">Todavía no hay personajes enlazados a este expediente.</p>}
      </section>

      <nav className="character-pagination title-pagination">
        <Link href={`/titulos/${title.previous.slug}`}><small>← ANTERIOR</small><strong>{title.previous.title}</strong></Link>
        <span>✦</span>
        <Link href={`/titulos/${title.next.slug}`}><small>SIGUIENTE →</small><strong>{title.next.title}</strong></Link>
      </nav>
    </main>
  );
}
