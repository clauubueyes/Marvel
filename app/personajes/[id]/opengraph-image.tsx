import { getCharacter } from "@/repositories/characterRepository";
import { createSocialImage, socialImageSize } from "@/components/common/SocialImage";
export const size = socialImageSize;
export const contentType = "image/png";
export const alt = "Ficha de personaje del MCU en Guía Marvel y NEXUS";
export default async function CharacterOpenGraphImage({ params }: { params: Promise<{ id: string }> }) { const character = getCharacter((await params).id); return createSocialImage({ kicker: character ? `GUÍA MARVEL · NEXUS · ${character.role}` : "ARCHIVO DE PERSONAJES", title: character?.name ?? "Personaje no encontrado", subtitle: character?.description ?? "Expediente NEXUS", accent: character?.color }); }
