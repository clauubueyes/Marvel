# Imágenes por acto de historia

Los recursos están en `public/characters/history/<Character.id>/acto-1.webp`
hasta `acto-4.webp`. Las instrucciones para añadir imágenes y formatos admitidos
están en `public/characters/history/README.md`.

`characterStoryImageRepository.ts` resuelve los archivos locales desde el servidor.
La página `/personajes/[id]` pasa las rutas resueltas a `CharacterStory`; el navegador
no sondea archivos ni solicita imágenes inexistentes. Cada acto sin recurso propio
conserva el retrato del catálogo. La primera imagen también se usa como capa base.
La configuración existente de Next Image permite `/characters/**`.

Las imágenes se descubren durante la generación de las fichas. Añadirlas a una
instalación publicada requiere un nuevo build y despliegue.
