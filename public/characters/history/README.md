# Imágenes de la historia

Cada subcarpeta usa el ID del personaje del catálogo. Por ejemplo, Iron Man usa
`iron`, Spider-Man usa `spider` y Doctor Strange usa `strange`.

Añade una imagen por acto con estos nombres:

- `acto-1.webp`: origen.
- `acto-2.webp`: poder.
- `acto-3.webp`: crisis.
- `acto-4.webp`: desenlace.

También se admiten `.avif`, `.jpg`, `.jpeg` y `.png`, en minúsculas. Si existen
varios formatos para un acto, la prioridad es WebP, AVIF, JPG, JPEG y PNG.
Por ejemplo: `public/characters/history/iron/acto-4.jpg`.

No hace falta editar el catálogo: la página detecta los archivos al renderizarse
en el servidor. Si un acto no tiene imagen, utiliza el retrato actual del personaje.
Los retratos de las demás secciones no cambian.

Usa imágenes de buena resolución con el sujeto cerca del centro: se recortan con
`object-fit: cover` para adaptarse a la columna de escritorio y la franja móvil.

En desarrollo, recarga la página después de añadir los archivos. En producción,
vuelve a compilar y desplegar: las fichas se generan estáticamente durante el build.
