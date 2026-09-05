# Persistencia y cuentas de Nexus

## Arquitectura y alcance

Revisión inicial: no existía `/docs`, configuración Supabase, login de Nexus ni gestor global de estado. El stack instalado es Next.js 16.3.3 (App Router), React 19.2.8 y TypeScript 6.0.3. `app/` contiene rutas públicas, páginas estáticas y las API de noticias e imágenes; `features/` agrupa experiencias y hooks; `repositories/` relaciona el catálogo; `services/` integra servicios externos. La autorización existente de Google sirve exclusivamente a Calendar y no constituye una cuenta de Nexus.

El catálogo sigue en `data/mcuCatalog.ts`, `data/titles/`, `data/characters/` y `data/viewingRoutes.ts`. `MCUEntry.slug`, `TitleDetails.titleId`, apariciones de personajes y pasos de rutas ya se relacionan mediante el mismo slug estable. No se copia el catálogo a la base de datos ni se usan índices de arrays. Mantener estos slugs al editar contenido; renombrarlos exigiría una migración explícita del progreso.

`AccountProvider`, montado en el layout raíz, mantiene una sola suscripción a Auth y un `MovieProgressStore` compartido. El cliente Supabase se crea una sola vez en el navegador. Las páginas siguen públicas y no necesitan sesión en Server Components: por ello no se añaden cookies SSR, middleware ni clientes de servidor redundantes. La autorización efectiva de datos ocurre en PostgreSQL mediante RLS, no mediante la identidad del estado de React.

`INITIAL_SESSION`, `SIGNED_IN` y `SIGNED_OUT` actualizan la identidad. Un cambio de identidad limpia inmediatamente datos y operaciones pendientes; las respuestas anteriores quedan invalidadas. Repeticiones del evento para el mismo usuario conservan su estado. Las llamadas a la base se difieren fuera del callback de Auth para no bloquear su lock interno. El SDK conserva y renueva la sesión; cerrar sesión afecta al dispositivo actual.

`useMovieProgress` adapta títulos y rutas al estado compartido. En una cuenta, marcar una película desde una ruta también actualiza su estado en títulos y otras rutas. Durante la carga se deshabilitan escrituras. La cola serializa cambios individuales y masivos, muestra su resultado inmediatamente y reconstruye el estado desde la última confirmación más las operaciones pendientes si una petición falla. Usa `upsert` y tiempo máximo de 15 segundos por petición. Los errores permiten volver a marcar o recargar. No hay peticiones por render ni sincronización Realtime. Recargar, iniciar una nueva sesión o pulsar RECARGAR PROGRESO obtiene cambios de otro dispositivo; escrituras concurrentes entre dispositivos siguen el último cambio aceptado por la base.

Una respuesta perdida puede significar que el servidor sí guardó un cambio: tras un error de red, RECARGAR PROGRESO reconcilia con la base. La cola reside en memoria: no cerrar la pestaña mientras indique GUARDANDO. El cierre de sesión desde la UI espera a terminar los guardados; un cierre externo invalida la cola inmediatamente.

## Almacenamiento local

- Invitados: `nexus:titles:watched` y `nexus:route:<slug>` mantienen el comportamiento previo separado por contexto. Solo se escriben desde el modo invitado; nunca se importan automáticamente a cuentas. Si el almacenamiento falla, el hook conserva cambios en memoria durante la sesión de la aplicación.
- Cuenta: `movie_progress` es la fuente de verdad; los datos privados solo están en el estado en memoria. El SDK almacena su propia sesión Auth en localStorage, independiente del progreso.
- Calendar: `nexus:google-calendar-id`; analítica: `nexus:analytics-consent`. Siguen independientes de Auth.
- Intro: `nexus:cinematic-intro:seen`, una vez por navegador hasta borrar almacenamiento. Se registra al entrar, también si se omite o se prefiere movimiento reducido. Si localStorage está bloqueado, solo se garantiza una vez durante la vida de la aplicación.

El contacto usa `target="_blank"` y `rel="noopener noreferrer"`; la apertura del cliente de correo depende del navegador. La sección `/cuenta` tiene estilos propios en `features/account/Account.css`, tras la petición de mejorar su presentación: composición compacta de dos columnas en escritorio y una en móvil, panel de acceso y resumen del progreso existente. Conserva las fuentes y paleta de Nexus, sin alterar otras secciones ni nombres de personajes. El formulario ya no hereda estilos del planificador. El registro muestra confirmación pendiente cuando Auth no devuelve sesión, o cuenta creada cuando inicia sesión directamente; la interfaz no modifica la política de confirmación de Supabase.

## Tabla y SQL

SQL completo: [`20260906000000_create_movie_progress.sql`](../supabase/migrations/20260906000000_create_movie_progress.sql).

| Columna | Tipo y finalidad |
| --- | --- |
| `id` | UUID, clave primaria generada por PostgreSQL |
| `user_id` | UUID, FK a `auth.users(id)` con borrado en cascada |
| `movie_id` | Slug estable del catálogo; texto no vacío con formato validado |
| `watched` | Booleano, visto o pendiente |
| `created_at` | timestamptz, fecha de creación controlada por trigger |
| `updated_at` | timestamptz, fecha del último cambio controlada por trigger |

`UNIQUE(user_id, movie_id)` impide duplicados y permite upsert. Su índice también sirve para consultar por usuario. No hay tabla de perfiles ni copia de emails. La base valida formato del slug, no pertenencia al catálogo estático; la interfaz filtra los identificadores disponibles. Un cliente manipulado podría crear un slug desconocido únicamente en su propia cuenta.

RLS está habilitada y forzada. Se retiran los permisos de `PUBLIC`, `anon` y `authenticated`, y se conceden solo SELECT/INSERT/UPDATE/DELETE a `authenticated`. SELECT y DELETE aplican `USING ((select auth.uid()) = user_id)`; INSERT aplica `WITH CHECK`; UPDATE aplica ambos para impedir tanto modificar filas ajenas como cambiar su propietario. Sin sesión no hay acceso. No hay vistas ni RPC con `SECURITY DEFINER` que eludan estas reglas. El trigger tiene search_path vacío y no admite ejecución directa desde los roles cliente.

## Variables y entornos

Partir de [`.env.example`](../.env.example). En `.env.local` configurar, sin sobrescribir otras variables existentes:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://TU_REF_LOCAL.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA_LOCAL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

El segundo campo acepta una clave `sb_publishable_...` o el JWT legacy con rol `anon`. No usar contraseña de base de datos ni clave privada. La validación de `next.config.ts` detiene el proceso antes de empaquetar una clave privada configurada por error. Los archivos `.env*` reales están ignorados; únicamente `.env.example` se versiona. No se han leído ni copiado los valores de `.env.local`.

En el entorno de compilación/despliegue de Nexus-Main usar los mismos nombres con URL y clave pública de Nexus-Main y el dominio real en `NEXT_PUBLIC_SITE_URL`. Next.js incorpora `NEXT_PUBLIC_*` al build: reconstruir al cambiar de proyecto. No reutilizar el build generado con Nexus-Local para Main. Sin configuración Supabase la navegación y el progreso de invitado siguen disponibles; el formulario explica que el servicio de cuentas no está configurado.

En **cada proyecto** configurar Auth: proveedor email/password, registro habilitado, confirmación de email, contraseña mínima de 8 caracteres y Site URL de ese entorno. Autorizar las URLs exactas de retorno `/cuenta` (por ejemplo `http://localhost:3000/cuenta` para desarrollo). Para producción configurar SMTP propio y verificar recepción de confirmaciones y límites de envío. No se añade OAuth. `supabase/config.toml` configura únicamente el stack Docker local: no modifica por sí mismo las opciones Auth de proyectos alojados.

## Migraciones en Nexus-Local y Nexus-Main

Desde la raíz del repositorio, en cmd, usando la CLI oficial de Supabase. Sustituir los identificadores por el **project ref**, no por el nombre mostrado en el dashboard. La CLI solicitará autenticación/contraseña fuera del código.

```bat
npx supabase login
npx supabase link --project-ref TU_REF_LOCAL
npx supabase migration list
npx supabase db push --dry-run
npx supabase db push
```

Esto aplica la migración versionada a **Nexus-Local alojado**, que es distinto de un stack Docker en el ordenador. Si ya hay tablas o historial remoto no presentes en el repo, inspeccionar y conciliar ese esquema antes de aplicar cambios; no reparar historial ni usar reset a ciegas.

Tras validar Local, preparar Main:

```bat
npx supabase link --project-ref TU_REF_MAIN
npx supabase migration list
npx supabase db push --dry-run
```

Antes de ejecutar el siguiente comando en Main, revisar y aprobar expresamente el SQL pendiente y confirmar el project ref. Crea `movie_progress`, su trigger, permisos y policies; no altera el catálogo ni borra tablas existentes. Si el dry-run muestra otras migraciones, revisarlas también.

```bat
npx supabase db push
```

Es exactamente la misma migración. No se han enlazado ni modificado proyectos remotos durante esta implementación. Volver a enlazar Nexus-Local al terminar para reducir errores de destino. No ejecutar `db reset --linked` contra ninguno de los proyectos alojados.

Para una instancia desechable del ordenador: arrancar Docker y ejecutar `npx supabase start`; aplica las migraciones desde cero. El `config.toml` usa PostgreSQL 17; comprobar la versión remota antes de utilizar herramientas de diff. El correo de confirmación del stack local se puede abrir en `http://127.0.0.1:54324`.

## Verificación

```bat
npm test
npx playwright install chromium
npm run test:e2e
npm run lint
npx tsc --noEmit
npm run build
```

Las pruebas unitarias cubren carga fallida, retry, reversión, cambios rápidos/masivos, logout, cambio de usuario y respuestas tardías. Las pruebas de SQL ejecutan la migración real en PostgreSQL embebido (PGlite), reproduciendo roles y `auth.uid()` mediante el subject JWT; verifican permisos anónimos, propiedad de SELECT/INSERT/UPDATE/DELETE/upsert, UNIQUE, trigger y cascada. Las claves privadas se rechazan en pruebas de configuración.

Playwright arranca la app en el puerto 3100 con URL y clave públicas ficticias y simula únicamente las respuestas HTTP de Supabase. Verifica invitado, registro con confirmación pendiente, login, recarga de sesión, marcar/desmarcar y persistir, errores, logout/cambio de cuenta, intro y contacto. No utiliza credenciales reales ni demuestra por sí solo la configuración de Auth o RLS de un proyecto alojado.

Antes del despliegue, repetir en Nexus-Local real:

1. Navegar sin sesión y comprobar progreso de invitado.
2. Registrar A, recibir/confirmar el email e iniciar sesión.
3. Marcar y desmarcar títulos, incluido desde rutas. Recargar y comprobar el estado.
4. Iniciar sesión como A en otro navegador/dispositivo: debe recuperar lo guardado.
5. Cerrar sesión: desaparece el progreso privado y reaparece únicamente el de invitado.
6. Registrar/iniciar B: nunca debe verse el progreso privado de A.
7. Con la sesión B y la clave pública, consultar/actualizar/borrar por `user_id` de A: ninguna fila debe ser accesible; insertar/upsert con el ID de A y cambiar propietario deben rechazarse.
8. Sin sesión, las cuatro operaciones deben denegarse. Revisar en el proyecto que RLS y las cuatro policies coincidan con la migración.
9. Simular fallo de red durante un guardado: aparece error, se revierte, y RECARGAR PROGRESO permite reconciliar.

Nexus-Local ya está configurado en `.env.local`. El usuario ha confirmado la creación de la tabla, el guardado y la recuperación del progreso desde navegación privada. Sigue pendiente la prueba con una segunda cuenta y la verificación directa de las policies alojadas.

Si falla el registro, `services/supabase/authErrorMessage.ts` traduce los códigos de Auth sin mostrar respuestas sin filtrar. `email_address_not_authorized` indica una restricción del servicio de correo predeterminado: configurar SMTP propio en el proyecto para enviar confirmaciones a otras direcciones. `over_email_send_rate_limit` indica un límite de envío: esperar antes de repetir. La interfaz también distingue contraseña débil, correo inválido, confirmación pendiente y registro deshabilitado. Para diagnosticar un fallo desconocido, consultar únicamente el código de error en la respuesta de `/auth/v1/signup` o los logs de Auth; no copiar contraseñas ni tokens.

Resultado de esta implementación: 11 pruebas de lógica/SQL/configuración y 2 pruebas de navegador superadas; lint, TypeScript y build de producción correctos (176 páginas generadas). Validación y auditoría editorial también superadas. Docker no estaba arrancado, por lo que no se ejecutó el stack completo local de Supabase. La búsqueda de claves privadas en código y bundle no encontró claves `sb_secret_` reales; `.env.local`, `.env.production` y el enlace temporal de Supabase están ignorados por Git.

## Archivos de la implementación

- Nuevos: `.env.example`, `config/supabaseEnvironment.ts`, `services/supabase/client.ts`, `repositories/movieProgressRepository.ts`, `services/progress/movieProgressStore.ts`, `features/account/{AccountProvider,AccountForm,ProgressStatus}.tsx`, `hooks/useMovieProgress.ts`, `app/cuenta/page.tsx`, `utils/cinematicIntro.ts`.
- Base de datos/documentación: `supabase/.gitignore`, `supabase/config.toml`, `supabase/migrations/20260906000000_create_movie_progress.sql`, `docs/supabase.md`, `Readme.md`.
- Integración: `app/layout.tsx`, `components/layout/LegalFooter/LegalFooter.tsx`, `features/titles/directory/TitleDirectory.tsx`, su hook `useTitleDirectory.ts` y componentes `TitleDirectoryCard.tsx`/`TitleBulkActions.tsx`, `features/viewing-routes/ViewingRouteExperience.tsx`, `hooks/usePersistentStringSet.ts`, `features/home/components/CinematicIntro/CinematicIntro.tsx`, `next.config.ts`, `.gitignore`, `package.json`, `package-lock.json`.
- Pruebas: `services/progress/{movieProgressStore,movieProgressMigration,supabaseEnvironment}.test.ts`, `playwright.config.ts`, `tests/e2e/account.spec.ts`.

Referencias oficiales: [sesión y eventos Auth](https://supabase.com/docs/reference/javascript/auth-onauthstatechange), [cliente JavaScript](https://supabase.com/docs/reference/javascript/initializing), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [migraciones](https://supabase.com/docs/guides/deployment/database-migrations).
