import type { Character } from "@/types/character";
import type { MCUEntry } from "@/types/title";

export type MCUEntityKind = "EVENTO" | "UNIVERSO" | "EQUIPO";
export type EditorialStatus = "CONFIRMADO EN PANTALLA" | "CONTEXTO EDITORIAL";
export type MCUEntityConnection = { kind: MCUEntityKind; slug: string; label: string };
export type MCUEntity = {
  kind: MCUEntityKind;
  slug: string;
  name: string;
  kicker: string;
  summary: string;
  description: string;
  status: EditorialStatus;
  color: string;
  symbol: string;
  titleIds: string[];
  characterIds: string[];
  connections: MCUEntityConnection[];
};

export type MCUEntityDossier = {
  entity: MCUEntity;
  titles: MCUEntry[];
  relatedCharacters: Character[];
  connections: (MCUEntityConnection & { entity: MCUEntity })[];
};
