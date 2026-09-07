import Link from "next/link";

export function SpoilerNotice() {
  return <div><p>🔒 Contenido bloqueado por spoilers</p><p>Continúa viendo el UCM para desbloquear esta parte.</p><Link href="/cuenta#spoilers">ACTUALIZAR MI PROGRESO ↗</Link></div>;
}
