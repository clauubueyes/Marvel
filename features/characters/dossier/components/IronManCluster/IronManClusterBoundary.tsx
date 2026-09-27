"use client";

import dynamic from "next/dynamic";

const IronManCluster = dynamic(
  () =>
    import("@/features/characters/dossier/components/IronManCluster/IronManCluster").then(
      (m) => m.IronManCluster,
    ),
  { ssr: false },
);

export function IronManClusterBoundary() {
  return <IronManCluster />;
}
