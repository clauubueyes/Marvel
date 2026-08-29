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
  sourceUrl: string;
  role: string;
  origin: string;
  description: string;
  stats: { label: string; value: number }[];
  abilities: string[];
  timeline: { year: string; title: string; text: string }[];
  facts: { value: string; label: string; text: string }[];
  appearances: { title: string; year: string; type: "PELÍCULA" | "SERIE"; event: string }[];
  screenMoment: { videoId: string; title: string; kicker: string; text: string };
};

export const characters: Character[] = [
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
];

export function getCharacter(id: string) {
  return characters.find((character) => character.id === id);
}
