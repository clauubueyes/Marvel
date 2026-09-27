import assert from "node:assert/strict";
import test from "node:test";
import { rankCommunityTop, type CommunityCandidate } from "./communityTop";

const candidate = (id: string, name: string): CommunityCandidate => ({
  id,
  name,
  alias: `alias-${id}`,
  color: "#b9d737",
  image: `/characters/${id}.webp`,
});

const catalog = [
  candidate("iron", "Iron Man"),
  candidate("thor", "Thor"),
  candidate("hela", "Hela"),
];

test("the real ranking puts the most voted character first", () => {
  const top = rankCommunityTop(catalog, { iron: 12, thor: 40, hela: 3 }, 10);
  assert.deepEqual(
    top.map(({ id }) => id),
    ["thor", "iron", "hela"],
  );
  assert.deepEqual(
    top.map(({ position }) => position),
    [1, 2, 3],
  );
});

test("characters without fans never appear in a ranking", () => {
  const top = rankCommunityTop(catalog, { thor: 2 }, 10);
  assert.deepEqual(
    top.map(({ id }) => id),
    ["thor"],
  );
  assert.deepEqual(rankCommunityTop(catalog, {}, 10), []);
  assert.deepEqual(rankCommunityTop(catalog, { iron: 0 }, 10), []);
});

test("votes for ids outside the catalogue are ignored", () => {
  const top = rankCommunityTop(catalog, { "personaje-retirado": 99, thor: 1 }, 10);
  assert.deepEqual(
    top.map(({ id }) => id),
    ["thor"],
  );
});

test("ties are broken by name so the order never shuffles", () => {
  const tied = [candidate("b", "Zeta"), candidate("a", "Alfa")];
  const first = rankCommunityTop(tied, { a: 5, b: 5 }, 10);
  const second = rankCommunityTop([...tied].reverse(), { a: 5, b: 5 }, 10);
  assert.deepEqual(
    first.map(({ id }) => id),
    ["a", "b"],
  );
  assert.deepEqual(
    second.map(({ id }) => id),
    first.map(({ id }) => id),
  );
});

test("the limit caps the ranking without dropping the leaders", () => {
  const many = Array.from({ length: 25 }, (_, index) =>
    candidate(`id-${index}`, `Personaje ${String(index).padStart(2, "0")}`),
  );
  const counts = Object.fromEntries(many.map(({ id }, index) => [id, index]));
  const top = rankCommunityTop(many, counts, 10);
  assert.equal(top.length, 10);
  assert.equal(top[0].id, "id-24");
  assert.equal(top[9].id, "id-15");
});
