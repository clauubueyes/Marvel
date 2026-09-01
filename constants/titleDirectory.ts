import type { MCUContinuity, MCUType } from "@/types/title";

export type TitleTypeFilter = "TODOS" | MCUType;
export type TitleOrderMode = "NARRATIVO" | "ESTRENO";
export type TitleSortMode = "ORDEN" | "AÑO" | "NOMBRE" | "RELEVANCIA";
export type TitleProgressFilter = "TODOS" | "PENDIENTES" | "VISTOS";
export type TitleViewMode = "CUADRÍCULA" | "LISTA";

export const TITLE_TYPES: TitleTypeFilter[] = ["TODOS", "PELÍCULA", "SERIE", "ESPECIAL", "ONE-SHOT"];
export const TITLE_SAGAS = ["SAGA DEL INFINITO", "SAGA DEL MULTIVERSO", "OTRAS HISTORIAS"] as const;
export const TITLE_CONTINUITIES: MCUContinuity[] = ["SAGA PRINCIPAL", "MARVEL TELEVISION", "MULTIVERSO"];
export const TITLE_PROGRESS_STORAGE_KEY = "nexus:titles:watched";
export const TITLE_PROGRESS_EVENT = "nexus-title-progress";
