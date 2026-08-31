import { getViewingRoute } from "@/data/viewingRoutes";
import { createSocialImage, socialImageSize } from "@/components/common/SocialImage";
export const size = socialImageSize;
export const contentType = "image/png";
export default async function RouteOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) { const route = getViewingRoute((await params).slug); return createSocialImage({ kicker: route?.kicker ?? "RUTA DE VISIONADO", title: route?.name ?? "Ruta no encontrada", subtitle: route?.description ?? "Recorrido editorial NEXUS", accent: route?.accent }); }
