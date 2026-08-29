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
  appearances: { title: string; year: string; type: "PELÍCULA" | "SERIE" }[];
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
    timeline: [{ year: "1962", title: "La picadura", text: "Un accidente científico cambia para siempre la vida de Peter." }, { year: "1963", title: "Primer balanceo", text: "Nueva York descubre a un héroe que todavía está aprendiendo." }, { year: "HOY", title: "Siempre en pie", text: "El amistoso vecino continúa protegiendo su ciudad y su gente." }],
    facts: [{ value: "15", label: "AÑOS", text: "La edad aproximada de Peter al comenzar su etapa heroica en el MCU." }, { value: "576", label: "COMBINACIONES", text: "Las posibles configuraciones de telaraña mencionadas para sus lanzadores." }, { value: "616", label: "TIERRA", text: "La designación clásica de su universo principal en los cómics." }],
    appearances: [{ title: "Civil War", year: "2016", type: "PELÍCULA" }, { title: "Homecoming", year: "2017", type: "PELÍCULA" }, { title: "Far From Home", year: "2019", type: "PELÍCULA" }, { title: "No Way Home", year: "2021", type: "PELÍCULA" }],
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
    timeline: [{ year: "1963", title: "Mark I", text: "Una prisión se convierte en el taller de su primera armadura." }, { year: "2012", title: "La iniciativa", text: "Stark comprende que incluso un genio necesita un equipo." }, { year: "HOY", title: "Nueva iteración", text: "Cada amenaza es el prototipo de una solución mejor." }],
    facts: [{ value: "2008", label: "EL INICIO", text: "Iron Man inauguró la historia cinematográfica conectada del MCU." }, { value: "3000", label: "TE QUIERO", text: "Una frase familiar que se convirtió en el corazón emocional de su despedida." }, { value: "85", label: "MARK", text: "La armadura usada durante la batalla definitiva contra Thanos." }],
    appearances: [{ title: "Iron Man", year: "2008", type: "PELÍCULA" }, { title: "The Avengers", year: "2012", type: "PELÍCULA" }, { title: "Civil War", year: "2016", type: "PELÍCULA" }, { title: "Endgame", year: "2019", type: "PELÍCULA" }],
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
    timeline: [{ year: "1963", title: "La búsqueda", text: "Un cirujano brillante viaja para reparar algo más que sus manos." }, { year: "2016", title: "El Sanctum", text: "Strange asume la defensa mística de Nueva York." }, { year: "∞", title: "Más allá", text: "Las dimensiones nunca duermen. Su guardián tampoco." }],
    facts: [{ value: "14M", label: "FUTUROS", text: "Strange examinó millones de resultados posibles antes de elegir un único camino." }, { value: "177A", label: "BLEECKER", text: "La dirección del Sanctum Sanctorum en Greenwich Village." }, { value: "1", label: "JURAMENTO", text: "Antes de dominar la magia juró salvar vidas como médico." }],
    appearances: [{ title: "Doctor Strange", year: "2016", type: "PELÍCULA" }, { title: "Infinity War", year: "2018", type: "PELÍCULA" }, { title: "No Way Home", year: "2021", type: "PELÍCULA" }, { title: "Multiverse of Madness", year: "2022", type: "PELÍCULA" }],
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
    timeline: [{ year: "1966", title: "El visitante", text: "El mundo exterior descubre al protector de Wakanda." }, { year: "2018", title: "Fronteras abiertas", text: "Una nación oculta decide compartir su futuro." }, { year: "HOY", title: "Wakanda forever", text: "El legado de la Pantera nunca pertenece a una sola persona." }],
    facts: [{ value: "1966", label: "DEBUT", text: "T'Challa apareció por primera vez en Fantastic Four #52." }, { value: "10K", label: "AÑOS", text: "La tradición de la Pantera Negra atraviesa generaciones de historia wakandiana." }, { value: "∞", label: "LEGADO", text: "La Pantera es un manto y una responsabilidad, no solo una identidad." }],
    appearances: [{ title: "Civil War", year: "2016", type: "PELÍCULA" }, { title: "Black Panther", year: "2018", type: "PELÍCULA" }, { title: "Infinity War", year: "2018", type: "PELÍCULA" }, { title: "Endgame", year: "2019", type: "PELÍCULA" }],
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
    timeline: [{ year: "1964", title: "La hermandad", text: "Wanda aparece como una fuerza que todavía no comprende." }, { year: "2015", title: "Una vengadora", text: "Encuentra una familia entre quienes antes fueron adversarios." }, { year: "?", title: "Caos y creación", text: "Las reglas existen hasta que ella decide reescribirlas." }],
    facts: [{ value: "1964", label: "DEBUT", text: "Wanda y Pietro aparecieron originalmente en X-Men #4." }, { value: "HEX", label: "ANOMALÍA", text: "Su magia puede cambiar probabilidades, materia y la propia realidad." }, { value: "9", label: "EPISODIOS", text: "WandaVision exploró el duelo detrás de su mundo perfecto." }],
    appearances: [{ title: "Age of Ultron", year: "2015", type: "PELÍCULA" }, { title: "Civil War", year: "2016", type: "PELÍCULA" }, { title: "WandaVision", year: "2021", type: "SERIE" }, { title: "Multiverse of Madness", year: "2022", type: "PELÍCULA" }],
    screenMoment: { videoId: "sj9J2ecsSpo", title: "Un mundo perfecto se agrieta", kicker: "WANDAVISION · TRÁILER OFICIAL", text: "Una vida de comedia clásica comienza a revelar interferencias, ausencias y una verdad que Wanda no está preparada para aceptar." },
  },
];

export function getCharacter(id: string) {
  return characters.find((character) => character.id === id);
}
