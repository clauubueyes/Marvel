import { createSocialImage, socialImageSize } from "@/components/common/SocialImage";
import { siteConfig } from "@/config/site";
export const size = socialImageSize;
export const contentType = "image/png";
export default function OpenGraphImage() { return createSocialImage({ kicker: "GUÍA EDITORIAL DEL MCU", title: "El camino hacia Doomsday", subtitle: siteConfig.description }); }
