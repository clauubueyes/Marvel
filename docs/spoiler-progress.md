# Protección de spoilers por progreso

## Cuenta y persistencia

La fuente de verdad continúa en `movie_progress`, mediante `AccountProvider`,
`MovieProgressStore` y su cola de cambios individuales/masivos. No hay nuevas
tablas, migraciones ni dependencias.

El registro muestra únicamente «Evitar spoilers», marcado por defecto. Se guarda
en `auth.users.user_metadata.avoid_spoilers` mediante `signUp`, también cuando se
requiere confirmación por correo. Solo el booleano `false` permite spoilers;
las cuentas anteriores y valores ausentes conservan la protección. Esta opción
no sustituye el progreso ni marca obras como vistas.

Tras iniciar sesión aparece `/cuenta#spoilers`. La preferencia se actualiza con
`auth.updateUser`; la suscripción Auth existente la aplica sin vaciar el progreso.
El panel permite buscar títulos y marcar resultados individualmente o en bloque.
El filtro por personaje incluye apariciones y todas las obras necesarias para
desbloquear su historia, datos, vídeo y variantes (`getCharacterProgressTitleIds`).
Un personaje es un filtro de obras concretas, no un booleano «personaje visto».

Las series conservan la granularidad del catálogo: temporada o grupo de temporadas,
sin inferir progreso por episodio. En invitados se usa `nexus:titles:watched`,
compartido con el directorio de títulos. Las rutas de invitado mantienen su
almacenamiento separado; con sesión, títulos y rutas usan el mismo progreso de
cuenta. No se importa automáticamente el progreso de invitado.

## Cobertura de los personajes

Los **49 personajes y sus 196 actos** tienen requisitos editoriales explícitos:

- `data/characters/storyData.ts`: cada capítulo declara `spoiler.allOf`. El requisito
  abarca título, kicker, texto, año e imagen del acto, incluido el rail lateral.
- `data/characters/spoilerData.ts`: requisitos de introducción/cita (`overview`),
  capacidades (`powers`), estado, afiliaciones, vídeo, cada dato curioso y variante.
  `catalog.ts` incorpora estos requisitos al catálogo común de personajes.
- Las conexiones de una ficha requieren todos los títulos vinculados a la entidad;
  el resumen de cada recorrido requiere los títulos de sus pasos. Cada elemento se
  evalúa por separado. Las fuentes editoriales siguen disponibles.

Los requisitos usan slugs del catálogo. No se deducen de años, orden de estreno,
posición del acto, palabras del texto ni de la última película vista. Ejemplos:

- Iron Man + Iron Man 2 desbloquean el primer acto de Tony; Los Vengadores, Civil War
  y Endgame desbloquean sus respectivos actos.
- El primer vengador desbloquea los dos primeros actos de Steve; El soldado de
  invierno el tercero y Endgame el cuarto.
- El primer acto de Rocket narra un origen revelado en Guardianes Vol. 3. Ver
  Guardianes Vol. 1 desbloquea su segundo acto, pero no ese origen.
- El acto de T'Challa que mezcla Infinity War y su regreso en Endgame requiere ambas.
- El recuerdo de Kate durante Nueva York requiere Ojo de Halcón, la obra que lo
  muestra, aunque la batalla ocurriera antes.

Los bloques que mezclan revelaciones se desbloquean como una unidad cuando se han
visto todas sus obras. El catálogo incluye historias anunciadas: sus actos requieren
el título correspondiente, sin asumir que se ha visto por conocer otras entregas.
Para historias de continuidades que el catálogo resume en un título del UCM (como
el Duende Verde en No Way Home), se usa ese título; no se inventan IDs externos ni
un catálogo paralelo.

## Lógica y renderizado

`canRevealSpoiler` evalúa `SpoilerRequirement.allOf`. `protectContent` devuelve el
contenido original o una sustitución neutra completa, sin mezclar campos sensibles.
Los componentes narrativos usan `UNREVIEWED_SPOILER` si faltan requisitos: ese
respaldo permanece bloqueado en modo sin spoilers. El evaluador general permite
omitir requisitos únicamente para contenido explícitamente público.

`useSpoilerProgress` se suscribe al progreso existente. Con protección activa,
la recuperación de sesión, cargas, guardados pendientes y errores mantienen los
bloqueos. Una escritura optimista fallida no debe exponer una revelación. Al confirmar
cambios o cambiar de identidad, React actualiza la ficha sin nuevas consultas por
componente. Con spoilers permitidos, basta recuperar la sesión para mostrarla.

`CharacterStory` sustituye los actos antes del JSX. No monta imágenes bloqueadas,
ni en la capa base ni mediante el retrato alternativo. Los títulos accesibles, años,
etiquetas y navegación se sustituyen también. Las animaciones se reconstruyen al
cambiar la visibilidad y buscan la imagen dentro de su propio acto. Los vídeos se
montan solo después del desbloqueo. El JSON-LD público usa una descripción neutra
y omite el estado y las capacidades.

Esta protección evita exposición accidental en el renderizado, incluido el HTML
visible inicial y la navegación sin JavaScript. El catálogo, los datos serializados
de Next y las URL públicas de recursos no son confidenciales. Los nombres y retratos
de catálogo siguen siendo identificadores públicos.

Más allá de los personajes, la protección por progreso también se aplica a:

- **Filmografía de personajes**: cada aparición solo se muestra cuando se ha visto su
  título (`allOf: [titleId]`), para no delatar el arco del personaje.
- **Rutas de visionado** (`/rutas`): el «spoiler» de cada paso solo se revela cuando se
  ha visto el título del paso. Con protección activa y sin haberlo visto, se muestra un
  aviso en lugar del texto spoilero.
- **Dossier de títulos** (`/titulos`): el resumen de «EL ACONTECIMIENTO» y las escenas
  poscréditos se bloquean hasta que se ha visto el propio título (`allOf: [slug]`).
  `ProgressSpoilerGate` reutiliza `canRevealSpoiler` como wrapper client para contenido
  sensible de otras páginas sin necesidad de duplicar la lógica.

## Ampliación y validación

Al añadir un personaje, completar sus actos y `characterSpoilers`. Mantener alineado
el orden de requisitos de datos curiosos y variantes con sus respectivas colecciones.
Si un contenido nuevo revela varias obras, incluir todos sus slugs en `allOf`.

`validateCharacterSpoilers` se ejecuta dentro de `npm run validate:content` y del build.
Rechaza historias o campos sin requisitos, listas vacías, IDs desconocidos y colecciones
de requisitos desalineadas. El fallback de renderizado protege durante desarrollo;
la validación impide publicar otra ficha sin etiquetar.

`npm test` cubre todo el catálogo: ausencia de progreso, desbloqueo completo, falta
de cualquiera de las obras exigidas, requisitos incorrectos, flashbacks y selección
de cuenta. Conserva las pruebas de persistencia, rollback, Auth y aislamiento.
`tests/e2e/spoilers-catalog.spec.ts` recorre cada personaje con progreso vacío, parcial,
completo y revocado. `account.spec.ts` cubre registro, preferencia, guardado, recarga,
logout, SSR sin JavaScript y ausencia de peticiones de imágenes bloqueadas.
Supabase se simula por HTTP; no se escriben cuentas reales durante estas pruebas.
