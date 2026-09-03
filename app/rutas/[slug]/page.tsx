import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlobalNavigation } from "@/components/layout/GlobalNavigation";
import { MotionEffects } from "@/components/common/MotionEffects";
import { ViewingRouteExperience } from "@/features/viewing-routes";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { AnalyticsView } from "@/features/analytics";
import { createPageMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { formatRouteDuration, getViewingRoute, viewingRoutes } from "@/data/viewingRoutes";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return viewingRoutes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const route = getViewingRoute((await params).slug);
  return route ? createPageMetadata({ title: `${route.name} — Ruta NEXUS`, socialTitle: route.name, description: route.description, path: `/rutas/${route.slug}` }) : { title: "Ruta no encontrada — NEXUS" };
}

export default async function RoutePage({ params }: PageProps) {
  const route = getViewingRoute((await params).slug);
  if (!route) notFound();
  return <main className="route-profile" style={{ "--accent": route.accent, "--accent-2": "#4f6b28" } as React.CSSProperties}>
    <AnalyticsView kind="route" slug={route.slug} name={route.name} />
    <MotionEffects />
    <GlobalNavigation context="RUTA DE VISIONADO" />
    <Breadcrumbs items={[{ label: "RUTAS", href: "/rutas" }, { label: route.name }]} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", url: new URL(`/rutas/${route.slug}`, siteConfig.url).toString(), name: route.name, description: route.description, numberOfItems: route.steps.length, itemListElement: route.steps.map((step, index) => ({ "@type": "ListItem", position: index + 1, url: new URL(`/titulos/${step.titleId}`, siteConfig.url).toString() })) }).replaceAll("<", "\\u003c") }} />
    <section className="route-profile-hero" style={{ "--route-accent": route.accent } as React.CSSProperties}>
      <p className="eyebrow"><span /> {route.kicker}</p><h1>{route.name}</h1><p>{route.description}</p><div><span>{String(route.steps.length).padStart(2, "0")} CAPÍTULOS</span><span>{formatRouteDuration(route.estimatedMinutes)}</span><span>PROGRESO LOCAL</span></div>
    </section>
    <ViewingRouteExperience route={route} />
    <nav className="route-back"><Link href="/rutas">← VER TODAS LAS RUTAS</Link></nav>
  </main>;
}
