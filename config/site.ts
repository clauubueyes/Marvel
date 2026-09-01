const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://guia-marvel.vercel.app").replace(/\/+$/, "");

export const siteConfig = {
  name: "Guía Marvel",
  alternateName: "NEXUS",
  title: "Guía Marvel — El universo Marvel en español",
  description: "Explora personajes, historias y el universo Marvel en una guía completa en español.",
  url: siteUrl,
  locale: "es_ES",
  language: "es-ES",
};
