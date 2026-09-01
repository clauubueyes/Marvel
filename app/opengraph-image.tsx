import { createSocialImage, socialImageSize } from "@/components/common/SocialImage";
import { siteConfig } from "@/config/site";
export const size = socialImageSize;
export const contentType = "image/png";
export const alt = "Guía Marvel y NEXUS — guía del MCU en español";
export default function OpenGraphImage() { return createSocialImage({ kicker: "NEXUS · GUÍA DEL MCU", title: "Guía Marvel", subtitle: siteConfig.description }); }
