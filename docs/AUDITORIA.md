# Auditoría del código — NEXUS / Guía Marvel

> Proyecto: `marvel-nexus` v0.1.0 · Next.js (App Router) + TypeScript + Supabase
> Fecha: 23 de septiembre de 2026
> Rama evaluada: `feature/documentandoCodigo`

---

## 1. Resumen ejecutivo

NEXUS es una guía editorial en español del universo Marvel con calidad muy por encima
de la media para un proyecto fan. El código está bien tipado, la arquitectura por capas
es limpia, el sistema de spoilers y progreso está cuidadosamente diseñado y existe una
estrategia de pruebas real (unit + migraciones con PGlite + e2e con Playwright).

La auditoría encuentra pocos defectos críticos. La mayoría de recomendaciones son de
**evolución**: simplificar empalmes heredados (CSS global, páginas monofichero), mover la
persistencia actual de `localStorage` a la cuenta cuando es posible, añadir índice de
búsqueda en servidor, y abrir horizontes de producto (ranking comunitario real, IA
generativa de guía, PWA, watchlist, modo oscuro, i18n).

Puntuación por áreas (1–10):

| Área | Nota | Comentario |
| --- | --- | --- |
| Arquitectura y organización | 9 | Capas `config / data / types / repositories / services / features / hooks` muy coherentes. |
| Tipado y seguridad | 9 | `strict: true`, validación de claves en build, RLS fuerte probada en PGlite. |
| Rendimiento | 8 | Páginas estáticas, `Image` optimizada, prefetch OK; dependencias pesadas (three/gsap) sin cargar de forma perezosa. |
| SEO y accesibilidad | 7 | Metadata, sitemap y JSON-LD excelentes; HTML muy comprimido en una línea y contraste/focus mejorables. |
| Mantenibilidad | 7 | Estilos `@import` globales y JSX denso en una línea dificultan el trabajo futuro. |
| Estado y persistencia | 8 | Stores con `useSyncExternalStore` bien diseñados; `localStorage` duplica estado que Supabase ya persiste. |
| Testing | 9 | Contratos unit, migraciones sobre Postgres real en memoria y e2e con mocks de Supabase. |
| Seguridad de datos | 9 | Consent Mode v2, sanitización de PII, proxy de imágenes con validación de hostname. |

---

## 2. Fortalezas (lo que está bien hecho)

1. **Separación de responsabilidades impecable**:
   - `repositories/` aíslan el acceso a datos; `features/` encapsulan UI por dominio
     (`home`, `characters`, `titles`, `search`, `account`, `spoilers`…).
   - `config/`, `constants/` y `types/` concentran la configuración y los contratos.
   - Referencias: `config/site.ts`, `repositories/contentRepository.ts`, `features/characters/directory/`.

2. **Sistema de spoilers robusto y seguro por diseño** (`docs/spoiler-progress.md`):
   - `canRevealSpoiler` + `protectContent` (`services/progress/spoilerPolicy.ts`) nunca
     parciales: se sustituye el contenido completo por un reemplazo neutro.
   - Fail-closed: sin `ready`, sin JS o con error, nada protegido se renderiza ni se descarga
     (verificado en `tests/e2e/account.spec.ts`, líneas 233–255).
   - Contenido no revisado (`UNREVIEWED_SPOILER`) nunca es público por defecto.

3. **Seguridad real**:
   - RLS forzada con policies de "solo propietario" en todas las tablas
     (`supabase/migrations/*.sql`) y verificación de denegación en los tests PGlite.
   - `assertPublicSupabaseKey` (`config/supabaseEnvironment.ts`) y chequeo en `next.config.ts`
     rompen el build si se intenta empaquetar una clave privilegiada en `NEXT_PUBLIC_*`.
   - PII sanitizado en analytics (`safeText`/`safeSearchTerm`), YouTube
     `youtube-nocookie.com`, proxy de imágenes que valida hostnames
     (`app/api/title-image/route.ts:12`).

4. **Calidad de datos garantizada en build**:
   - `npm run build` ejecuta `validate:content` + `audit:content`; el build falla si hay
     slugs duplicados, enlaces rotos, requisitos de spoiler inválidos o relaciones rotas.

5. **Estrategia de tests inusual y valiosa**:
   - Los tests de migración ejecutan el SQL real contra **PGlite** (Postgres en memoria)
     y verifican RLS, constraints y cascadas, no solo que "compile".

6. **Degradación elegante en todos los servicios externos**:
   - RSS con fallback estático (`newsFeedService.ts`), audio y analytics que nunca rompen la
     UI, stores que revierten a estado confirmado ante escrituras fallidas.

---

## 3. Áreas de mejora

Ordenadas por prioridad. Cada ítem indica *qué*, *dónde* y *cómo*.

### 3.1 Prioridad alta

#### H1. Mover persistencia de `localStorage` a la cuenta de Supabase
- **Dónde**: `useMovieProgress.ts`, `usePersistentStringSet.ts` (`hooks/`), `constants/titleDirectory.ts` (clave `TITLE_PROGRESS_STORAGE_KEY`), favoritos en cuenta.
- **Problema**: el progreso de "títulos vistos" y la preferencia `allowSpoilers` viven en
  `localStorage` cuando el usuario tiene cuenta. Hoy solo `movie_progress` por personaje y
  `character_favorites` están en Supabase.
- **Cómo**: añadir tabla `title_progress (user_id, title_id, watched_at)` con RLS idéntica a
  `movie_progress`, replicar el patrón `MovieProgressStore` -> `TitleProgressStore`, y verter
  valores locales a remoto en el primer login (migración de datos). Esto habilita multi-dispositivo.

#### H2. Refactorizar estilos: salir del `@import` global monolítico
- **Dónde**: `app/globals.css` y `styles/*.css` (base, navigation, responsive, legal…).
- **Problema**: toda la UI se resuelve por cascada de `@import` y selectores globales
  (páginas con clases largas en una línea). El CSS crece y no hay aislamiento ni *scoping*;
  modificar una regla puede romper otra pantalla sin test que lo detecte.
- **Cómo**: migrar gradualmente a CSS Modules (`*.module.css`) por feature, empezando por
  `features/*/styles`, o a `tailwind`/`vanilla-extract` si se quiere diseño-sistema.
  Mantener `globals.css` solo para tokens (colores, tipografías) y resets.

#### H3. Reducir densidad del JSX (legibilidad y diff)
- **Dónde**: `app/personajes/page.tsx`, `app/titulos/page.tsx`, `app/page.tsx`,
  `features/home/components/*`, entre otros; el historial reciente ya contiene commits de
  retoques de línea que indican fricción.
- **Problema**: secciones enteras del layout están en una sola línea (p. ej.
  `app/personajes/page.tsx:21`), lo que dificulta la legibilidad, el diff y el debugging.
- **Cómo**: formatear con `prettier --print-width 100` y `tabWidth: 2`, y traer un
  `.prettierrc.yml` al repo (hoy no existe). Añadir `lint-staged` + `husky` para que se
  apliquen antes de cada commit.

#### H4. Vendor de librerías pesadas con carga perezosa
- **Dónde**: `package.json` (`gsap`, `three`), `utils/characterMotion.ts`, `useMotionEffects.ts`.
- **Problema**: `three` (~600 KB) y `gsap` están como dependencias aunque los efectos actuales
  son IntersectionObserver + CSS custom props en `requestAnimationFrame`
  (`useMotionEffects.ts`).
- **Cómo**: si se usan de verdad (¿portales 3D futuros?), cargarlas con `next/dynamic`. Si no,
  eliminarlas de `dependencies`. Idem revisar `sharp` (¿se usa solo en scripts de build?).

### 3.2 Prioridad media

#### M1. `Home` y páginas índice duplican bootstrapping
- **Dónde**: `app/page.tsx:30`, `app/personajes/page.tsx:16`, `app/titulos/page.tsx:31`.
- **Problema**: `<MotionEffects/>`, `<GlobalNavigation/>`, clases `mcu-home/characters-index`
  y custom props `--accent`/`--accent-2` se repiten página a página.
- **Cómo**: crear un layout compartido `app/(marketing)/layout.tsx` (o un componente
  `EditorialShell`) que centralice `MotionEffects` + `GlobalNavigation` + `skip-link`.

#### M2. Índice de búsqueda en cliente ↔ contenido que crece
- **Dónde**: `services/searchService.ts` (índice construido en build), `features/search`.
- **Problema**: hoy la búsqueda es 100 % cliente (`searchIndex` en runtime). Con 70+
  personajes, ~90 títulos y 6 rutas aún es aceptable, pero el coste de parsear ese índice
  crecerá con cada título o personaje nuevo.
- **Cómo**: exponer `app/api/search/route.ts` que devuelva respuestas ya filtradas y cacheadas
  (`Cache-Control: stale-while-revalidate`), manteniendo el mismo `searchService` como núcleo;
  el cliente solo dibuja.

#### M3. `sitemap.ts` con `lastModified` fijo
- **Dónde**: `app/sitemap.ts:10` (`new Date("2026-08-31")`).
- **Problema**: la fecha es manual; se queda obsoleta.
- **Cómo**: derivarla de `git log` en build o de `fs.stat` de las fuentes de datos
  (`data/**`), o dejar la fecha de cada `mcuEntities/characters` individualizada.

#### M4. Revisar soporte de pantalla pequeña y contraste en legal/responsive
- **Dónde**: `styles/legal.css`, `styles/responsive.css`, `styles/mobile.css`.
- **Problema**: hay reglas específicas de responsividad fuera de los módulos de los
  componentes (la estrategia H2 ayudará); verificar contraste AA en las etiquetas
  `eyebrow` y texto sobre fondos editoriales oscuros.
- **Cómo**: ejecutar un test de contraste automatizado (Lighthouse CI o pa11y) en el flujo e2e.

### 3.3 Prioridad baja

#### L1. `robots`, `verification` y datos de la marca en una sola fuente
- **Dónde**: `app/layout.tsx` (metadata global), `config/seo.ts`.
- **Cómo**: centralizar `email`, `creator`, `verification` y `category` en `siteConfig`.

#### L2. Tipos duplicados y `types/` con declaraciones casi vacías
- **Dónde**: `types/news.ts` (1 línea), `types/search.ts` (2 líneas), `types/planner.ts`.
- **Cómo**: consolidar en módulos por dominio y re-exportar; o mantenerlos si son *barrels*
  intencionales (documentarlo).

#### L3. Scripts de validación duplican lógica con `repositories/contentRepository.ts`
- **Dónde**: `validation/contentAudit.ts` vs `contentRepository.validateContent()`.
- **Problema**: hay tres validadores (`validateContent`, `validateCharacterSpoilers`,
  `validateProgressRelations`) que recorren estructuras muy cercanas.
- **Cómo**: unificarlos en un único runner en `scripts/` que delegue a cada validador
  y presente el resumen completo (ya lo hace `audit:content`; consolidar la salida de `validate`).

#### L4. `opencode.json` de herramienta en el repo
- **Dónde**: raíz.
- **Problema**: configuración personal de la herramienta de desarrollo versionada por error.
- **Cómo**: añadir `opencode.json` a `.gitignore` o mantener solo `opencode.backup.json` como ejemplo.

---

## 4. Nuevas funcionalidades propuestas

Hoja de ruta priorizada. Cada idea incluye el *porqué* y la *aproximación técnica*.

### P0 — Camino de valor inmediato

| # | Funcionalidad | Aproximación técnica |
| --- | --- | --- |
| 1 | **Watchlist “Siguiente a ver” por cuenta** | Combinar `movie_progress` + título visto + `getNextWatch` (`services/progress/nextWatch.ts`) y persistirlo en `title_progress` (ver H1). Sección “CONTINUAR” en Home y en `/cuenta`. |
| 2 | **Sincronizar progreso multi-dispositivo** | Tabla `title_progress` remota + estrategia de 2 vías en el login (ver H1). Los favoritos ya lo hacen; falta títulos y preferencia `avoid_spoilers` (ya se guarda en `user_metadata`, solo falta aplicarla en `buildSpoilerProgress` — revisar si ya se lee). |
| 3 | **Exportar progreso a Google Calendar completo** | Ya existe `services/googleCalendarService.ts`; exponerlo también desde `/rutas` y desde el dossier de cada título, no solo del planificador. |

### P1 — Funcionalidad de producto

| # | Funcionalidad | Aproximación técnica |
| --- | --- | --- |
| 4 | **Ranking comunitario real con agregados** | Reutilizar `character_favorites` como voto y añadir RPC `top_characters()` tipo `SECURITY DEFINER` (patrón `get_character_favorites`) para exponer solo agregados; sección en Home “TOP DE LA COMUNIDAD”. |
| 5 | **Modo oscuro / tema editorial** | Tokenizar colores en CSS custom props en `--accent` (ya existe el patrón con `--accent-2`), `prefers-color-scheme` + toggle persistido en cuenta y localStorage. |
| 6 | **PWA (instalable + offline)** | `manifest.webmanifest`, Service Worker que precachee rutas estáticas y el feed fallback; Next soporta `next-pwa` o config manual. El contenido editorial es estático, ideal para offline. |
| 7 | **Mapa de conexiones entre personajes** | Hay `CharacterConnections` y datos de conexiones; dibujar un grafo interactivo (canvas/SVG, sin `three` si se puede) común a `docs/#` con los títulos que conectan. |
| 8 | **Feed de noticias por título/universo** | El RSS ya trae 6 ítems; guardar categoría/imagen (`newsFeedService` normaliza pocos campos) y permitir filtrar el feed desde `/universos/[slug]`. |

### P2 — Diferenciadores editoriales

| # | Funcionalidad | Aproximación técnica |
| --- | --- | --- |
| 9 | **Línea de tiempo visual interactiva (“Incursiones”)** | Pasos de `viewingRoutes.ts` ya tienen orden; un componente tipo timeline vertical con scroll-snap y marcadores de saga por obra. |
| 10 | **Modo “Guía doblada / modos de visión”** | `useViewMode` (ya existe en `TitleDirectory`), extender el mismo patrón a personajes (grid/lista/interactivo). |
| 11 | **Notificaciones de estrenos (títulos `upcoming.ts`)** | `data/titles/upcoming.ts` ya existe; hook `useReleaseAlerts` con suscripción opcional por correo (Supabase Auth maglink) o Web Push. |
| 12 | **Analíticas de recorrido (funnel) en Analytics** | `trackRouteView`, `trackPlannerPlanGenerated` ya existen; añadir un funil “home → personaje → título → ruta” con `trackEvent({ event: "funnel_step", ... })`. |
| 13 | **i18n (EN)** | El contenido es literal puro (`data/**` con strings "es"): preparar `messages/` y un `LanguageProvider`; el auditor incluye la estructura para hacerlo incremental (empezando por metadata y navegación). |

### P3 — Backlog técnico (deuda a largo plazo)

| # | Funcionalidad |
| --- | --- |
| 14 | Migrar a contenido headless (MDX/Markdown) para que no-editoriales añadan fichas sin tocar TS. |
| 15 | Generar OG-images por personaje/título desde plantilla parametrizada (hoy hay `createSocialImage`, unificar el estilo). |
| 16 | End-to-end con usuarios reales en Supabase (hoy los e2e mapean la API remota; añadir un set con `testcontainers`/Supabase local). |

---

## 5. Conclusión

El proyecto está en un estado notablemente sano. Las debilidades detectadas son de
**evolución y consistencia**, no de corrección urgente. Las tres acciones con mayor
retorno serían:

1. **H1 (persistencia remota completa)** — habilita multi-dispositivo y Watchlist, dos
   funcionalidades pedidas por cualquier usuario de una guía de visionado.
2. **H2 (CSS modular)** — el mayor ahorro de dolor futuro en un proyecto con tantas pantallas.
3. **P1-4 (ranking comunitario real)** — cierra el ciclo "voto → agregado → ranking" con el
   patrón de seguridad ya probado en `get_character_favorites`.