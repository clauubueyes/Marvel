import type { MCUEntity } from "@/types/entity";

export function EntityExplanation({ entity }: { entity: MCUEntity }) {
  return <section className="entity-explanation profile-section"><div><p className="section-label">01 / CONTEXTO</p><h2>QUÉ<br /><em>SIGNIFICA</em></h2></div><article><p>{entity.description}</p><aside><b>{entity.status}</b><span>{entity.status === "CONFIRMADO EN PANTALLA" ? "Información mostrada o expresada directamente en las producciones relacionadas." : "Síntesis NEXUS que conecta hechos mostrados sin presentarla como confirmación futura."}</span></aside></article></section>;
}
