import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { AnalyticsView } from "@/features/analytics";
import { MotionEffects } from "@/components/common/MotionEffects";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { createCharacterMetadata, createCharacterStructuredData } from "@/config/characterSeo";
import {
  CharacterChapter,
  CharacterConnections,
  CharacterFacts,
  CharacterFilmography,
  CharacterHero,
  CharacterIdentity,
  CharacterPagination,
  CharacterPowers,
  CharacterReference,
  CharacterScreenMoment,
  StorylineRail,
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
    ? createCharacterMetadata(character)
    : { title: "Personaje no encontrado — Guía Marvel", robots: { index: false, follow: false } };
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
  const structuredData = createCharacterStructuredData(character);

  const beats = character.story.slice(0, 4);
  const actLabels = ["I · EL ORIGEN", "II · EL PODER", "III · LA CRISIS", "IV · EL DESENLACE"];
  const actNumerals = ["I", "II", "III", "IV"];

  /*
   * Variables visuales de la ficha:
   * - `--accent` y `--accent-2` aplican la paleta propia del personaje.
   * - `--motion-*` sincroniza las animaciones definidas en motion.css.
   * - `data-motion` selecciona la firma tecnológica, mística, cósmica, etc.
   */
  return <main className={`profile profile-${character.id}`} data-motion={motion.signature} style={{ "--accent": character.color, "--accent-2": character.color2, "--motion-cycle": `${motion.tempo * 18}s`, "--motion-counter-cycle": `${motion.tempo * 12}s`, "--motion-pulse-cycle": `${motion.tempo * 3.4}s`, "--motion-particle-cycle": `${motion.tempo * 5}s`, "--motion-sweep-cycle": `${motion.tempo * 7}s`, "--motion-drift": `${motion.drift}px` } as React.CSSProperties}>
    <AnalyticsView kind="character" id={character.id} name={character.name} />
    {/* Capa funcional y ambiental que permanece por encima del dossier. */}
    <MotionEffects />
    <div className="character-atmosphere" aria-hidden="true"><i /><i /><i /><i /></div>
    <GlobalNavigation context={`ARCHIVO / ${character.number}`} />
    <Breadcrumbs items={[{ label: "PERSONAJES", href: "/personajes" }, { label: character.name }]} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} />

    {beats.length > 0 && <StorylineRail beats={beats.map((beat, index) => ({ act: actLabels[index], year: beat.year }))} />}

    {/* Primer impacto visual: nombre, retrato principal y metadatos. */}
    <CharacterHero character={character} motion={motion} />
    {/* La historia es la columna vertebral: cada capítulo abre una sección. */}
    {beats[0] && <CharacterChapter chapter={beats[0]} act={actLabels[0]} actNumeral={actNumerals[0]} position="left" />}
    <CharacterIdentity character={character} />
    <CharacterScreenMoment character={character} />
    {beats[1] && <CharacterChapter chapter={beats[1]} act={actLabels[1]} actNumeral={actNumerals[1]} position="right" />}
    <CharacterPowers character={character} />
    <CharacterFacts facts={character.facts} />
    <CharacterFilmography appearances={character.appearances} />
    {beats[2] && <CharacterChapter chapter={beats[2]} act={actLabels[2]} actNumeral={actNumerals[2]} position="left" />}
    {beats[3] && <CharacterChapter chapter={beats[3]} act={actLabels[3]} actNumeral={actNumerals[3]} position="right" />}
    {/* Cierre relacional: conexiones, fuentes y navegación entre personajes. */}
    <CharacterConnections entities={connectedEntities} />
    <CharacterReference character={character} routes={relatedRoutes} />
    <CharacterPagination current={character} previous={previous} next={next} />
  </main>;
}
