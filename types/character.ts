export type CharacterAppearance = {
  titleId: string;
  title: string;
  year: string;
  type: "PELÍCULA" | "SERIE";
  event: string;
};

export type Character = {
  id: string;
  name: string;
  alias: string;
  number: string;
  quote: string;
  universe: string;
  color: string;
  color2: string;
  power: string;
  symbol: string;
  votes: number;
  image: string;
  imagePosition?: string;
  sourceUrl: string;
  role: string;
  origin: string;
  description: string;
  stats: { label: string; value: number }[];
  abilities: string[];
  timeline: { year: string; title: string; text: string }[];
  facts: { value: string; label: string; text: string }[];
  appearances: CharacterAppearance[];
  screenMoment: { videoId: string; title: string; kicker: string; text: string };
  category: "HÉROE" | "VILLANO" | "SECUNDARIO" | "ANTI-HÉROE";
  status: "ACTIVO" | "INACTIVO" | "DESCONOCIDO";
  affiliations: string[];
  variants: { name: string; universe: string; description: string }[];
  sources: { label: string; url: string }[];
  reviewedAt: string;
};
