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
  role: string;
  origin: string;
  description: string;
  stats: { label: string; value: number }[];
  abilities: string[];
  timeline: { year: string; title: string; text: string }[];
};

export const characters: Character[] = [
  {
    id: "spider", name: "SPIDER-MAN", alias: "Peter Parker", number: "01",
    quote: "Un gran poder conlleva una gran responsabilidad.", universe: "Tierra-616",
    color: "#ed1b24", color2: "#1261ff", power: "Sentido arácnido", symbol: "🕸", votes: 4821,
    role: "El héroe cercano", origin: "Queens · Nueva York",
    description: "Ciencia, vértigo y un sentido de la responsabilidad demasiado grande para un solo adolescente. Peter convierte cada caída en una razón para volver a levantarse.",
    stats: [{ label: "Agilidad", value: 96 }, { label: "Ingenio", value: 89 }, { label: "Fuerza", value: 78 }, { label: "Voluntad", value: 94 }],
    abilities: ["Sentido arácnido", "Adherencia", "Fuerza aumentada", "Ingeniería web"],
    timeline: [{ year: "1962", title: "La picadura", text: "Un accidente científico cambia para siempre la vida de Peter." }, { year: "1963", title: "Primer balanceo", text: "Nueva York descubre a un héroe que todavía está aprendiendo." }, { year: "HOY", title: "Siempre en pie", text: "El amistoso vecino continúa protegiendo su ciudad y su gente." }],
  },
  {
    id: "iron", name: "IRON MAN", alias: "Tony Stark", number: "02",
    quote: "La armadura es solo el principio.", universe: "Tierra-616",
    color: "#ff3b19", color2: "#ffc400", power: "Ingenio sin límites", symbol: "◉", votes: 3954,
    role: "El futurista", origin: "Manhattan · Nueva York",
    description: "Inventor, provocador y arquitecto del mañana. Tony Stark construye soluciones imposibles y aprende que el metal más resistente sigue necesitando un corazón.",
    stats: [{ label: "Ingenio", value: 100 }, { label: "Tecnología", value: 99 }, { label: "Estrategia", value: 88 }, { label: "Voluntad", value: 84 }],
    abilities: ["Armadura modular", "Vuelo supersónico", "Energía repulsora", "IA táctica"],
    timeline: [{ year: "1963", title: "Mark I", text: "Una prisión se convierte en el taller de su primera armadura." }, { year: "2012", title: "La iniciativa", text: "Stark comprende que incluso un genio necesita un equipo." }, { year: "HOY", title: "Nueva iteración", text: "Cada amenaza es el prototipo de una solución mejor." }],
  },
  {
    id: "strange", name: "DOCTOR STRANGE", alias: "Stephen Strange", number: "03",
    quote: "La realidad es una de muchas posibilidades.", universe: "Tierra-616",
    color: "#f257ff", color2: "#00d9ff", power: "Artes místicas", symbol: "◎", votes: 3267,
    role: "El guardián místico", origin: "Sanctum Sanctorum · Nueva York",
    description: "Cuando la ciencia dejó de darle respuestas, Stephen Strange aprendió a formular preguntas nuevas. Ahora protege las fronteras que la realidad no puede ver.",
    stats: [{ label: "Magia", value: 100 }, { label: "Conocimiento", value: 97 }, { label: "Estrategia", value: 91 }, { label: "Fuerza", value: 48 }],
    abilities: ["Portales", "Proyección astral", "Hechicería", "Manipulación temporal"],
    timeline: [{ year: "1963", title: "La búsqueda", text: "Un cirujano brillante viaja para reparar algo más que sus manos." }, { year: "2016", title: "El Sanctum", text: "Strange asume la defensa mística de Nueva York." }, { year: "∞", title: "Más allá", text: "Las dimensiones nunca duermen. Su guardián tampoco." }],
  },
  {
    id: "panther", name: "BLACK PANTHER", alias: "T'Challa", number: "04",
    quote: "Wakanda no observa la historia. La escribe.", universe: "Tierra-616",
    color: "#9d5cff", color2: "#27e6bb", power: "Corazón de Wakanda", symbol: "◇", votes: 3710,
    role: "El rey", origin: "Birnin Zana · Wakanda",
    description: "Científico, guerrero y soberano. T'Challa camina entre la tradición y el futuro, llevando consigo el peso de una nación que nunca dejó de avanzar.",
    stats: [{ label: "Estrategia", value: 98 }, { label: "Agilidad", value: 92 }, { label: "Tecnología", value: 96 }, { label: "Liderazgo", value: 100 }],
    abilities: ["Sentidos elevados", "Traje de vibranium", "Combate experto", "Mente estratégica"],
    timeline: [{ year: "1966", title: "El visitante", text: "El mundo exterior descubre al protector de Wakanda." }, { year: "2018", title: "Fronteras abiertas", text: "Una nación oculta decide compartir su futuro." }, { year: "HOY", title: "Wakanda forever", text: "El legado de la Pantera nunca pertenece a una sola persona." }],
  },
  {
    id: "wanda", name: "SCARLET WITCH", alias: "Wanda Maximoff", number: "05",
    quote: "El caos también sabe crear.", universe: "Tierra-616",
    color: "#ff174f", color2: "#9b004e", power: "Magia del caos", symbol: "✦", votes: 4420,
    role: "La anomalía", origin: "Sokovia · Europa Oriental",
    description: "La probabilidad se curva a su alrededor. Wanda no solo altera el mundo: lucha constantemente por decidir qué parte de él debería permanecer intacta.",
    stats: [{ label: "Magia", value: 100 }, { label: "Realidad", value: 100 }, { label: "Voluntad", value: 91 }, { label: "Control", value: 62 }],
    abilities: ["Magia del caos", "Telequinesis", "Alteración mental", "Realidad mutable"],
    timeline: [{ year: "1964", title: "La hermandad", text: "Wanda aparece como una fuerza que todavía no comprende." }, { year: "2015", title: "Una vengadora", text: "Encuentra una familia entre quienes antes fueron adversarios." }, { year: "?", title: "Caos y creación", text: "Las reglas existen hasta que ella decide reescribirlas." }],
  },
];

export function getCharacter(id: string) {
  return characters.find((character) => character.id === id);
}
