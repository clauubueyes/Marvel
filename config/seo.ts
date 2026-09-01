import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  socialTitle?: string;
  index?: boolean;
};

export function createPageMetadata({ title, description, path, socialTitle = title, index = true }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
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
