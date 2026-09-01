import type { Character } from "@/types/character";

export type MCUType = "PELÍCULA" | "SERIE" | "ESPECIAL" | "ONE-SHOT";
export type MCUContinuity = "SAGA PRINCIPAL" | "MARVEL TELEVISION" | "MULTIVERSO";
export type MCUEntry = { slug: string; order: number; title: string; period: string; type: MCUType; continuity: MCUContinuity; phase: string; event: string };
export type TitleReleaseStatus = "ESTRENADO" | "PRÓXIMO ESTRENO" | "ANUNCIADO";
export type EditorialCoverage = "EXPEDIENTE COMPLETO" | "FICHA BÁSICA" | "TÍTULO ANUNCIADO";

export type TitleDetails = {
  titleId: string;
  spoilerFreeSynopsis: string;
  releaseDate: string;
  releaseDateISO: string;
  runtime: string;
  certification: string;
  status: TitleReleaseStatus;
  availability: string;
  directors: string[];
  writers: string[];
  cast: string[];
  trailerId: string;
  watchBefore: string[];
  watchAfter: string[];
  postCredits: { label: string; description: string }[];
  sources: { label: string; url: string }[];
  reviewedAt: string;
};

export type TitleDirectoryEntry = MCUEntry & {
  releaseDateISO: string;
  runtime: string;
  coverage: EditorialCoverage;
  routes: { slug: string; name: string }[];
};

export type TitleDossier = MCUEntry & {
  characters: Character[];
  previous: MCUEntry;
  next: MCUEntry;
};
