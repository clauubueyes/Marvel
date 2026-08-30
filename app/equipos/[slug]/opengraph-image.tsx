import { getMCUEntity } from "@/lib/mcuEntities";
import { createSocialImage, socialImageSize } from "@/lib/socialImage";
export const size = socialImageSize;
export const contentType = "image/png";
export default async function TeamOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) { const entity = getMCUEntity("EQUIPO", (await params).slug); return createSocialImage({ kicker: entity?.kicker ?? "EQUIPO", title: entity?.name ?? "Equipo no encontrado", subtitle: entity?.summary ?? "Expediente NEXUS", accent: entity?.color }); }
