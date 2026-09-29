import { MotionEffects } from "@/components/common/MotionEffects";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";

/** Paleta editorial por defecto. Casi todas las secciones comparten estos dos verdes. */
export const DEFAULT_ACCENT = "#b9d737";
export const DEFAULT_ACCENT_2 = "#4f6b28";

export type EditorialShellProps = {
  children: React.ReactNode;
  /** Clase raíz de la sección, por ejemplo `mcu-home` o `title-profile`. */
  className?: string;
  /** Texto de contexto de la barra de navegación, por ejemplo "ARCHIVO / TÍTULOS". */
  context?: string;
  /** La portada usa la variante `topbar` de la navegación en lugar de `profile-nav`. */
  home?: boolean;
  accent?: string;
  accent2?: string;
  /**
   * `MotionEffects` es opt-out porque `/cuenta` y las páginas legales nunca lo
   * montaron. Quitarlo por defecto cambiaría su aspecto, así que la decisión queda
   * explícita en cada página en vez de heredada del refactor.
   */
  motion?: boolean;
  /**
   * Antes de la navegación: overlays a pantalla completa (`CinematicIntro`) y datos
   * estructurados.Va dentro de `<main>` para que el overlay pueda fijarse a la ventana.
   */
  beforeNavigation?: React.ReactNode;
  /** Entre la navegación y el cuerpo: migas de pan, pestañas de sección. */
  afterNavigation?: React.ReactNode;
  /**
   * Custom properties propias de la sección. Se aplican encima de la paleta, así que
   * `--accent` y `--accent-2` se pueden dejar sin repetir aquí.
   */
  style?: React.CSSProperties;
};

/**
 * Envoltura editorial compartida por todas las secciones.
 *
 * Antes, cada página repetía a mano `<MotionEffects/>`, `<GlobalNavigation/>`, la clase
 * raíz y las custom properties `--accent`/`--accent-2`. Eso era la causa de que dos
 * secciones se desincronizasen sin que nadie lo notara. Aquí queda en un único sitio y
 * las páginas solo aportan lo que de verdad les es propio: su clase, su paleta y su
 * contenido.
 *
 * El resto de atributos se pasan a `<main>`: la ficha de personaje, por ejemplo, necesita
 * `data-motion` para elegir su firma de animación.
 */
export function EditorialShell({
  children,
  className,
  context,
  home = false,
  accent = DEFAULT_ACCENT,
  accent2 = DEFAULT_ACCENT_2,
  motion = true,
  beforeNavigation,
  afterNavigation,
  style,
  ...rest
}: EditorialShellProps & Record<string, unknown>) {
  return (
    <main
      {...rest}
      className={className}
      style={
        {
          "--accent": accent,
          "--accent-2": accent2,
          ...style,
        } as React.CSSProperties
      }
    >
      {beforeNavigation}
      {/* Infraestructura visual persistente: animaciones de scroll y navegación. */}
      {motion && <MotionEffects />}
      <GlobalNavigation home={home} context={context} />
      {afterNavigation}
      {children}
    </main>
  );
}
