import { MotionEffects } from "@/components/common/MotionEffects";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { characters } from "@/repositories/characterRepository";
import { CinematicIntro, DoomsdayGuide, HomeCharacterPreview, HomeFooter, HomeHero, MCUCatalog } from "@/features/home/components";

export const metadata = createPageMetadata({
  title: "NEXUS — El camino hacia Doomsday",
  description: siteConfig.description,
  path: "/",
});

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: `${siteConfig.url}/`,
  name: siteConfig.name,
  alternateName: siteConfig.alternateName,
  description: siteConfig.description,
  inLanguage: siteConfig.language,
};

export default function Home() {
  /* La paleta verde se comparte con todos los bloques editoriales de la portada. */
  return <main className="mcu-home" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData).replaceAll("<", "\\u003c") }} />
    {/* Overlay de entrada; desaparece antes de mostrar el contenido de Home. */}
    <CinematicIntro />
    {/* Infraestructura visual persistente: animaciones de scroll y navegación. */}
    <MotionEffects />
    <GlobalNavigation home context="RUTA MCU · 2026" />
    {/* Orden visual de las grandes secciones de la portada. */}
    <HomeHero />
    <DoomsdayGuide />
    <MCUCatalog />
    <HomeCharacterPreview characters={characters} />
    <HomeFooter />
  </main>;
}
