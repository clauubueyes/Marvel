import Link from "next/link";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { createPageMetadata } from "@/config/seo";

export const metadata = createPageMetadata({
  title: "Política de privacidad — Planificador de visionado",
  description: "Cómo el planificador de visionado utiliza y protege los datos relacionados con Google Calendar.",
  path: "/privacidad",
});

export default function PrivacyPage() {
  return <main className="legal-page" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <GlobalNavigation context="PRIVACIDAD" />
    <header><p className="eyebrow"><span /> INFORMACIÓN LEGAL</p><h1>POLÍTICA DE<br /><em>PRIVACIDAD</em></h1><p>Última actualización: 31 de agosto de 2026</p></header>
    <article>
      <section><h2>1. Responsable y alcance</h2><p>Esta política describe el tratamiento de datos realizado por el planificador de visionado disponible en NEXUS. Para consultas relacionadas con privacidad puedes escribir a <a href="mailto:clauubyy@gmail.com">clauubyy@gmail.com</a>.</p></section>
      <section><h2>2. Datos locales de la aplicación</h2><p>El progreso de títulos vistos, la selección de contenidos y el identificador del calendario creado se guardan en el almacenamiento local de tu navegador. Estos datos no se envían a un servidor propio y puedes eliminarlos borrando los datos del sitio en tu navegador.</p></section>
      <section><h2>3. Datos de Google Calendar</h2><p>La conexión con Google es opcional. Al autorizarla, la aplicación solicita permiso para crear y administrar un calendario secundario creado por ella. La aplicación utiliza ese permiso exclusivamente para crear, actualizar o eliminar el calendario de planificación y sus eventos.</p><p>La aplicación no solicita acceso general a tu calendario principal, no lee otros calendarios, correos, contactos ni archivos, y no utiliza los datos de Google para publicidad o elaboración de perfiles.</p></section>
      <section><h2>4. Uso y almacenamiento</h2><p>El token de acceso de Google se mantiene temporalmente en la memoria del navegador mientras se realiza la operación solicitada. No se almacena en una base de datos propia. Google conserva los eventos creados dentro de tu cuenta hasta que los elimines desde Google Calendar o mediante la opción «Eliminar de Google» de la aplicación.</p></section>
      <section><h2>5. Cesión de datos</h2><p>No vendemos, alquilamos ni transferimos datos de usuario de Google a terceros. Tampoco permitimos que personas revisen esos datos. La información se usa únicamente para proporcionar la función visible de planificación solicitada por el usuario.</p></section>
      <section><h2>6. Uso limitado de datos de Google</h2><p>El uso de información recibida de las API de Google Workspace cumple la <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">Política de Datos de Usuario de los Servicios API de Google</a>, incluidos sus requisitos de Uso Limitado.</p></section>
      <section><h2>7. Control y revocación</h2><p>Puedes eliminar el calendario desde el planificador o revocar el acceso desde la sección de conexiones de seguridad de tu cuenta de Google. Tras la revocación, la aplicación no podrá realizar nuevas operaciones salvo que vuelvas a autorizarla.</p></section>
      <section><h2>8. Seguridad y cambios</h2><p>Se aplican medidas razonables para limitar el acceso a lo estrictamente necesario. Esta política se actualizará si cambia el modo en que la aplicación utiliza datos. La fecha de revisión aparecerá al comienzo de la página.</p></section>
      <nav><Link href="/">← VOLVER AL INICIO</Link><Link href="/terminos">CONDICIONES DE USO →</Link></nav>
    </article>
  </main>;
}
