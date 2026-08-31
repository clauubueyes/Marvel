import { characters } from "@/repositories/characterRepository";
import { mcuCatalog } from "@/data/mcuCatalog";
import { getMCUEntity } from "@/data/mcuEntities";
import type { MCUEntity, MCUEntityDossier } from "@/types/entity";

const titlesById = new Map(mcuCatalog.map((title) => [title.slug, title]));
const charactersById = new Map(characters.map((character) => [character.id, character]));

export function getEntityDossier(entity: MCUEntity): MCUEntityDossier {
  return {
    entity,
    titles: entity.titleIds.flatMap((id) => { const title = titlesById.get(id); return title ? [title] : []; }),
    relatedCharacters: entity.characterIds.flatMap((id) => { const character = charactersById.get(id); return character ? [character] : []; }),
    connections: entity.connections.flatMap((connection) => {
      const connected = getMCUEntity(connection.kind, connection.slug);
      return connected ? [{ ...connection, entity: connected }] : [];
    }),
  };
}
