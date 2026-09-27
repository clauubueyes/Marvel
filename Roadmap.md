# Roadmap de implementación — NEXUS / Guía Marvel

Plan de trabajo ordenado para implementar todas las mejoras y nuevas funcionalidades
detectadas en la auditoría (`docs/AUDITORIA.md`). Cada tarea indica la rama de trabajo,
su prioridad, el esfuerzo estimado y las dependencias.

> **Flujo de trabajo**: cada mejora se desarrolla en una rama `feature/` (PascalCase en
> español, convención del repo) creada desde `development`, y se fusiona de vuelta a
> `development`. La rama `main` es producción y solo recibe `development` en releases.

---

## 1. Convenciones y flujo de trabajo

1. **Base**: `development`. Crear la rama con `git switch development` y
   `git switch -c feature/Nombre`.
2. **Gate por PR** (obligatorio antes de fusionar):
   ```bash
   npm run validate:content
   npm run audit:content
   npm test
   npm run lint
   # + e2e cuando la rama toque comportamiento (npm run test:e2e)
   ```
3. **Condición previa (paso 0)**: ✅ superada. El trabajo de
   `feature/documentandoCodigo` quedó cerrado antes de abrir la primera rama del roadmap.
4. Los cambios de una fase NO dependen de la siguiente; cada fase se puede empezar una
   vez terminadas sus dependencias internas.

### Estado de prioridad

| Símbolo | Significado                                             |
| ------- | ------------------------------------------------------- |
| 🔴      | Prioridad alta (seguridad, base de datos, arquitectura) |
| 🟡      | Prioridad media (producto)                              |
| 🟢      | Prioridad baja / deuda técnica                          |

### Esfuerzo

| Símbolo | Esfuerzo estimado  |
| ------- | ------------------ |
| S       | Menos de 1 jornada |
| M       | 1–3 jornadas       |
| L       | 1–2 semanas        |

---

## 2. FASE 0 — Higiene y cimientos

Objetivo: dejar el repo formateado, sin deuda de configuración y con diffs limpios para
todo lo que venga después. Sin dependencias entre sí; se pueden ejecutar en paralelo.

| #   | Rama                           | Prioridad | Mejora / Detalle                                                                                                                                                                            | Esfuerzo | Estado                                     |
| --- | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------ |
| 1   | `feature/FormatearCodigo`      | 🟢        | Añadir `.prettierrc` (printWidth 100, tabWidth 2) + `husky`/`lint-staged`. Formatear el repo completo (hoy hay JSX denso en una línea, p. ej. `app/personajes/page.tsx:21`). Auditoría: H3. | S        | ✅ Hecho en `90664ff`                      |
| 2   | `feature/LimpiezaRepo`         | 🟢        | `opencode.json` → `.gitignore` (configuración personal versionada por error). Revisar `tsconfig.tsbuildinfo` y restos de `.temp`. Auditoría: L4.                                            | S        | ✅ Hecho en `31d6aa7`                      |
| 3   | `feature/OptimizarGsap`        | 🟡        | Auditar `three`, `gsap`, `sharp`: si se usan, cargar con `next/dynamic`; si no, quitarlas de `dependencies`. Auditoría: H4.                                                                 | M        | ✅ Hecho (rama renombrada)                 |
| 4   | `feature/SitemapDinamico`      | 🟢        | `lastModified` de `app/sitemap.ts:10` derivado de `fs.stat`/`git` en vez de fecha fija. Auditoría: M3.                                                                                      | S        | ✅ Hecho                                   |
| 5   | `feature/CentralizarConfigSeo` | 🟢        | Mover `email`, `creator`, `verification`, `category`, `formatDetection` de `app/layout.tsx` a `siteConfig`. Auditoría: L1.                                                                  | S        | ✅ Hecho                                   |
| 6   | `feature/ConsolidarTipos`      | 🟢        | Unificar `types/news.ts`, `types/search.ts`, `types/planner.ts` (declaraciones casi vacías) en módulos por dominio. Auditoría: L2.                                                          | S        | ✅ Hecho (vía barrels + `types/README.md`) |
| 7   | `feature/UnificarValidadores`  | 🟢        | Consolidar `validateContent` + `validateCharacterSpoilers` + `validateProgressRelations` en un único runner con salida única. Auditoría: L3.                                                | S        | ✅ Hecho en `403f68c`                      |

Notas de la FASE 0 (estado real, no el plan original):

- **#1**: `.prettierrc` y el hook `husky` ya existían. El trabajo real fue normalizar los
  47 ficheros del repo y ampliar `lint-staged` a `.mjs`, `.cjs`, `.yml` y `.yaml`.
- **#2**: además de la config de `opencode` (ya resuelta antes de empezar), se retiró el
  submódulo `ironman-source` del índice, se añadió a `.gitignore` y a las exclusiones de
  ESLint, y se corrigieron 7 errores `react/no-unescaped-entities` preexistentes.
- **#3**: la rama se llamó `feature/OptimizarGsap`. `three` no se usaba y su prototipo 3D
  quedó fuera del repo; `gsap` se carga perezosamente en `StorylineRail` pero se mantiene
  estático en `CharacterStory` para evitar un parpadeo previo; `sharp` se queda en
  `dependencies` porque Next 16 lo necesita en runtime. No se apreció reducción del bundle
  inicial mientras `CharacterStory` importe GSAP estático: queda como medición pendiente.

---

## 3. FASE 1 — Datos y persistencia

Objetivo: bases de datos y sincronización de estado. **Esta fase habilita la fase 3**
(watchlist, notificaciones).

| #   | Rama                                      | Prioridad | Mejora / Detalle                                                                                                                                                                                                                                                         | Esfuerzo | Depende de                            |
| --- | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------- |
| 8   | `feature/ProgresoTitulosMultiDispositivo` | 🔴        | Tabla `title_progress(user_id, title_id, watched_at)` con RLS idéntica a `movie_progress`; migración en `supabase/migrations/`; `TitleProgressStore` replicando el patrón de `MovieProgressStore`; volcado de `localStorage` → cuenta en el primer login. Auditoría: H1. | L        | ✅ Hecho (sin tabla ni store nuevos)  |
| 9   | `feature/AplicarPreferenciaSpoilers`      | 🔴        | Leer `avoid_spoilers` de `auth.users.user_metadata` en `buildSpoilerProgress` (fin-a-fin). Auditoría: P0-2.                                                                                                                                                              | S        | ✅ Ya estaba hecho                    |
| 10  | `feature/RankingComunitarioReal`          | 🟡        | RPC `top_characters()` estilo `get_character_favorites` (`SECURITY DEFINER`, `search_path=''`, solo agregados); sección “TOP DE LA COMUNIDAD” en Home. Auditoría: P1-4.                                                                                                  | M        | ✅ Hecho (reutiliza la RPC existente) |
| 11  | `feature/ExportarCalendario`              | 🟡        | Exponer `addPlanToGoogleCalendar` también desde dossiers de título y rutas, no solo del planificador. Auditoría: P0-3.                                                                                                                                                   | S        | ✅ Hecho                              |

Notas de la FASE 1 (estado real, no el plan original):

- **#8**: no hizo falta ni tabla `title_progress` ni `TitleProgressStore`.
  `movie_progress` ya guarda slugs de títulos en `movie_id` con la misma RLS, así que el
  progreso de una cuenta ya era multi-dispositivo; lo que faltaba era el volcado del
  progreso de invitado. Se implementó en `features/account/importGuestProgress.ts`: solo
  añade títulos que la cuenta no tiene vistos, descarta ids fuera del catálogo y borra
  las claves de invitado únicamente cuando la escritura se confirma
  (`MovieProgressStore.whenSettled`). El catálogo se importa de forma diferida para no
  entrar en el bundle inicial. Invierte la decisión que `docs/supabase.md` documentaba
  como "nunca se importan a cuentas".
- **#9**: ya estaba implementado de punta a punta antes de abrir la fase.
  `AccountForm`/`SpoilerPreference` escriben `avoid_spoilers` con `auth.updateUser`,
  `AccountProvider` lo pasa a `setUser`, `MovieProgressStore` detecta el cambio y
  `buildSpoilerProgress` lo lee. Cubierto por `spoilerProgressState.test.ts`,
  `movieProgressStore.test.ts` y el e2e `account.spec.ts` (registro, login, revelado,
  cambio de preferencia, recarga y fallo de guardado). No requiere código.
- **#10**: no hizo falta una RPC `top_characters()`. `get_character_favorites()` ya
  devuelve exactamente el agregado que necesita el ranking (conteos por personaje, nunca
  `user_id`) y está concedida a `anon` y `authenticated`, así que la sección se puede
  pintar también para visitantes sin cuenta. Añadir una segunda función SQL solo habría
  ampliado la superficie RLS sin aportar datos nuevos. La nueva sección
  `features/home/components/CommunityTop` ordena ese agregado con
  `utils/communityTop.rankCommunityTop`, que descarta personajes sin votos, ignora ids
  fuera del catálogo y desempata por nombre para que el orden sea determinista entre
  renders y dispositivos. La proyección que recibe el componente es mínima
  (id, nombre, alias, color e imagen), no el `Character` entero. Estados cubiertos:
  ranking, sin votos, error con reintento y aislamiento del fallo respecto al resto de
  Home.
- **#11**: la exportación ya no vive solo en el planificador. El nuevo hook
  `features/titles/planner/hooks/useCalendarExport` reutiliza
  `addPlanToGoogleCalendar()` y `createIcsCalendar()` tal cual, de modo que el calendario
  NEXUS sigue siendo el mismo y los eventos se deduplican con el mismo `eventId`. Se
  expone con `CalendarExportActions` en dos sitios: la ficha de un título (solo ese
  título) y la ficha de una ruta (solo los pasos que se están viendo; `DESTINO` se
  excluye porque no genera sesión). La regla de admisión al planificador se extrajo a
  `utils/viewingPlanner.isPlannableTitle` para que las tres superficies apliquen el
  mismo criterio. `TitleHero` sigue siendo un componente de servidor: la exportación
  entra como isla cliente y los `runtime`, que solo existen en `data/titles`, se resuelven
  en la página de ruta y llegan por props. Los botones usan la clase `export-actions`, no
  `calendar-actions`, porque esta última ya está afinada para el planificador.

---

## 4. FASE 2 — Refactor de UI y arquitectura

Objetivo: mantenibilidad de la interfaz y el arranque. Habilita `ModoOscuro` (depende de #13).

| #   | Rama                               | Prioridad | Mejora / Detalle                                                                                                                                                   | Esfuerzo | Depende de |
| --- | ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ---------- |
| 12  | `feature/ShellEditorialCompartido` | 🟡        | Layout `app/(marketing)/layout.tsx` o componente `EditorialShell` que centralice `MotionEffects` + `GlobalNavigation` + `skip-link` + custom props. Auditoría: M1. | M        | —          |
| 13  | `feature/RefactorizarCSS`          | 🔴        | Migrar de `@import` global (`app/globals.css`, `styles/*`) a CSS Modules por feature, dejando en `globals.css` solo tokens/reset. Auditoría: H2.                   | L        | —          |
| 14  | `feature/AccesibilidadContraste`   | 🟡        | Contraste AA en `eyebrow`/fondos editoriales, estados de foco, labels; test automático Lighthouse/pa11y en el flujo e2e. Auditoría: M4.                            | M        | —          |
| 15  | `feature/BusquedaEnServidor`       | 🟡        | `app/api/search/route.ts` cacheable que reutilice `searchService`; el cliente solo dibuja. Auditoría: M2.                                                          | M        | —          |

---

## 5. FASE 3 — Producto core

Objetivo: funcionalidades de valor directo para el usuario. Mayormente paralelizables.

| #   | Rama                             | Prioridad | Mejora / Detalle                                                                                                           | Esfuerzo | Depende de |
| --- | -------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- |
| 16  | `feature/WatchlistSiguienteAVer` | 🔴        | Sección “CONTINUAR / SIGUIENTE A VER” en Home y `/cuenta` usando `getNextWatch` + `title_progress`. Auditoría: P0-1.       | M        | 8          |
| 17  | `feature/ModoOscuro`             | 🟡        | Tokenizar colores en custom props + toggle persistido en cuenta/localStorage (+ `prefers-color-scheme`). Auditoría: P1-5.  | M        | 13         |
| 18  | `feature/PwaInstalable`          | 🟡        | `manifest.webmanifest` + Service Worker con precaché de rutas estáticas y fallback del feed. Auditoría: P1-6.              | M        | —          |
| 19  | `feature/MapaConexiones`         | 🟡        | Grafo interactivo (SVG/canvas) personajes ↔ títulos partiendo de `CharacterConnections`. Auditoría: P1-7.                  | M        | —          |
| 20  | `feature/FeedPorUniverso`        | 🟡        | Filtrar el feed RSS por universo/título en `universos/[slug]`. Auditoría: P1-8.                                            | S        | —          |
| 21  | `feature/TimelineInteractiva`    | 🟢        | Timeline vertical por rutas con scroll-snap y marcadores de saga sobre `viewingRoutes`. Auditoría: P2-9.                   | M        | —          |
| 22  | `feature/ModosVisionPersonajes`  | 🟢        | Extender `useViewMode` del directorio de títulos a personajes (grid/lista/interactivo). Auditoría: P2-10.                  | M        | —          |
| 23  | `feature/NotificacionesEstrenos` | 🟡        | Alertas de `data/titles/upcoming.ts` vía maglink de Supabase Auth o Web Push, con suscripción en cuenta. Auditoría: P2-11. | L        | 8          |
| 24  | `feature/FunnelAnaliticas`       | 🟢        | Funil Home→personaje→título→ruta con `trackEvent` (reutilizar `trackRouteView`, `trackPlanner*`). Auditoría: P2-12.        | S        | —          |

---

## 6. FASE 4 — Social y comunidad

Objetivo: comunidad, participación y compartición. Se apoya en el patrón de RLS/agregados
ya probado en la fase 1.

| #   | Rama                                | Prioridad | Mejora / Detalle                                                                                                   | Esfuerzo | Depende de |
| --- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------ | -------- | ---------- |
| 25  | `feature/ComentariosComunidad`      | 🟡        | Tabla `comments` con RLS, moderación básica (report/ocultar) y carga por expediente.                               | L        | —          |
| 26  | `feature/WatchParties`              | 🟡        | Cuartos con código + sincronización de “visto” en tiempo real con Supabase Realtime.                               | L        | 8          |
| 27  | `feature/TriviasMCU`                | 🟡        | Quizzes sin spoilers reutilizando el motor de progreso (`canRevealSpoiler`) y conteo por cuenta/local.             | M        | —          |
| 28  | `feature/LogrosYEstadisticas`       | 🟢        | Insignias, % completado por saga, heatmap semanal y horas vistas (derivados de `movie_progress`/`title_progress`). | M        | 8          |
| 29  | `feature/RutasPersonalizadas`       | 🟡        | Crear ruta propia (filtros por saga/personaje) y compartirla por URL con hash.                                     | M        | —          |
| 30  | `feature/RecomendacionesConectadas` | 🟢        | “Si te gustó X, mira Y” usando `CharacterConnections` + títulos compartidos.                                       | S        | —          |
| 31  | `feature/OrdenesAlternativas`       | 🟢        | Modo rewatch / órdenes por universo, personaje o estreno real.                                                     | S        | —          |
| 32  | `feature/TarjetasProgresoCompartir` | 🟢        | Social cards “He visto X/90 títulos” con `createSocialImage`.                                                      | S        | —          |

---

## 7. FASE 5 — Contenido y calidad de vida

Objetivo: enriquecer el contenido y la experiencia de ficha sin tocar la persistencia.

| #   | Rama                           | Prioridad | Mejora / Detalle                                                                | Esfuerzo |
| --- | ------------------------------ | --------- | ------------------------------------------------------------------------------- | -------- |
| 33  | `feature/ComparadorPersonajes` | 🟢        | Comparador de stats lado a lado desde el directorio.                            | S        |
| 34  | `feature/MapaMultiverso`       | 🟢        | Visualización de universos/incursiones en SVG.                                  | M        |
| 35  | `feature/CitasYAudioGuia`      | 🟢        | Citas célebres por personaje + modo audio-guía con el `AudioContext` existente. | M        |
| 36  | `feature/ContadorEstrenos`     | 🟢        | Cuenta atrás de estrenos en Home desde `upcoming.ts`.                           | S        |
| 37  | `feature/FiltroPorPoderes`     | 🟢        | Índice invertido sobre `powers`/`affiliations` en el directorio.                | M        |
| 38  | `feature/PreferenciaDoblaje`   | 🟢        | preferencia latino/castellano persistida en `user_metadata`.                    | S        |
| 39  | `feature/NotasPersonales`      | 🟢        | Notas por expediente/ título en la cuenta (tabla `user_notes` con RLS).         | M        |

---

## 8. FASE 6 — Deuda técnica y horizonte

Objetivo: arquitectura a medio plazo. Ideas más invasivas, útiles para escalar contenido.

| #   | Rama                               | Prioridad | Mejora / Detalle                                                                    | Esfuerzo |
| --- | ---------------------------------- | --------- | ----------------------------------------------------------------------------------- | -------- |
| 40  | `feature/ContenidoHeadless`        | 🟢        | Fichas en MDX/Markdown para que no-editoriales añadan contenido sin TS.             | L        |
| 41  | `feature/UnificarImagenesSociales` | 🟢        | OG-images paramétricas con un estilo común (centralizar `createSocialImage`).       | M        |
| 42  | `feature/E2eSupabaseReal`          | 🟡        | Juego e2e contra Supabase real o testcontainers (hoy los e2e mapean la API remota). | L        |
| 43  | `feature/Internacionalizacion`     | 🟢        | i18n EN incremental: metadata/navegación primero, luego contenido.                  | L        |

---

## 9. Dependencias y orden recomendado

```
FASE 0 (#1–7)  ──►  FASE 1 (#8–11)
                        │
                        ├──►  #16 Watchlist ──► #26 WatchParties
                        ├──►  #28 Logros
                        └──►  #23 Notificaciones
FASE 2 (#12–15)  ──►  #13 CSS ──► #17 ModoOscuro
FASE 3 (#16–24) ──► FASE 4 (#25–32) ──► FASE 5 (#33–39)
FASE 6 (#40–43) en paralelo y al final (deuda)
```

Reglas de secuencia:

1. **Fase 0 completa antes de tocar cualquier código** (todas las ramas siguientes salen de un diff limpio).
2. **#8 antes de #16, #26 y #28** (la persistencia remota de títulos es su base).
3. **#13 antes de #17** (los tokens del refactor CSS son el andamiaje del modo oscuro).
4. Las fases 3–5 son paralelizables **entre sí** una vez terminadas sus dependencias de las fases 1–2.
5. La fase 6 se planifica aparte; no bloquea a las demás.

---

## 10. Criterios de “hecho” (Definition of Done por rama)

- ✅ Compatibilidad TS: `npm run lint` sin errores.
- ✅ Contenido: `npm run validate:content` y `npm run audit:content` en verde.
  `validate:content` es el runner único de los tres validadores estructurales
  (`validation/index.ts`): agrupa las incidencias por ámbito y sale con código 1.
  `audit:content` sigue siendo el comando aparte de la auditoría editorial.
- ✅ Tests: `npm test` en verde; e2e si la rama toca comportamiento (`npm run test:e2e`).
- ✅ Seguridad: cualquier dato nuevo en Supabase lleva migración SQL con RLS forzada +
  test PGlite (patrón de `movieProgressMigration.test.ts`).
- ✅ Spoilers: ningún contenido nuevo sensible sin `SpoilerRequirement` y sin pasar por
  `canRevealSpoiler`/`protectContent`.
- ✅ SEO: metadata, canonicals y sitemap actualizados cuando se añade una ruta nueva.
- ✅ Sin regresiones visuales conocidas (revisar con `story-images.spec.ts` si aplica).
- ✅ Merge a `development` y, en release, a `main`.

---

## 11. Resumen rápido

| Fase | Ámbito                   | Ramas  | Esfuerzo total |
| ---- | ------------------------ | ------ | -------------- |
| 0    | Higiene y cimientos      | #1–7   | S              |
| 1    | Datos y persistencia     | #8–11  | M–L            |
| 2    | Refactor UI/arquitectura | #12–15 | M–L            |
| 3    | Producto core            | #16–24 | S–L            |
| 4    | Social y comunidad       | #25–32 | S–L            |
| 5    | Contenido y QoL          | #33–39 | S–M            |
| 6    | Deuda técnica            | #40–43 | M–L            |

**Hoja de ruta inicial sugerida**: #1 → #2 → #8 → #9 → #10 → #16 → #13 → #12 → #17.
