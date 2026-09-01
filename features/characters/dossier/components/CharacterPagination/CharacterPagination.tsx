import Link from "next/link";
import type { Character } from "@/types/character";

type CharacterPaginationProps = { current: Character; previous: Character; next: Character };

export function CharacterPagination({ current, previous, next }: CharacterPaginationProps) {
  return <nav className="character-pagination"><Link href={`/personajes/${previous.id}`}><small>← ANTERIOR</small><strong>{previous.name}</strong></Link><span>{current.symbol}</span><Link href={`/personajes/${next.id}`}><small>SIGUIENTE →</small><strong>{next.name}</strong></Link></nav>;
}
