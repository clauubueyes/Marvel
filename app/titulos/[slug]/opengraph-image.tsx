import { getTitle } from "@/lib/contentRepository";
import { createSocialImage, socialImageSize } from "@/lib/socialImage";
export const size = socialImageSize;
export const contentType = "image/png";
export default async function TitleOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) { const title = getTitle((await params).slug); return createSocialImage({ kicker: title ? `${title.type} · ${title.phase}` : "ARCHIVO DE TÍTULOS", title: title?.title ?? "Título no encontrado", subtitle: title?.event ?? "Expediente NEXUS" }); }
