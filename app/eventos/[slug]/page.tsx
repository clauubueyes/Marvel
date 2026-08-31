import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityDossier } from "@/features/entities/dossier";
import { events, getMCUEntity } from "@/data/mcuEntities";
type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return events.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const entity = getMCUEntity("EVENTO", (await params).slug); return entity ? { title: `${entity.name} — NEXUS`, description: entity.summary, alternates: { canonical: `/eventos/${entity.slug}` }, openGraph: { title: entity.name, description: entity.summary, url: `/eventos/${entity.slug}` } } : {}; }
export default async function EventPage({ params }: PageProps) { const entity = getMCUEntity("EVENTO", (await params).slug); if (!entity) notFound(); return <EntityDossier entity={entity} />; }
