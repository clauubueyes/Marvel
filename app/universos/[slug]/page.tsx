import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/config/seo";
import { EntityDossier } from "@/features/entities/dossier";
import { getMCUEntity, universes } from "@/data/mcuEntities";
type PageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return universes.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const entity = getMCUEntity("UNIVERSO", (await params).slug); return entity ? createPageMetadata({ title: `${entity.name} — NEXUS`, socialTitle: entity.name, description: entity.summary, path: `/universos/${entity.slug}` }) : {}; }
export default async function UniversePage({ params }: PageProps) { const entity = getMCUEntity("UNIVERSO", (await params).slug); if (!entity) notFound(); return <EntityDossier entity={entity} />; }
