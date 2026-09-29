import type { Metadata } from "next";
import { Anton, Space_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { Analytics } from "@/features/analytics";
import { AccountProvider } from "@/features/account/AccountProvider";
import { SpoilerProgressProvider } from "@/features/spoilers/SpoilerProgressProvider";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { THEME_BOOTSTRAP_SCRIPT } from "@/services/theme/themePreference";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: siteConfig.category,
  formatDetection: siteConfig.formatDetection,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: siteConfig.verification,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-theme="dark" data-scroll-behavior="smooth">
      <head>
        {/*
          El tema se fija antes del primer pintado a proposito. Si se aplicara desde
          React, la pagina se pintaria con el tema por defecto y saltaria al elegido
          un instante despues, y ese parpadeo es justo lo que hace que el modo
          oscuro parezca roto.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className={`${display.variable} ${mono.variable}`}>
        <ThemeProvider>
          <AccountProvider>
            <SpoilerProgressProvider>
              <a className="skip-link" href="#main-content">
                SALTAR AL CONTENIDO
              </a>
              <div id="main-content">{children}</div>
              <LegalFooter />
              <Analytics />
            </SpoilerProgressProvider>
          </AccountProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
