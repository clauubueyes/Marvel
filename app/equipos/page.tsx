import type { Metadata } from "next";
import { EntityDirectory } from "@/components/EntityDirectory";
import { teams } from "@/lib/mcuEntities";
export const metadata: Metadata = { title: "Equipos del MCU — NEXUS", description: "Alianzas, familias y organizaciones conectadas del universo audiovisual Marvel.", alternates: { canonical: "/equipos" } };
export default function TeamsPage() { return <EntityDirectory entities={teams} eyebrow="ALIANZAS Y ORGANIZACIONES" title="NADIE SALVA" outline="EL MUNDO SOLO" description="Conoce quién forma cada grupo, por qué existe y qué acontecimientos cambiaron su misión." />; }
