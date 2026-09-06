import type { StoryChapter } from "@/types/character";

export const storyData: Record<string, StoryChapter[]> = {
  spider: [
    { year: "2016", kicker: "LA RECLUTA", title: "Un poder que nadie pidió", text: "Tony Stark recluta a un adolescente de Queens para un enfrentamiento entre héroes. Peter acepta con entusiasmo y vértigo: nadie le ha explicado cuánto pesa la responsabilidad." },
    { year: "2017", kicker: "SIN EL TRAJE", title: "El héroe sin el disfraz", text: "Sin la tecnología de Stark y encerrado bajo el barco de Toomes, Peter demuestra que el heroísmo no depende de un traje. Se levanta solo, con fuerzas que aún no entiende." },
    { year: "2019", kicker: "IDENTIDAD REVELADA", title: "El nombre que se hizo público", text: "Tras la muerte de Tony y la mentira de Mysterio, el mundo descubre quién es Spider-Man. Peter vuelve a empezar de cero, con los ojos puestos en él por primera vez." },
    { year: "2021", kicker: "EL OLVIDO", title: "Borrar para salvar el multiverso", text: "Reunir a sus versiones de otros universos cuesta más de lo que Peter imagina. Decide que toda su historia sea olvidada para cerrar la fractura; Spider-Man sigue ahí." },
  ],
  iron: [
    { year: "2008", kicker: "LA JAULA", title: "Nacer en una cueva", text: "Secuestrado en Afganistán, Tony construye la Mark I con chatarra y a escondidas. La primera armadura no lo convierte en héroe: le enseña que la ironía del inventor es sentirse responsable de lo que crea." },
    { year: "2012", kicker: "NUEVA YORK", title: "Salvar la ciudad", text: "Atraviesa un portal con un misil nuclear para salvar Manhattan. El genio que siempre había combatido solo aprende, sobre una ciudad en llamas, que necesita a un equipo." },
    { year: "2016", kicker: "LOS SECRETOS", title: "El precio de la verdad", text: "Los Acuerdos de Sokovia primero; después, la confesión de que Bucky fue el asesino de sus padres. Tony descubre que su máquina más perfeccionada —la venganza— no tiene arreglo." },
    { year: "2023", kicker: "EL SACRIFICIO", title: "Enfrentar al Titán Loco", text: "Viaja al pasado, recupera a quienes desaparecieron y, cuando todas las armas se agotan, usa las Gemas del Infinito. Tony Stark dice \"yo soy Iron Man\" y pone fin a la guerra con su propia vida." },
  ],
  strange: [
    { year: "2016", kicker: "LAS MANOS", title: "Perder para aprender", text: "\"Los accidentes no pasan por accidente\": Strange pierde sus manos y su identidad, y en un templo en Katmandú descubre que lo que más deseaba —controlarlo todo— era su mayor obstáculo." },
    { year: "2018", kicker: "14.000.605", title: "La única victoria", text: "Examina millones de futuros en Titán y entrega la Gema del Tiempo sin dudar. Ningún hechizo salva el universo; a veces solo una jugada a la larga." },
    { year: "2021", kicker: "LA FRACTURA", title: "Las consecuencias de un hechizo", text: "Su hechizo incompleto abre la frontera multiversal y obliga a Peter a elegir entre sus amigos y el orden que protege. Strange hace de espejo: no siempre se tiene razón." },
    { year: "2022", kicker: "LA INCURSIÓN", title: "El precio de la multiversalidad", text: "Entre realidades, cada decisión deja cicatrices. Clea le advierte que ha causado una incursión y baja del trono de hechicero supremo para pagar una deuda que ni la magia puede cobrar." },
  ],
  panther: [
    { year: "2016", kicker: "LA VENGANZA", title: "Un reino en duelo", text: "La muerte de T'Chaka arrastra a T'Challa a una cacería que Zemo manipula. La Pantera descubre que la venganza es un ciclo y elige romperlo: primera decisión de un futuro rey." },
    { year: "2018", kicker: "EL TRONO", title: "Wakanda frente al espejo", text: "Contra Killmonger, T'Challa derrota a quien le recuerda lo que Wakanda eligió ignorar. Su respuesta no es cerrar fronteras, sino entregar al mundo el conocimiento que le negaron." },
    { year: "2018", kicker: "EL BLIP", title: "El sacrificio de la recompensa", text: "Abre las puertas de Wakanda para proteger a Vision. Thanos le gana la batalla, pero el gesto convierte a la nación en el nuevo hogar de los Vengadores. Regresa en 2023 con el ejército entero detrás." },
    { year: "2018", kicker: "KILLMONGER", title: "La voz del resentimiento", text: "Killmonger reclama un trono que cree suyo y desafía la política de aislamiento que Wakanda eligió durante siglos. La derrota no termina la lucha: transforma el reino para siempre." },
  ],
  wanda: [
    { year: "2015", kicker: "SOKOVIA", title: "Ir con el corazón", text: "Traicionada por Ultron en su creación, del lado de los que consideraba enemigos. La Vengadora pierde a su hermano, y desde entonces su magia operará dentro del duelo, no alrededor." },
    { year: "2016", kicker: "LAGOS", title: "El accidente", text: "Un rescate protegido termina en civiles muertos. La culpa se convierte en deliberación pública: Wanda es confinada, convertida en símbolo del miedo que otros siembran." },
    { year: "2021", kicker: "WESTVIEW", title: "El Hex", text: "Sin Vision y sin golpe, Wanda remodela un pueblo entero a su imagen del duelo. Su magia del caos dicta que el dolor no puede esconderse: el Hex no contiene lo que de verdad la sostiene." },
    { year: "2022", kicker: "EL DARKHOLD", title: "La madre que lo borró todo", text: "Corrompida por el Darkhold, atraviesa mundos para encontrar a sus hijos y, al final, destruye el libro en todos los universos para que nadie más cargue con esa maldición." },
  ],
  "captain-america": [
    { year: "1943", kicker: "EL PROYECTO", title: "El hombre que no paraba", text: "Steve miente para servir, sobrevive a la máquina y se vuelve el primer supersoldado. El suero no lo cambió: solo amplificó lo que ya era antes de tener bíceps." },
    { year: "1945", kicker: "EL HIELO", title: "El último vuelo", text: "Prefiere estrellarse en el Ártico antes de dejar que HYDRA maneje el mundo. Steve Rogers se despide de su tiempo como los héroes de las películas: a tiempo de no volver." },
    { year: "2014", kicker: "DESOBEDECER", title: "Más grande que la bandera", text: "Su lealtad obedece los códigos, pero no los principios. Cuando descubre que su agencia está tomada por el enemigo, Steve elige desobedecer a todo un sistema en nombre de la justicia." },
    { year: "2023", kicker: "UNA VIDA PENDIENTE", title: "El final del baile", text: "Devuelve las Gemas al pasado y, en vez de volver a la guerra, se queda. El héroe que renunció a todo por el deber ahora renuncia al título para vivir la vida que le debían desde 1945." },
  ],
  thor: [
    { year: "2011", kicker: "EL DESTIERRO", title: "Aprender en Midgard", text: "La arrogancia le cuesta el título de heredero y lo arroja a la Tierra sin poderes. Thor abandona el martillo y, por primera vez, gana algo ajeno a la fuerza: la humildad." },
    { year: "2017", kicker: "RAGNAROK", title: "Perder para reinar", text: "Pierde el martillo, un ojo y un hogar. Llega al poder más grande que jamás tuvo cuando acepta destruir Asgard para salvar a su pueblo: la verdad de Odín, asumida al fin." },
    { year: "2018", kicker: "STORMBREAKER", title: "El golpe que no llegó a tiempo", text: "Forja Stormbreaker y está a punto de detener a Thanos, pero su deseo de venganza permite el Chasquido. Gana la batalla personal y pierde la guerra por un puñado de minutos de rencor." },
    { year: "2022", kicker: "LOVE AND THUNDER", title: "El dios que quiso ser persona", text: "Entre la parada del amor y la exigencia del título, Thor encuentra una forma distinta de merecer: ser padre de una hija que no hereda su rayo sino su corazón." },
  ],
  hulk: [
    { year: "2008", kicker: "EL EXPERIMENTO", title: "El arma que fue Banner", text: "Una exposición a rayos gamma divide a Bruce Banner en dos. La energía que lo convirtió en Hulk también lo obliga a huir de quien lo quiere como arma militar." },
    { year: "2012", kicker: "NUEVA YORK", title: "El monstruo del equipo", text: "Loki cree controlar un monstruo, pero Banner controla al monstruo cuando le conviene: la ciudad entera necesita un Hulk, y se lo da con el golpe más decisivo de la batalla." },
    { year: "2017", kicker: "SAKAAR", title: "El campeón que no quería volver", text: "Dos años de Hulk mercurial que no quería dar la cara. Banner aprende a negociar con su otra mitad: el miedo de una parte no puede durar siempre." },
    { year: "2023", kicker: "EL CHASQUIDO", title: "Cerebro y fuerza", text: "Fusionado en Smart Hulk, devuelve el Blip con las Gemas, porque el único cuerpo lo bastante fuerte para el chasquido también tiene la inteligencia suficiente para querer hacerlo. Banner ya no es dos: es uno." },
  ],
  "black-widow": [
    { year: "2010", kicker: "LA INFILTRACIÓN", title: "La mujer de las sombras", text: "Se instala en Stark Industries bajo fachada y evalúa a Tony sin pestañear. S.H.I.E.L.D. tiene muchas armas; Natasha le recuerda que la más peligrosa no aparece en los jefes." },
    { year: "2014", kicker: "LOS EXPEDIENTES", title: "Quemarlo todo", text: "Elegida para decir la verdad: expone los secretos de S.H.I.E.L.D. para destruir la infiltración de HYDRA. Una vida de mentiras vendida al fin por el costo de sobrevivir en un sistema podrido." },
    { year: "2016", kicker: "SIN BANDOS", title: "La elegida", text: "Ayuda a Steve y a Bucky aunque la convierta en fugitiva. La espía que siempre tuvo un plan empieza a tener una conciencia que vale más que su plan de escape." },
    { year: "2021", kicker: "VORMIR", title: "La deuda saldada", text: "Para conseguir la Gema del Alma, Natasha se ofrece a sí misma. La chica que la Habitación Roja hizo con deuda moral se entrega para que su familia gane: \"te veo\", el saldo final." },
  ],
  hawkeye: [
    { year: "2012", kicker: "LA CIUDAD", title: "El arco entre dioses", text: "Supera el control de Loki y defiende Manhattan desde los tejados. Con un arco, entre dioses y monstruos, dentro de una ciudad que vuela: precisión pura." },
    { year: "2015", kicker: "SOKOVIA", title: "El hogar", text: "Ofrece su casa de campo a los Vengadores y le enseña a Wanda a levantarse después de perderlo todo. Clint sostiene al equipo con lo que siempre fue importante: un lugar al que volver." },
    { year: "2023", kicker: "RONIN", title: "El monstruo que eligió", text: "El Blip lo empuja a una cruzada sin esperanza. Natasha lo detiene, y Clint aprende lo que es la venganza: dejar el mecanismo, no alimentarlo." },
    { year: "2021", kicker: "KATE BISHOP", title: "El relevo", text: "Un traje de Ronin suelto y un cómplice tan valiente como imprudente. Clint recibe a Kate Bishop, le regala el conocimiento y sale del escenario entre arcos y Navidad." },
  ],
  loki: [
    { year: "2011", kicker: "EL HIJO DE NADIE", title: "La mentira del trono", text: "Descubre su origen gigante de hielo y el trono de Asgard se desploma cuando más lo creía suyo. Loki construye su identidad sobre el engaño… de sí mismo." },
    { year: "2012", kicker: "LA CAIDA", title: "El enemigo más productivo", text: "Detrás de los Chitauri, Thanos y una humillación en Manhattan: Loki, el dios del engaño, se convierte en el villano favorito de una historia que no puede controlar." },
    { year: "2018", kicker: "LA MENTIRA TRISTE", title: "El sacrificio del hermano", text: "Se declara hijo de Odín para morir bajo Thanos. La primera vez que un acto de amor no es un plan: el villano más egoísta del universo se escribe a sí mismo para salvar a su hermano." },
    { year: "S2", kicker: "EL TELAR", title: "El dios de las historias", text: "Ante la TVA, Loki deja de querer un trono para sostener todas las líneas temporales. Renuncia a ser visto por completo: no hay gloria nueva en sostener el Yggdrasil." },
  ],
  "captain-marvel": [
    { year: "1995", kicker: "EL OLVIDO", title: "Recordar es rebelarse", text: "Dolada de la memoria Kree, Carol descubre que su \"origen\" era una mentira. No es una arma: es Carol Danvers, y echa abajo el mito que la construyó." },
    { year: "2019", kicker: "LA LLAMADA", title: "Entre los mundos", text: "Responde al busca de Fury que pulsa un año antes y encuentra a los Vengadores rotos tras el Blip. Una sola mujer entre galaxias tiene que bastar para contener a los que rompieron el universo." },
    { year: "2022", kicker: "LAS MARVELS", title: "El intercambio", text: "El brazalete de Kamala entrelaza sus luces con las de Monica. Carol deja de ser la solución solitaria y aprende otra vez a pedir ayuda: la fuerza del universo conectada." },
    { year: "2023", kicker: "HALA", title: "Enfrentar el pasado", text: "La Inteligencia Suprema no es un recuerdo: la destruye de nuevo, esta vez con consecuencias que la persiguen hasta otro planeta. Carol carga las deudas que no puede borrar con un rayo." },
  ],
  "sam-wilson": [
    { year: "2014", kicker: "A TU IZQUIERDA", title: "El héroe que corrió", text: "Un soldado de rescate con alas mecánicas alcanza a un supersoldado. Sam conoce a Steve con la marginalidad típica del que tiene que demostrar todo: levántate y acelera." },
    { year: "2016", kicker: "LA GUERRA", title: "El que quedó de pie", text: "La ruptura de los Vengadores lo encarcela en la Balsa junto a Steve. Sam acepta la sentencia porque el linaje no se elige: se lleva." },
    { year: "2021", kicker: "EL ESCUDO", title: "El peso del símbolo", text: "Recupera el escudo que el gobierno entregó mal y se lo gana en público. Capitán América no porque haya pasado por una máquina, sino porque decidió serlo." },
    { year: "2025", kicker: "BRAVE NEW WORLD", title: "El nuevo símbolo", text: "Investiga una conspiración internacional y defiende el significado del escudo ante un Hulk rojo. Sam demuestra que el símbolo no es el metal: es lo que uno elige hacer con él." },
  ],
};
