import type { Metadata } from "next";
import { EditorialShell } from "@/components/layout/EditorialShell";
import { AccountForm } from "@/features/account/AccountForm";
import { SpoilerProgressSettings } from "@/features/account/SpoilerProgressSettings";

export const metadata: Metadata = {
  title: "Mi cuenta — NEXUS",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <EditorialShell className="account-page" context="MI CUENTA" motion={false}>
      <div className="account-layout">
        <header className="account-heading">
          <h1>
            MI <em>CUENTA</em>
          </h1>
          <p>Tu cuenta, tu progreso y cómo quieres explorar Nexus.</p>
        </header>
        <AccountForm>
          <SpoilerProgressSettings />
        </AccountForm>
      </div>
    </EditorialShell>
  );
}
