import type { Metadata } from "next";
import { EntityDirectory } from "@/components/EntityDirectory";
import { universes } from "@/lib/mcuEntities";
export const metadata: Metadata = { title: "Universos del MCU — NEXUS", description: "Realidades, continuidades y mundos que forman el multiverso audiovisual de Marvel.", alternates: { canonical: "/universos" } };
export default function UniversesPage() { return <EntityDirectory entities={universes} eyebrow="CARTOGRAFÍA MULTIVERSAL" title="MUNDOS SIN" outline="UNA SOLA FRONTERA" description="Distingue la continuidad principal, las Tierras alternativas y las sagas heredadas que ahora comparten el multiverso." />; }
