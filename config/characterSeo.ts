import type { Metadata } from "next";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import type { Character } from "@/types/character";

function getCharacterSeoContent(character: Character) {
  const displayName = `${character.name} (${character.alias})`;
  const path = `/personajes/${character.id}`;
  const url = new URL(path, siteConfig.url).toString();
  const title = `${displayName} en el MCU — Guía Marvel`;
  const description = `Todo sobre ${displayName} en el MCU: historia, poderes y apariciones en Guía Marvel, el archivo NEXUS en español.`;
  const keywords = [
    character.name,
    character.alias,
    `${character.name} MCU`,
    `${character.alias} MCU`,
    `${character.name} Marvel`,
    `${character.alias} Marvel`,
    `${character.name} poderes`,
    `${character.name} películas y series`,
    character.universe,
    character.role,
    character.category,
    ...character.affiliations,
    ...character.appearances.map(({ title: appearanceTitle }) => appearanceTitle),
  ];

  return { displayName, path, url, title, description, keywords };
}

export function createCharacterMetadata(character: Character): Metadata {
  const seo = getCharacterSeoContent(character);

  return createPageMetadata({
    title: seo.title,
    socialTitle: `${seo.displayName} | Guía Marvel`,
    description: seo.description,
    path: seo.path,
    keywords: seo.keywords,
  });
}

export function createCharacterStructuredData(character: Character) {
  const seo = getCharacterSeoContent(character);
  const websiteId = `${siteConfig.url}/#website`;
  const webpageId = `${seo.url}#webpage`;
  const characterId = `${seo.url}#character`;
  const breadcrumbId = `${seo.url}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: seo.url,
        name: seo.title,
        description: seo.description,
        inLanguage: siteConfig.language,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": characterId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "Person",
        "@id": characterId,
        name: character.name,
        alternateName: character.alias,
        description: character.description,
        url: seo.url,
        image: new URL(character.image, siteConfig.url).toString(),
        sameAs: [character.sourceUrl],
        mainEntityOfPage: { "@id": webpageId },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Universo", value: character.universe },
          { "@type": "PropertyValue", name: "Categoría", value: character.category },
          { "@type": "PropertyValue", name: "Estado", value: character.status },
          { "@type": "PropertyValue", name: "Poderes", value: character.abilities.join(", ") },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Guía Marvel", item: `${siteConfig.url}/` },
          { "@type": "ListItem", position: 2, name: "Personajes del MCU", item: new URL("/personajes", siteConfig.url).toString() },
          { "@type": "ListItem", position: 3, name: seo.displayName, item: seo.url },
        ],
      },
    ],
  };
}
