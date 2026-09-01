import type { Metadata } from "next";
import { Anton, Space_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { LegalFooter } from "@/components/layout/LegalFooter";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "NEXUS — El camino hacia Doomsday",
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: { type: "website", locale: "es_ES", siteName: siteConfig.name, title: "NEXUS — El camino hacia Doomsday", description: siteConfig.description, url: "/" },
  twitter: { card: "summary_large_image", title: "NEXUS — El camino hacia Doomsday", description: siteConfig.description },
  robots: { index: true, follow: true },
  verification: { google: "kj3TIYD9OX2ZhgjzdHflfzFJUlUgj945t3WZzdMWAC4" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${mono.variable}`}><a className="skip-link" href="#main-content">SALTAR AL CONTENIDO</a><div id="main-content">{children}</div><LegalFooter /></body>
    </html>
  );
}
