export type TitleReleaseStatus = "ESTRENADO" | "PRÓXIMO ESTRENO" | "ANUNCIADO";

export type TitleDetails = {
  titleId: string;
  spoilerFreeSynopsis: string;
  releaseDate: string;
  releaseDateISO: string;
  runtime: string;
  certification: string;
  status: TitleReleaseStatus;
  availability: string;
  directors: string[];
  writers: string[];
  cast: string[];
  trailerId: string;
  watchBefore: string[];
  watchAfter: string[];
  postCredits: { label: string; description: string }[];
  sources: { label: string; url: string }[];
  reviewedAt: string;
};

export type EditorialCoverage = "EXPEDIENTE COMPLETO" | "FICHA BÁSICA" | "TÍTULO ANUNCIADO";

const titleDetails: TitleDetails[] = [
  {
    titleId: "vengadores-infinity-war",
    spoilerFreeSynopsis: "Thanos inicia una ofensiva para reunir las seis Gemas del Infinito mientras los héroes de la Tierra y los Guardianes intentan detenerlo en varios frentes.",
    releaseDate: "27 ABR 2018", releaseDateISO: "2018-04-27", runtime: "149 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Anthony Russo", "Joe Russo"], writers: ["Christopher Markus", "Stephen McFeely"], cast: ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo", "Chris Evans", "Scarlett Johansson", "Josh Brolin"], trailerId: "6ZfuNTqbHE8",
    watchBefore: ["capitan-america-civil-war", "thor-ragnarok", "black-panther"], watchAfter: ["ant-man-y-la-avispa", "capitana-marvel", "vengadores-endgame"],
    postCredits: [{ label: "ESCENA FINAL", description: "Nick Fury activa un busca antes de desaparecer por el chasquido. La señal enviada pertenece a Capitana Marvel." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/avengers-infinity-war" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "wandavision",
    spoilerFreeSynopsis: "Wanda Maximoff y Vision viven una existencia de comedia televisiva en Westview, pero la realidad que los rodea empieza a revelar grietas y una amenaza exterior.",
    releaseDate: "15 ENE 2021", releaseDateISO: "2021-01-15", runtime: "9 EPISODIOS", certification: "TV-14", status: "ESTRENADO", availability: "DISNEY+",
    directors: ["Matt Shakman"], writers: ["Jac Schaeffer"], cast: ["Elizabeth Olsen", "Paul Bettany", "Kathryn Hahn", "Teyonah Parris", "Kat Dennings", "Randall Park"], trailerId: "sj9J2ecsSpo",
    watchBefore: ["vengadores-la-era-de-ultron", "capitan-america-civil-war", "vengadores-endgame"], watchAfter: ["doctor-strange-en-el-multiverso-de-la-locura", "agatha-quien-si-no"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Monica Rambeau recibe la visita de una Skrull que la convoca en nombre de un amigo de su madre." }, { label: "ESCENA FINAL", description: "Wanda estudia el Darkhold en forma astral y oye a sus hijos pedir ayuda." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/tv-shows/wandavision/1" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "ant-man-y-la-avispa-quantumania",
    spoilerFreeSynopsis: "La familia de Scott Lang queda atrapada en el Reino Cuántico, donde descubre una civilización sometida y al conquistador que domina ese mundo oculto.",
    releaseDate: "17 FEB 2023", releaseDateISO: "2023-02-17", runtime: "125 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Peyton Reed"], writers: ["Jeff Loveness"], cast: ["Paul Rudd", "Evangeline Lilly", "Jonathan Majors", "Kathryn Newton", "Michelle Pfeiffer", "Michael Douglas"], trailerId: "ZlNFpri-Y40",
    watchBefore: ["ant-man", "ant-man-y-la-avispa", "loki-temporadas-1-y-2"], watchAfter: ["avengers-doomsday"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Un consejo formado por numerosas variantes de Kang se reúne tras la muerte del Conquistador." }, { label: "ESCENA FINAL", description: "Loki y Mobius observan en el siglo XIX una presentación de Victor Timely, otra variante de Kang." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/antman" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "the-marvels",
    spoilerFreeSynopsis: "Los poderes de Carol Danvers, Monica Rambeau y Kamala Khan quedan entrelazados, obligándolas a coordinarse mientras una revolucionaria Kree desestabiliza la red de saltos espaciales.",
    releaseDate: "10 NOV 2023", releaseDateISO: "2023-11-10", runtime: "105 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Nia DaCosta"], writers: ["Megan McDonnell", "Nia DaCosta", "Elissa Karasik", "Zeb Wells"], cast: ["Brie Larson", "Teyonah Parris", "Iman Vellani", "Zawe Ashton", "Samuel L. Jackson", "Park Seo-joon"], trailerId: "wS_qbDztgVY",
    watchBefore: ["capitana-marvel", "wandavision", "ms-marvel"], watchAfter: ["avengers-doomsday"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Monica despierta en otra realidad, donde encuentra a una variante de su madre y al mutante Hank McCoy." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/the-marvels" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "agatha-quien-si-no",
    spoilerFreeSynopsis: "Sin poderes y atrapada tras los sucesos de Westview, Agatha Harkness reúne un aquelarre para recorrer la legendaria Senda de las Brujas.",
    releaseDate: "18 SEP 2024", releaseDateISO: "2024-09-18", runtime: "9 EPISODIOS", certification: "TV-14", status: "ESTRENADO", availability: "DISNEY+",
    directors: ["Jac Schaeffer", "Rachel Goldberg", "Gandja Monteiro"], writers: ["Jac Schaeffer"], cast: ["Kathryn Hahn", "Joe Locke", "Sasheer Zamata", "Ali Ahn", "Patti LuPone", "Aubrey Plaza"], trailerId: "R9pXbNz6Vbw",
    watchBefore: ["wandavision", "doctor-strange-en-el-multiverso-de-la-locura"], watchAfter: ["avengers-doomsday"],
    postCredits: [],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/tv-shows/agatha-all-along/1" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "capitan-america-brave-new-world",
    spoilerFreeSynopsis: "Sam Wilson queda atrapado en un incidente internacional tras reunirse con el presidente Thaddeus Ross y debe descubrir quién dirige la conspiración.",
    releaseDate: "14 FEB 2025", releaseDateISO: "2025-02-14", runtime: "118 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Julius Onah"], writers: ["Rob Edwards", "Malcolm Spellman", "Dalan Musson", "Julius Onah", "Peter Glanz"], cast: ["Anthony Mackie", "Danny Ramirez", "Harrison Ford", "Tim Blake Nelson", "Carl Lumbly", "Giancarlo Esposito"], trailerId: "1pHDWnXmK7Y",
    watchBefore: ["el-increible-hulk", "falcon-y-el-soldado-de-invierno", "eternals"], watchAfter: ["thunderbolts", "avengers-doomsday"],
    postCredits: [{ label: "ESCENA FINAL", description: "Samuel Sterns advierte a Sam de que otros mundos se aproximan, una amenaza vinculada al conflicto multiversal." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/captain-america-brave-new-world" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "thunderbolts",
    spoilerFreeSynopsis: "Yelena Belova y varios operativos descartados caen en una trampa de Valentina Allegra de Fontaine y deben decidir si pueden convertirse en un verdadero equipo.",
    releaseDate: "2 MAY 2025", releaseDateISO: "2025-05-02", runtime: "127 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Jake Schreier"], writers: ["Eric Pearson", "Joanna Calo"], cast: ["Florence Pugh", "Sebastian Stan", "Wyatt Russell", "Lewis Pullman", "David Harbour", "Julia Louis-Dreyfus"], trailerId: "bqnRzjPfb5A",
    watchBefore: ["black-widow", "falcon-y-el-soldado-de-invierno", "capitan-america-brave-new-world"], watchAfter: ["avengers-doomsday"],
    postCredits: [{ label: "ESCENA FINAL", description: "Los Nuevos Vengadores detectan una nave marcada con el emblema de los Cuatro Fantásticos entrando en su universo." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/thunderbolts" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "avengers-doomsday",
    spoilerFreeSynopsis: "La próxima reunión de los Vengadores conectará a héroes de distintas ramas del universo Marvel ante la llegada de Victor von Doom.",
    releaseDate: "18 DIC 2026", releaseDateISO: "2026-12-18", runtime: "POR CONFIRMAR", certification: "POR CONFIRMAR", status: "PRÓXIMO ESTRENO", availability: "ESTRENO EN CINES",
    directors: ["Anthony Russo", "Joe Russo"], writers: [], cast: ["Robert Downey Jr.", "Chris Hemsworth", "Anthony Mackie", "Vanessa Kirby", "Pedro Pascal", "Patrick Stewart"], trailerId: "",
    watchBefore: ["loki-temporadas-1-y-2", "deadpool-y-lobezno", "los-cuatro-fantasticos-primeros-pasos", "thunderbolts"], watchAfter: [], postCredits: [],
    sources: [{ label: "CALENDARIO OFICIAL MARVEL", url: "https://www.marvel.com/movies" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "vengadores-endgame",
    spoilerFreeSynopsis: "Los Vengadores supervivientes buscan una última oportunidad para reparar el daño causado por Thanos y recuperar aquello que el universo perdió.",
    releaseDate: "26 ABR 2019", releaseDateISO: "2019-04-26", runtime: "181 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Anthony Russo", "Joe Russo"], writers: ["Christopher Markus", "Stephen McFeely"], cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth", "Scarlett Johansson", "Jeremy Renner"], trailerId: "TcMBFSGVi1c",
    watchBefore: ["vengadores-infinity-war", "capitana-marvel", "ant-man-y-la-avispa"], watchAfter: ["loki-temporadas-1-y-2", "wandavision", "falcon-y-el-soldado-de-invierno"], postCredits: [],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/avengers-untitled" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "loki-temporadas-1-y-2",
    spoilerFreeSynopsis: "Una variante de Loki queda bajo custodia de la TVA y descubre que el orden temporal que parecía absoluto esconde una verdad mucho más peligrosa.",
    releaseDate: "2021–2023", releaseDateISO: "2021-06-09", runtime: "12 EPISODIOS", certification: "TV-14", status: "ESTRENADO", availability: "DISNEY+",
    directors: ["Kate Herron", "Justin Benson", "Aaron Moorhead", "Dan DeLeeuw", "Kasra Farahani"], writers: ["Michael Waldron", "Eric Martin"], cast: ["Tom Hiddleston", "Sophia Di Martino", "Owen Wilson", "Gugu Mbatha-Raw", "Wunmi Mosaku", "Ke Huy Quan"], trailerId: "dug56u8NN7g",
    watchBefore: ["los-vengadores", "vengadores-endgame"], watchAfter: ["deadpool-y-lobezno", "avengers-doomsday"], postCredits: [],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/tv-shows/loki/1" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "spider-man-no-way-home",
    spoilerFreeSynopsis: "Con su identidad expuesta, Peter Parker pide ayuda a Doctor Strange y desencadena una crisis que rompe las fronteras de su mundo.",
    releaseDate: "17 DIC 2021", releaseDateISO: "2021-12-17", runtime: "148 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISPONIBILIDAD SEGÚN REGIÓN",
    directors: ["Jon Watts"], writers: ["Chris McKenna", "Erik Sommers"], cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon", "Willem Dafoe", "Alfred Molina"], trailerId: "JfVOs4VSpmA",
    watchBefore: ["spider-man-lejos-de-casa", "loki-temporadas-1-y-2"], watchAfter: ["doctor-strange-en-el-multiverso-de-la-locura", "spider-man-brand-new-day"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Un visitante de otra realidad deja tras de sí una pequeña parte de un simbionte antes de regresar a su universo." }],
    sources: [{ label: "MARVEL · PELÍCULAS", url: "https://www.marvel.com/movies/spider-man-no-way-home" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "doctor-strange-en-el-multiverso-de-la-locura",
    spoilerFreeSynopsis: "Doctor Strange protege a una joven capaz de viajar entre universos mientras una amenaza vinculada al Darkhold persigue su poder.",
    releaseDate: "6 MAY 2022", releaseDateISO: "2022-05-06", runtime: "126 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Sam Raimi"], writers: ["Michael Waldron"], cast: ["Benedict Cumberbatch", "Elizabeth Olsen", "Benedict Wong", "Xochitl Gomez", "Rachel McAdams", "Chiwetel Ejiofor"], trailerId: "aWzlQ2N6qqg",
    watchBefore: ["doctor-strange", "wandavision", "spider-man-no-way-home"], watchAfter: ["agatha-quien-si-no", "avengers-doomsday"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Clea recluta a Strange para reparar una incursión y abre un portal hacia la Dimensión Oscura." }, { label: "ESCENA FINAL", description: "Pizza Poppa deja de golpearse cuando termina el hechizo y celebra que la espera ha terminado." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/doctor-strange-in-the-multiverse-of-madness" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "deadpool-y-lobezno",
    spoilerFreeSynopsis: "Wade Wilson abandona su retiro cuando la TVA amenaza la supervivencia de su universo y necesita convencer a un Wolverine reticente para ayudarlo.",
    releaseDate: "26 JUL 2024", releaseDateISO: "2024-07-26", runtime: "128 MIN", certification: "R", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Shawn Levy"], writers: ["Ryan Reynolds", "Rhett Reese", "Paul Wernick", "Zeb Wells", "Shawn Levy"], cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Matthew Macfadyen", "Morena Baccarin", "Rob Delaney"], trailerId: "73_1biulkYk",
    watchBefore: ["loki-temporadas-1-y-2"], watchAfter: ["avengers-doomsday"],
    postCredits: [{ label: "ESCENA FINAL", description: "Una grabación de la TVA demuestra qué dijo realmente Johnny Storm antes de su enfrentamiento con Cassandra Nova." }],
    sources: [{ label: "ESTRENO OFICIAL MARVEL", url: "https://www.marvel.com/deadpool-and-wolverine-live-red-carpet-premiere" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "los-cuatro-fantasticos-primeros-pasos",
    spoilerFreeSynopsis: "En una Tierra retrofuturista, la Primera Familia debe proteger su mundo cuando la llegada de Silver Surfer anuncia una amenaza cósmica imposible.",
    releaseDate: "25 JUL 2025", releaseDateISO: "2025-07-25", runtime: "115 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Matt Shakman"], writers: ["Josh Friedman", "Eric Pearson", "Jeff Kaplan", "Ian Springer"], cast: ["Pedro Pascal", "Vanessa Kirby", "Joseph Quinn", "Ebon Moss-Bachrach", "Ralph Ineson", "Julia Garner"], trailerId: "pAsmrKyMqaA",
    watchBefore: [], watchAfter: ["avengers-doomsday"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Sue encuentra a una figura misteriosa junto a Franklin, anticipando la llegada de Victor von Doom." }, { label: "ESCENA FINAL", description: "Un programa animado dentro de Tierra-828 recupera una versión clásica de la Primera Familia." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/fantastic-four" }, { label: "CONEXIÓN CON DOOMSDAY", url: "https://www.marvel.com/articles/movies/fantastic-four-first-steps-avengers-doomsday-kevin-feige" }], reviewedAt: "30 AGO 2026",
  },
];

const titleDetailsById = new Map(titleDetails.map((details) => [details.titleId, details]));

export function getTitleDetails(titleId: string) {
  return titleDetailsById.get(titleId);
}

export function getDetailedTitleIds() {
  return titleDetails.map(({ titleId }) => titleId);
}

export function getEditorialCoverage(titleId: string): EditorialCoverage {
  const details = getTitleDetails(titleId);
  if (!details) return "FICHA BÁSICA";
  return details.status === "ESTRENADO" ? "EXPEDIENTE COMPLETO" : "TÍTULO ANUNCIADO";
}
