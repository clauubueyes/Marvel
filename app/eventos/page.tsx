import type { Metadata } from "next";
import { EntityDirectory } from "@/components/EntityDirectory";
import { events } from "@/lib/mcuEntities";

export const metadata: Metadata = { title: "Acontecimientos del MCU — NEXUS", description: "Los sucesos que transformaron y conectaron la historia del universo audiovisual Marvel." };
export default function EventsPage() { return <EntityDirectory entities={events} eyebrow="ACONTECIMIENTOS DEL MCU" title="MOMENTOS QUE" outline="LO CAMBIAN TODO" description="De Nueva York a las incursiones: entiende qué ocurrió, qué provocó y dónde continúa cada acontecimiento." />; }
