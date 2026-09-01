import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  socialTitle?: string;
  keywords?: readonly string[];
  index?: boolean;
};

const brandKeywords = [
  siteConfig.name,
  siteConfig.alternateName,
  "Guía Marvel en español",
  "NEXUS Marvel",
  "MCU",
  "Universo Cinematográfico de Marvel",
  "Marvel Cinematic Universe",
];

export function createPageMetadata({ title, description, path, socialTitle = title, keywords = [], index = true }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    keywords: [...new Set([...brandKeywords, ...keywords])],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", title: socialTitle, description },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}
