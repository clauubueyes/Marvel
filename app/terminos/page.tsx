import type { Metadata } from "next";
import Link from "next/link";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";

export const metadata: Metadata = {
  title: "Condiciones de uso — Planificador de visionado",
  description: "Condiciones aplicables al uso de NEXUS y su planificador de visionado.",
  alternates: { canonical: "/terminos" },
};

export default function TermsPage() {
  return <main className="legal-page" style={{ "--accent": "#b9d737", "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <GlobalNavigation context="CONDICIONES" />
    <header><p className="eyebrow"><span /> INFORMACIÓN LEGAL</p><h1>CONDICIONES<br /><em>DE USO</em></h1><p>Última actualización: 31 de agosto de 2026</p></header>
    <article>
      <section><h2>1. Aceptación</h2><p>Al utilizar NEXUS y su planificador aceptas estas condiciones. Si no estás de acuerdo, no conectes tu cuenta de Google ni utilices las funciones de planificación.</p></section>
      <section><h2>2. Descripción del servicio</h2><p>La aplicación ofrece información editorial sobre producciones audiovisuales y permite preparar un plan personal de visionado. Opcionalmente, puede crear un calendario secundario en Google Calendar o generar un archivo compatible con aplicaciones de calendario.</p></section>
      <section><h2>3. Uso permitido</h2><p>Debes utilizar el servicio de forma lícita y no intentar interferir en su funcionamiento, acceder a sistemas sin autorización, automatizar solicitudes abusivas o emplearlo para perjudicar a otras personas.</p></section>
      <section><h2>4. Cuenta y autorización de Google</h2><p>Eres responsable de la cuenta de Google utilizada y de revisar los permisos concedidos. Puedes revocar el acceso en cualquier momento. NEXUS solo actúa sobre el calendario secundario creado por la propia aplicación.</p></section>
      <section><h2>5. Disponibilidad y exactitud</h2><p>Las duraciones de episodios señaladas como estimadas son aproximaciones y pueden variar. No se garantiza que el servicio esté siempre disponible ni que toda la información editorial carezca de errores. Las funciones pueden modificarse para mejorar la aplicación o cumplir requisitos técnicos y legales.</p></section>
      <section><h2>6. Propiedad intelectual</h2><p>NEXUS es un proyecto fan independiente y no está afiliado, patrocinado ni respaldado por Marvel Entertainment, The Walt Disney Company o Google. Los nombres, personajes, imágenes y marcas de terceros pertenecen a sus respectivos titulares.</p></section>
      <section><h2>7. Responsabilidad</h2><p>El servicio se proporciona tal como está. En la medida permitida por la legislación aplicable, no se asume responsabilidad por interrupciones, pérdida de configuraciones locales o decisiones tomadas a partir de estimaciones de planificación.</p></section>
      <section><h2>8. Contacto y cambios</h2><p>Las condiciones pueden actualizarse cuando cambien las funciones o requisitos aplicables. Para consultas puedes escribir a <a href="mailto:clauubyy@gmail.com">clauubyy@gmail.com</a>.</p></section>
      <nav><Link href="/">← VOLVER AL INICIO</Link><Link href="/privacidad">POLÍTICA DE PRIVACIDAD →</Link></nav>
    </article>
  </main>;
}
