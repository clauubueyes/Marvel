import type { Metadata } from "next";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { AccountForm } from "@/features/account/AccountForm";
import { SpoilerProgressSettings } from "@/features/account/SpoilerProgressSettings";
import { mcuCatalog } from "@/data/mcuCatalog";
import { characters } from "@/repositories/characterRepository";

export const metadata: Metadata = { title: "Mi cuenta — NEXUS", robots: { index: false, follow: false } };

export default function AccountPage() {
  return <main className="account-page" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <GlobalNavigation context="MI CUENTA" />
    <div className="account-layout">
      <header className="account-heading">
        <p className="eyebrow"><span /> TU ESPACIO EN NEXUS</p>
        <h1>MI <em>CUENTA</em></h1>
        <p>Tu recorrido por el universo Marvel, siempre contigo.</p>
        <div className="account-heading-note"><span aria-hidden="true">↗</span><p>Marca lo que has visto.<br />Continúa desde cualquier dispositivo.</p></div>
      </header>
      <AccountForm><SpoilerProgressSettings
        titles={mcuCatalog.map(({ slug, title, type }) => ({ slug, title, type }))}
        characters={characters.map(({ id, name, appearances }) => ({ id, name, titleIds: appearances.map(({ titleId }) => titleId) }))}
      /></AccountForm>
    </div>
  </main>;
}
