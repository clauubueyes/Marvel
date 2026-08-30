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
