import type { Metadata } from "next";
import { Anton, Space_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { LegalFooter } from "@/components/layout/LegalFooter";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "entertainment",
  formatDetection: { address: false, email: false, telephone: false },
  openGraph: { type: "website", locale: siteConfig.locale, siteName: siteConfig.name, title: siteConfig.title, description: siteConfig.description, url: "/" },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  verification: { google: "kj3TIYD9OX2ZhgjzdHflfzFJUlUgj945t3WZzdMWAC4" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${mono.variable}`}><a className="skip-link" href="#main-content">SALTAR AL CONTENIDO</a><div id="main-content">{children}</div><LegalFooter /></body>
    </html>
  );
}
