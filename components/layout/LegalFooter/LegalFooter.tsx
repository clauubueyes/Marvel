import Link from "next/link";
import { CookieSettingsButton } from "./CookieSettingsButton";

export function LegalFooter() {
  return <footer className="legal-footer">
    <div><strong>PLANIFICADOR DE VISIONADO</strong><p>Organiza películas y series y, con tu permiso, crea un calendario secundario en Google Calendar.</p></div>
    <nav aria-label="Información legal"><Link href="/cuenta">MI CUENTA</Link><Link href="/privacidad">PRIVACIDAD</Link><CookieSettingsButton /><Link href="/terminos">CONDICIONES DE USO</Link><a href="mailto:clauubyy@gmail.com" target="_blank" rel="noopener noreferrer">CONTACTO</a></nav>
    <small>Proyecto fan independiente. No afiliado a Marvel Entertainment, Disney ni Google.</small>
  </footer>;
}
