import type { Metadata } from "next";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { AccountForm } from "@/features/account/AccountForm";

export const metadata: Metadata = { title: "Mi cuenta — NEXUS", robots: { index: false, follow: false } };

export default function AccountPage() {
  return <main className="titles-index" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <GlobalNavigation context="MI CUENTA" />
    <section className="titles-index-hero"><p className="eyebrow">NEXUS</p><h1>MI CUENTA</h1></section>
    <AccountForm />
  </main>;
}
