const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://guia-marvel.vercel.app").replace(
  /\/+$/,
  "",
);

export const siteConfig = {
  name: "Guía Marvel",
  alternateName: "NEXUS",
  title: "Guía Marvel — El universo Marvel en español",
  description:
    "Explora personajes, historias y el universo Marvel en una guía completa en español.",
  url: siteUrl,
  locale: "es_ES",
  language: "es-ES",
  email: "clauubyy@gmail.com",
  category: "entertainment",
  formatDetection: { address: false, email: false, telephone: false },
  verification: { google: "kj3TIYD9OX2ZhgjzdHflfzFJUlUgj945t3WZzdMWAC4" },
};
