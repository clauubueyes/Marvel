import { animationTitleDetails } from "./animation";
import { infinitySagaTitleDetails } from "./infinitySaga";
import { marvelTelevisionTitleDetails } from "./marvelTelevision";
import { multiverseSagaTitleDetails } from "./multiverseSaga";
import { oneShotsTitleDetails } from "./oneShots";
import { upcomingTitleDetails } from "./upcoming";
import type { EditorialCoverage, TitleDetails } from "@/types/title";

const titleDetails: TitleDetails[] = [
  ...infinitySagaTitleDetails,
  ...multiverseSagaTitleDetails,
  ...marvelTelevisionTitleDetails,
  ...animationTitleDetails,
  ...oneShotsTitleDetails,
  ...upcomingTitleDetails,
];

const titleDetailsById = new Map(titleDetails.map((details) => [details.titleId, details]));

export function getTitleDetails(titleId: string) {
  return titleDetailsById.get(titleId);
}

export function getDetailedTitleIds() {
  return titleDetails.map(({ titleId }) => titleId);
}

export function getEditorialCoverage(titleId: string): EditorialCoverage {
  const details = getTitleDetails(titleId);
  if (!details) return "FICHA BÁSICA";
  return details.status === "ESTRENADO" ? "EXPEDIENTE COMPLETO" : "TÍTULO ANUNCIADO";
}

export type { EditorialCoverage, TitleDetails, TitleReleaseStatus } from "@/types/title";
