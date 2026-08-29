export type DoomEvent = {
  order: string;
  year: string;
  title: string;
  format: "PELÍCULA" | "SERIE";
  chapter: string;
  summary: string;
  key: string;
  status: "ESENCIAL" | "RECOMENDADO" | "DESTINO";
  image: string;
};

export const doomEvents: DoomEvent[] = [
  { order: "01", year: "2019", title: "Avengers: Endgame", format: "PELÍCULA", chapter: "EL TIEMPO SE ABRE", summary: "El viaje temporal demuestra que la historia puede bifurcarse y deja un mundo sin sus Vengadores originales.", key: "Viajes temporales · Legado", status: "ESENCIAL", image: "https://i.ytimg.com/vi/TcMBFSGVi1c/maxresdefault.jpg" },
  { order: "02", year: "2021–23", title: "Loki", format: "SERIE", chapter: "NACE EL MULTIVERSO", summary: "La Línea Temporal Sagrada deja de ser una única vía. La TVA pasa a vigilar infinitas ramificaciones.", key: "TVA · Variantes · Yggdrasil", status: "ESENCIAL", image: "https://i.ytimg.com/vi/nW948Va-l10/maxresdefault.jpg" },
  { order: "03", year: "2021", title: "Spider-Man: No Way Home", format: "PELÍCULA", chapter: "LAS REALIDADES SE TOCAN", summary: "Un hechizo roto permite que personas de universos distintos atraviesen la misma frontera.", key: "Hechizo · Variantes · Memoria", status: "RECOMENDADO", image: "https://i.ytimg.com/vi/JfVOs4VSpmA/maxresdefault.jpg" },
  { order: "04", year: "2022", title: "Multiverse of Madness", format: "PELÍCULA", chapter: "LAS INCURSIONES", summary: "Viajar entre realidades tiene un precio: dos universos pueden colisionar y destruirse mutuamente.", key: "Incursiones · Darkhold · América", status: "ESENCIAL", image: "https://i.ytimg.com/vi/aWzlQ2N6qqg/maxresdefault.jpg" },
  { order: "05", year: "2024", title: "Deadpool & Wolverine", format: "PELÍCULA", chapter: "MUNDOS QUE MUEREN", summary: "La TVA, el Vacío y los seres ancla muestran que una realidad completa puede marchitarse.", key: "TVA · Vacío · X-Men", status: "RECOMENDADO", image: "https://i.ytimg.com/vi/73_1biulkYk/maxresdefault.jpg" },
  { order: "06", year: "2025", title: "The Fantastic Four: First Steps", format: "PELÍCULA", chapter: "TIERRA-828", summary: "La Primera Familia llega desde otro universo y su historia enlaza directamente con la próxima reunión de los Vengadores.", key: "Fantastic Four · Tierra-828", status: "ESENCIAL", image: "https://i.ytimg.com/vi/18QQWa5MEcs/maxresdefault.jpg" },
  { order: "07", year: "2026", title: "Avengers: Doomsday", format: "PELÍCULA", chapter: "LOS MUNDOS COLISIONAN", summary: "Avengers, X-Men y Fantastic Four convergen ante una amenaza todavía envuelta en secreto: Victor von Doom.", key: "Doom · Colisión · Convergencia", status: "DESTINO", image: "https://i.ytimg.com/vi/399Ez7WHK5s/maxresdefault.jpg" },
];
