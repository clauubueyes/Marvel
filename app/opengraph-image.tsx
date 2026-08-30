import { createSocialImage, socialImageSize } from "@/lib/socialImage";
import { siteConfig } from "@/lib/site";
export const size = socialImageSize;
export const contentType = "image/png";
export default function OpenGraphImage() { return createSocialImage({ kicker: "GUÍA EDITORIAL DEL MCU", title: "El camino hacia Doomsday", subtitle: siteConfig.description }); }
