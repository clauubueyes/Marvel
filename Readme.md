# NEXUS

Experiencia editorial interactiva que recorre los personajes y acontecimientos esenciales en el camino hacia `Avengers: Doomsday`.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` en el navegador.

Para configurar cuentas, persistencia de progreso y migraciones en Nexus-Local / Nexus-Main, consulta [la guía de Supabase](docs/supabase.md) y `.env.example`.

Para generar URLs canónicas, el sitemap y las tarjetas sociales con el dominio de producción, configura:

```bash
NEXT_PUBLIC_SITE_URL=https://tu-dominio.example
```

## Estado actual

- Portada dinámica con cinco identidades visuales.
- Catálogo de personajes adaptable a móvil.
- Fichas individuales con estadísticas, habilidades y cronología.
- Imágenes editoriales remotas procedentes de las fichas oficiales de Marvel, con atribución.
- Recorrido audiovisual por personaje con tráilers oficiales, filmografía y curiosidades.
- Ruta cronológica hacia Doomsday con siete acontecimientos esenciales y contexto editorial.
- Votación persistente en el navegador.
- Ranking comunitario de demostración.
- Feed editorial conectado a Google News RSS, con caché y contenido de respaldo.

Este es un proyecto fan no oficial y no está afiliado a Marvel Entertainment.
