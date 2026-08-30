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

const titleDetails: TitleDetails[] = [
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
