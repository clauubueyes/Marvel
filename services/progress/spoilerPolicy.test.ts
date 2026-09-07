import assert from "node:assert/strict";
import test from "node:test";
import { canRevealSpoiler, protectContent } from "./spoilerPolicy";
import { storyData } from "@/data/characters/storyData";
import { mcuCatalog } from "@/data/mcuCatalog";
import { characters } from "@/repositories/characterRepository";

test("explicit spoiler opt-out reveals without changing progress, only after initialization", () => {
  const watched = new Set<string>();
  const requirement = { allOf: ["vengadores-endgame"] };
  assert.equal(canRevealSpoiler(requirement, { ready: true, watched, allowSpoilers: true }), true);
  assert.equal(canRevealSpoiler(requirement, { ready: false, watched, allowSpoilers: true }), false);
  assert.equal(canRevealSpoiler(requirement, { ready: true, watched }), false);
  assert.equal(watched.size, 0);
});

test("Iron Man and Iron Man 2 unlock only the origin; later works never imply earlier ones", () => {
  const progress = { ready: true, watched: new Set(["iron-man", "iron-man-2"]) };
  assert.deepEqual(storyData.iron.map((chapter) => canRevealSpoiler(chapter.spoiler, progress)), [true, false, false, false]);
  assert.deepEqual(storyData.iron.map((chapter) => canRevealSpoiler(chapter.spoiler, { ready: true, watched: new Set(["vengadores-endgame"]) })), [false, false, false, true]);
});

test("loading, unknown requirements and incomplete multiple requirements stay locked", () => {
  const watched = new Set(["iron-man"]);
  assert.equal(canRevealSpoiler({ allOf: ["iron-man"] }, { ready: false, watched }), false);
  assert.equal(canRevealSpoiler({ allOf: [] }, { ready: true, watched }), false);
  assert.equal(canRevealSpoiler({ allOf: ["unknown"] }, { ready: true, watched }), false);
  assert.equal(canRevealSpoiler({ allOf: ["iron-man", "iron-man-2"] }, { ready: true, watched }), false);
  assert.equal(canRevealSpoiler({ allOf: ["iron-man", "iron-man-2"] }, { ready: true, watched: new Set(["iron-man", "iron-man-2"]) }), true);
  assert.equal(canRevealSpoiler(undefined, { ready: false, watched }), true);
});

test("locked data is replaced completely, including images, labels and nested information", () => {
  const content = { title: "secret", image: "/secret.webp", nested: { year: "2023" } };
  const replacement = { title: "locked" };
  assert.deepEqual(protectContent<object>(content, { allOf: ["iron-man"] }, { ready: false, watched: new Set() }, replacement), replacement);
  assert.equal(protectContent<object>(content, { allOf: ["iron-man"] }, { ready: true, watched: new Set(["iron-man"]) }, replacement), content);
});

test("every declared spoiler requirement references real catalog IDs", () => {
  const valid = new Set(mcuCatalog.map(({ slug }) => slug));
  const requirements = characters.flatMap((character) => [
    ...character.story.map(({ spoiler }) => spoiler),
    character.spoilers?.status, character.spoilers?.screenMoment,
    ...(character.spoilers?.facts ?? []),
  ]).filter((requirement) => requirement !== undefined);
  for (const requirement of requirements) {
    assert.ok(requirement.allOf.length);
    for (const id of requirement.allOf) assert.ok(valid.has(id), `Unknown spoiler requirement: ${id}`);
  }
  assert.ok(storyData.iron.every(({ spoiler }) => spoiler));
});
