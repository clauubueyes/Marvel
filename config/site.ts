const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://guia-marvel.vercel.app").replace(/\/+$/, "");

export const siteConfig = {
  name: "NEXUS",
  alternateName: "Guía Marvel",
  description: "Guía editorial conectada del universo audiovisual Marvel y el camino hacia Avengers: Doomsday.",
  url: siteUrl,
  locale: "es_ES",
  language: "es-ES",
};
