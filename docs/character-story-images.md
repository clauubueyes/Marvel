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

## Historia en móvil

Hasta 900 px, el fondo sticky ocupa `100svh` y cada imagen usa `object-fit: contain`
sin ampliación, para conservar el encuadre completo. El texto se desplaza en el flujo
normal, con contraste propio y sin animaciones de opacidad que oculten la lectura.
Los años decorativos y el indicador lateral se ocultan para evitar solapamientos.

`CharacterStory` selecciona las animaciones mediante `gsap.matchMedia`: en móvil
solo anima la opacidad del fondo y un pequeño desplazamiento del título. Se eliminan
los desenfoques, giros por letra y capas ambientales del diseño móvil. Al cambiar
el ancho o la preferencia de movimiento se revierten las animaciones anteriores.
Con movimiento reducido, las imágenes cambian sin fundido y el texto queda estático.
