import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MotionEffects } from "@/components/common/MotionEffects";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import {
  CharacterConnections,
  CharacterFacts,
  CharacterFilmography,
  CharacterHero,
  CharacterIdentity,
  CharacterPagination,
  CharacterPowers,
  CharacterReference,
  CharacterScreenMoment,
  CharacterTimeline,
} from "@/features/characters/dossier/components";
import { characters, getCharacter } from "@/repositories/characterRepository";
import { getEntitiesForCharacter, getViewingRoutesForCharacter } from "@/repositories/contentRepository";
import { getCharacterMotionProfile } from "@/utils/characterMotion";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return characters.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const character = getCharacter((await params).id);
  return character
    ? createPageMetadata({ title: `${character.name} — Archivo NEXUS`, socialTitle: character.name, description: character.description, path: `/personajes/${character.id}` })
    : { title: "Personaje no encontrado — NEXUS" };
}

export default async function CharacterPage({ params }: PageProps) {
  const character = getCharacter((await params).id);
  if (!character) notFound();

  const currentIndex = characters.findIndex(({ id }) => id === character.id);
  const previous = characters[(currentIndex - 1 + characters.length) % characters.length];
  const next = characters[(currentIndex + 1) % characters.length];
  const connectedEntities = getEntitiesForCharacter(character.id);
  const relatedRoutes = getViewingRoutesForCharacter(character.id);
  const motion = getCharacterMotionProfile(character);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: character.name,
    alternateName: character.alias,
    description: character.description,
    url: new URL(`/personajes/${character.id}`, siteConfig.url).toString(),
    image: new URL(character.image, siteConfig.url).toString(),
    sameAs: character.sourceUrl,
    mainEntityOfPage: new URL(`/personajes/${character.id}`, siteConfig.url).toString(),
  };

  /*
   * Variables visuales de la ficha:
   * - `--accent` y `--accent-2` aplican la paleta propia del personaje.
   * - `--motion-*` sincroniza las animaciones definidas en motion.css.
   * - `data-motion` selecciona la firma tecnológica, mística, cósmica, etc.
   */
  return <main className={`profile profile-${character.id}`} data-motion={motion.signature} style={{ "--accent": character.color, "--accent-2": character.color2, "--motion-cycle": `${motion.tempo * 18}s`, "--motion-counter-cycle": `${motion.tempo * 12}s`, "--motion-pulse-cycle": `${motion.tempo * 3.4}s`, "--motion-particle-cycle": `${motion.tempo * 5}s`, "--motion-sweep-cycle": `${motion.tempo * 7}s`, "--motion-drift": `${motion.drift}px` } as React.CSSProperties}>
    {/* Capa funcional y ambiental que permanece por encima del dossier. */}
    <MotionEffects />
    <div className="character-atmosphere" aria-hidden="true"><i /><i /><i /><i /></div>
    <GlobalNavigation context={`ARCHIVO / ${character.number}`} />
    <Breadcrumbs items={[{ label: "PERSONAJES", href: "/personajes" }, { label: character.name }]} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} />

    {/* Primer impacto visual: nombre, retrato principal y metadatos. */}
    <CharacterHero character={character} motion={motion} />
    {/* Secciones editoriales claras y oscuras que desarrollan el personaje. */}
    <CharacterIdentity character={character} />
    <CharacterScreenMoment character={character} />
    <CharacterFacts facts={character.facts} />
    <CharacterFilmography appearances={character.appearances} />
    <CharacterPowers character={character} />
    <CharacterTimeline character={character} />
    {/* Cierre relacional: conexiones, fuentes y navegación entre personajes. */}
    <CharacterConnections entities={connectedEntities} />
    <CharacterReference character={character} routes={relatedRoutes} />
    <CharacterPagination current={character} previous={previous} next={next} />
  </main>;
}
