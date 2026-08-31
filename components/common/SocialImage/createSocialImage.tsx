import { ImageResponse } from "next/og";

/** Tamaño recomendado por Open Graph. Se aplica a todas las imágenes al compartir. */
export const socialImageSize = { width: 1200, height: 630 };

interface SocialImageOptions {
  /** Texto pequeño superior que identifica el tipo de contenido. */
  kicker: string;
  /** Titular principal de la tarjeta. */
  title: string;
  /** Resumen que aparece debajo del titular. */
  subtitle: string;
  /** Color editorial usado en el círculo, el kicker y el isotipo. */
  accent?: string;
}

/**
 * Genera la tarjeta que se muestra al compartir una página en redes sociales.
 * Los estilos son inline porque `ImageResponse` renderiza fuera del documento
 * HTML y no consume las hojas CSS de la aplicación.
 */
export function createSocialImage({
  kicker,
  title,
  subtitle,
  accent = "#b9d737",
}: SocialImageOptions) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "65px 75px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "#edf1e5",
        background: "#080b07",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Círculos de fondo: aportan el motivo orbital con el color del contenido. */}
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          right: -130,
          top: -180,
          border: `2px solid ${accent}`,
          borderRadius: "50%",
          opacity: 0.35,
          boxShadow: `0 0 0 70px ${accent}18, 0 0 0 140px ${accent}0d`,
        }}
      />

      {/* Kicker superior: equivale al eyebrow utilizado dentro de la web. */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 18, letterSpacing: 4, color: accent }}>
        <span style={{ width: 45, height: 4, background: accent }} />
        {kicker}
      </div>

      {/* Contenido central. Los títulos largos reducen su tamaño automáticamente. */}
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <div style={{ fontSize: title.length > 32 ? 70 : 92, lineHeight: 0.92, fontWeight: 900, textTransform: "uppercase", letterSpacing: -3 }}>
          {title}
        </div>
        <div style={{ maxWidth: 800, marginTop: 28, color: "#aab3a1", fontSize: 22, lineHeight: 1.45 }}>
          {subtitle}
        </div>
      </div>

      {/* Firma NEXUS situada en la esquina inferior izquierda. */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 27, fontWeight: 900, letterSpacing: 3 }}>
        <span style={{ width: 42, height: 48, display: "flex", alignItems: "center", justifyContent: "center", color: "white", background: accent }}>
          N
        </span>
        NEXUS
      </div>
    </div>,
    socialImageSize,
  );
}
