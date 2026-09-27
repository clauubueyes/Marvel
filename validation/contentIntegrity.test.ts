import assert from "node:assert/strict";
import test from "node:test";
import { runValidation } from "./index";
import { validateContentIntegrity } from "./contentIntegrity";

test("the real catalogue passes the integrity guard", () => {
  assert.deepEqual(validateContentIntegrity(), []);
});

test("the real catalogue passes the unified structural validation", () => {
  const report = runValidation();
  assert.deepEqual(report.issues, []);
  assert.equal(report.errors, 0);
});

test("the unified report always exposes the three scopes in presentation order", () => {
  const report = runValidation();
  assert.deepEqual(
    report.byScope.map(({ scope }) => scope),
    ["integridad", "spoilers", "progreso"],
  );
  for (const group of report.byScope) {
    assert.ok(group.label.length);
    for (const issue of group.issues) {
      assert.equal(issue.scope, group.scope);
    }
  }
});

test("the report count and the grouped issues stay consistent", () => {
  const report = runValidation();
  const grouped = report.byScope.reduce((total, group) => total + group.issues.length, 0);
  assert.equal(grouped, report.issues.length);
  assert.equal(report.errors, report.issues.filter(({ severity }) => severity === "ERROR").length);
});
