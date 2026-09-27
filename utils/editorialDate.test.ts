import test from "node:test";
import assert from "node:assert/strict";
import { parseEditorialDate, parseIsoDate, parseEditorialReviewedAt } from "./editorialDate";

const iso = (value: string) => parseIsoDate(value)?.toISOString();

test("parseIsoDate accepts real ISO dates and rejects impossible ones", () => {
  assert.equal(iso("2026-08-30"), "2026-08-30T00:00:00.000Z");
  assert.equal(parseIsoDate("2026-02-31"), undefined);
  assert.equal(parseIsoDate("30-08-2026"), undefined);
  assert.equal(parseIsoDate("2026-8-3"), undefined);
  assert.equal(parseIsoDate(""), undefined);
  assert.equal(parseIsoDate(undefined), undefined);
});

test("parseEditorialDate accepts the catalogue format and rejects unknown months", () => {
  assert.equal(parseEditorialDate("30 AGO 2026")?.toISOString(), "2026-08-30T00:00:00.000Z");
  assert.equal(parseEditorialDate("1 ENE 2026")?.toISOString(), "2026-01-01T00:00:00.000Z");
  assert.equal(parseEditorialDate("30 XYZ 2026"), undefined);
  assert.equal(parseEditorialDate("2026-08-30"), undefined);
  assert.equal(parseEditorialDate("30 AGO"), undefined);
  assert.equal(parseEditorialDate(null), undefined);
});

test("parseEditorialReviewedAt reads both formats that coexist in the catalogue", () => {
  assert.equal(
    parseEditorialReviewedAt("2026-08-30")?.toISOString(),
    parseEditorialReviewedAt("30 AGO 2026")?.toISOString(),
  );
  assert.equal(parseEditorialReviewedAt("30 AGO 2026")?.toISOString(), "2026-08-30T00:00:00.000Z");
  assert.equal(parseEditorialReviewedAt("revisado ayer"), undefined);
});
