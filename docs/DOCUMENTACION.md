# Documentación del código — NEXUS / Guía Marvel

Guía técnica del proyecto `marvel-nexus` (v0.1.0): arquitectura, estructura de
directorios, flujos de datos, seguridad, pruebas y convenciones.

> Para la auditoría y hoja de ruta, ver [`docs/AUDITORIA.md`](AUDITORIA.md).
> Documento sobre Supabase: [`docs/supabase.md`](supabase.md).

---

## 1. Visión general

Experiencia editorial interactiva en español que recorre los personajes y
acontecimientos esenciales del camino hacia _Avengers: Doomsday_.

- **Stack**: Next.js 16 (App Router, RSC) · React · TypeScript (`strict`) · Supabase
  (Auth + Postgres con RLS) · Google News RSS · Google Calendar/OAuth · GA4.
- **Producto**: portada con identidad visual propia, catálogo de personajes y títulos,
  fichas/dossiers, rutas de visionado, planificador, progreso con protección de spoilers,
  favoritos comunitarios, feed editorial y búsqueda.
- **Despliegue**: Vercel (`.vercel/`), guía canónica `https://guia-marvel.vercel.app`.

## 2. Arquitectura

```
┌────────────────────────────────────────────────────────────────────┐
│  app/  (páginas + API routes)                                      │
│   page.tsx · personajes · titulos · rutas · eventos · universos ·  │
│   equipos · buscar · cuenta · api/news · api/title-image · ...     │
└───────────────┬────────────────────────────────────────────────────┘
                │ importa
┌───────────────▼────────────────────────────────────────────────────┐
│  features/  (UI por dominio)                                       │
│  home · characters · titles · entities · viewing-routes · search ·│
│  account · spoilers · analytics                                    │
└───────┬──────────────────┬──────────────────┬──────────────────────┘
        │ hooks             │ componentes       │ stores externos
┌───────▼────────┐ ┌────────▼───────┐ ┌─────────▼──────────────────────┐
│ hooks/         │ │ repositories/  │ │ services/                     │
│ use* ...       │ │ characterRepo  │ │  progress/ · favorites/ ·     │
│                │ │ contentRepo    │ │  supabase/ · analytics/ ·     │
│                │ │ movieProgress  │ │  audio/ · news · search ·     │
└────────────────┘ └────────┬───────┘ │  calendar · identity · images ┘
                            │        ┌─ utils/ (funciones puras) ────┐
                    datos de build    │ viewingPlanner · titleImages ·│
┌───────────────────▼───────────────┐ │ contentSlug · text ...        │
│ data/ (fuente de verdad)          │ └───────────────────────────────┘
│ characters/ · titles/ ·           │
│ mcuEntities · mcuCatalog ·        │
│ news · viewingRoutes              │
└────────────────────────────────────┘
```

Reglas de oro:

- **Los datos son estáticos y tipados**: `data/**` + `types/**` son la fuente de verdad;
  el contenido se valida en build (`scripts/validate-content.ts`, `audit-content.ts`).
- **El acceso a la persistencia pasa por `repositories/`**: los `features/` nunca tocan
  Supabase directamente; lo hacen a través de `services/` y stores con
  `useSyncExternalStore`.
- **El cliente no aloja secretos**: solo variables `NEXT_PUBLIC_*` (ver §6).

## 3. Estructura del proyecto

```
app/                     Rutas del App Router y API routes (incl. SEO: sitemap, robots, OG)
components/common/       Breadcrumbs · MotionEffects · SocialImage · SpoilerDisclosure
components/layout/       GlobalNavigation · LegalFooter (+ CookieSettingsButton)
config/                  site · seo · characterSeo · supabaseEnvironment
constants/               uiEvents · titleDirectory · homeCatalog
data/                    Catálogos (characters/, titles/, mcuEntities, mcuCatalog, news, viewingRoutes)
docs/                    Documentación (supabase, spoiler-progress, character-*, AUDITORIA)
features/                Módulos de UI por dominio (cada uno con components/ hooks/ o styles/)
hooks/                   Hooks de estado/persistencia reutilizables
public/                  Assets estáticos (characters/, titles/, cinematic/, editorial/, …)
repositories/            Acceso a datos (character, content, entity, favorites, progress, story images)
scripts/                 CLI de contenido (validate · audit · check-links · localize images)
services/                Lógica de negocio y terceros
supabase/                config.toml + migraciones SQL (RLS)
tests/e2e/               Specs de Playwright
types/                   Contratos de dominio
utils/                   Funciones puras
validation/              Validadores compartidos (contentAudit, characterSpoilers, progressRelations)
styles/                  CSS global/heredado (base, navigation, responsive, …)
```

## 4. Catálogo de rutas

| Ruta                                              | Tipo                         | Origen de datos                                      | Notas                                                        |
| ------------------------------------------------- | ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| `/`                                               | RSC estática                 | `repositories/characterRepository` + `features/home` | Portada: CinematicIntro, DoomsdayGuide, MCUCatalog, preview. |
| `/personajes`                                     | RSC estática                 | `characterRepository`                                | Directorio con filtros (`useCharacterFilters`).              |
| `/personajes/[id]`                                | SSG (`generateStaticParams`) | `contentRepository.getCharacterDossier`              | Dossier: story, spoilers, stats, cronología.                 |
| `/titulos`                                        | RSC + searchParams           | `mcuCatalog` + `data/titles`                         | Directorio con filtros/saga/continuidad/estado.              |
| `/titulos/[slug]`                                 | SSG                          | `contentRepository.getTitleDossier`                  | Dossier con tráiler, post-credits, cast, fuentes.            |
| `/rutas` y `/rutas/[slug]`                        | RSC/SSG                      | `data/viewingRoutes`                                 | Planes de visionado con pasos.                               |
| `/eventos`, `/universos`, `/equipos` (+ `[slug]`) | RSC/SSG                      | `data/mcuEntities` + `entityRepository`              | Páginas de entidades (eventos, universos, equipos).          |
| `/buscar`                                         | RSC                          | `searchService` (cliente)                            | Búsqueda ponderada sobre índice en build.                    |
| `/cuenta`                                         | RSC                          | Supabase Auth                                        | Login/registro, preferencia de spoilers, progreso.           |
| `/privacidad`, `/terminos`                        | Estáticas                    | —                                                    | Legales con consentimiento de cookies.                       |
| `api/news` (GET)                                  | Dinámica                     | `newsFeedService`                                    | RSS Google News + fallback; cache `s-maxage=3600`.           |
| `api/title-image` (GET)                           | Dinámica proxy               | `titleImageService`                                  | Proxy de imágenes IMDb/Wikipedia con validación de host.     |
| `robots.ts`, `sitemap.ts`                         | Generadas                    | `siteConfig` + catálogos                             | SEO global.                                                  |
| `opengraph-image.tsx`                             | Generadas por ruta           | `createSocialImage`                                  | Tarjetas sociales dinámicas.                                 |

## 5. Flujos de datos clave

### 5.1 Progreso de visionado y spoilers

1. `SpoilerProgressProvider` (layout) envuelve todo el árbol y usa `useMovieProgress`.
2. `useMovieProgress`:
   - **Con cuenta** → `MovieProgressStore` (cola optimista con `generation`, drena en serie).
   - **Invitado** → `usePersistentStringSet` (localStorage, eventos multi-tab).
3. `buildSpoilerProgress` combina cuenta + preferencia `avoid_spoilers` →
   `ready / allowSpoilers / watched`.
4. `canRevealSpoiler(requirement, progress)` exige ver TODAS las obras de
   `requirement.allOf`. `protectContent` nunca devuelve contenido parcialmente redactado.
5. `getNextWatch` recomienda solo títulos (nunca eventos) respetando `ready`/`allowSpoilers`.

Archivos: `services/progress/*`, `services/favorites/*`, `hooks/useMovieProgress.ts`,
`hooks/useSpoilerProgress.ts`, `types/spoiler.ts`. Ver `docs/spoiler-progress.md`.

### 5.2 Favoritos (voto comunitario)

1. Repositorio `characterFavoritesRepository` llama al RPC `get_character_favorites()`
   (`SECURITY DEFINER`, `search_path=''`) que expone **solo agregados** (`counts`,
   `favorite` propio), nunca votos individuales.
2. `CharacterFavoritesStore` (store externo) hace toggles optimistas:
   - acierto → confirma y recarga contadores globales;
   - fallo → revierte al estado `confirmed` y exige reconciliación explícita.
3. `useCharacterFavorites` lo expone con `useSyncExternalStore` por contexto.
4. RLS: `user_id = auth.uid()`; único favorito por usuario (`PRIMARY KEY (user_id)`);
   CHECK de `character_id` contra ids reales del catálogo.

Archivos: `repositories/characterFavoritesRepository.ts`,
`services/favorites/characterFavoritesStore.ts`, `hooks/useCharacterFavorites.ts`,
`supabase/migrations/20260906010000_create_character_favorites.sql`. Ver
`docs/character-favorites.md`.

### 5.3 Planificador y Google Calendar

1. `createViewingPlan` (pure) reparte títulos en slots semanales.
2. `useTitleViewingPlanner` expone el estado y `trackPlanner*` de analytics.
3. `addPlanToGoogleCalendar` usa un `eventId` determinista (FNV-1a) para tolerar `409`
   (no duplica eventos), obtiene el token vía `requestGoogleCalendarToken` (stock
   `google.accounts.oauth2`), y el calendario se re-crea con
   `replaceNexusGoogleCalendar`.

Archivos: `utils/viewingPlanner.ts`, `features/titles/planner/*`,
`services/googleCalendarService.ts`, `services/googleIdentityService.ts`,
`hooks/useYouTubeEmbed.ts`.

### 5.4 Feed editorial

`getMarvelNews()` → fetch RSS de Google News (q=Marvel, es) con
`AbortSignal.timeout(5000)` → `fast-xml-parser` → normaliza 6 ítems; ante cualquier error
cae a `fallbackNews` estático con `live:false`. El cliente distingue `live` real vs fallback.

Archivos: `services/newsFeedService.ts`, `app/api/news/route.ts`, `data/news.ts`.

### 5.5 Búsqueda

`searchIndex` se construye en build desde personajes, `mcuCatalog` y `mcuEntities`.
`searchContent` puntúa: exacta=100, prefijo=60, incluye=40, substring del índice=20,
fuzzy (Levenshtein con vector optimizado)=8. Es 100 % cliente (ver auditoría M2).

Archivos: `services/searchService.ts`, `features/search/*`, `utils/text.ts`.

## 6. Seguridad y privacidad

| Tema                   | Implementación                                                                                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claves públicas        | Solo `NEXT_PUBLIC_*` en cliente; `assertPublicSupabaseKey` rechaza `sb_secret_*`/`service_role`/`authenticated`; `next.config.ts` rompe el build si hay clave privilegiada. |
| RLS                    | Todas las tablas con `force row level security`; policies solo-propietario (`auth.uid()`); `revoke` explícitos; las funciones `SECURITY DEFINER` fijan `search_path=''`.    |
| Consentimiento cookies | Google Consent Mode v2: default `denied` con `wait_for_update:500`; `subscribeAnalyticsConsent` multi-tab; solo se habilita `analytics_storage`.                            |
| PII                    | `safeText`/`safeSearchTerm` omiten emails/teléfonos en eventos GA4.                                                                                                         |
| Privacidad multimedia  | YouTube `youtube-nocookie.com` con `origin`; proxy `api/title-image` valida hostname y content-type; User-Agent explícito.                                                  |
| Spoilers               | Fail-closed (sin `ready`/sin JS/error → contenido protegido nunca renderizado ni descargado).                                                                               |
| Errores                | Todos los servicios de terceros degradan con try/catch sin tocar la UI; stores revierten en fallos de escritura.                                                            |

## 7. Estrategia de pruebas

**Tests unitarios / de contrato** — `npm test` (node:test vía tsx):

- `services/analytics/index.test.ts`: cola gtag y Consent Mode idempotente.
- `services/progress/*.test.ts`: `movieProgressStore`, `nextWatch`, `spoilerPolicy`,
  `spoilerProgressState`, `progressRelations`, `supabaseEnvironment` y **migraciones SQL
  contra PGlite** (roles anon/authenticated, RLS, constraints, cascadas).
- `services/favorites/*.test.ts`: store de favoritos (rollback, aislamiento) y migración.

**E2E — Playwright** — `npx playwright test` (workers:1, puerto 3100, `supabase.co`
mockeado en memoria):

- `account.spec.ts`: login, preferencia de spoilers, **fails-closed sin JS**.
- `spoilers-catalog.spec.ts` / `spoilers-titles-routes.spec.ts`: solo se revelan/descargan
  actos vistos.
- `favorites.spec.ts`: votos, aislamiento entre cuentas, rollback.
- `audio.spec.ts`: `AudioContext` lazy y respeta `soundEnabled`.
- `story-images.spec.ts`: comparación de píxeles de trailers/imágenes.

## 8. Comandos

```bash
npm run dev              # desarrollo (http://localhost:3000)
npm run build            # validate:content + audit:content + next build
npm run lint             # eslint .
npm test                 # tests unitarios (tsx --test)
npm run test:e2e         # Playwright
npm run validate:content # validación de datos
npm run audit:content    # auditoría/coherencia del contenido
npm run audit:links      # comprueba enlaces del contenido
npm run assets:localize  # descarga/optimiza imágenes estáticas
```

Variables de entorno (ver `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (nunca secret/service_role),
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

## 9. Convenciones de desarrollo

- **Idioma**: el contenido editorial y las UI están en español; los mensajes de código
  (IDs, slugs, clases) en inglés.
- **Slugs**: generados con `createContentSlug` (NFD + strip + guiones); la llave maestra es
  el slug (`contentRepository.titlesBySlug`).
- **Estado**: `repositories` para acceso a datos, stores `useSyncExternalStore` para estado
  compartido, `utils` puros sin efectos.
- **Spoilers**: cualquier contenido sensible debe declarar su `SpoilerRequirement`
  (`{ allOf: [...] }`) y pasar por `canRevealSpoiler`/`protectContent`. Nunca revelar por
  defecto contenido no revisado (`UNREVIEWED_SPOILER`).
- **Validación**: cualquier nuevo dato en `data/**` debe pasar `npm run validate:content`
  y `npm run audit:content` antes de un commit (la build los ejecuta).
- **Imágenes**: se sirven desde `public/` como `.webp` (localizadas con
  `assets:localize`) y se referencian vía `getScreenPortrait`, `getTitleImage` o rutas de
  `public`; el `next.config.ts` limita los orígenes remotos permitidos.
