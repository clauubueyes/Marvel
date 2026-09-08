import test from "node:test";
import assert from "node:assert/strict";
import { getNextWatch, getCharacterWatchTitleIds } from "./nextWatch";
import { characters } from "@/repositories/characterRepository";
import { existsSync } from "node:fs";
import { join } from "node:path";

const titlesFor = (id: string) => getCharacterWatchTitleIds(characters.find(character => character.id === id)!);
const nextFor = (id: string, watched: string[] = []) => getNextWatch({ ready: true, watched: new Set(watched) }, titlesFor(id));

test("recommendations wait for confirmed progress and respect spoiler preference", () => {
  assert.equal(getNextWatch({ ready: false, watched: new Set() }, titlesFor("iron")), undefined);
  assert.equal(getNextWatch({ ready: true, allowSpoilers: true, watched: new Set() }, titlesFor("iron")), undefined);
});

test("each character recommends their own pending titles in release order", () => {
  assert.equal(nextFor("iron")?.slug, "iron-man");
  assert.equal(nextFor("iron", ["iron-man"])?.slug, "iron-man-2");
  assert.equal(nextFor("iron", ["iron-man", "iron-man-2"])?.slug, "los-vengadores");
  assert.equal(nextFor("iron", ["vengadores-endgame"])?.slug, "iron-man");
  assert.equal(nextFor("captain-america")?.slug, "capitan-america-el-primer-vengador");
  assert.equal(nextFor("rocket")?.slug, "guardianes-de-la-galaxia");
  assert.equal(nextFor("kate-bishop")?.slug, "ojo-de-halcon");
  assert.equal(nextFor("daredevil")?.slug, "daredevil-temporada-1");
});

test("completed and unknown character title sets never fall back to unrelated titles", () => {
  for (const character of characters) {
    const ids = getCharacterWatchTitleIds(character);
    assert.equal(getNextWatch({ ready: true, watched: new Set(ids) }, ids), undefined);
  }
  assert.equal(getNextWatch({ ready: true, watched: new Set() }, []), undefined);
  assert.equal(getNextWatch({ ready: true, watched: new Set() }, ["unknown"]), undefined);
});

test("all recommended trailers have thumbnails and remain within the character's titles", () => {
  for (const character of characters) {
    const ids = getCharacterWatchTitleIds(character);
    const watched = new Set<string>();
    let next;
    while ((next = getNextWatch({ ready: true, watched }, ids))) {
      assert.ok(ids.includes(next.slug));
      if (next.trailerId) assert.ok(existsSync(join(process.cwd(), "public", "trailers", `${next.slug}.webp`)), next.slug);
      watched.add(next.slug);
    }
  }
});
