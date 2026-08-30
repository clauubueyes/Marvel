import type { Character, CharacterAppearance } from "@/lib/characters";
import { createContentSlug } from "@/lib/contentSlug";

export type CharacterSeed = Pick<Character, "id" | "name" | "alias" | "quote" | "universe" | "color" | "color2" | "power" | "symbol" | "image" | "sourceUrl" | "role" | "origin" | "description" | "abilities" | "category" | "status" | "affiliations" | "variants" | "screenMoment"> & {
  appearances: Array<Omit<CharacterAppearance, "titleId"> & { catalogTitle: string }>;
};

const reviewedAt = "2026-08-30";

const characterPortraits: Record<string, string> = {
  "yelena-belova": "https://cdn.marvel.com/u/prod/marvel/i/mg/3/70/68128d1f9a161.webp",
  "winter-soldier": "https://upload.wikimedia.org/wikipedia/en/9/9c/Bucky_%28James_Buchanan_Barnes%29.png",
  vision: "https://upload.wikimedia.org/wikipedia/en/3/3d/Vision_%28Marvel_Comics%29.png",
  "agatha-harkness": "https://upload.wikimedia.org/wikipedia/en/2/26/Agatha_Harkness_%282022_Design%29.webp",
  daredevil: "https://upload.wikimedia.org/wikipedia/en/1/14/Daredevil_65.jpg",
  kingpin: "https://upload.wikimedia.org/wikipedia/en/5/54/Kingpin_%28Wilson_Grant_Fisk%29.png",
  thanos: "https://upload.wikimedia.org/wikipedia/en/b/b7/Thanos_%28Infobox_image%29.png",
  shuri: "https://upload.wikimedia.org/wikipedia/en/2/2d/Shuri_as_Griot%2C_Black_Panther_%282018%29_Variant_Cover.jpg",
  "monica-rambeau": "https://upload.wikimedia.org/wikipedia/en/6/6e/Monica_Rambeau_as_Photon_%282022%29.webp",
};

const characterImagePositions: Partial<Record<string, string>> = {
  vision: "center 12%",
  kingpin: "center 8%",
};

export function buildCharacter(seed: CharacterSeed, number: number): Character {
  const appearances = seed.appearances.map(({ catalogTitle, ...appearance }) => ({ ...appearance, titleId: createContentSlug(catalogTitle) }));
  return {
    ...seed,
    image: characterPortraits[seed.id] ?? seed.image,
    imagePosition: characterImagePositions[seed.id],
    number: String(number).padStart(2, "0"),
    votes: 0,
    appearances,
    stats: seed.abilities.map((label, abilityIndex) => ({ label, value: 88 - abilityIndex * 5 })),
    timeline: appearances.slice(0, 3).map(({ year, title, event }) => ({ year, title, text: event })),
    facts: [
      { value: seed.category, label: "FUNCIÓN", text: `${seed.name} ocupa un lugar ${seed.role.toLocaleLowerCase("es")} dentro de la continuidad audiovisual.` },
      { value: seed.status, label: "ESTADO", text: `Estado editorial revisado el ${reviewedAt}.` },
      { value: String(appearances.length), label: "CAPÍTULOS", text: "Selección esencial enlazada automáticamente con el catálogo de títulos." },
    ],
    reviewedAt,
    sources: [{ label: "Ficha oficial del personaje", url: seed.sourceUrl }, { label: "Marvel Studios", url: "https://www.marvel.com/movies" }],
  };
}

const seeds: CharacterSeed[] = [
  {
    id: "yelena-belova", name: "YELENA BELOVA", alias: "Black Widow", quote: "La familia también puede elegirse.", universe: "Tierra-616", color: "#d8d3c7", color2: "#6f7b73", power: "Espionaje de élite", symbol: "⌛", image: "/api/title-image?title=Black%20Widow&type=PELÍCULA", sourceUrl: "https://www.marvel.com/characters/black-widow-yelena-belova", role: "La nueva viuda", origin: "Rusia · Habitación Roja", description: "Yelena fue entrenada para obedecer, pero convirtió su libertad en una misión: proteger a otras viudas y construir una identidad que no pertenezca a nadie más.", abilities: ["Espionaje", "Combate cuerpo a cuerpo", "Infiltración", "Tiro experto"], category: "ANTI-HÉROE", status: "ACTIVO", affiliations: ["Thunderbolts", "Viudas"], variants: [],
    appearances: [{ catalogTitle: "Black Widow", title: "Black Widow", year: "2021", type: "PELÍCULA", event: "Se reencuentra con Natasha y participa en la liberación de las agentes sometidas por la Habitación Roja." }, { catalogTitle: "Ojo de Halcón", title: "Ojo de Halcón", year: "2021", type: "SERIE", event: "Viaja a Nueva York siguiendo una pista sobre Natasha y termina cuestionando la misión que recibió." }, { catalogTitle: "Thunderbolts*", title: "Thunderbolts*", year: "2025", type: "PELÍCULA", event: "Una operación reúne a Yelena con otros agentes que buscan un propósito fuera de quienes los utilizaron." }], screenMoment: { videoId: "m9EX0f6V11Y", title: "Romper el control", kicker: "BLACK WIDOW · TRÁILER OFICIAL", text: "Yelena vuelve con Natasha al origen del programa que les arrebató la libertad." },
  },
  {
    id: "winter-soldier", name: "WINTER SOLDIER", alias: "Bucky Barnes", quote: "Estoy contigo hasta el final.", universe: "Tierra-616", color: "#657587", color2: "#b32631", power: "Supersoldado", symbol: "✪", image: "/api/title-image?title=Capitán%20América%3A%20El%20Soldado%20de%20Invierno&type=PELÍCULA", sourceUrl: "https://www.marvel.com/characters/winter-soldier-bucky-barnes", role: "El superviviente", origin: "Brooklyn · Nueva York", description: "Bucky Barnes sobrevivió a décadas de manipulación. Recuperar su memoria fue solo el principio: ahora decide por sí mismo qué hacer con la vida que le devolvieron.", abilities: ["Fuerza aumentada", "Brazo de vibranium", "Combate táctico", "Tiro experto"], category: "ANTI-HÉROE", status: "ACTIVO", affiliations: ["Thunderbolts", "Vengadores", "Comandos Aulladores"], variants: [],
    appearances: [{ catalogTitle: "Capitán América: El Primer Vengador", title: "El Primer Vengador", year: "2011", type: "PELÍCULA", event: "Combate junto a Steve y los Comandos Aulladores durante la Segunda Guerra Mundial." }, { catalogTitle: "Capitán América: El Soldado de Invierno", title: "El Soldado de Invierno", year: "2014", type: "PELÍCULA", event: "HYDRA lo utiliza como agente hasta que el vínculo con Steve empieza a quebrar su programación." }, { catalogTitle: "Falcon y el Soldado de Invierno", title: "Falcon y el Soldado de Invierno", year: "2021", type: "SERIE", event: "Afronta las consecuencias de su pasado mientras ayuda a Sam a asumir el escudo." }, { catalogTitle: "Thunderbolts*", title: "Thunderbolts*", year: "2025", type: "PELÍCULA", event: "Se cruza con un equipo de operativos marcados por decisiones ajenas y pasados difíciles." }], screenMoment: { videoId: "7SlILk2WMTI", title: "Una memoria bajo el hielo", kicker: "THE WINTER SOLDIER · TRÁILER OFICIAL", text: "Steve descubre que el enemigo que lo persigue conserva el rostro de su mejor amigo." },
  },
  {
    id: "vision", name: "VISION", alias: "Vision", quote: "Algo no es hermoso porque dure.", universe: "Tierra-616", color: "#c54552", color2: "#45a48c", power: "Mente sintética", symbol: "◆", image: "/api/title-image?title=WandaVision&type=SERIE", sourceUrl: "https://www.marvel.com/characters/vision", role: "El sintezoide", origin: "Torre de los Vengadores", description: "Nacido de tecnología, energía cósmica y una idea de humanidad, Vision observa el mundo con una curiosidad serena y aprende que sentir también implica aceptar la pérdida.", abilities: ["Control de densidad", "Vuelo", "Proyección de energía", "Inteligencia sintética"], category: "HÉROE", status: "ACTIVO", affiliations: ["Vengadores"], variants: [{ name: "Vision blanco", universe: "Tierra-616", description: "Cuerpo reconstruido por S.W.O.R.D. con recuerdos restaurados, pero una identidad aún abierta." }],
    appearances: [{ catalogTitle: "Vengadores: La Era de Ultrón", title: "La Era de Ultrón", year: "2015", type: "PELÍCULA", event: "Surge como una nueva forma de vida y ayuda a detener el plan de Ultron." }, { catalogTitle: "Capitán América: Civil War", title: "Civil War", year: "2016", type: "PELÍCULA", event: "Su relación con Wanda crece mientras los Vengadores se dividen por los Acuerdos." }, { catalogTitle: "WandaVision", title: "WandaVision", year: "2021", type: "SERIE", event: "La vida de Westview obliga a distintas versiones de Vision a preguntarse qué constituye una identidad." }], screenMoment: { videoId: "sj9J2ecsSpo", title: "Una vida imposible", kicker: "WANDAVISION · TRÁILER OFICIAL", text: "Vision empieza a percibir las grietas dentro de la realidad cotidiana de Westview." },
  },
  {
    id: "agatha-harkness", name: "AGATHA HARKNESS", alias: "Agnes", quote: "La magia siempre tiene un precio.", universe: "Tierra-616", color: "#713b8d", color2: "#202232", power: "Brujería", symbol: "✧", image: "/api/title-image?title=Agatha%2C%20¿quién%20si%20no%3F&type=SERIE", sourceUrl: "https://www.marvel.com/characters/agatha-harkness", role: "La bruja superviviente", origin: "Salem · Massachusetts", description: "Agatha lleva siglos estudiando la magia y sus reglas. Su apetito por el conocimiento la convierte tanto en amenaza como en guía para quienes atraviesan el mundo de la brujería.", abilities: ["Absorción mágica", "Hechicería", "Ilusiones", "Conocimiento arcano"], category: "ANTI-HÉROE", status: "ACTIVO", affiliations: ["Aquelarre de la Senda"], variants: [],
    appearances: [{ catalogTitle: "WandaVision", title: "WandaVision", year: "2021", type: "SERIE", event: "Investiga el Hex de Westview y empuja a Wanda a comprender el origen de su poder." }, { catalogTitle: "Agatha, ¿quién si no?", title: "Agatha, ¿quién si no?", year: "2024", type: "SERIE", event: "Sin sus poderes, reúne un nuevo aquelarre para recorrer una senda ligada a deseos y pérdidas." }], screenMoment: { videoId: "R9pXbNz6Vbw", title: "La senda vuelve a abrirse", kicker: "AGATHA · TRÁILER OFICIAL", text: "Una bruja sin poder reúne aliados improbables para recuperar lo que perdió." },
  },
  {
    id: "daredevil", name: "DAREDEVIL", alias: "Matt Murdock", quote: "La justicia puede necesitar que alguien se levante.", universe: "Tierra-616", color: "#9b151d", color2: "#262626", power: "Sentidos aumentados", symbol: "⚖", image: "/api/title-image?title=Daredevil%3A%20Born%20Again&type=SERIE", sourceUrl: "https://www.marvel.com/characters/daredevil-matthew-murdock", role: "El vigilante de Hell's Kitchen", origin: "Hell's Kitchen · Nueva York", description: "Abogado de día y vigilante de noche, Matt Murdock intenta que la ley y su propia conciencia conduzcan al mismo lugar, incluso cuando la ciudad pone ambas convicciones a prueba.", abilities: ["Sentidos aumentados", "Artes marciales", "Ecolocalización", "Derecho penal"], category: "HÉROE", status: "ACTIVO", affiliations: ["Nelson, Murdock & Page", "Defenders"], variants: [],
    appearances: [{ catalogTitle: "Daredevil · Temporada 1", title: "Daredevil", year: "2015", type: "SERIE", event: "Defiende Hell's Kitchen en los tribunales y en sus calles frente al ascenso de Wilson Fisk." }, { catalogTitle: "Spider-Man: No Way Home", title: "No Way Home", year: "2021", type: "PELÍCULA", event: "Asesora legalmente a Peter Parker cuando su identidad se convierte en asunto público." }, { catalogTitle: "Daredevil: Born Again · Temporada 1", title: "Daredevil: Born Again", year: "2025", type: "SERIE", event: "El regreso de Fisk a la vida pública obliga a Matt a reconsiderar cómo protege su ciudad." }], screenMoment: { videoId: "7xALolZzhSM", title: "La ciudad vuelve a llamar", kicker: "BORN AGAIN · TRÁILER OFICIAL", text: "Matt y Fisk regresan a una Nueva York donde sus caminos nunca permanecen separados mucho tiempo." },
  },
  {
    id: "kingpin", name: "KINGPIN", alias: "Wilson Fisk", quote: "La ciudad necesita orden.", universe: "Tierra-616", color: "#e7e0d3", color2: "#472128", power: "Poder criminal", symbol: "♛", image: "/api/title-image?title=Daredevil%3A%20Born%20Again&type=SERIE", sourceUrl: "https://www.marvel.com/characters/kingpin-wilson-fisk", role: "El señor del crimen", origin: "Nueva York", description: "Wilson Fisk presenta su ambición como servicio público. Detrás de esa promesa existe una red de influencia, fuerza y miedo diseñada para convertir la ciudad en una extensión de su voluntad.", abilities: ["Estrategia criminal", "Influencia política", "Fuerza física", "Manipulación"], category: "VILLANO", status: "ACTIVO", affiliations: ["Imperio criminal de Fisk"], variants: [],
    appearances: [{ catalogTitle: "Daredevil · Temporada 1", title: "Daredevil", year: "2015", type: "SERIE", event: "Intenta reconstruir Hell's Kitchen bajo su control y encuentra en Daredevil a su principal oposición." }, { catalogTitle: "Ojo de Halcón", title: "Ojo de Halcón", year: "2021", type: "SERIE", event: "Su red criminal conecta el pasado de Maya López con los conflictos de Clint y Kate." }, { catalogTitle: "Daredevil: Born Again · Temporada 1", title: "Daredevil: Born Again", year: "2025", type: "SERIE", event: "Traslada su influencia a la política mientras su rival vuelve a actuar en las calles." }], screenMoment: { videoId: "7xALolZzhSM", title: "Poder con rostro público", kicker: "BORN AGAIN · TRÁILER OFICIAL", text: "Fisk busca legitimidad política sin abandonar las herramientas que construyeron su imperio." },
  },
  {
    id: "thanos", name: "THANOS", alias: "El Titán Loco", quote: "El universo exige equilibrio.", universe: "Tierra-616", color: "#75558f", color2: "#d5a637", power: "Poder de las Gemas", symbol: "∞", image: "/api/title-image?title=Vengadores%3A%20Infinity%20War&type=PELÍCULA", sourceUrl: "https://www.marvel.com/characters/thanos", role: "La amenaza del Infinito", origin: "Titán", description: "Thanos convierte una conclusión monstruosa en una cruzada personal. Su paciencia, sus ejércitos y su búsqueda de las Gemas obligan a héroes de toda la galaxia a formar un frente común.", abilities: ["Fuerza titánica", "Estrategia", "Combate", "Guantelete del Infinito"], category: "VILLANO", status: "INACTIVO", affiliations: ["Orden Negra"], variants: [{ name: "Thanos", universe: "Realidad de los Illuminati", description: "Variante derrotada antes de completar su cruzada por las Gemas." }],
    appearances: [{ catalogTitle: "Guardianes de la Galaxia", title: "Guardianes de la Galaxia", year: "2014", type: "PELÍCULA", event: "Su búsqueda de una Gema conecta a Ronan, Gamora y Nebula con un conflicto galáctico mayor." }, { catalogTitle: "Vengadores: Infinity War", title: "Infinity War", year: "2018", type: "PELÍCULA", event: "Recorre el universo reuniendo las seis Gemas frente a héroes que aún combaten separados." }, { catalogTitle: "Vengadores: Endgame", title: "Endgame", year: "2019", type: "PELÍCULA", event: "Las consecuencias de su victoria reúnen a los supervivientes para un último intento de reparación." }], screenMoment: { videoId: "6ZfuNTqbHE8", title: "La guerra por las Gemas", kicker: "INFINITY WAR · TRÁILER OFICIAL", text: "La amenaza que llevaba años creciendo obliga a todos los frentes del MCU a converger." },
  },
  {
    id: "shuri", name: "BLACK PANTHER", alias: "Shuri", quote: "El futuro de Wakanda también se construye.", universe: "Tierra-616", color: "#6d45a5", color2: "#c9a94e", power: "Pantera y científica", symbol: "◇", image: "/api/title-image?title=Black%20Panther%3A%20Wakanda%20Forever&type=PELÍCULA", sourceUrl: "https://www.marvel.com/characters/shuri", role: "La protectora de Wakanda", origin: "Birnin Zana · Wakanda", description: "Inventora brillante y heredera de una nación herida, Shuri debe reconciliar ciencia, tradición y duelo para decidir qué clase de protectora necesita Wakanda.", abilities: ["Tecnología de vibranium", "Combate", "Sentidos elevados", "Ingeniería"], category: "HÉROE", status: "ACTIVO", affiliations: ["Wakandianos"], variants: [],
    appearances: [{ catalogTitle: "Black Panther", title: "Black Panther", year: "2018", type: "PELÍCULA", event: "Equipa a T'Challa con tecnología de vibranium y dirige la defensa desde su laboratorio." }, { catalogTitle: "Vengadores: Infinity War", title: "Infinity War", year: "2018", type: "PELÍCULA", event: "Intenta separar la Gema de la Mente de Vision durante la batalla de Wakanda." }, { catalogTitle: "Black Panther: Wakanda Forever", title: "Wakanda Forever", year: "2022", type: "PELÍCULA", event: "El duelo y una amenaza internacional la empujan a asumir una nueva responsabilidad por su pueblo." }], screenMoment: { videoId: "RlOB3UALvrQ", title: "Una nación debe continuar", kicker: "WAKANDA FOREVER · TRÁILER OFICIAL", text: "Shuri busca una respuesta para Wakanda entre el legado recibido y el futuro que puede diseñar." },
  },
];

export const expandedCharacters = seeds.map((seed, index) => buildCharacter(seed, index + 14));
