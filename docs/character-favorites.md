# Personajes favoritos

## Arquitectura

`Character.id` es el identificador estable del catálogo. No se usan índices de arrays
ni se copian fichas a Supabase. La migración
`20260906010000_create_character_favorites.sql` crea `public.character_favorites`
con solo `user_id` y `character_id`. La clave primaria `user_id` también garantiza
UNIQUE: cada usuario puede tener cero o un favorito, incluso con escrituras concurrentes.
El FK a `auth.users` elimina el voto al eliminar la cuenta. Un CHECK admite únicamente
los IDs del catálogo actual; al añadir personajes, ampliar ese CHECK mediante otra
migración. La prueba SQL comprueba que todos los IDs actuales se admiten.

## Permisos y contadores

RLS está habilitada y forzada. `authenticated` tiene SELECT/INSERT/UPDATE/DELETE
exclusivamente sobre su voto mediante las policies `character_favorites_select_own`,
`character_favorites_insert_own`, `character_favorites_update_own` y
`character_favorites_delete_own`. INSERT y UPDATE verifican el propietario nuevo;
SELECT, UPDATE y DELETE verifican el propietario existente. `anon` no puede leer
filas individuales ni escribir.

La RPC sin argumentos `get_character_favorites()` devuelve un objeto:

```json
{ "counts": { "spider": 12, "iron": 8 }, "favorite": "spider" }
```

Los conteos son `COUNT(*) GROUP BY character_id` sobre los votos reales, con índice
en `character_id`; un personaje ausente tiene cero fans. El favorito propio se obtiene
con `auth.uid()`, y es null para invitados. La consulta SQL utiliza una única instantánea
coherente y no devuelve IDs de usuarios ni filas ajenas. No hay contadores incrementales
que puedan acumular duplicados o desajustarse.

La función es deliberadamente `SECURITY DEFINER` para poder agregar votos protegidos
por RLS. Tiene `search_path = ''`, referencias cualificadas, ninguna entrada del cliente
y solo lectura. Se revoca EXECUTE de PUBLIC y se concede exclusivamente a `anon` y
`authenticated`. Referencias: [funciones de Supabase](https://supabase.com/docs/guides/database/functions)
y [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Estado y UX

`AccountProvider` conserva un `CharacterFavoritesStore` junto al store de progreso.
La suscripción Auth existente actualiza ambos; no se crea otra suscripción ni otro
cliente Supabase. `useCharacterFavorites` carga la RPC bajo demanda y deduplica las
solicitudes de todas las tarjetas. Los cambios de filtros y renders no vuelven a consultar.
El favorito solo reside en memoria; Supabase conserva el dato y Auth conserva su sesión.

`CharacterFavorite` se reutiliza en el directorio y en la cabecera de cada ficha. El
enlace de apertura del expediente y el control de favorito son elementos hermanos,
sin botones dentro de enlaces. Los invitados ven totales y acceden a `/cuenta` con el
flujo de login existente. No se emite un voto automáticamente al entrar.

Una selección hace `upsert` con conflicto en `user_id`, por lo que cambia el voto en
una sola operación atómica. Volver a pulsar el favorito hace DELETE del voto propio.
El store actualiza inmediatamente selección y ambos contadores; bloquea nuevas
operaciones hasta terminar el guardado y la relectura conjunta de los conteos reales.
Un fallo de escritura revierte la vista y exige REINTENTAR para reconciliar: una
respuesta perdida podría corresponder a una escritura confirmada en servidor.
Si solo falla la relectura, conserva el voto guardado y ofrece reintento.

La carga fallida muestra `— fans`, nunca un cero inventado. Un cambio de identidad
limpia inmediatamente el favorito y descarta respuestas anteriores. Cerrar sesión
desde la UI espera al guardado; un logout externo también invalida operaciones antiguas.
Los conteos se actualizan al cargar personajes, cambiar de identidad, votar, reintentar
o recargar. No hay Realtime ni sondeos: votos desde otro dispositivo se reflejan en
la siguiente lectura. Entre escrituras concurrentes de una cuenta prevalece la última.

## Entornos y comprobaciones

Aplicada y verificada en **Nexus-Local** (`gwpklkqebcplpeyyfkdx`). Antes de aplicar se
confirmó que solo existía `movie_progress` y que el dry-run incluía únicamente esta
migración. La RPC alojada devuelve HTTP 200 a invitados. Nexus-Main no se ha modificado.
Para producción, aplicar esta misma migración siguiendo el procedimiento de revisión
de `docs/supabase.md`, antes de desplegar el frontend.

`npm test` incluye pruebas del store y del SQL real con PGlite: permisos, privacidad,
catálogo, UNIQUE, cambios de voto, conteos, cascada, carga compartida, fallos, reintentos,
clics rápidos y respuestas tardías. `tests/e2e/favorites.spec.ts` simula HTTP de Supabase
y cubre el flujo de invitados, login, selección, cambio, eliminación, recarga, rollback,
logout, aislamiento entre cuentas y reutilización de la carga al abrir una ficha.
La prueba no crea cuentas reales ni demuestra la configuración de envío de correo.
Verificación visual a 320, 390 y 1440 px: tarjetas de 500 px en móvil y 480 px en
escritorio, sin modificar sus dimensiones, y control de ficha sin solaparse con el
indicador de desplazamiento.

Resultado: 17 pruebas de lógica/SQL y 5 pruebas de navegador superadas (incluidas
cuentas y audio existentes), lint y TypeScript correctos, y build de producción
completado con 176 páginas. La suite de navegador se ejecutó contra el servidor
de desarrollo existente con respuestas Auth simuladas, sin interrumpirlo.
