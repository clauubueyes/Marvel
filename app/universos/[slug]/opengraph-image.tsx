import { getMCUEntity } from "@/data/mcuEntities";
import { createSocialImage, socialImageSize } from "@/components/common/SocialImage";
export const size = socialImageSize;
export const contentType = "image/png";
export default async function UniverseOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) { const entity = getMCUEntity("UNIVERSO", (await params).slug); return createSocialImage({ kicker: entity?.kicker ?? "UNIVERSO", title: entity?.name ?? "Universo no encontrado", subtitle: entity?.summary ?? "Expediente NEXUS", accent: entity?.color }); }
