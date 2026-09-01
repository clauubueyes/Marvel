import { createPageMetadata } from "@/config/seo";
import { EntityDirectory } from "@/features/entities/directory";
import { universes } from "@/data/mcuEntities";
export const metadata = createPageMetadata({ title: "Universos del MCU — NEXUS", description: "Realidades, continuidades y mundos que forman el multiverso audiovisual de Marvel.", path: "/universos" });
export default function UniversesPage() { return <EntityDirectory entities={universes} eyebrow="CARTOGRAFÍA MULTIVERSAL" title="MUNDOS SIN" outline="UNA SOLA FRONTERA" description="Distingue la continuidad principal, las Tierras alternativas y las sagas heredadas que ahora comparten el multiverso." />; }
