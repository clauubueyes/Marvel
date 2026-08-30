import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityDossier } from "@/components/EntityDossier";
import { events, getMCUEntity } from "@/lib/mcuEntities";
type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return events.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const entity = getMCUEntity("EVENTO", (await params).slug); return entity ? { title: `${entity.name} — NEXUS`, description: entity.summary } : {}; }
export default async function EventPage({ params }: PageProps) { const entity = getMCUEntity("EVENTO", (await params).slug); if (!entity) notFound(); return <EntityDossier entity={entity} />; }
