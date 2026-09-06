import assert from "node:assert/strict";
import { test } from "node:test";
import { CharacterFavoritesStore } from "./characterFavoritesStore";
import type { FavoritesData } from "@/repositories/characterFavoritesRepository";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

test("shared loading deduplicates all cards; guests cannot write", async () => {
  const response = deferred<FavoritesData>(); let loads = 0; let saves = 0;
  const store = new CharacterFavoritesStore({ load: () => { loads++; return response.promise; }, save: async () => { saves++; } });
  store.setUser(null);
  const loading = store.load();
  for (let i = 0; i < 50; i++) store.ensureLoaded();
  assert.equal(loads, 1);
  response.resolve({ counts: { spider: 12 }, favorite: null }); await loading;
  await store.toggle("spider"); store.ensureLoaded();
  assert.equal(saves, 0); assert.equal(loads, 1);
  assert.equal(store.getSnapshot().counts.spider, 12);
});

test("choose, move and remove are immediate; rapid clicks cannot create extra writes", async () => {
  let data: FavoritesData = { counts: { spider: 2 }, favorite: null };
  let writes = 0;
  let saved = deferred<void>();
  const store = new CharacterFavoritesStore({ load: async () => data, save: async (_user, favorite) => {
    writes++; await saved.promise;
    data = { favorite, counts: favorite === "spider" ? { spider: 3 } : favorite === "iron" ? { spider: 2, iron: 1 } : { spider: 2 } };
  } });
  store.setUser("alice"); await store.load();
  const first = store.toggle("spider");
  await store.toggle("spider"); await store.toggle("iron");
  assert.equal(writes, 1); assert.equal(store.getSnapshot().counts.spider, 3);
  store.setUser("alice"); assert.equal(store.getSnapshot().pending, true);
  saved.resolve(); await first;
  saved = deferred<void>(); const move = store.toggle("iron");
  assert.equal(store.getSnapshot().counts.spider, 2); assert.equal(store.getSnapshot().counts.iron, 1);
  saved.resolve(); await move;
  saved = deferred<void>(); const remove = store.toggle("iron");
  assert.equal(store.getSnapshot().favorite, null); assert.equal(store.getSnapshot().counts.iron, 0);
  saved.resolve(); await remove;
  assert.deepEqual(store.getSnapshot().counts, { spider: 2 });
});

test("failure rolls back both counts and selection and requires reconciliation", async () => {
  const store = new CharacterFavoritesStore({ load: async () => ({ counts: { spider: 1 }, favorite: "spider" }), save: async () => { throw new Error(); } });
  store.setUser("alice"); await store.load(); await store.toggle("iron");
  assert.equal(store.getSnapshot().favorite, "spider");
  assert.deepEqual(store.getSnapshot().counts, { spider: 1 });
  assert.equal(store.getSnapshot().ready, false); assert.ok(store.getSnapshot().error);
  await store.load(); assert.equal(store.getSnapshot().ready, true);
});

test("late saves and loads cannot restore a logged-out user's private state", async () => {
  const saved = deferred<void>();
  const store = new CharacterFavoritesStore({ load: async () => ({ counts: {}, favorite: null }), save: () => saved.promise });
  store.setUser("alice"); await store.load(); const saving = store.toggle("spider");
  store.setUser(null); assert.equal(store.getSnapshot().favorite, null);
  assert.deepEqual(store.getSnapshot().counts, {});
  saved.resolve(); await saving; assert.equal(store.getSnapshot().favorite, null);
  const old = deferred<FavoritesData>(); let calls = 0;
  const other = new CharacterFavoritesStore({ load: () => ++calls === 1 ? old.promise : Promise.resolve({ counts: { iron: 1 }, favorite: "iron" }), save: async () => {} });
  other.setUser("alice"); const loading = other.load(); other.setUser("bob"); await other.load();
  old.resolve({ counts: { spider: 1 }, favorite: "spider" }); await loading;
  assert.equal(other.getSnapshot().favorite, "iron");
});

test("failed reads retry without loops; a confirmed write is not rolled back when its refresh fails", async () => {
  let fail = true;
  const store = new CharacterFavoritesStore({ load: async () => {
    if (fail) throw new Error(); return { counts: {}, favorite: null };
  }, save: async () => { fail = true; } });
  store.setUser("alice"); await store.load(); assert.equal(store.getSnapshot().ready, false);
  fail = false; await store.load(); await store.toggle("spider");
  assert.equal(store.getSnapshot().favorite, "spider"); assert.equal(store.getSnapshot().counts.spider, 1);
  assert.equal(store.getSnapshot().ready, false); assert.equal(store.getSnapshot().pending, false);
  assert.match(store.getSnapshot().error!, /guardado/);
});
