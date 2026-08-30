import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntityDossier } from "@/components/EntityDossier";
import { getMCUEntity, teams } from "@/lib/mcuEntities";
type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return teams.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const entity = getMCUEntity("EQUIPO", (await params).slug); return entity ? { title: `${entity.name} — NEXUS`, description: entity.summary, alternates: { canonical: `/equipos/${entity.slug}` }, openGraph: { title: entity.name, description: entity.summary, url: `/equipos/${entity.slug}` } } : {}; }
export default async function TeamPage({ params }: PageProps) { const entity = getMCUEntity("EQUIPO", (await params).slug); if (!entity) notFound(); return <EntityDossier entity={entity} />; }
