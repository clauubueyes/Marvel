/**
 * Clasificación comunitaria de personajes a partir de los conteos agregados que
 * expone `get_character_favorites()`.
 *
 * El orden es totalmente determinista: dos personajes con el mismo número de fans
 * se ordenan por nombre. Sin ese desempate la lista cambiaría de posición entre
 * renders y entre dispositivos, y el servidor y el cliente no coincidirían.
 */

export type CommunityCandidate = {
  id: string;
  name: string;
  alias: string;
  color: string;
  image: string;
};

export type CommunityRank = CommunityCandidate & { fans: number; position: number };

const byName = (a: CommunityCandidate, b: CommunityCandidate) => a.name.localeCompare(b.name, "es");

/**
 * Devuelve los `limit` personajes con más votos. Se descartan los que no tienen
 * ningún fan y los ids que llegan desde la base pero ya no están en el catálogo.
 */
export function rankCommunityTop(
  candidates: readonly CommunityCandidate[],
  counts: Readonly<Record<string, number>>,
  limit: number,
): CommunityRank[] {
  return candidates
    .map((candidate) => ({ ...candidate, fans: counts[candidate.id] ?? 0 }))
    .filter(({ fans }) => fans > 0)
    .sort((a, b) => b.fans - a.fans || byName(a, b))
    .slice(0, limit)
    .map((entry, index) => ({ ...entry, position: index + 1 }));
}
