import type { MCUEntity, MCUEntityKind } from "@/types/entity";

export const events: MCUEntity[] = [
  {
    kind: "EVENTO", slug: "batalla-de-nueva-york", name: "Batalla de Nueva York", kicker: "2012 · LA PRIMERA UNIÓN",
    summary: "La invasión Chitauri que convirtió a los Vengadores en un equipo y cambió para siempre la percepción pública de los superhéroes.",
    description: "Loki utiliza el Teseracto para abrir un portal sobre Manhattan. Iron Man, Capitán América, Thor, Hulk, Black Widow y Hawkeye combaten juntos por primera vez. El acontecimiento deja tecnología alienígena en la Tierra, provoca el trauma de Tony Stark y se convierte más tarde en un punto crítico del viaje temporal y de la TVA.",
    status: "CONFIRMADO EN PANTALLA", color: "#4da6d8", symbol: "A",
    titleIds: ["los-vengadores", "vengadores-endgame", "loki-temporadas-1-y-2"], characterIds: ["iron", "captain-america", "thor", "hulk", "black-widow", "hawkeye", "loki"],
    connections: [{ kind: "EQUIPO", slug: "vengadores", label: "El equipo nace durante la batalla" }, { kind: "EVENTO", slug: "ruptura-del-multiverso", label: "El viaje a 2012 crea una variante" }],
  },
  {
    kind: "EVENTO", slug: "caida-de-sokovia", name: "Caída de Sokovia", kicker: "2015 · EL COSTE DE ULTRÓN",
    summary: "La destrucción de Sokovia que desemboca en los Acuerdos y en la ruptura política de los Vengadores.",
    description: "Ultron eleva la capital de Sokovia para usarla como un meteorito. Los Vengadores detienen la extinción, pero no pueden evitar la destrucción del país ni numerosas víctimas. Las consecuencias impulsan los Acuerdos de Sokovia, radicalizan a Helmut Zemo y sitúan a Wanda en el centro del debate sobre el control de los héroes.",
    status: "CONFIRMADO EN PANTALLA", color: "#d36c43", symbol: "S",
    titleIds: ["vengadores-la-era-de-ultron", "capitan-america-civil-war", "falcon-y-el-soldado-de-invierno"], characterIds: ["iron", "captain-america", "wanda", "thor", "hulk", "black-widow", "hawkeye", "sam-wilson"],
    connections: [{ kind: "EQUIPO", slug: "vengadores", label: "Provoca la fractura del equipo" }, { kind: "EVENTO", slug: "el-blip", label: "Debilita al grupo antes de Thanos" }],
  },
  {
    kind: "EVENTO", slug: "el-blip", name: "El Blip", kicker: "2018–2023 · CINCO AÑOS AUSENTES",
    summary: "La desaparición y el regreso de la mitad de la vida del universo tras los dos chasquidos con las Gemas del Infinito.",
    description: "Thanos elimina a la mitad de los seres vivos. Cinco años después, los Vengadores recuperan las Gemas mediante un atraco temporal y Hulk revierte la desaparición. El regreso no borra los años perdidos: transforma gobiernos, familias, fronteras y la vida de prácticamente todos los personajes posteriores.",
    status: "CONFIRMADO EN PANTALLA", color: "#b276d8", symbol: "½",
    titleIds: ["vengadores-infinity-war", "vengadores-endgame", "falcon-y-el-soldado-de-invierno", "spider-man-lejos-de-casa"], characterIds: ["iron", "spider", "strange", "panther", "wanda", "captain-america", "thor", "hulk", "black-widow", "hawkeye", "loki", "captain-marvel", "sam-wilson"],
    connections: [{ kind: "EQUIPO", slug: "vengadores", label: "Sus supervivientes revierten el Chasquido" }, { kind: "EVENTO", slug: "ruptura-del-multiverso", label: "El atraco temporal genera nuevas ramas" }],
  },
  {
    kind: "EVENTO", slug: "ruptura-del-multiverso", name: "Ruptura del multiverso", kicker: "VARIANTES · RAMAS · TVA",
    summary: "La liberación de las líneas temporales y las fracturas que permiten el contacto entre realidades completas.",
    description: "La muerte de He Who Remains elimina el control de una única Línea Temporal Sagrada. Las ramas crecen, la TVA cambia su misión y distintas interferencias permiten que variantes y habitantes de otros universos atraviesen fronteras que antes permanecían separadas.",
    status: "CONTEXTO EDITORIAL", color: "#8f5bc4", symbol: "∞",
    titleIds: ["loki-temporadas-1-y-2", "spider-man-no-way-home", "doctor-strange-en-el-multiverso-de-la-locura", "deadpool-y-lobezno"], characterIds: ["loki", "spider", "strange", "wanda"],
    connections: [{ kind: "EQUIPO", slug: "tva", label: "Vigila las nuevas ramas temporales" }, { kind: "EVENTO", slug: "incursiones", label: "La interferencia entre realidades aumenta el riesgo" }, { kind: "UNIVERSO", slug: "tierra-616", label: "La realidad principal queda expuesta" }],
  },
  {
    kind: "EVENTO", slug: "incursiones", name: "Incursiones", kicker: "DOS REALIDADES · UNA COLISIÓN",
    summary: "El peligro de que dos universos interfieran hasta colisionar y provocar la destrucción de uno o de ambos.",
    description: "El MCU presenta las incursiones como una consecuencia extrema de viajar o actuar entre universos. Los detalles de la crisis futura todavía no están completos, pero la advertencia de Clea, la grieta abierta por Monica Rambeau y la llegada de nuevas realidades colocan el concepto en el centro del camino hacia Doomsday.",
    status: "CONTEXTO EDITORIAL", color: "#d763cf", symbol: "◎",
    titleIds: ["doctor-strange-en-el-multiverso-de-la-locura", "the-marvels", "los-cuatro-fantasticos-primeros-pasos", "avengers-doomsday"], characterIds: ["strange", "wanda", "captain-marvel"],
    connections: [{ kind: "EVENTO", slug: "ruptura-del-multiverso", label: "Las ramas hacen posible la interferencia" }, { kind: "UNIVERSO", slug: "tierra-828", label: "Una realidad separada entra en la saga" }, { kind: "EQUIPO", slug: "fantastic-four", label: "La Primera Familia procede de otra Tierra" }],
  },
];

export const universes: MCUEntity[] = [
  {
    kind: "UNIVERSO", slug: "tierra-616", name: "Tierra-616", kicker: "CONTINUIDAD PRINCIPAL",
    summary: "La realidad donde transcurre la historia central del MCU y a la que pertenecen sus Vengadores.",
    description: "Es la continuidad de Iron Man, Steve Rogers, Wanda Maximoff y la mayoría de las historias de Marvel Studios. El nombre se verbaliza dentro del propio MCU, aunque otras clasificaciones externas hayan utilizado números diferentes. NEXUS emplea Tierra-616 porque es la denominación establecida en pantalla.",
    status: "CONFIRMADO EN PANTALLA", color: "#b9d737", symbol: "616",
    titleIds: ["iron-man", "los-vengadores", "vengadores-endgame", "doctor-strange-en-el-multiverso-de-la-locura"], characterIds: ["spider", "iron", "strange", "panther", "wanda", "captain-america", "thor", "hulk", "black-widow", "hawkeye", "loki", "captain-marvel", "sam-wilson"],
    connections: [{ kind: "EQUIPO", slug: "vengadores", label: "Sus principales defensores" }, { kind: "EVENTO", slug: "incursiones", label: "Amenazada por la interferencia multiversal" }],
  },
  {
    kind: "UNIVERSO", slug: "tierra-828", name: "Tierra-828", kicker: "MUNDO RETROFUTURISTA",
    summary: "La realidad alternativa de los Fantastic Four, marcada por una tecnología avanzada y una estética inspirada en los años sesenta.",
    description: "Esta Tierra presenta una historia, cultura y desarrollo tecnológico propios. No es el pasado de la continuidad principal. Su existencia permite que la Primera Familia tenga una trayectoria consolidada antes de cruzarse con otros protagonistas de la Saga del Multiverso.",
    status: "CONFIRMADO EN PANTALLA", color: "#45a9db", symbol: "828",
    titleIds: ["los-cuatro-fantasticos-primeros-pasos", "avengers-doomsday"], characterIds: [],
    connections: [{ kind: "EQUIPO", slug: "fantastic-four", label: "Los protectores de esta realidad" }, { kind: "EVENTO", slug: "incursiones", label: "Su conexión futura amenaza las fronteras" }],
  },
  {
    kind: "UNIVERSO", slug: "universos-heredados", name: "Universos heredados", kicker: "HISTORIAS ANTERIORES AL MCU",
    summary: "Realidades procedentes de otras sagas cinematográficas que ahora forman parte del mapa multiversal.",
    description: "Las historias audiovisuales de otros Spider-Man, mutantes y héroes producidas fuera de la continuidad principal no se reescriben como Tierra-616. El MCU las conecta como universos independientes, preservando sus versiones de personajes y acontecimientos.",
    status: "CONTEXTO EDITORIAL", color: "#e19b3d", symbol: "X",
    titleIds: ["spider-man-no-way-home", "deadpool-y-lobezno", "x-men-97"], characterIds: ["spider"],
    connections: [{ kind: "EVENTO", slug: "ruptura-del-multiverso", label: "Permite el contacto entre continuidades" }, { kind: "EQUIPO", slug: "tva", label: "Supervisa el destino de estas realidades" }],
  },
];

export const teams: MCUEntity[] = [
  {
    kind: "EQUIPO", slug: "vengadores", name: "Los Vengadores", kicker: "LA INICIATIVA",
    summary: "El equipo de respuesta formado para proteger la Tierra de amenazas que ningún héroe podría detener por separado.",
    description: "La iniciativa de Nick Fury reúne por primera vez a seis héroes durante la Batalla de Nueva York. Su formación cambia, se rompe por los Acuerdos de Sokovia y vuelve a reunirse contra Thanos. Su legado continúa incluso cuando la alineación original deja de existir.",
    status: "CONFIRMADO EN PANTALLA", color: "#4d9fd4", symbol: "A",
    titleIds: ["los-vengadores", "vengadores-la-era-de-ultron", "capitan-america-civil-war", "vengadores-infinity-war", "vengadores-endgame"], characterIds: ["iron", "captain-america", "thor", "hulk", "black-widow", "hawkeye", "wanda", "sam-wilson"],
    connections: [{ kind: "EVENTO", slug: "batalla-de-nueva-york", label: "Su primera misión conjunta" }, { kind: "EVENTO", slug: "caida-de-sokovia", label: "El comienzo de su ruptura" }, { kind: "EVENTO", slug: "el-blip", label: "Su mayor derrota y victoria" }],
  },
  {
    kind: "EQUIPO", slug: "tva", name: "TVA", kicker: "AUTORIDAD DE VARIACIÓN TEMPORAL",
    summary: "La organización situada fuera del tiempo que pasó de podar variantes a proteger un multiverso ramificado.",
    description: "Creada para mantener el orden impuesto por He Who Remains, la TVA elimina inicialmente cualquier desviación de la Línea Temporal Sagrada. Loki y Sylvie revelan su origen. Después del sacrificio de Loki, la organización redirige su misión hacia la vigilancia de amenazas multiversales.",
    status: "CONFIRMADO EN PANTALLA", color: "#df983d", symbol: "TVA",
    titleIds: ["loki-temporadas-1-y-2", "deadpool-y-lobezno"], characterIds: ["loki"],
    connections: [{ kind: "EVENTO", slug: "ruptura-del-multiverso", label: "Se reorganiza tras la liberación de las ramas" }, { kind: "UNIVERSO", slug: "universos-heredados", label: "Interviene en realidades fuera de Tierra-616" }],
  },
  {
    kind: "EQUIPO", slug: "fantastic-four", name: "Fantastic Four", kicker: "LA PRIMERA FAMILIA",
    summary: "Reed Richards, Sue Storm, Johnny Storm y Ben Grimm: exploradores y protectores de Tierra-828.",
    description: "Más que un equipo táctico, los Fantastic Four son una familia unida por la exploración científica y una transformación compartida. Su experiencia cósmica y su procedencia multiversal los sitúan entre las piezas esenciales del camino hacia Doomsday.",
    status: "CONFIRMADO EN PANTALLA", color: "#48a9dc", symbol: "4",
    titleIds: ["los-cuatro-fantasticos-primeros-pasos", "avengers-doomsday"], characterIds: [],
    connections: [{ kind: "UNIVERSO", slug: "tierra-828", label: "Su realidad de origen" }, { kind: "EVENTO", slug: "incursiones", label: "El conflicto que conecta su mundo" }],
  },
  {
    kind: "EQUIPO", slug: "guardianes-de-la-galaxia", name: "Guardianes de la Galaxia", kicker: "UNA FAMILIA ELEGIDA",
    summary: "Un grupo de inadaptados que pasa de buscar beneficio propio a defender juntos la galaxia.",
    description: "Peter Quill, Gamora, Rocket, Groot y Drax forman el núcleo original durante la defensa de Xandar. Sus integrantes y objetivos cambian, pero la identidad del grupo permanece ligada a la familia elegida y a la protección de quienes no pueden defenderse.",
    status: "CONFIRMADO EN PANTALLA", color: "#d4688a", symbol: "G",
    titleIds: ["guardianes-de-la-galaxia", "guardianes-de-la-galaxia-vol-2", "vengadores-infinity-war", "guardianes-de-la-galaxia-vol-3"], characterIds: [],
    connections: [{ kind: "EVENTO", slug: "el-blip", label: "Combaten a Thanos y sufren el Chasquido" }, { kind: "UNIVERSO", slug: "tierra-616", label: "Actúan dentro de la continuidad principal" }],
  },
];

export const mcuEntities = [...events, ...universes, ...teams];

export function getMCUEntity(kind: MCUEntityKind, slug: string) {
  return mcuEntities.find((entity) => entity.kind === kind && entity.slug === slug);
}

export function getEntityHref(entity: Pick<MCUEntity, "kind" | "slug">) {
  const roots: Record<MCUEntityKind, string> = { EVENTO: "eventos", UNIVERSO: "universos", EQUIPO: "equipos" };
  return `/${roots[entity.kind]}/${entity.slug}`;
}

export type { EditorialStatus, MCUEntity, MCUEntityConnection, MCUEntityKind } from "@/types/entity";
