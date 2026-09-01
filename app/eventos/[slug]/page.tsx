import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/config/seo";
import { EntityDossier } from "@/features/entities/dossier";
import { events, getMCUEntity } from "@/data/mcuEntities";
type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return events.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const entity = getMCUEntity("EVENTO", (await params).slug); return entity ? createPageMetadata({ title: `${entity.name} — NEXUS`, socialTitle: entity.name, description: entity.summary, path: `/eventos/${entity.slug}` }) : {}; }
export default async function EventPage({ params }: PageProps) { const entity = getMCUEntity("EVENTO", (await params).slug); if (!entity) notFound(); return <EntityDossier entity={entity} />; }
