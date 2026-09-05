import type { ViewingRoute } from "@/types/viewingRoute";

export const viewingRoutes: ViewingRoute[] = [
  {
    slug: "camino-a-doomsday",
    name: "Camino a Doomsday",
    kicker: "LA RUTA PRINCIPAL",
    description: "Seis capítulos para comprender el multiverso, las incursiones y las piezas que convergen en Avengers: Doomsday.",
    accent: "#b9d737",
    coverImage: "/editorial/avengers-doomsday.webp",
    coverPosition: "center 28%",
    estimatedMinutes: 790,
    steps: [
      { titleId: "vengadores-endgame", priority: "RECOMENDADO", contribution: "Establece el viaje temporal y las consecuencias de alterar el pasado.", spoiler: "El atraco temporal abre ramificaciones y devuelve a quienes desaparecieron durante el Blip." },
      { titleId: "loki-temporadas-1-y-2", priority: "ESENCIAL", contribution: "Explica la TVA, las líneas temporales y la nueva arquitectura del multiverso.", spoiler: "Loki termina sosteniendo las ramas temporales después de romper el ciclo impuesto por la TVA." },
      { titleId: "spider-man-no-way-home", priority: "RECOMENDADO", contribution: "Muestra cómo personas de universos distintos pueden atravesar una fractura.", spoiler: "El hechizo de Strange reúne variantes y amenaza con romper la frontera entre realidades." },
      { titleId: "doctor-strange-en-el-multiverso-de-la-locura", priority: "ESENCIAL", contribution: "Introduce explícitamente las incursiones y sus consecuencias.", spoiler: "Clea advierte a Strange de que sus acciones han provocado una incursión." },
      { titleId: "deadpool-y-lobezno", priority: "RECOMENDADO", contribution: "Amplía la TVA y conecta universos heredados con la saga multiversal.", spoiler: "Deadpool entra en la TVA y lucha por impedir la desaparición de su universo." },
      { titleId: "los-cuatro-fantasticos-primeros-pasos", priority: "ESENCIAL", contribution: "Presenta a la Primera Familia y la realidad desde la que llegará al conflicto.", spoiler: "Los Fantastic Four protegen Tierra-828 antes de incorporarse a la crisis multiversal." },
    ],
  },
  {
    slug: "multiverso",
    name: "El multiverso",
    kicker: "REALIDADES EN COLISIÓN",
    description: "De las primeras ramas temporales a universos completos que empiezan a interferir entre sí.",
    accent: "#9c64d6",
    coverImage: "/editorial/doctor-strange-multiverse.webp",
    coverPosition: "center 35%",
    estimatedMinutes: 1090,
    steps: [
      { titleId: "vengadores-endgame", priority: "RECOMENDADO", contribution: "Introduce las ramificaciones creadas por el viaje temporal.", spoiler: "Los Vengadores visitan momentos del pasado y generan nuevas consecuencias." },
      { titleId: "loki-temporadas-1-y-2", priority: "ESENCIAL", contribution: "Define ramas, variantes y el funcionamiento de la TVA.", spoiler: "La Línea Temporal Sagrada da paso a un multiverso de ramas sostenidas por Loki." },
      { titleId: "spider-man-no-way-home", priority: "ESENCIAL", contribution: "Conecta físicamente tres universos cinematográficos.", spoiler: "Tres versiones de Peter Parker colaboran para reparar una fractura." },
      { titleId: "doctor-strange-en-el-multiverso-de-la-locura", priority: "ESENCIAL", contribution: "Recorre realidades alternativas e introduce las incursiones.", spoiler: "El uso del Darkhold y los saltos entre universos tienen consecuencias estructurales." },
      { titleId: "what-if-temporadas-1-3", priority: "OPCIONAL", contribution: "Explora cómo una decisión transforma una realidad completa.", spoiler: "El Vigilante interviene cuando varias realidades quedan amenazadas." },
      { titleId: "deadpool-y-lobezno", priority: "RECOMENDADO", contribution: "Explica universos moribundos y la supervisión de la TVA.", spoiler: "La estabilidad de una realidad queda ligada a sus figuras ancla." },
    ],
  },
  {
    slug: "tva-y-loki",
    name: "TVA y Loki",
    kicker: "FUERA DEL TIEMPO",
    description: "La ruta corta para entender quién vigilaba el tiempo, por qué dejó de hacerlo y qué ocupa ahora su lugar.",
    accent: "#e19b3d",
    coverImage: "/editorial/loki.webp",
    coverPosition: "center 32%",
    estimatedMinutes: 650,
    steps: [
      { titleId: "los-vengadores", priority: "RECOMENDADO", contribution: "Presenta al Loki del que nace la variante perseguida por la TVA.", spoiler: "Loki fracasa en la invasión de Nueva York y queda bajo custodia." },
      { titleId: "vengadores-endgame", priority: "ESENCIAL", contribution: "Crea la variante de Loki que escapa con el Teseracto.", spoiler: "La intervención de los Vengadores en 2012 permite que Loki escape." },
      { titleId: "loki-temporadas-1-y-2", priority: "ESENCIAL", contribution: "Cuenta la historia completa de la TVA y el nuevo árbol temporal.", spoiler: "Loki sustituye el Telar y sostiene personalmente las ramas del multiverso." },
      { titleId: "deadpool-y-lobezno", priority: "RECOMENDADO", contribution: "Muestra cómo opera la TVA después del cambio provocado por Loki.", spoiler: "Una facción de la organización manipula el destino de universos enteros." },
    ],
  },
  {
    slug: "wanda-y-la-magia",
    name: "Wanda y la magia",
    kicker: "CAOS, DUELO Y DARKHOLD",
    description: "La transformación de Wanda Maximoff y las consecuencias que deja en la parte mágica del MCU.",
    accent: "#e32961",
    coverImage: "/cinematic/dr-strange-wanda.jpg",
    coverPosition: "center 25%",
    estimatedMinutes: 890,
    steps: [
      { titleId: "vengadores-la-era-de-ultron", priority: "RECOMENDADO", contribution: "Introduce a Wanda, sus poderes y la pérdida de Pietro.", spoiler: "Wanda se vuelve contra Ultron y termina uniéndose a los Vengadores." },
      { titleId: "capitan-america-civil-war", priority: "RECOMENDADO", contribution: "Expone su culpa, su aislamiento y el miedo público a sus poderes.", spoiler: "El accidente de Lagos convierte a Wanda en argumento central de los Acuerdos." },
      { titleId: "wandavision", priority: "ESENCIAL", contribution: "Define a la Bruja Escarlata, el Hex y su vínculo con el Darkhold.", spoiler: "El duelo de Wanda crea Westview y despierta plenamente la magia del caos." },
      { titleId: "doctor-strange-en-el-multiverso-de-la-locura", priority: "ESENCIAL", contribution: "Lleva la corrupción del Darkhold hasta el multiverso.", spoiler: "Wanda persigue el poder de América Chávez y destruye el Darkhold en todas las realidades." },
      { titleId: "agatha-quien-si-no", priority: "RECOMENDADO", contribution: "Continúa el legado mágico de Westview y de Billy Maximoff.", spoiler: "La Senda de las Brujas revela nuevas consecuencias del hechizo de Wanda." },
    ],
  },
  {
    slug: "fantastic-four",
    name: "Fantastic Four",
    kicker: "LA PRIMERA FAMILIA",
    description: "Una entrada directa a la familia que ocupará una posición central en el siguiente choque de universos.",
    accent: "#4aa9dc",
    coverImage: "/editorial/fantastic-four.webp",
    coverPosition: "center 28%",
    estimatedMinutes: 245,
    steps: [
      { titleId: "los-cuatro-fantasticos-primeros-pasos", priority: "ESENCIAL", contribution: "Presenta al equipo, su dinámica familiar y Tierra-828.", spoiler: "La familia se enfrenta a Galactus dentro de su universo retrofuturista." },
      { titleId: "avengers-doomsday", priority: "DESTINO", contribution: "Será el siguiente capítulo de su relación con la saga multiversal.", spoiler: "Los detalles concretos de su participación todavía pertenecen al próximo destino." },
    ],
  },
  {
    slug: "incursiones",
    name: "Las incursiones",
    kicker: "CUANDO DOS UNIVERSOS CHOCAN",
    description: "Las historias que preparan el concepto más peligroso de la Saga del Multiverso.",
    accent: "#d76ad9",
    coverImage: "/titles/the-marvels.webp",
    coverPosition: "center 35%",
    estimatedMinutes: 690,
    steps: [
      { titleId: "loki-temporadas-1-y-2", priority: "RECOMENDADO", contribution: "Establece la coexistencia de innumerables ramas temporales.", spoiler: "El multiverso queda abierto y sostenido como un árbol de realidades." },
      { titleId: "spider-man-no-way-home", priority: "RECOMENDADO", contribution: "Enseña la fragilidad de la frontera entre universos.", spoiler: "Un hechizo atrae habitantes de otras realidades y casi provoca una ruptura irreversible." },
      { titleId: "doctor-strange-en-el-multiverso-de-la-locura", priority: "ESENCIAL", contribution: "Nombra y define directamente las incursiones.", spoiler: "La interferencia entre realidades puede hacer que una o ambas sean destruidas." },
      { titleId: "the-marvels", priority: "RECOMENDADO", contribution: "Muestra una grieta capaz de conectar universos distintos.", spoiler: "Monica queda atrapada al otro lado de una fractura entre realidades." },
      { titleId: "los-cuatro-fantasticos-primeros-pasos", priority: "ESENCIAL", contribution: "Establece otra Tierra destinada a entrar en la convergencia.", spoiler: "La Primera Familia existe en Tierra-828, separada de la continuidad principal." },
    ],
  },
];

export function getViewingRoute(slug: string) {
  return viewingRoutes.find((route) => route.slug === slug);
}

export function formatRouteDuration(minutes: number) {
  const hours = Math.round(minutes / 60);
  return `≈ ${hours} H`;
}

export type { ViewingPriority, ViewingRoute, ViewingRouteStep } from "@/types/viewingRoute";
