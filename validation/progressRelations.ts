import { mcuCatalog } from "@/data/mcuCatalog";
import { mcuEntities } from "@/data/mcuEntities";
import { viewingRoutes } from "@/data/viewingRoutes";
import { titleDossierRequirement } from "@/services/progress/titleSpoilers";
import type { MCUEntity } from "@/types/entity";
import type { ViewingRoute } from "@/types/viewingRoute";

/**
 * Build guard for the progress-protected relations added outside the character
 * dossiers: viewing routes, entity connections and the title dossier gates.
 * Every route unlocks through `allOf` of its steps, every connection through
 * `allOf` of its `titleIds` and every dossier section through its own title.
 */
export function validateProgressRelations(
  routes: readonly ViewingRoute[] = viewingRoutes,
  entities: readonly MCUEntity[] = mcuEntities,
  catalogue = mcuCatalog,
): string[] {
  const errors: string[] = [];
  const valid = new Set(catalogue.map(({ slug }) => slug));

  for (const route of routes) {
    if (!route.steps.length) errors.push(`${route.name}: la ruta no tiene pasos y su requisito queda vacío.`);
    const seen = new Set<string>();
    for (const step of route.steps) {
      if (!valid.has(step.titleId)) errors.push(`${route.name}: el paso ${step.titleId} no existe en el catálogo.`);
      if (seen.has(step.titleId)) errors.push(`${route.name}: el paso ${step.titleId} se repite, el desbloqueo debería ser suficiente.`);
      seen.add(step.titleId);
      if (!step.spoiler.trim()) errors.push(`${route.name}: el paso ${step.titleId} no tiene spoiler que desbloquear.`);
    }
  }

  for (const entity of entities) {
    if (!entity.titleIds.length) errors.push(`${entity.name}: la conexión no referencia ningún título y queda bloqueada para siempre.`);
  }

  for (const title of catalogue) {
    const requirement = titleDossierRequirement(title.slug);
    if (!requirement.allOf.length || !requirement.allOf.every((id) => valid.has(id))) {
      errors.push(`${title.title}: el requisito del dossier no es válido.`);
    }
  }

  return errors;
}