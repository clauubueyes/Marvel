import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/config/seo";
import { EntityDossier } from "@/features/entities/dossier";
import { getMCUEntity, teams } from "@/data/mcuEntities";
type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return teams.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const entity = getMCUEntity("EQUIPO", (await params).slug); return entity ? createPageMetadata({ title: `${entity.name} — NEXUS`, socialTitle: entity.name, description: entity.summary, path: `/equipos/${entity.slug}` }) : {}; }
export default async function TeamPage({ params }: PageProps) { const entity = getMCUEntity("EQUIPO", (await params).slug); if (!entity) notFound(); return <EntityDossier entity={entity} />; }
