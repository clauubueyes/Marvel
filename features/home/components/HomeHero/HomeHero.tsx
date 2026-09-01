export function HomeHero() {
  return (
    <section className="doom-hero" id="inicio">
      <div className="doom-hero-image" aria-hidden="true" />
      <div className="doom-hero-grid" aria-hidden="true" />
      <div className="doom-hero-copy">
        <p className="eyebrow">
          <span /> MARVEL STUDIOS · GUÍA SIN CÓMICS
        </p>
        <h1>
          ANTES DE
          <br />
          <em>DOOMSDAY</em>
        </h1>
        <p className="doom-deck">
          Todo lo que el MCU ya te ha contado para entender a Victor von Doom, el multiverso y la colisión que viene.
        </p>
        <div className="hero-actions">
          <a className="primary" href="#doom">
            EMPEZAR DESDE CERO <b>↓</b>
          </a>
          <a className="ghost-action" href="#cronologia">
            VER TODO EL MCU
          </a>
        </div>
      </div>
      <div className="doom-hero-fact">
        <span>OBJETIVO</span>
        <b>06 TÍTULOS</b>
        <p>Una ruta directa. Sin relleno. Solo películas y series del MCU.</p>
      </div>
      <div className="ticker">
        <span>MULTIVERSO</span>
        <b>✦</b>
        <span>INCURSIONES</span>
        <b>✦</b>
        <span>VARIANTES</span>
        <b>✦</b>
        <span>VICTOR VON DOOM</span>
      </div>
    </section>
  );
}