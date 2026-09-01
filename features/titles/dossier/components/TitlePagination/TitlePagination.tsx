import Link from "next/link";
import type { MCUEntry } from "@/types/title";

export function TitlePagination({ previous, next }: { previous: MCUEntry; next: MCUEntry }) {
  return <nav className="character-pagination title-pagination"><Link href={`/titulos/${previous.slug}`}><small>← ANTERIOR</small><strong>{previous.title}</strong></Link><span>✦</span><Link href={`/titulos/${next.slug}`}><small>SIGUIENTE →</small><strong>{next.title}</strong></Link></nav>;
}
