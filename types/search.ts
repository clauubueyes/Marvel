export type SearchResultType = "PERSONAJE" | "TÍTULO" | "EVENTO" | "UNIVERSO" | "EQUIPO";
export type SearchResult = { id: string; type: SearchResultType; title: string; subtitle: string; description: string; href: string; image: string; searchText: string };
