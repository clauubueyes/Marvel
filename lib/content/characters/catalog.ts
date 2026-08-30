import { createContentSlug } from "@/lib/contentSlug";
import { getCharacterEditorialData } from "@/lib/content/characters/editorial";
import { expandedCharacters } from "@/lib/content/characters/expanded";
import { additionalCharacters } from "@/lib/content/characters/additional";
import { essentialCharacters } from "@/lib/content/characters/essential";
import { heroCharacters } from "@/lib/content/characters/heroes";

export type CharacterAppearance = {
  titleId: string;
  title: string;
  year: string;
  type: "PELÍCULA" | "SERIE";
  event: string;
};

export type Character = {
  id: string;
  name: string;
  alias: string;
  number: string;
  quote: string;
  universe: string;
  color: string;
  color2: string;
  power: string;
  symbol: string;
  votes: number;
  image: string;
  imagePosition?: string;
  sourceUrl: string;
  role: string;
  origin: string;
  description: string;
  stats: { label: string; value: number }[];
  abilities: string[];
  timeline: { year: string; title: string; text: string }[];
  facts: { value: string; label: string; text: string }[];
  appearances: CharacterAppearance[];
  screenMoment: { videoId: string; title: string; kicker: string; text: string };
  category: "HÉROE" | "VILLANO" | "SECUNDARIO" | "ANTI-HÉROE";
  status: "ACTIVO" | "INACTIVO" | "DESCONOCIDO";
  affiliations: string[];
  variants: { name: string; universe: string; description: string }[];
  sources: { label: string; url: string }[];
  reviewedAt: string;
};

type CharacterEntry = Omit<Character, "appearances" | "category" | "status" | "affiliations" | "variants" | "sources" | "reviewedAt"> & {
  appearances: Omit<CharacterAppearance, "titleId">[];
};

const characterEntries: CharacterEntry[] = [
  {
    id: "spider", name: "SPIDER-MAN", alias: "Peter Parker", number: "01",
    quote: "Un gran poder conlleva una gran responsabilidad.", universe: "Tierra-616",
    color: "#ed1b24", color2: "#1261ff", power: "Sentido arácnido", symbol: "🕸", votes: 4821,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg", sourceUrl: "https://www.marvel.com/characters/spider-man-peter-parker/",
    role: "El héroe cercano", origin: "Queens · Nueva York",
    description: "Ciencia, vértigo y un sentido de la responsabilidad demasiado grande para un solo adolescente. Peter convierte cada caída en una razón para volver a levantarse.",
    stats: [{ label: "Agilidad", value: 96 }, { label: "Ingenio", value: 89 }, { label: "Fuerza", value: 78 }, { label: "Voluntad", value: 94 }],
    abilities: ["Sentido arácnido", "Adherencia", "Fuerza aumentada", "Ingeniería web"],
    timeline: [{ year: "2016", title: "Civil War", text: "Tony Stark recluta al joven héroe de Queens para el enfrentamiento de los Vengadores." }, { year: "2019", title: "El regreso", text: "Peter vuelve tras el Blip y combate junto a los héroes contra Thanos." }, { year: "2021", title: "Nadie recuerda", text: "Sacrifica su identidad para cerrar una fractura entre universos." }],
    facts: [{ value: "15", label: "AÑOS", text: "La edad aproximada de Peter al comenzar su etapa heroica en el MCU." }, { value: "3", label: "VERSIONES", text: "Tres Peter Parker de universos distintos colaboran en No Way Home." }, { value: "1", label: "SECRETO", text: "El mundo olvida quién es Peter Parker para contener la fractura multiversal." }],
    appearances: [{ title: "Civil War", year: "2016", type: "PELÍCULA", event: "Tony Stark recluta a Peter para detener al equipo de Steve Rogers. Su entusiasmo contrasta con una ruptura de los Vengadores que todavía no comprende." }, { title: "Homecoming", year: "2017", type: "PELÍCULA", event: "Peter desafía a Adrian Toomes sin el traje de Stark y demuestra que su heroísmo no depende de la tecnología ni de pertenecer a los Vengadores." }, { title: "Far From Home", year: "2019", type: "PELÍCULA", event: "Tras el Blip y la muerte de Tony, Mysterio manipula a Peter, se apodera de EDITH y revela públicamente su identidad." }, { title: "No Way Home", year: "2021", type: "PELÍCULA", event: "Un hechizo atrae visitantes de otros universos. Peter salva a sus enemigos y acepta que todo el mundo olvide quién es para cerrar la fractura." }],
    screenMoment: { videoId: "JfVOs4VSpmA", title: "El multiverso llama a la puerta", kicker: "NO WAY HOME · TRÁILER OFICIAL", text: "Peter intenta recuperar su identidad secreta y convierte una decisión desesperada en una fractura de la realidad." },
  },
  {
    id: "iron", name: "IRON MAN", alias: "Tony Stark", number: "02",
    quote: "La armadura es solo el principio.", universe: "Tierra-616",
    color: "#ff3b19", color2: "#ffc400", power: "Ingenio sin límites", symbol: "◉", votes: 3954,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg", sourceUrl: "https://www.marvel.com/characters/iron-man-tony-stark/",
    role: "El futurista", origin: "Manhattan · Nueva York",
    description: "Inventor, provocador y arquitecto del mañana. Tony Stark construye soluciones imposibles y aprende que el metal más resistente sigue necesitando un corazón.",
    stats: [{ label: "Ingenio", value: 100 }, { label: "Tecnología", value: 99 }, { label: "Estrategia", value: 88 }, { label: "Voluntad", value: 84 }],
    abilities: ["Armadura modular", "Vuelo supersónico", "Energía repulsora", "IA táctica"],
    timeline: [{ year: "2008", title: "Mark I", text: "Una prisión se convierte en el taller de su primera armadura." }, { year: "2012", title: "La iniciativa", text: "Stark comprende que incluso un genio necesita un equipo." }, { year: "2023", title: "El sacrificio", text: "Usa las Gemas para detener a Thanos y entrega su vida por el universo." }],
    facts: [{ value: "2008", label: "EL INICIO", text: "Iron Man inauguró la historia cinematográfica conectada del MCU." }, { value: "3000", label: "TE QUIERO", text: "Una frase familiar que se convirtió en el corazón emocional de su despedida." }, { value: "85", label: "MARK", text: "La armadura usada durante la batalla definitiva contra Thanos." }],
    appearances: [{ title: "Iron Man", year: "2008", type: "PELÍCULA", event: "Tony escapa del cautiverio construyendo la Mark I, abandona la fabricación de armas y revela al mundo que él es Iron Man." }, { title: "The Avengers", year: "2012", type: "PELÍCULA", event: "Aprende a combatir como parte de un equipo y atraviesa el portal de Nueva York con un misil nuclear para salvar la ciudad." }, { title: "Civil War", year: "2016", type: "PELÍCULA", event: "La culpa por Sokovia lo lleva a defender los Acuerdos. La verdad sobre la muerte de sus padres termina rompiendo su relación con Steve." }, { title: "Endgame", year: "2019", type: "PELÍCULA", event: "Resuelve el viaje temporal, recupera a quienes desaparecieron y usa las Gemas para eliminar a Thanos a costa de su propia vida." }],
    screenMoment: { videoId: "Ke1Y3P9D0Bc", title: "Enfrentarse a sus propios fantasmas", kicker: "IRON MAN 3 · TRÁILER OFICIAL", text: "Sin respuestas fáciles ni una armadura infalible, Tony debe descubrir qué queda del héroe cuando todo lo demás desaparece." },
  },
  {
    id: "strange", name: "DOCTOR STRANGE", alias: "Stephen Strange", number: "03",
    quote: "La realidad es una de muchas posibilidades.", universe: "Tierra-616",
    color: "#f257ff", color2: "#00d9ff", power: "Artes místicas", symbol: "◎", votes: 3267,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe.jpg", sourceUrl: "https://www.marvel.com/characters/doctor-strange-stephen-strange/",
    role: "El guardián místico", origin: "Sanctum Sanctorum · Nueva York",
    description: "Cuando la ciencia dejó de darle respuestas, Stephen Strange aprendió a formular preguntas nuevas. Ahora protege las fronteras que la realidad no puede ver.",
    stats: [{ label: "Magia", value: 100 }, { label: "Conocimiento", value: 97 }, { label: "Estrategia", value: 91 }, { label: "Fuerza", value: 48 }],
    abilities: ["Portales", "Proyección astral", "Hechicería", "Manipulación temporal"],
    timeline: [{ year: "2016", title: "La búsqueda", text: "Un cirujano brillante aprende las artes místicas tras perder el control de sus manos." }, { year: "2018", title: "La única victoria", text: "Examina millones de futuros y entrega la Gema del Tiempo para alcanzar uno posible." }, { year: "2022", title: "La incursión", text: "Clea le advierte de una incursión y lo conduce hacia la Dimensión Oscura." }],
    facts: [{ value: "14M", label: "FUTUROS", text: "Strange examinó millones de resultados posibles antes de elegir un único camino." }, { value: "177A", label: "BLEECKER", text: "La dirección del Sanctum Sanctorum en Greenwich Village." }, { value: "1", label: "JURAMENTO", text: "Antes de dominar la magia juró salvar vidas como médico." }],
    appearances: [{ title: "Doctor Strange", year: "2016", type: "PELÍCULA", event: "La pérdida del control de sus manos conduce a Strange hacia Kamar-Taj, donde derrota a Dormammu mediante un bucle temporal." }, { title: "Infinity War", year: "2018", type: "PELÍCULA", event: "Observa más de catorce millones de futuros y entrega la Gema del Tiempo para preservar la única posibilidad de victoria." }, { title: "No Way Home", year: "2021", type: "PELÍCULA", event: "Su hechizo incompleto abre la frontera multiversal. Después intenta contener a los visitantes y cerrar la ruptura final." }, { title: "Multiverse of Madness", year: "2022", type: "PELÍCULA", event: "Protege a América Chávez, atraviesa realidades y utiliza el Darkhold antes de que Clea le advierta que ha causado una incursión." }],
    screenMoment: { videoId: "aWzlQ2N6qqg", title: "La realidad pierde sus límites", kicker: "MULTIVERSE OF MADNESS · TRÁILER OFICIAL", text: "Las decisiones de Strange abren dimensiones imposibles y le obligan a mirar versiones de sí mismo que nunca quiso conocer." },
  },
  {
    id: "panther", name: "BLACK PANTHER", alias: "T'Challa", number: "04",
    quote: "Wakanda no observa la historia. La escribe.", universe: "Tierra-616",
    color: "#9d5cff", color2: "#27e6bb", power: "Corazón de Wakanda", symbol: "◇", votes: 3710,
    image: "https://cdn.marvel.com/content/1x/blackpanther_lob_crd_01_4.jpg", sourceUrl: "https://www.marvel.com/characters/black-panther-t-challa/",
    role: "El rey", origin: "Birnin Zana · Wakanda",
    description: "Científico, guerrero y soberano. T'Challa camina entre la tradición y el futuro, llevando consigo el peso de una nación que nunca dejó de avanzar.",
    stats: [{ label: "Estrategia", value: 98 }, { label: "Agilidad", value: 92 }, { label: "Tecnología", value: 96 }, { label: "Liderazgo", value: 100 }],
    abilities: ["Sentidos elevados", "Traje de vibranium", "Combate experto", "Mente estratégica"],
    timeline: [{ year: "2016", title: "Civil War", text: "T'Challa persigue al responsable de la muerte de su padre y elige romper el ciclo de venganza." }, { year: "2018", title: "Fronteras abiertas", text: "El rey decide compartir el conocimiento de Wakanda con el mundo." }, { year: "2023", title: "La batalla final", text: "Regresa tras el Blip para combatir contra Thanos junto a los Vengadores." }],
    facts: [{ value: "2016", label: "DEBUT MCU", text: "T'Challa aparece por primera vez en pantalla en Captain America: Civil War." }, { value: "5", label: "TRIBUS", text: "Las grandes tribus que conforman la sociedad wakandiana mostrada en el MCU." }, { value: "∞", label: "LEGADO", text: "La Pantera es un manto y una responsabilidad, no solo una identidad." }],
    appearances: [{ title: "Civil War", year: "2016", type: "PELÍCULA", event: "T'Challa persigue a Bucky por la muerte de su padre, descubre la manipulación de Zemo y decide romper el ciclo de venganza." }, { title: "Black Panther", year: "2018", type: "PELÍCULA", event: "Defiende el trono frente a Killmonger y transforma la política de Wakanda al decidir compartir su conocimiento con el mundo." }, { title: "Infinity War", year: "2018", type: "PELÍCULA", event: "Abre Wakanda a los Vengadores para proteger a Vision y lidera la defensa contra el ejército de Thanos antes de desaparecer en el Blip." }, { title: "Endgame", year: "2019", type: "PELÍCULA", event: "Regresa a través de los portales de Wakanda y combate junto a todos los héroes en la batalla final contra Thanos." }],
    screenMoment: { videoId: "xjDjIWPwcPU", title: "Un rey vuelve a casa", kicker: "BLACK PANTHER · TRÁILER OFICIAL", text: "T'Challa regresa a Wakanda para heredar el trono y descubre que gobernar exige mucho más que vencer en combate." },
  },
  {
    id: "wanda", name: "SCARLET WITCH", alias: "Wanda Maximoff", number: "05",
    quote: "El caos también sabe crear.", universe: "Tierra-616",
    color: "#ff174f", color2: "#9b004e", power: "Magia del caos", symbol: "✦", votes: 4420,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/9/b0/537bc2375dfb9.jpg", sourceUrl: "https://www.marvel.com/characters/scarlet-witch-wanda-maximoff/",
    role: "La anomalía", origin: "Sokovia · Europa Oriental",
    description: "La probabilidad se curva a su alrededor. Wanda no solo altera el mundo: lucha constantemente por decidir qué parte de él debería permanecer intacta.",
    stats: [{ label: "Magia", value: 100 }, { label: "Realidad", value: 100 }, { label: "Voluntad", value: 91 }, { label: "Control", value: 62 }],
    abilities: ["Magia del caos", "Telequinesis", "Alteración mental", "Realidad mutable"],
    timeline: [{ year: "2015", title: "Una vengadora", text: "Rompe con Ultron y encuentra una familia entre los Vengadores." }, { year: "2023", title: "El Hex", text: "Su duelo transforma Westview en una realidad construida alrededor de su familia." }, { year: "2024", title: "El Darkhold", text: "Busca a sus hijos a través del multiverso y finalmente destruye todas las copias del libro." }],
    facts: [{ value: "2015", label: "DEBUT MCU", text: "Age of Ultron presenta plenamente a Wanda y Pietro Maximoff." }, { value: "HEX", label: "ANOMALÍA", text: "Su magia transforma materia, memoria y realidad dentro de Westview." }, { value: "9", label: "EPISODIOS", text: "WandaVision explora el duelo detrás de su mundo perfecto." }],
    appearances: [{ title: "Age of Ultron", year: "2015", type: "PELÍCULA", event: "Wanda abandona a Ultron al descubrir su plan, pierde a Pietro durante la batalla de Sokovia y se incorpora a los Vengadores." }, { title: "Civil War", year: "2016", type: "PELÍCULA", event: "El accidente de Lagos la convierte en centro del debate sobre los Acuerdos y termina confinada y enfrentada al equipo de Stark." }, { title: "WandaVision", year: "2021", type: "SERIE", event: "Su duelo crea el Hex de Westview, una familia con Vision y el despertar definitivo de su identidad como Bruja Escarlata." }, { title: "Multiverse of Madness", year: "2022", type: "PELÍCULA", event: "Corrompida por el Darkhold, persigue el poder de América para reunirse con sus hijos y finalmente destruye el libro en todos los universos." }],
    screenMoment: { videoId: "sj9J2ecsSpo", title: "Un mundo perfecto se agrieta", kicker: "WANDAVISION · TRÁILER OFICIAL", text: "Una vida de comedia clásica comienza a revelar interferencias, ausencias y una verdad que Wanda no está preparada para aceptar." },
  },
  {
    id: "captain-america", name: "CAPTAIN AMERICA", alias: "Steve Rogers", number: "06",
    quote: "Puedo hacer esto todo el día.", universe: "Tierra-616", color: "#1775d1", color2: "#e52b32", power: "Voluntad inquebrantable", symbol: "★", votes: 4688,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087.jpg", sourceUrl: "https://www.marvel.com/characters/captain-america-steve-rogers/", role: "El primer Vengador", origin: "Brooklyn · Nueva York",
    description: "Antes que supersoldado, Steve Rogers fue un hombre incapaz de mirar hacia otro lado. Su escudo representa una idea: hacer lo correcto incluso cuando nadie más está dispuesto.",
    stats: [{ label: "Liderazgo", value: 100 }, { label: "Voluntad", value: 100 }, { label: "Combate", value: 96 }, { label: "Fuerza", value: 88 }],
    abilities: ["Suero supersoldado", "Maestro del escudo", "Táctica militar", "Liderazgo"],
    timeline: [{ year: "1943", title: "Proyecto Renacimiento", text: "El suero convierte su valor en una fuerza capaz de enfrentarse a HYDRA." }, { year: "2014", title: "La caída de S.H.I.E.L.D.", text: "Descubre la infiltración de HYDRA y derriba la organización desde dentro." }, { year: "2023", title: "Una vida pendiente", text: "Devuelve las Gemas y elige regresar para vivir junto a Peggy Carter." }],
    facts: [{ value: "1943", label: "EL ORIGEN", text: "El Proyecto Renacimiento crea al primer supersoldado aliado." }, { value: "1", label: "ESCUDO", text: "Su arma de vibranium es también el símbolo de un legado compartido." }, { value: "70", label: "AÑOS", text: "El tiempo aproximado que permanece congelado antes de despertar." }],
    appearances: [{ title: "The First Avenger", year: "2011", type: "PELÍCULA", event: "Steve combate a Cráneo Rojo y sacrifica su futuro al estrellar el avión de HYDRA en el hielo." }, { title: "The Avengers", year: "2012", type: "PELÍCULA", event: "Asume el mando del equipo durante la batalla de Nueva York y vuelve a encontrar un propósito." }, { title: "Civil War", year: "2016", type: "PELÍCULA", event: "Rechaza los Acuerdos de Sokovia y protege a Bucky, provocando la ruptura de los Vengadores." }, { title: "Endgame", year: "2019", type: "PELÍCULA", event: "Empuña Mjolnir, lidera la batalla final y entrega el escudo a Sam Wilson." }],
    screenMoment: { videoId: "7SlILk2WMTI", title: "El símbolo se enfrenta al sistema", kicker: "THE WINTER SOLDIER · TRÁILER OFICIAL", text: "Steve descubre que obedecer ya no basta cuando la institución a la que sirve ha sido tomada por el enemigo." },
  },
  {
    id: "thor", name: "THOR", alias: "Thor Odinson", number: "07", quote: "Sigo siendo digno.", universe: "Tierra-616", color: "#4fa8ff", color2: "#f1b82d", power: "Dios del Trueno", symbol: "ϟ", votes: 4312,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/537bc7036ab02.jpg", sourceUrl: "https://www.marvel.com/characters/thor-thor-odinson/", role: "El dios errante", origin: "Asgard",
    description: "Príncipe, guerrero y superviviente. Thor pierde un reino, una familia y casi la fe en sí mismo, pero aprende que la dignidad no reside en un arma ni en una corona.",
    stats: [{ label: "Fuerza", value: 100 }, { label: "Resistencia", value: 100 }, { label: "Rayo", value: 98 }, { label: "Voluntad", value: 91 }], abilities: ["Control del rayo", "Fuerza asgardiana", "Vuelo con Mjolnir", "Longevidad"],
    timeline: [{ year: "2011", title: "Desterrado", text: "Pierde sus poderes y aprende en Midgard qué significa ser digno." }, { year: "2017", title: "Ragnarok", text: "Acepta la destrucción de Asgard para salvar a su pueblo de Hela." }, { year: "2023", title: "Todavía digno", text: "Mjolnir responde a su llamada y Thor vuelve a levantarse contra Thanos." }],
    facts: [{ value: "1500", label: "AÑOS", text: "La edad aproximada que Thor menciona durante Infinity War." }, { value: "2", label: "ARMAS", text: "Mjolnir y Stormbreaker canalizan distintas etapas de su recorrido." }, { value: "9", label: "REINOS", text: "Los mundos conectados por el árbol cósmico Yggdrasil." }],
    appearances: [{ title: "Thor", year: "2011", type: "PELÍCULA", event: "Su arrogancia provoca el destierro; al sacrificarse por otros recupera Mjolnir y su dignidad." }, { title: "Ragnarok", year: "2017", type: "PELÍCULA", event: "Pierde el martillo y un ojo, despierta su poder y permite que Surtur destruya Asgard para vencer a Hela." }, { title: "Infinity War", year: "2018", type: "PELÍCULA", event: "Forja Stormbreaker y está a punto de detener a Thanos, pero su deseo de venganza permite el Chasquido." }, { title: "Love and Thunder", year: "2022", type: "PELÍCULA", event: "Se reencuentra con Jane, se despide de ella y adopta a la hija de Gorr." }],
    screenMoment: { videoId: "ue80QwXMRHg", title: "El fin de Asgard", kicker: "THOR: RAGNAROK · TRÁILER OFICIAL", text: "Sin martillo ni trono, Thor debe descubrir el poder que siempre estuvo dentro de él." },
  },
  {
    id: "hulk", name: "HULK", alias: "Bruce Banner", number: "08", quote: "Siempre estoy enfadado.", universe: "Tierra-616", color: "#72bd44", color2: "#7446a8", power: "Fuerza gamma", symbol: "✹", votes: 3899,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0.jpg", sourceUrl: "https://www.marvel.com/characters/hulk-bruce-banner/", role: "La fuerza interior", origin: "Dayton · Ohio",
    description: "La mente de Bruce Banner y la fuerza de Hulk parecían condenadas a luchar. Con el tiempo dejan de ser dos mitades enfrentadas y se convierten en una sola respuesta.",
    stats: [{ label: "Fuerza", value: 100 }, { label: "Intelecto", value: 100 }, { label: "Resistencia", value: 99 }, { label: "Control", value: 83 }], abilities: ["Fuerza gamma", "Regeneración", "Resistencia extrema", "Genio científico"],
    timeline: [{ year: "2008", title: "El fugitivo", text: "Banner busca una cura mientras Ross intenta convertir su condición en un arma." }, { year: "2017", title: "El campeón", text: "Hulk reina en la arena de Sakaar hasta que Bruce recupera el control." }, { year: "2023", title: "La unión", text: "Banner integra ambas identidades y revierte el Blip con las Gemas." }],
    facts: [{ value: "7", label: "DOCTORADOS", text: "Banner enumera su extraordinaria formación científica ante Shuri." }, { value: "18M", label: "SAKAAR", text: "El tiempo puede transcurrir de forma distinta en el planeta del Gran Maestro." }, { value: "1", label: "CHASQUIDO", text: "Su resistencia gamma permite devolver a quienes Thanos eliminó." }],
    appearances: [{ title: "The Incredible Hulk", year: "2008", type: "PELÍCULA", event: "Banner huye de Ross, combate a Abominación y comienza a entender que debe controlar su transformación." }, { title: "The Avengers", year: "2012", type: "PELÍCULA", event: "Se une al equipo, revela que controla su ira y es decisivo contra los Chitauri." }, { title: "Ragnarok", year: "2017", type: "PELÍCULA", event: "Tras dos años como Hulk en Sakaar, Banner vuelve y arriesga su identidad para ayudar a salvar Asgard." }, { title: "Endgame", year: "2019", type: "PELÍCULA", event: "Fusiona cerebro y fuerza, domina el viaje temporal y usa las Gemas para revertir el Blip." }],
    screenMoment: { videoId: "eOrNdBpGMv8", title: "El equipo necesita un monstruo", kicker: "THE AVENGERS · TRÁILER OFICIAL", text: "La amenaza de Loki obliga a Banner a dejar de huir y dirigir a Hulk hacia algo que merece ser destruido." },
  },
  {
    id: "black-widow", name: "BLACK WIDOW", alias: "Natasha Romanoff", number: "09", quote: "Tengo mucho rojo en mi cuenta.", universe: "Tierra-616", color: "#e62e2e", color2: "#181a1f", power: "Espionaje total", symbol: "⌛", votes: 4227,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b.jpg", sourceUrl: "https://www.marvel.com/characters/black-widow-natasha-romanoff/", role: "La espía", origin: "Rusia",
    description: "La Habitación Roja la convirtió en arma. Natasha convirtió esa deuda en una vida dedicada a reunir personas, derribar imperios ocultos y dar a otros la familia que encontró.",
    stats: [{ label: "Espionaje", value: 100 }, { label: "Combate", value: 97 }, { label: "Estrategia", value: 94 }, { label: "Voluntad", value: 98 }], abilities: ["Infiltración", "Artes marciales", "Interrogatorio", "Tiro experto"],
    timeline: [{ year: "2010", title: "Infiltrada", text: "Vigila a Tony Stark y revela su identidad como agente de S.H.I.E.L.D." }, { year: "2016", title: "Sin bandos", text: "Ayuda a Steve y Bucky a escapar aunque eso la convierta en fugitiva." }, { year: "2023", title: "Vormir", text: "Entrega su vida para que los Vengadores obtengan la Gema del Alma." }],
    facts: [{ value: "1995", label: "OHIO", text: "La misión encubierta que Natasha recuerda como su primera familia." }, { value: "1", label: "FAMILIA", text: "Los Vengadores se convierten en el hogar que decide proteger." }, { value: "∞", label: "DEUDA", text: "Su deseo de compensar el pasado orienta cada una de sus decisiones." }],
    appearances: [{ title: "Iron Man 2", year: "2010", type: "PELÍCULA", event: "Se infiltra en Stark Industries, evalúa a Tony y ayuda a detener el ataque de Hammer y Vanko." }, { title: "The Winter Soldier", year: "2014", type: "PELÍCULA", event: "Expone públicamente los secretos de S.H.I.E.L.D. para destruir la infiltración de HYDRA." }, { title: "Black Widow", year: "2021", type: "PELÍCULA", event: "Se reúne con Yelena y su familia encubierta para liberar a las Viudas del control de Dreykov." }, { title: "Endgame", year: "2019", type: "PELÍCULA", event: "Mantiene unido al equipo tras el Blip y se sacrifica en Vormir para conseguir la Gema del Alma." }],
    screenMoment: { videoId: "Fp9pNPdNwjI", title: "Volver a la Habitación Roja", kicker: "BLACK WIDOW · TRÁILER OFICIAL", text: "Natasha afronta la familia y el sistema que intentó borrar para liberar a quienes aún siguen atrapadas." },
  },
  {
    id: "hawkeye", name: "HAWKEYE", alias: "Clint Barton", number: "10", quote: "La ciudad vuela y yo tengo un arco.", universe: "Tierra-616", color: "#8b4bb5", color2: "#20212a", power: "Precisión absoluta", symbol: "➶", votes: 3128,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/e/90/50fecaf4f101b.jpg", sourceUrl: "https://www.marvel.com/characters/hawkeye-clint-barton/", role: "El tirador", origin: "Iowa · Estados Unidos", description: "Sin armadura ni poderes, Clint sostiene al equipo con experiencia, puntería y una humanidad obstinada. Su mayor batalla siempre consiste en volver a casa.",
    stats: [{ label: "Precisión", value: 100 }, { label: "Estrategia", value: 94 }, { label: "Combate", value: 91 }, { label: "Resistencia", value: 82 }], abilities: ["Tiro con arco", "Combate táctico", "Infiltración", "Liderazgo de campo"],
    timeline: [{ year: "2012", title: "Nueva York", text: "Supera el control de Loki y defiende la ciudad junto a los Vengadores." }, { year: "2023", title: "Ronin", text: "El Blip lo empuja a una cruzada que Natasha logra detener." }, { year: "2024", title: "El relevo", text: "Reconoce el talento de Kate Bishop y la acepta como compañera." }],
    facts: [{ value: "0", label: "PODERES", text: "Su lugar entre dioses depende de disciplina, experiencia y precisión." }, { value: "3", label: "HIJOS", text: "La familia Barton es el centro emocional de todas sus decisiones." }, { value: "1", label: "RONIN", text: "Una identidad nacida del dolor que otros intentan heredar." }],
    appearances: [{ title: "The Avengers", year: "2012", type: "PELÍCULA", event: "Loki controla su mente; Natasha lo recupera y Clint combate desde los tejados de Nueva York." }, { title: "Age of Ultron", year: "2015", type: "PELÍCULA", event: "Ofrece su hogar al equipo y convence a Wanda para levantarse y luchar en Sokovia." }, { title: "Endgame", year: "2019", type: "PELÍCULA", event: "Regresa como Ronin, pierde a Natasha en Vormir y vuelve con su familia tras la victoria." }, { title: "Hawkeye", year: "2021", type: "SERIE", event: "El traje de Ronin lo une a Kate Bishop y lo obliga a afrontar las consecuencias de su cruzada." }],
    screenMoment: { videoId: "5VYb3B1ETlk", title: "Un último caso por Navidad", kicker: "HAWKEYE · TRÁILER OFICIAL", text: "El pasado de Ronin impide que Clint vuelva a casa y convierte a Kate Bishop en su inesperada compañera." },
  },
  {
    id: "loki", name: "LOKI", alias: "Loki Laufeyson", number: "11", quote: "Estoy cargado con un glorioso propósito.", universe: "Tierra-616 / TVA", color: "#3e9b55", color2: "#d5ae45", power: "Dios de las historias", symbol: "♜", votes: 4510,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/d/90/526547f509313.jpg", sourceUrl: "https://www.marvel.com/characters/loki/", role: "El embaucador", origin: "Jotunheim · Asgard", description: "Villano, hermano y variante. Loki pasa de querer un trono a sostener infinitas historias, descubriendo que el propósito más glorioso puede consistir en renunciar a ser visto.",
    stats: [{ label: "Magia", value: 96 }, { label: "Ingenio", value: 98 }, { label: "Engaño", value: 100 }, { label: "Voluntad", value: 97 }], abilities: ["Ilusiones", "Metamorfosis", "Telequinesis", "Control temporal"],
    timeline: [{ year: "2012", title: "La invasión", text: "Ataca Nueva York con los Chitauri y termina prisionero de los Vengadores." }, { year: "2018", title: "El sacrificio", text: "Intenta matar a Thanos para proteger a Thor y muere en el intento." }, { year: "Fuera del tiempo", title: "Yggdrasil", text: "Reúne las líneas temporales y ocupa el centro de sus historias." }],
    facts: [{ value: "L1130", label: "VARIANTE", text: "La TVA asigna este expediente al Loki que escapa en 2012." }, { value: "∞", label: "LÍNEAS", text: "Aprende a desplazarse entre ramificaciones temporales." }, { value: "1", label: "TRONO", text: "Obtiene el trono que deseaba cuando ya comprende su verdadero coste." }],
    appearances: [{ title: "Thor", year: "2011", type: "PELÍCULA", event: "Descubre su origen gigante de hielo, usurpa el trono e intenta demostrar su valor ante Odín." }, { title: "The Avengers", year: "2012", type: "PELÍCULA", event: "Lidera la invasión Chitauri bajo la influencia de Thanos y es derrotado por los Vengadores." }, { title: "Infinity War", year: "2018", type: "PELÍCULA", event: "Se declara hijo de Odín e intenta asesinar a Thanos para salvar a Thor." }, { title: "Loki", year: "2021", type: "SERIE", event: "Una variante arrestada por la TVA rompe el telar y termina sosteniendo todas las líneas temporales." }],
    screenMoment: { videoId: "nW948Va-l10", title: "El tiempo pide una respuesta", kicker: "LOKI · TRÁILER OFICIAL", text: "La TVA obliga al dios del engaño a contemplar su historia completa y decidir qué hará con la siguiente." },
  },
  {
    id: "captain-marvel", name: "CAPTAIN MARVEL", alias: "Carol Danvers", number: "12", quote: "No tengo nada que demostrarte.", universe: "Tierra-616", color: "#1768b0", color2: "#ef3340", power: "Energía cósmica", symbol: "✦", votes: 3374,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/c/10/537ba5ff07aa4.jpg", sourceUrl: "https://www.marvel.com/characters/captain-marvel-carol-danvers/", role: "La centinela cósmica", origin: "Tierra · Hala", description: "Piloto convertida en arma Kree, Carol recupera su memoria y su nombre. Desde entonces protege mundos enteros mientras aprende que incluso el poder cósmico necesita vínculos.",
    stats: [{ label: "Energía", value: 100 }, { label: "Vuelo", value: 100 }, { label: "Fuerza", value: 98 }, { label: "Voluntad", value: 96 }], abilities: ["Absorción de energía", "Vuelo interestelar", "Fuerza cósmica", "Forma binaria"],
    timeline: [{ year: "1995", title: "Recuperar el nombre", text: "Descubre la mentira Kree y ayuda a los Skrull a encontrar refugio." }, { year: "2019", title: "La llamada", text: "Responde al busca de Fury y encuentra a los Vengadores tras el Blip." }, { year: "2026", title: "Entrelazadas", text: "Sus poderes se conectan con los de Kamala y Monica." }],
    facts: [{ value: "1995", label: "REGRESO", text: "El año en que vuelve a la Tierra sin recordar que fue Carol Danvers." }, { value: "3", label: "MARVELS", text: "Carol, Monica y Kamala intercambian lugar al usar sus poderes." }, { value: "∞", label: "ALCANCE", text: "Puede atravesar el espacio sin nave y responder a crisis planetarias." }],
    appearances: [{ title: "Captain Marvel", year: "2019", type: "PELÍCULA", event: "Carol rompe el inhibidor Kree, recupera sus recuerdos y protege a los Skrull de sus antiguos superiores." }, { title: "Endgame", year: "2019", type: "PELÍCULA", event: "Rescata a Tony y Nebula, protege otros mundos y destruye la nave de Thanos en la batalla final." }, { title: "Ms. Marvel", year: "2022", type: "SERIE", event: "El brazalete de Kamala activa un intercambio inesperado y Carol aparece en su habitación." }, { title: "The Marvels", year: "2023", type: "PELÍCULA", event: "Se entrelaza con Monica y Kamala y afronta las consecuencias de haber destruido la Inteligencia Suprema." }],
    screenMoment: { videoId: "Z1BCujX3pw8", title: "Recordar quién eres", kicker: "CAPTAIN MARVEL · TRÁILER OFICIAL", text: "Carol descubre que su historia fue reescrita y que el límite impuesto a su poder nunca fue real." },
  },
  {
    id: "sam-wilson", name: "CAPTAIN AMERICA", alias: "Sam Wilson", number: "13", quote: "El único poder que tengo es creer que podemos hacerlo mejor.", universe: "Tierra-616", color: "#225ca8", color2: "#d72d35", power: "El nuevo símbolo", symbol: "★", votes: 3520,
    image: "https://i.annihil.us/u/prod/marvel/i/mg/d/c0/569e646046152.jpg", sourceUrl: "https://www.marvel.com/characters/falcon-sam-wilson/", role: "El heredero", origin: "Delacroix · Luisiana", description: "Veterano, consejero y Vengador. Sam acepta el escudo sabiendo que representa una historia imperfecta y decide usarlo para exigir un futuro mejor.",
    stats: [{ label: "Liderazgo", value: 98 }, { label: "Vuelo", value: 96 }, { label: "Combate", value: 91 }, { label: "Empatía", value: 100 }], abilities: ["Vuelo táctico", "Escudo de vibranium", "Drones Redwing", "Rescate militar"],
    timeline: [{ year: "2014", title: "A tu izquierda", text: "Ayuda a Steve a derribar los Helicarriers infiltrados por HYDRA." }, { year: "2024", title: "El escudo", text: "Acepta públicamente el manto de Capitán América." }, { year: "2027", title: "Un mundo nuevo", text: "Defiende su legitimidad frente a una crisis internacional." }],
    facts: [{ value: "EXO-7", label: "FALCON", text: "El sistema de alas que domina desde su etapa de rescate militar." }, { value: "1", label: "ESCUDO", text: "Steve lo elige personalmente para continuar su legado." }, { value: "0", label: "SUERO", text: "Sam demuestra que el símbolo depende del carácter y no del suero." }],
    appearances: [{ title: "The Winter Soldier", year: "2014", type: "PELÍCULA", event: "Conoce a Steve, recupera sus alas y ayuda a destruir los Helicarriers controlados por HYDRA." }, { title: "Civil War", year: "2016", type: "PELÍCULA", event: "Permanece junto a Steve contra los Acuerdos y acaba encarcelado en la Balsa." }, { title: "The Falcon and the Winter Soldier", year: "2021", type: "SERIE", event: "Recupera el escudo, estrena un nuevo traje y asume el nombre de Capitán América ante el mundo." }, { title: "Brave New World", year: "2025", type: "PELÍCULA", event: "Investiga una conspiración internacional y defiende el significado del escudo sin depender del suero." }],
    screenMoment: { videoId: "IWBsDaFWyTE", title: "El peso de un legado", kicker: "THE FALCON AND THE WINTER SOLDIER · TRÁILER", text: "Sam y Bucky afrontan un mundo sin Steve mientras deciden quién puede portar el símbolo que dejó atrás." },
  },
];

const appearanceCatalogTitles: Record<string, string> = {
  "Age of Ultron": "Vengadores: La Era de Ultrón",
  "Brave New World": "Capitán América: Brave New World",
  "Captain Marvel": "Capitana Marvel",
  "Civil War": "Capitán América: Civil War",
  "Endgame": "Vengadores: Endgame",
  "Far From Home": "Spider-Man: Lejos de casa",
  "Hawkeye": "Ojo de Halcón",
  "Homecoming": "Spider-Man: Homecoming",
  "Infinity War": "Vengadores: Infinity War",
  "Loki": "Loki · Temporadas 1 y 2",
  "Love and Thunder": "Thor: Love and Thunder",
  "Ms. Marvel": "Ms. Marvel",
  "Multiverse of Madness": "Doctor Strange en el Multiverso de la Locura",
  "No Way Home": "Spider-Man: No Way Home",
  "Ragnarok": "Thor: Ragnarok",
  "The Avengers": "Los Vengadores",
  "The Falcon and the Winter Soldier": "Falcon y el Soldado de Invierno",
  "The First Avenger": "Capitán América: El Primer Vengador",
  "The Incredible Hulk": "El Increíble Hulk",
  "The Marvels": "The Marvels",
  "The Winter Soldier": "Capitán América: El Soldado de Invierno",
  "WandaVision": "WandaVision",
};

export const characters: Character[] = [...characterEntries.map((character) => ({
  ...character,
  ...getCharacterEditorialData(character.id, character.sourceUrl),
  appearances: character.appearances.map((appearance) => ({
    ...appearance,
    titleId: createContentSlug(appearanceCatalogTitles[appearance.title] ?? appearance.title),
  })),
})), ...expandedCharacters, ...additionalCharacters, ...essentialCharacters, ...heroCharacters];

export function getCharacter(id: string) {
  return characters.find((character) => character.id === id);
}
