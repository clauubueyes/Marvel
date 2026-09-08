import assert from "node:assert/strict";
import test from "node:test";
import { canRevealSpoiler, protectContent, UNREVIEWED_SPOILER } from "./spoilerPolicy";
import { storyData } from "@/data/characters/storyData";
import { mcuCatalog } from "@/data/mcuCatalog";
import { characters } from "@/repositories/characterRepository";
import { getCharacterSpoilerRequirements, getCharacterProgressTitleIds } from "@/utils/characterSpoilers";
import { validateCharacterSpoilers } from "@/validation/characterSpoilers";

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
  assert.deepEqual(validateCharacterSpoilers(characters, valid), []);
  const requirements = characters.flatMap(getCharacterSpoilerRequirements);
  for (const requirement of requirements) {
    assert.ok(requirement);
    assert.ok(requirement.allOf.length);
    for (const id of requirement.allOf) assert.ok(valid.has(id), `Unknown spoiler requirement: ${id}`);
  }
  assert.ok(storyData.iron.every(({ spoiler }) => spoiler));
});

test("every character can unlock every protected field using their account title selection", () => {
  for (const character of characters) {
    const watched = new Set(getCharacterProgressTitleIds(character));
    for (const requirement of getCharacterSpoilerRequirements(character)) {
      assert.ok(requirement?.allOf.length, character.id);
      assert.equal(canRevealSpoiler(requirement, { ready: true, watched }), true, character.id);
      assert.equal(canRevealSpoiler(requirement, { ready: true, watched: new Set() }), false, character.id);
      for (const id of requirement.allOf) {
        const missing = new Set(watched); missing.delete(id);
        assert.equal(canRevealSpoiler(requirement, { ready: true, watched: missing }), false, `${character.id} without ${id}`);
      }
    }
  }
});

test("the build rejects missing, empty, unknown and misaligned spoiler requirements", () => {
  const valid = new Set(mcuCatalog.map(({ slug }) => slug));
  const original = characters[0];
  for (const spoiler of [undefined, { allOf: [] }, { allOf: ["unknown-title"] }]) {
    const changed = { ...original, story: original.story.map((chapter, index) => index === 0 ? { ...chapter, spoiler } : chapter) };
    assert.ok(validateCharacterSpoilers([changed], valid).length);
  }
  assert.ok(validateCharacterSpoilers([{ ...original, spoilers: undefined }], valid).length);
  assert.ok(validateCharacterSpoilers([{ ...original, facts: [...original.facts, original.facts[0]] }], valid).length);
});

test("flashbacks and mixed acts use revealed works, not chronological years or appearances", () => {
  const progress = (ids: string[]) => ({ ready: true, watched: new Set(ids) });
  assert.equal(canRevealSpoiler(storyData.rocket[0].spoiler, progress(["guardianes-de-la-galaxia"])), false);
  assert.equal(canRevealSpoiler(storyData.rocket[1].spoiler, progress(["guardianes-de-la-galaxia"])), true);
  assert.equal(canRevealSpoiler(storyData.panther[2].spoiler, progress(["vengadores-infinity-war"])), false);
  assert.equal(canRevealSpoiler(storyData.panther[2].spoiler, progress(["vengadores-infinity-war", "vengadores-endgame"])), true);
  assert.equal(canRevealSpoiler(storyData["kate-bishop"][0].spoiler, progress(["los-vengadores"])), false);
  assert.equal(canRevealSpoiler(storyData["kate-bishop"][0].spoiler, progress(["ojo-de-halcon"])), true);
  assert.ok(getCharacterProgressTitleIds(characters.find(({ id }) => id === "captain-america")!).includes("capitan-america-el-soldado-de-invierno"));
});

test("Captain America unlocks only the watched film and unreviewed character stories stay locked", () => {
  const progress = { ready: true, watched: new Set(["capitan-america-el-primer-vengador"]) };
  assert.deepEqual(storyData["captain-america"].map(({ spoiler }) => canRevealSpoiler(spoiler, progress)), [true, true, false, false]);
  for (const character of characters) {
    for (const chapter of character.story) {
      assert.equal(canRevealSpoiler(chapter.spoiler ?? UNREVIEWED_SPOILER, { ready: true, watched: new Set() }), false, character.id);
    }
  }
  assert.equal(canRevealSpoiler(UNREVIEWED_SPOILER, { ready: true, watched: new Set(mcuCatalog.map(({ slug }) => slug)) }), false);
  assert.equal(canRevealSpoiler(UNREVIEWED_SPOILER, { ready: true, watched: new Set(), allowSpoilers: true }), true);
});
