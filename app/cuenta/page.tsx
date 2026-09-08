import type { Metadata } from "next";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { AccountForm } from "@/features/account/AccountForm";
import { SpoilerProgressSettings } from "@/features/account/SpoilerProgressSettings";

export const metadata: Metadata = { title: "Mi cuenta — NEXUS", robots: { index: false, follow: false } };

export default function AccountPage() {
  return <main className="account-page" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <GlobalNavigation context="MI CUENTA" />
    <div className="account-layout">
      <header className="account-heading">
        <h1>MI <em>CUENTA</em></h1>
        <p>Tu cuenta, tu progreso y cómo quieres explorar Nexus.</p>
      </header>
      <AccountForm><SpoilerProgressSettings /></AccountForm>
    </div>
  </main>;
}
