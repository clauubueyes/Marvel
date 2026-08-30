import { getCharacter } from "@/lib/characters";
import { createSocialImage, socialImageSize } from "@/lib/socialImage";
export const size = socialImageSize;
export const contentType = "image/png";
export default async function CharacterOpenGraphImage({ params }: { params: Promise<{ id: string }> }) { const character = getCharacter((await params).id); return createSocialImage({ kicker: character?.role ?? "ARCHIVO DE PERSONAJES", title: character?.name ?? "Personaje no encontrado", subtitle: character?.description ?? "Expediente NEXUS", accent: character?.color }); }
