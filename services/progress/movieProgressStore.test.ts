import assert from "node:assert/strict";
import { test } from "node:test";
import { MovieProgressStore } from "./movieProgressStore";
import type { MovieProgressRepository, ProgressChange } from "@/repositories/movieProgressRepository";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const tick = () => new Promise((resolve) => setImmediate(resolve));
const user = { id: "alice" };

test("guest initialization and sign-out never retain private progress", async () => {
  const store = new MovieProgressStore({ load: async () => new Set(["iron-man"]), save: async () => {} });
  assert.equal(store.getSnapshot().initialized, false);
  store.setUser(null);
  assert.equal(store.getSnapshot().ready, true);
  store.setUser(user);
  await store.load();
  assert.ok(store.getSnapshot().watched.has("iron-man"));
  store.setUser(null);
  assert.equal(store.getSnapshot().watched.size, 0);
});

test("late load from a previous user cannot populate the next user's state", async () => {
  const first = deferred<Set<string>>();
  const store = new MovieProgressStore({ load: (id) => id === "alice" ? first.promise : Promise.resolve(new Set(["thor"])), save: async () => {} });
  store.setUser(user);
  const load = store.load();
  store.setUser({ id: "bob" });
  assert.equal(store.getSnapshot().watched.size, 0);
  await store.load();
  first.resolve(new Set(["iron-man"])); await load;
  assert.deepEqual([...store.getSnapshot().watched], ["thor"]);
});

test("rapid overlapping changes are optimistic, serialized and roll back to confirmed state", async () => {
  const writes: { changes: ProgressChange[]; result: ReturnType<typeof deferred<void>> }[] = [];
  const repo: MovieProgressRepository = {
    load: async () => new Set(),
    save: async (_id, changes) => { const result = deferred<void>(); writes.push({ changes, result }); return result.promise; },
  };
  const store = new MovieProgressStore(repo);
  store.setUser(user); await store.load();
  store.setMany(["iron-man", "thor"], true);
  store.setMany(["iron-man"], false);
  store.setMany(["iron-man"], true);
  assert.equal(writes.length, 1);
  assert.ok(store.getSnapshot().watched.has("iron-man"));
  writes[0].result.resolve(); await tick();
  writes[1].result.reject(new Error("offline")); await tick();
  assert.ok(store.getSnapshot().watched.has("iron-man"));
  writes[2].result.reject(new Error("offline")); await tick();
  assert.deepEqual([...store.getSnapshot().watched], ["iron-man", "thor"]);
  assert.equal(store.getSnapshot().pending, 0);
  assert.ok(store.getSnapshot().error);
});

test("failed writes revert only their own changes and later operations continue", async () => {
  let fail = true;
  const store = new MovieProgressStore({ load: async () => new Set(), save: async () => { if (fail) { fail = false; throw new Error(); } } });
  store.setUser(user); await store.load();
  store.setMany(["iron-man"], true); store.setMany(["thor"], true);
  await tick();
  assert.deepEqual([...store.getSnapshot().watched], ["thor"]);
});

test("sign-out cancels queued writes and ignores an in-flight response", async () => {
  const result = deferred<void>(); let calls = 0;
  const store = new MovieProgressStore({ load: async () => new Set(), save: () => { calls++; return result.promise; } });
  store.setUser(user); await store.load();
  store.setMany(["iron-man"], true); store.setMany(["thor"], true);
  store.setUser(null); result.resolve(); await tick();
  assert.equal(calls, 1);
  assert.equal(store.getSnapshot().watched.size, 0);
  assert.equal(store.getSnapshot().pending, 0);
});

test("failed initial load blocks writes until a successful retry", async () => {
  let fail = true; let saves = 0;
  const store = new MovieProgressStore({ load: async () => { if (fail) throw new Error(); return new Set(["thor"]); }, save: async () => { saves++; } });
  store.setUser(user); await store.load(); store.setMany(["iron-man"], true);
  assert.equal(saves, 0); assert.equal(store.getSnapshot().ready, false);
  fail = false; await store.load();
  assert.equal(store.getSnapshot().ready, true); assert.equal(store.getSnapshot().error, null);
});

test("repeated sign-in/token events for the same identity keep pending state", async () => {
  const result = deferred<void>();
  const store = new MovieProgressStore({ load: async () => new Set(), save: () => result.promise });
  store.setUser(user); await store.load(); store.setMany(["thor"], true);
  store.setUser({ ...user });
  assert.equal(store.getSnapshot().pending, 1); assert.ok(store.getSnapshot().watched.has("thor"));
  result.resolve(); await tick();
});
