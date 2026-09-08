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
El panel muestra el total visto y enlaza a `/titulos` para buscar y marcar obras
individualmente o en bloque. Cuenta ofrece también `RECARGAR PROGRESO` para
recuperar cambios de otros dispositivos. Los ajustes permanecen visibles sin
pestañas, también al entrar directamente en `#spoilers`.

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

El progreso para spoilers se computa **una sola vez por árbol** en
`SpoilerProgressProvider` (montado en el layout raíz, dentro de `AccountProvider`)
y se reparte por contexto. Todos los consumidores — historia, rail, capacidades,
datos curiosos, conexiones, escena, referencias, filmografía, texto inline y
puertas de progreso — leen del mismo valor con `useSpoilerProgress`; ninguno
ejecuta su propia suscripción. `buildSpoilerProgress` es la única función que
decide `ready`/`allowSpoilers` a partir de la cuenta y del progreso confirmado,
y está cubierta por tests unitarios.

El dossier se adapta al progreso: historia y rail contienen solo actos disponibles;
filmografía, conexiones, datos curiosos y variantes filtran los elementos pendientes.
Capacidades y escena esencial se omiten hasta cumplir sus requisitos. No se dejan
pantallas de candados en su lugar. Los recorridos editoriales disponibles conservan
sus enlaces y siempre se ofrece una entrada al catálogo.

Si queda historia pendiente, `CharacterStory` añade un único paso de continuación
al mismo recorrido animado (también con progreso vacío). El texto permanece en la
columna de los actos y `NextTrailer` ocupa la columna sticky de imágenes, con un
recorte de entrada sincronizado con el scroll. No hay una tarjeta separada debajo.
El reproductor solo es interactivo en su paso activo; volver a otro acto o cambiar el título
desmonta el iframe. En móvil, vídeo y texto comparten el mismo paso con el vídeo
arriba y los controles accesibles. `getNextWatch` elige el primer título
pendiente del personaje marcado ESTRENADO en el catálogo, por fecha de estreno,
incluyendo series, especiales y otras continuidades. `getCharacterWatchTitleIds`
reúne sus apariciones y los requisitos de su historia, sin duplicados. La tarjeta
muestra el título y su tráiler, sin explicar acontecimientos, cameos ni revelaciones.
No usa fechas narrativas ni prioriza el orden de los actos (incluidos flashbacks).
Por ejemplo, tras Iron Man recomienda Iron Man 2, y Rocket comienza por Guardianes
Vol. 1 aunque su primer acto relate un origen revelado en Vol. 3. No supone
que ver una entrega implica haber visto las anteriores. Si no queda candidato ofrece
el catálogo, sin recomendar obras ajenas al personaje; si no tiene tráiler lo indica
sin saltarse esa obra.

El vídeo oficial del catálogo se carga únicamente al pulsar; la portada usa la
miniatura promocional existente de `/trailers`, nunca una escena protegida del dossier.
No se reproduce automáticamente al navegar. Al cambiar el título recomendado se
desmonta el reproductor anterior. Durante carga, error o guardado no se recomienda
desde progreso no confirmado. `SpoilerNotice`, reutilizado fuera de estas listas,
invita a continuar el recorrido y conserva el contador parcial accesible sin listar
los requisitos ocultos.

`CharacterStory` filtra los actos antes del JSX. No monta imágenes bloqueadas,
ni en la capa base ni mediante el retrato alternativo. Los títulos accesibles, años,
etiquetas y navegación pendientes se omiten también. Las animaciones se reconstruyen al
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
- **Dossier de títulos** (`/titulos`): protegido hasta haber visto el propio
  título con `titleDossierRequirement(slug)` (`allOf: [slug]`), el único requisito
  centralizado que usan todas las puertas de la ficha. El resumen de
  «EL ACONTECIMIENTO» y las escenas poscréditos se bloquean con
  `ProgressSpoilerGate`; la grilla de personajes conectados (`TitleCast`) se
  oculta por completo para no delatar apariciones o cameos; los resúmenes de
  las entidades conectadas (`TitleConnections`) se bloquean individualmente con
  `SpoilerText`; y la columna «CONTINUAR CON» del orden de visionado
  (`TitleWatchOrder`) se oculta, porque revela el futuro narrativo (la columna
  «VER ANTES» es información de navegación y permanece pública).
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

`validateProgressRelations` se ejecuta en la misma tubería y cubre los requisitos
derivados de fuera de los personajes: cada ruta debe desbloquearse con pasos
válidos, únicos y con spoiler (`allOf` de sus títulos), cada conexión de entidad
debe referenciar al menos un título (`allOf: entity.titleIds`) y cada título del
catálogo debe tener su `titleDossierRequirement(slug)`. Si el contenido editado
dejara una de estas puertas vacía, repetida o apuntando a un slug desconocido, el
build falla antes de publicar.

`npm test` cubre todo el catálogo: ausencia de progreso, desbloqueo completo, falta
de cualquiera de las obras exigidas, requisitos incorrectos, flashbacks y selección
de cuenta. Conserva las pruebas de persistencia, rollback, Auth y aislamiento.
`tests/e2e/spoilers-catalog.spec.ts` recorre cada personaje con progreso vacío, parcial,
completo y revocado. `account.spec.ts` cubre registro, preferencia, guardado, recarga,
logout, SSR sin JavaScript y ausencia de peticiones de imágenes bloqueadas.
Supabase se simula por HTTP; no se escriben cuentas reales durante estas pruebas.

La adaptación del dossier se verifica con los 49 personajes en cuatro estados de
progreso, pruebas de cuenta y una prueba de tráiler (montaje bajo demanda, cambio
de recomendación, retirada del reproductor y vistas de 390/1440 px). La reproducción
externa se simula: las pruebas no comprueban disponibilidad regional de YouTube.
Las pruebas de `nextWatch` comprueban además orden de estreno, progreso no listo,
preferencia, catálogo completado y existencia de las miniaturas promocionales.
