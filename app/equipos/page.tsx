import { createPageMetadata } from "@/config/seo";
import { EntityDirectory } from "@/features/entities/directory";
import { teams } from "@/data/mcuEntities";
export const metadata = createPageMetadata({ title: "Equipos del MCU — NEXUS", description: "Alianzas, familias y organizaciones conectadas del universo audiovisual Marvel.", path: "/equipos" });
export default function TeamsPage() { return <EntityDirectory entities={teams} eyebrow="ALIANZAS Y ORGANIZACIONES" title="NADIE SALVA" outline="EL MUNDO SOLO" description="Conoce quién forma cada grupo, por qué existe y qué acontecimientos cambiaron su misión." />; }
