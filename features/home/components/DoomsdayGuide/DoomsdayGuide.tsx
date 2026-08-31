import { ViewingRouteExperience } from "@/features/viewing-routes";
import { getViewingRoute } from "@/data/viewingRoutes";

export function DoomsdayGuide() {
  const route = getViewingRoute("camino-a-doomsday");
  return <><section className="doom-primer section" id="doom">
    <div className="section-backdrop" aria-hidden="true">DOOM</div>
    <div className="primer-heading" data-reveal><p className="eyebrow"><span /> ARCHIVO CERO · SIN CÓMICS</p><h2>ENTENDER A<br/><em>DOOM</em></h2></div>
    <div className="primer-copy" data-reveal>
      <p className="primer-lead">No necesitas conocer décadas de viñetas. Para llegar preparado basta con entender tres ideas que el MCU ya ha puesto sobre la mesa.</p>
      <div className="primer-grid">
        <article><b>01</b><h3>El multiverso</h3><p>Son realidades completas, cada una con sus propias versiones de personas y acontecimientos.</p></article>
        <article><b>02</b><h3>Las incursiones</h3><p>Cuando dos universos interfieren demasiado, pueden colisionar. Es el mayor riesgo establecido hasta ahora.</p></article>
        <article><b>03</b><h3>Victor von Doom</h3><p>Es la amenaza confirmada. Su historia concreta en el MCU sigue bajo secreto; aquí separamos hechos de teorías.</p></article>
      </div>
    </div>
    <aside className="truth-card" data-reveal><span>LO CONFIRMADO</span><strong>ROBERT DOWNEY JR.</strong><p>interpreta a Victor von Doom. Compartir actor con Tony Stark no confirma que ambos personajes sean la misma persona.</p></aside>
  </section>{route && <ViewingRouteExperience route={route} compact />}</>;
}
