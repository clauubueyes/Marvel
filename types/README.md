# Contratos de dominio

Cada módulo es la fuente única de los tipos de su dominio y se importa siempre por
ruta directa: `import type { NewsItem } from "@/types/news"`.

No son barrels. No los re-exportes desde `data/`, `services/` o `utils/`: hacerlo
crea una segunda ruta de importación para el mismo tipo y obliga a elegir entre dos
importaciones equivalentes. Si un consumidor necesita reexportar, que lo haga desde su
propio `index.ts` de dominio, no desde un módulo de datos.
