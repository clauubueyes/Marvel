import { getMCUEntity } from "@/data/mcuEntities";
import { createSocialImage, socialImageSize } from "@/components/common/SocialImage";
export const size = socialImageSize;
export const contentType = "image/png";
export default async function EventOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) { const entity = getMCUEntity("EVENTO", (await params).slug); return createSocialImage({ kicker: entity?.kicker ?? "ACONTECIMIENTO", title: entity?.name ?? "Evento no encontrado", subtitle: entity?.summary ?? "Expediente NEXUS", accent: entity?.color }); }
