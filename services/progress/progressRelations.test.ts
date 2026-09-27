import assert from "node:assert/strict";
import test from "node:test";
import { mcuCatalog } from "@/data/mcuCatalog";
import { mcuEntities } from "@/data/mcuEntities";
import { viewingRoutes } from "@/data/viewingRoutes";
import { titleDossierRequirement } from "./titleSpoilers";
import { validateProgressRelations } from "@/validation/progressRelations";

function withRoute(mutate: (route: (typeof viewingRoutes)[number]) => void) {
  const route = structuredClone(viewingRoutes[0]);
  mutate(route);
  return [route];
}

function withEntity(mutate: (entity: (typeof mcuEntities)[number]) => void) {
  const entity = structuredClone(mcuEntities[0]);
  mutate(entity);
  return [entity];
}

/** Los validadores devuelven incidencias estructuradas; aquí solo interesan los mensajes. */
function messages(issues: ReturnType<typeof validateProgressRelations>) {
  return issues.map(({ message }) => message);
}

test("the real catalogue passes the progress relations guard", () => {
  assert.deepEqual(validateProgressRelations(), []);
});

test("every catalogued title has its own non-empty dossier requirement", () => {
  const valid = new Set(mcuCatalog.map(({ slug }) => slug));
  for (const title of mcuCatalog) {
    const requirement = titleDossierRequirement(title.slug);
    assert.deepEqual(requirement, { allOf: [title.slug] });
    assert.ok(
      requirement.allOf.every((id) => valid.has(id)),
      title.slug,
    );
  }
});

test("a route without steps, with repeated or unknown titles, or without a spoiler cannot publish", () => {
  const empty = withRoute((route) => {
    route.steps = [];
  });
  assert.ok(
    messages(validateProgressRelations(empty)).some((m) => m.includes("la ruta no tiene pasos")),
  );

  const repeated = withRoute((route) => {
    route.steps = [route.steps[0], route.steps[0]];
  });
  assert.ok(messages(validateProgressRelations(repeated)).some((m) => m.includes("se repite")));

  const unknown = withRoute((route) => {
    route.steps[0].titleId = "no-existe";
  });
  assert.ok(
    messages(validateProgressRelations(unknown)).some((m) =>
      m.includes("no existe en el catálogo"),
    ),
  );

  const emptySpoiler = withRoute((route) => {
    route.steps[0].spoiler = "   ";
  });
  assert.ok(
    messages(validateProgressRelations(emptySpoiler)).some((m) => m.includes("no tiene spoiler")),
  );
});

test("an entity without any linked title cannot publish its connection", () => {
  const broken = withEntity((entity) => {
    entity.titleIds = [];
  });
  assert.ok(
    messages(validateProgressRelations([], broken)).some((m) =>
      m.includes("no referencia ningún título"),
    ),
  );
});

test("every progress issue is tagged with its scope, severity and affected field", () => {
  const broken = withRoute((route) => {
    route.steps = [];
  });
  const issues = validateProgressRelations(broken);
  assert.ok(issues.length);
  for (const issue of issues) {
    assert.equal(issue.scope, "progreso");
    assert.equal(issue.severity, "ERROR");
    assert.ok(issue.subject.length);
    assert.ok(issue.field.length);
  }
});
