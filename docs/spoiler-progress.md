# Protección de spoilers por progreso

La fuente de verdad sigue siendo `movie_progress`: se reutilizan `AccountProvider`,
`MovieProgressStore` y su cola de cambios individuales/masivos. No hay un booleano
que sustituya el progreso, tablas nuevas, migraciones ni dependencias nuevas.

El registro muestra únicamente una casilla «Evitar spoilers», marcada por defecto.
La selección se guarda en `auth.users.user_metadata.avoid_spoilers` mediante las
opciones de `signUp`, también si es necesaria la confirmación por correo. Solo el
valor booleano `false` permite mostrar spoilers; las cuentas anteriores conservan
la protección por defecto. Es una preferencia de presentación, no autorización.
Después de iniciar sesión aparece el panel detallado y se puede cambiar esa
preferencia mediante `auth.updateUser`, sin alterar las obras vistas. El evento
Auth existente actualiza la preferencia sin recargar ni vaciar el progreso.

En `/cuenta#spoilers`, con sesión iniciada, `SpoilerProgressSettings` permite buscar películas/series,
filtrar las apariciones catalogadas de un personaje y marcar/desmarcar todos los
resultados. Solo recibe nombres, tipos e IDs; no sinopsis, imágenes ni acontecimientos.
Un personaje sirve para seleccionar obras concretas, no para asumir un progreso
ambiguo de «personaje visto». Las series siguen la granularidad del catálogo actual
(temporada o grupo de temporadas), sin inventar progreso por episodio.

## Requisitos y renderizado

`SpoilerRequirement` declara `allOf`, una lista de slugs estables del catálogo.
Todas las obras deben estar vistas. Ver Endgame no implica haber visto Iron Man.
Un requisito vacío bloquea. Los componentes narrativos de personajes utilizan
`UNREVIEWED_SPOILER` cuando falta un requisito: pendiente de revisar nunca equivale
a público. El evaluador general permite la ausencia de requisito únicamente para
usos explícitos de contenido público.
`canRevealSpoiler` toma esa decisión y `protectContent` devuelve el objeto original
o una sustitución neutra completa, sin mezclar campos del contenido bloqueado.

`useSpoilerProgress` adapta el progreso existente. Con la protección activa, antes de recuperar la sesión,
durante la carga, durante guardados pendientes o ante un error, los requisitos no
se satisfacen. Así una escritura optimista fallida no revela contenido irreversible.
Los cambios confirmados, desmarcados y cambios de identidad actualizan React mediante
las suscripciones existentes; no hay nuevas consultas ni sondeos.
Si la cuenta permite spoilers explícitamente, el contenido se muestra al recuperar
la sesión, sin exigir que el usuario marque obras como vistas.

En invitados se reutiliza `nexus:titles:watched`, compartido con el directorio de
títulos. Las rutas de invitado mantienen su almacenamiento separado existente;
al iniciar sesión tanto rutas como títulos usan el progreso unificado de la cuenta.
No se importa progreso de invitado a cuentas.

## Personajes revisados: Iron Man y Capitán América

`data/characters/storyData.ts` asocia los cuatro actos, respectivamente, con
`iron-man`, `los-vengadores`, `capitan-america-civil-war` y `vengadores-endgame`.
El requisito de cada acto cubre texto, título, kicker, año e imagen del acto.
`CharacterStory` sustituye el acto antes de construir el JSX; no monta imágenes
bloqueadas, tampoco como capa base o retrato alternativo. `StorylineRail` aplica
el mismo criterio a los años y etiquetas laterales. Las animaciones se reconstruyen
cuando cambia la visibilidad y buscan la imagen dentro de su propio acto.

La ficha también protege los datos curiosos, el estado actual y el vídeo de
Iron Man 3 mediante los requisitos de `character.spoilers`. El estado protegido
se omite del JSON-LD público. Los títulos de la filmografía siguen siendo enlaces
de catálogo y no muestran sus descripciones de acontecimientos.

Los dos primeros actos de Steve Rogers requieren `capitan-america-el-primer-vengador`;
el tercero, `capitan-america-el-soldado-de-invierno`; y el cuarto, `vengadores-endgame`.
Sus datos curiosos, estado y vídeo también tienen requisitos. `overview` protege
la descripción introductoria, cita y capacidades de los personajes revisados.
Las historias, imágenes de actos, datos curiosos, vídeos, estado, introducción,
citas y capacidades sin requisitos quedan bloqueados en modo sin spoilers.
Afiliaciones, variantes y conexiones de la ficha quedan igualmente bloqueadas
hasta disponer de revisión editorial. Con spoilers permitidos se muestran.
El JSON-LD público usa una descripción neutra y omite estado y capacidades.

El catálogo y los recursos siguen siendo públicos. Esta es protección de
renderizado contra exposición accidental: no un control de acceso al código fuente,
los datos serializados de Next o las URL públicas de imágenes. El HTML visible
inicial y la versión sin JavaScript conservan los bloqueos. El resto de Nexus
requiere etiquetado editorial e integración antes de considerarse protegido.
El bloqueo conservador de fichas sin revisar evita exponer sus relatos, pero no
supone que ya tengan desbloqueo gradual: hace falta asignar sus obras explícitas.

## Ampliación y comprobaciones

Para otra historia, añadir `spoiler: { allOf: ["slug-de-la-obra"] }` al capítulo;
el componente y el rail ya lo interpretan sin versiones alternativas de la página.
Para otras piezas, asociar el mismo tipo a sus datos y ejecutar `protectContent`
antes del JSX o `canRevealSpoiler` antes de montar el componente sensible.
Un acontecimiento que revele varias obras puede requerir todos sus slugs.

`npm test` cubre requisitos múltiples, falta de progreso, slugs del catálogo,
sustitución completa y el ejemplo Iron Man + Iron Man 2, además de las pruebas
existentes de persistencia, aislamiento y rollback. `tests/e2e/account.spec.ts`
comprueba selección masiva, recarga, desbloqueo, logout, cambios de invitado,
renderizado sin JavaScript y ausencia de peticiones de imágenes bloqueadas.
Supabase se simula por HTTP; estas pruebas no escriben en cuentas reales.
