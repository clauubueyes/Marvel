import { createPageMetadata } from "@/config/seo";
import { EntityDirectory } from "@/features/entities/directory";
import { events } from "@/data/mcuEntities";

export const metadata = createPageMetadata({ title: "Acontecimientos del MCU — NEXUS", description: "Los sucesos que transformaron y conectaron la historia del universo audiovisual Marvel.", path: "/eventos" });
export default function EventsPage() { return <EntityDirectory entities={events} eyebrow="ACONTECIMIENTOS DEL MCU" title="MOMENTOS QUE" outline="LO CAMBIAN TODO" description="De Nueva York a las incursiones: entiende qué ocurrió, qué provocó y dónde continúa cada acontecimiento." />; }
