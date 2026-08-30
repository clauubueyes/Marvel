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
    titleId: "capitan-america-el-primer-vengador",
    spoilerFreeSynopsis: "Durante la Segunda Guerra Mundial, Steve Rogers se ofrece para un experimento que transforma su cuerpo, pero deberá demostrar que el valor que lo define no procede del suero.",
    releaseDate: "22 JUL 2011", releaseDateISO: "2011-07-22", runtime: "124 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Joe Johnston"], writers: ["Christopher Markus", "Stephen McFeely"], cast: ["Chris Evans", "Tommy Lee Jones", "Hugo Weaving", "Hayley Atwell", "Sebastian Stan", "Dominic Cooper"], trailerId: "JerVrbLldXw",
    watchBefore: [], watchAfter: ["agent-carter", "capitana-marvel", "los-vengadores"],
    postCredits: [{ label: "ESCENA FINAL", description: "Steve despierta en el presente, huye a Times Square y comprende que ha permanecido congelado durante casi setenta años." }],
    sources: [{ label: "GUÍA OFICIAL MARVEL", url: "https://www.marvel.com/articles/movies/the-essential-marvel-cinematic-universe-watch-guide" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "thor",
    spoilerFreeSynopsis: "La arrogancia de Thor provoca su destierro a la Tierra, donde deberá aprender qué significa ser digno mientras Loki maniobra para ocupar el trono de Asgard.",
    releaseDate: "6 MAY 2011", releaseDateISO: "2011-05-06", runtime: "115 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Kenneth Branagh"], writers: ["Ashley Miller", "Zack Stentz", "Don Payne"], cast: ["Chris Hemsworth", "Natalie Portman", "Tom Hiddleston", "Anthony Hopkins", "Stellan Skarsgård", "Idris Elba"], trailerId: "JOddp-nlNvQ",
    watchBefore: [], watchAfter: ["los-vengadores", "thor-el-mundo-oscuro"],
    postCredits: [{ label: "ESCENA FINAL", description: "Nick Fury muestra el Teseracto a Erik Selvig sin saber que Loki lo está manipulando." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/thor" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "thor-el-mundo-oscuro",
    spoilerFreeSynopsis: "Una antigua fuerza llamada Éter se une a Jane Foster y despierta a los Elfos Oscuros, obligando a Thor a buscar la ayuda de Loki para impedir una nueva era de oscuridad.",
    releaseDate: "8 NOV 2013", releaseDateISO: "2013-11-08", runtime: "112 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Alan Taylor"], writers: ["Christopher L. Yost", "Christopher Markus", "Stephen McFeely"], cast: ["Chris Hemsworth", "Natalie Portman", "Tom Hiddleston", "Anthony Hopkins", "Christopher Eccleston", "Idris Elba"], trailerId: "npvJ9FTgZbM",
    watchBefore: ["thor", "los-vengadores"], watchAfter: ["guardianes-de-la-galaxia", "vengadores-la-era-de-ultron", "thor-ragnarok"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Sif y Volstagg entregan el Éter al Coleccionista, identificándolo como una Gema del Infinito." }, { label: "ESCENA FINAL", description: "Thor regresa a la Tierra para reunirse con Jane mientras una bestia de Jotunheim continúa suelta en Londres." }],
    sources: [{ label: "GUÍA OFICIAL MARVEL", url: "https://www.marvel.com/articles/movies/the-essential-marvel-cinematic-universe-watch-guide" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "guardianes-de-la-galaxia",
    spoilerFreeSynopsis: "Peter Quill roba un orbe codiciado por Ronan y acaba formando una alianza improbable con Gamora, Rocket, Groot y Drax para impedir una catástrofe galáctica.",
    releaseDate: "1 AGO 2014", releaseDateISO: "2014-08-01", runtime: "121 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["James Gunn"], writers: ["James Gunn", "Nicole Perlman"], cast: ["Chris Pratt", "Zoe Saldaña", "Dave Bautista", "Vin Diesel", "Bradley Cooper", "Lee Pace"], trailerId: "d96cjJhvlMA",
    watchBefore: ["los-vengadores", "thor-el-mundo-oscuro"], watchAfter: ["guardianes-de-la-galaxia-vol-2", "vengadores-infinity-war"],
    postCredits: [{ label: "ESCENA FINAL", description: "El Coleccionista permanece entre las ruinas de su archivo junto a Cosmo y Howard el Pato." }],
    sources: [{ label: "GUÍA OFICIAL MARVEL", url: "https://www.marvel.com/articles/movies/the-essential-marvel-cinematic-universe-watch-guide" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "guardianes-de-la-galaxia-vol-2",
    spoilerFreeSynopsis: "Mientras la nueva familia de los Guardianes intenta mantenerse unida, Peter Quill conoce a Ego y descubre una respuesta inesperada sobre su origen.",
    releaseDate: "5 MAY 2017", releaseDateISO: "2017-05-05", runtime: "136 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["James Gunn"], writers: ["James Gunn"], cast: ["Chris Pratt", "Zoe Saldaña", "Dave Bautista", "Vin Diesel", "Bradley Cooper", "Kurt Russell"], trailerId: "dW1BIid8Osg",
    watchBefore: ["guardianes-de-la-galaxia"], watchAfter: ["vengadores-infinity-war", "guardianes-de-la-galaxia-especial-felices-fiestas", "guardianes-de-la-galaxia-vol-3"],
    postCredits: [{ label: "ESCENAS DURANTE LOS CRÉDITOS", description: "Kraglin practica con la flecha de Yondu; los Devastadores originales se reúnen; Groot atraviesa su adolescencia y Stan Lee continúa hablando con los Vigilantes." }, { label: "ESCENA DE AYESHA", description: "Ayesha presenta una cámara de gestación creada para engendrar a Adam, su arma contra los Guardianes." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/gotgvol2" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "black-panther",
    spoilerFreeSynopsis: "T'Challa regresa a Wakanda para asumir el trono, pero un adversario conectado con el pasado de su familia cuestiona tanto su derecho a reinar como el aislamiento del país.",
    releaseDate: "16 FEB 2018", releaseDateISO: "2018-02-16", runtime: "134 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Ryan Coogler"], writers: ["Ryan Coogler", "Joe Robert Cole"], cast: ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o", "Danai Gurira", "Martin Freeman", "Letitia Wright"], trailerId: "xjDjIWPwcPU",
    watchBefore: ["capitan-america-civil-war"], watchAfter: ["vengadores-infinity-war", "black-panther-wakanda-forever"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "T'Challa anuncia ante las Naciones Unidas que Wakanda compartirá sus recursos y conocimientos con el mundo." }, { label: "ESCENA FINAL", description: "Bucky despierta recuperado en Wakanda y Shuri se dispone a enseñarle el país." }],
    sources: [{ label: "GUÍA OFICIAL MARVEL", url: "https://www.marvel.com/articles/movies/the-essential-marvel-cinematic-universe-watch-guide" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "ant-man",
    spoilerFreeSynopsis: "El ladrón Scott Lang recibe una segunda oportunidad cuando Hank Pym le confía un traje capaz de alterar su tamaño y una misión para proteger esa tecnología.",
    releaseDate: "17 JUL 2015", releaseDateISO: "2015-07-17", runtime: "117 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Peyton Reed"], writers: ["Edgar Wright", "Joe Cornish", "Adam McKay", "Paul Rudd"], cast: ["Paul Rudd", "Evangeline Lilly", "Corey Stoll", "Bobby Cannavale", "Michael Peña", "Michael Douglas"], trailerId: "pWdKf3MneyI",
    watchBefore: ["los-vengadores"], watchAfter: ["capitan-america-civil-war", "ant-man-y-la-avispa"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Hank muestra a Hope un prototipo avanzado del traje de la Avispa que había diseñado junto a Janet." }, { label: "ESCENA FINAL", description: "Steve y Sam encuentran a Bucky; Sam afirma conocer a alguien que puede ayudarlos." }],
    sources: [{ label: "GUÍA OFICIAL MARVEL", url: "https://www.marvel.com/articles/movies/the-essential-marvel-cinematic-universe-watch-guide" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "ant-man-y-la-avispa",
    spoilerFreeSynopsis: "Durante su arresto domiciliario, Scott recibe una señal del Reino Cuántico y se une a Hope y Hank para intentar recuperar a Janet van Dyne.",
    releaseDate: "6 JUL 2018", releaseDateISO: "2018-07-06", runtime: "118 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Peyton Reed"], writers: ["Chris McKenna", "Erik Sommers", "Andrew Barrer", "Gabriel Ferrari", "Paul Rudd"], cast: ["Paul Rudd", "Evangeline Lilly", "Michael Peña", "Walton Goggins", "Hannah John-Kamen", "Michelle Pfeiffer"], trailerId: "8_rTIAOohas",
    watchBefore: ["ant-man", "capitan-america-civil-war"], watchAfter: ["vengadores-infinity-war", "vengadores-endgame", "ant-man-y-la-avispa-quantumania"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Scott queda atrapado en el Reino Cuántico cuando Hope, Hank y Janet desaparecen durante el chasquido." }, { label: "ESCENA FINAL", description: "La hormiga que sustituyó a Scott continúa tocando la batería en una ciudad silenciosa tras el chasquido." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/onlinecloseupmagicuniversity" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "spider-man-homecoming",
    spoilerFreeSynopsis: "Después de luchar junto a los Vengadores, Peter Parker intenta demostrar a Tony Stark que está preparado para amenazas mayores mientras el Buitre trafica con tecnología alienígena.",
    releaseDate: "7 JUL 2017", releaseDateISO: "2017-07-07", runtime: "133 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISPONIBILIDAD SEGÚN REGIÓN",
    directors: ["Jon Watts"], writers: ["Jonathan Goldstein", "John Francis Daley", "Jon Watts", "Christopher Ford", "Chris McKenna", "Erik Sommers"], cast: ["Tom Holland", "Michael Keaton", "Robert Downey Jr.", "Marisa Tomei", "Jon Favreau", "Zendaya"], trailerId: "n9DwoQ7HWvI",
    watchBefore: ["capitan-america-civil-war"], watchAfter: ["vengadores-infinity-war", "spider-man-lejos-de-casa"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Mac Gargan pregunta a Adrian Toomes por la identidad de Spider-Man, pero Toomes protege el secreto de Peter." }, { label: "ESCENA FINAL", description: "Capitán América protagoniza un vídeo educativo sobre la paciencia y reconoce que a veces esta no obtiene recompensa." }],
    sources: [{ label: "GUÍA OFICIAL MARVEL", url: "https://www.marvel.com/articles/movies/the-essential-marvel-cinematic-universe-watch-guide" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "spider-man-lejos-de-casa",
    spoilerFreeSynopsis: "Tras Endgame, Peter viaja a Europa buscando una vida normal, pero Nick Fury y un nuevo héroe llamado Mysterio lo reclutan ante una aparente amenaza interdimensional.",
    releaseDate: "2 JUL 2019", releaseDateISO: "2019-07-02", runtime: "129 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISPONIBILIDAD SEGÚN REGIÓN",
    directors: ["Jon Watts"], writers: ["Chris McKenna", "Erik Sommers"], cast: ["Tom Holland", "Samuel L. Jackson", "Zendaya", "Cobie Smulders", "Jon Favreau", "Jake Gyllenhaal"], trailerId: "Nt9L1jCKGnE",
    watchBefore: ["vengadores-endgame", "spider-man-homecoming"], watchAfter: ["spider-man-no-way-home"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "J. Jonah Jameson emite un vídeo manipulado por Mysterio que acusa a Spider-Man y revela públicamente que es Peter Parker." }, { label: "ESCENA FINAL", description: "Talos y Soren revelan que han sustituido a Fury y Hill mientras el verdadero Fury coordina una operación Skrull en el espacio." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/spider-man-far-from-home" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "iron-man",
    spoilerFreeSynopsis: "Tras sobrevivir a un secuestro gracias a una armadura construida en cautiverio, Tony Stark decide transformar su tecnología y asumir personalmente las consecuencias de sus armas.",
    releaseDate: "2 MAY 2008", releaseDateISO: "2008-05-02", runtime: "126 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Jon Favreau"], writers: ["Mark Fergus", "Hawk Ostby", "Art Marcum", "Matt Holloway"], cast: ["Robert Downey Jr.", "Terrence Howard", "Jeff Bridges", "Gwyneth Paltrow", "Leslie Bibb", "Shaun Toub"], trailerId: "8ugaeA-nMTc",
    watchBefore: [], watchAfter: ["iron-man-2", "los-vengadores"],
    postCredits: [{ label: "ESCENA FINAL", description: "Nick Fury visita a Tony Stark para hablarle de la Iniciativa Vengadores y de un universo mucho más grande." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/iron-man" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "los-vengadores",
    spoilerFreeSynopsis: "Nick Fury reúne a seis héroes con métodos incompatibles cuando Loki y un ejército extraterrestre amenazan con conquistar la Tierra.",
    releaseDate: "4 MAY 2012", releaseDateISO: "2012-05-04", runtime: "143 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Joss Whedon"], writers: ["Joss Whedon"], cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth", "Scarlett Johansson", "Jeremy Renner"], trailerId: "eOrNdBpGMv8",
    watchBefore: ["iron-man", "capitan-america-el-primer-vengador", "thor"], watchAfter: ["iron-man-3", "capitan-america-el-soldado-de-invierno", "vengadores-la-era-de-ultron"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "El líder de los Chitauri informa de la derrota a Thanos, quien sonríe ante la idea de desafiar a los humanos." }, { label: "ESCENA FINAL", description: "Los Vengadores comen en silencio en el restaurante de shawarma que Tony mencionó durante la batalla." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/the-avengers" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "vengadores-la-era-de-ultron",
    spoilerFreeSynopsis: "El programa de defensa creado por Tony Stark y Bruce Banner cobra conciencia, concluye que la humanidad es el problema y obliga a los Vengadores a enfrentarse a su propio legado.",
    releaseDate: "1 MAY 2015", releaseDateISO: "2015-05-01", runtime: "141 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Joss Whedon"], writers: ["Joss Whedon"], cast: ["Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo", "Chris Evans", "Scarlett Johansson", "James Spader"], trailerId: "tmeOjFno6Do",
    watchBefore: ["los-vengadores", "iron-man-3", "capitan-america-el-soldado-de-invierno"], watchAfter: ["capitan-america-civil-war", "black-panther", "wandavision"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Thanos se coloca el Guantelete del Infinito y decide buscar personalmente las Gemas." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/Ultron/" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "capitan-america-civil-war",
    spoilerFreeSynopsis: "La presión internacional para controlar a los Vengadores divide al equipo, mientras una conspiración convierte el pasado de Bucky Barnes en el centro del conflicto.",
    releaseDate: "6 MAY 2016", releaseDateISO: "2016-05-06", runtime: "147 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Anthony Russo", "Joe Russo"], writers: ["Christopher Markus", "Stephen McFeely"], cast: ["Chris Evans", "Robert Downey Jr.", "Scarlett Johansson", "Sebastian Stan", "Anthony Mackie", "Chadwick Boseman"], trailerId: "dKrVegVI0Us",
    watchBefore: ["vengadores-la-era-de-ultron", "capitan-america-el-soldado-de-invierno", "ant-man"], watchAfter: ["black-widow", "black-panther", "spider-man-homecoming"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Bucky vuelve a la criogenia en Wakanda mientras científicos buscan eliminar su programación mental." }, { label: "ESCENA FINAL", description: "Peter Parker prueba los nuevos lanzarredes y descubre la señal arácnida incorporada por Tony Stark." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/captain-america-civil-war" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "doctor-strange",
    spoilerFreeSynopsis: "Un cirujano brillante pierde el control de sus manos y, buscando una cura, descubre las artes místicas y una dimensión de amenazas que la ciencia no puede explicar.",
    releaseDate: "4 NOV 2016", releaseDateISO: "2016-11-04", runtime: "115 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Scott Derrickson"], writers: ["Jon Spaihts", "Scott Derrickson", "C. Robert Cargill"], cast: ["Benedict Cumberbatch", "Chiwetel Ejiofor", "Rachel McAdams", "Benedict Wong", "Mads Mikkelsen", "Tilda Swinton"], trailerId: "HSzx-zryEgM",
    watchBefore: [], watchAfter: ["thor-ragnarok", "vengadores-infinity-war", "doctor-strange-en-el-multiverso-de-la-locura"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Strange acepta ayudar a Thor a localizar a Odin para que los asgardianos abandonen la Tierra." }, { label: "ESCENA FINAL", description: "Mordo despoja de su energía mística a Pangborn y declara que hay demasiados hechiceros." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/doctor-strange" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "thor-ragnarok",
    spoilerFreeSynopsis: "Despojado de Mjolnir y prisionero en Sakaar, Thor debe regresar a Asgard antes de que Hela y la profecía del Ragnarök destruyan su hogar.",
    releaseDate: "3 NOV 2017", releaseDateISO: "2017-11-03", runtime: "130 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Taika Waititi"], writers: ["Eric Pearson", "Craig Kyle", "Christopher L. Yost"], cast: ["Chris Hemsworth", "Tom Hiddleston", "Cate Blanchett", "Idris Elba", "Jeff Goldblum", "Tessa Thompson"], trailerId: "ue80QwXMRHg",
    watchBefore: ["thor-el-mundo-oscuro", "vengadores-la-era-de-ultron", "doctor-strange"], watchAfter: ["vengadores-infinity-war", "thor-love-and-thunder"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "La nave de refugiados asgardianos queda interceptada por la gigantesca Sanctuary II de Thanos." }, { label: "ESCENA FINAL", description: "El Gran Maestro intenta convencer a los rebeldes de Sakaar de que el resultado de la revolución fue un empate." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/thor-ragnarok" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "capitana-marvel",
    spoilerFreeSynopsis: "Una guerrera Kree llega a la Tierra de 1995 durante una guerra contra los Skrull y empieza a reconstruir los recuerdos que cuestionan todo lo que sabe sobre sí misma.",
    releaseDate: "8 MAR 2019", releaseDateISO: "2019-03-08", runtime: "124 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Anna Boden", "Ryan Fleck"], writers: ["Anna Boden", "Ryan Fleck", "Geneva Robertson-Dworet"], cast: ["Brie Larson", "Samuel L. Jackson", "Ben Mendelsohn", "Djimon Hounsou", "Lee Pace", "Lashana Lynch"], trailerId: "Z1BCujX3pw8",
    watchBefore: [], watchAfter: ["vengadores-endgame", "ms-marvel", "the-marvels"],
    postCredits: [{ label: "ESCENA INTERMEDIA", description: "Carol aparece ante los Vengadores supervivientes después de que el busca de Fury deje de transmitir." }, { label: "ESCENA FINAL", description: "Goose expulsa el Teseracto sobre el escritorio de Fury." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/captain-marvel" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "falcon-y-el-soldado-de-invierno",
    spoilerFreeSynopsis: "Sam Wilson y Bucky Barnes afrontan el vacío dejado por Steve Rogers mientras un nuevo Capitán América y los Flag Smashers disputan el significado del escudo.",
    releaseDate: "19 MAR 2021", releaseDateISO: "2021-03-19", runtime: "6 EPISODIOS", certification: "TV-14", status: "ESTRENADO", availability: "DISNEY+",
    directors: ["Kari Skogland"], writers: ["Malcolm Spellman"], cast: ["Anthony Mackie", "Sebastian Stan", "Daniel Brühl", "Emily VanCamp", "Wyatt Russell", "Erin Kellyman"], trailerId: "IWBsDaFWyTE",
    watchBefore: ["capitan-america-civil-war", "vengadores-endgame"], watchAfter: ["capitan-america-brave-new-world", "thunderbolts"],
    postCredits: [{ label: "ESCENA FINAL DEL EPISODIO 6", description: "Sharon Carter recibe el indulto y recupera su puesto, pero planea vender secretos y tecnología desde dentro del Gobierno." }],
    sources: [{ label: "INFORMACIÓN OFICIAL MARVEL", url: "https://www.marvel.com/articles/tv-shows/falcon-winter-soldier-most-watched-series-premiere-ever-disney-plus" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "ms-marvel",
    spoilerFreeSynopsis: "Kamala Khan, una adolescente de Jersey City fascinada por los Vengadores, encuentra un brazalete familiar que despierta una conexión con su pasado y nuevas habilidades.",
    releaseDate: "8 JUN 2022", releaseDateISO: "2022-06-08", runtime: "6 EPISODIOS", certification: "TV-14", status: "ESTRENADO", availability: "DISNEY+",
    directors: ["Adil El Arbi", "Bilall Fallah", "Meera Menon", "Sharmeen Obaid-Chinoy"], writers: ["Bisha K. Ali"], cast: ["Iman Vellani", "Matt Lintz", "Yasmeen Fletcher", "Zenobia Shroff", "Mohan Kapur", "Saagar Shaikh"], trailerId: "m9EX0f6V11Y",
    watchBefore: ["capitana-marvel", "vengadores-endgame"], watchAfter: ["the-marvels"],
    postCredits: [{ label: "ESCENA FINAL DEL EPISODIO 6", description: "El brazalete reacciona y Kamala desaparece; Carol Danvers aparece de forma repentina en su habitación." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/tv-shows/ms-marvel/1" }], reviewedAt: "30 AGO 2026",
  },
  {
    titleId: "black-widow",
    spoilerFreeSynopsis: "Entre Civil War e Infinity War, Natasha Romanoff se reúne con su antigua familia encubierta para derribar el programa que convirtió a muchas jóvenes en Viudas.",
    releaseDate: "9 JUL 2021", releaseDateISO: "2021-07-09", runtime: "134 MIN", certification: "PG-13", status: "ESTRENADO", availability: "DISNEY+ · DIGITAL · BLU-RAY",
    directors: ["Cate Shortland"], writers: ["Eric Pearson"], cast: ["Scarlett Johansson", "Florence Pugh", "David Harbour", "Rachel Weisz", "O-T Fagbenle", "Ray Winstone"], trailerId: "RxAtuMu_ph4",
    watchBefore: ["capitan-america-civil-war"], watchAfter: ["vengadores-infinity-war", "ojo-de-halcon", "thunderbolts"],
    postCredits: [{ label: "ESCENA FINAL", description: "Después de Endgame, Valentina Allegra de Fontaine muestra a Yelena una foto de Clint Barton y lo señala como responsable de la muerte de Natasha." }],
    sources: [{ label: "FICHA OFICIAL MARVEL", url: "https://www.marvel.com/movies/black-widow" }], reviewedAt: "30 AGO 2026",
  },
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
