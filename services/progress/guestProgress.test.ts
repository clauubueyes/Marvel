import assert from "node:assert/strict";
import test from "node:test";
import { TITLE_PROGRESS_STORAGE_KEY } from "@/constants/titleDirectory";
import {
  ROUTE_PROGRESS_KEY_PREFIX,
  clearGuestProgress,
  readGuestProgress,
  type ProgressStorage,
} from "./guestProgress";

const catalog = new Set(["iron-man", "thor", "capitan-america-el-primer-vengador"]);

class MemoryStorage implements ProgressStorage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }
  getItem(key: string) {
    return this.map.get(key) ?? null;
  }
  removeItem(key: string) {
    this.map.delete(key);
  }
  set(key: string, value: string) {
    this.map.set(key, value);
  }
  raw(key: string) {
    return this.map.get(key);
  }
}

function storageWith(entries: Record<string, string>) {
  const storage = new MemoryStorage();
  for (const [key, value] of Object.entries(entries)) storage.set(key, value);
  return storage;
}

test("the real catalogue has guest progress to import", () => {
  const storage = storageWith({
    [TITLE_PROGRESS_STORAGE_KEY]: JSON.stringify(["iron-man", "thor"]),
  });
  const { ids, keys } = readGuestProgress(storage, catalog);
  assert.deepEqual(ids.sort(), ["iron-man", "thor"]);
  assert.deepEqual(keys, [TITLE_PROGRESS_STORAGE_KEY]);
});

test("the general key and every route key are merged into one union", () => {
  const storage = storageWith({
    [TITLE_PROGRESS_STORAGE_KEY]: JSON.stringify(["iron-man", "thor"]),
    [`${ROUTE_PROGRESS_KEY_PREFIX}infinity-war`]: JSON.stringify(["thor", "iron-man"]),
    [`${ROUTE_PROGRESS_KEY_PREFIX}capitan-america`]: JSON.stringify(["iron-man"]),
  });
  const { ids, keys } = readGuestProgress(storage, catalog);
  assert.deepEqual(ids.sort(), ["iron-man", "thor"]);
  assert.equal(keys.length, 3);
});

test("ids that left the catalogue are dropped instead of imported", () => {
  const storage = storageWith({
    [TITLE_PROGRESS_STORAGE_KEY]: JSON.stringify(["iron-man", "pelicula-retirada", 42, null]),
  });
  const { ids } = readGuestProgress(storage, catalog);
  assert.deepEqual(ids, ["iron-man"]);
});

test("unrelated and malformed entries are ignored without throwing", () => {
  const storage = storageWith({
    [TITLE_PROGRESS_STORAGE_KEY]: "no-es-json",
    "nexus:analytics-consent": JSON.stringify(["iron-man"]),
    soundEnabled: "false",
  });
  const { ids, keys } = readGuestProgress(storage, catalog);
  assert.deepEqual(ids, []);
  assert.deepEqual(keys, [TITLE_PROGRESS_STORAGE_KEY]);
});

test("an empty storage reports nothing to import", () => {
  const { ids, keys } = readGuestProgress(new MemoryStorage(), catalog);
  assert.deepEqual(ids, []);
  assert.deepEqual(keys, []);
});

test("clearing removes only the imported keys and survives a storage that refuses", () => {
  const storage = storageWith({
    [TITLE_PROGRESS_STORAGE_KEY]: JSON.stringify(["iron-man"]),
    "nexus:analytics-consent": "rejected",
  });
  const { keys } = readGuestProgress(storage, catalog);
  clearGuestProgress(storage, keys);
  assert.equal(storage.raw(TITLE_PROGRESS_STORAGE_KEY), undefined);
  assert.equal(storage.raw("nexus:analytics-consent"), "rejected");

  const refusing: ProgressStorage = {
    length: 1,
    key: () => TITLE_PROGRESS_STORAGE_KEY,
    getItem: () => null,
    removeItem: () => {
      throw new Error("almacenamiento no disponible");
    },
  };
  assert.doesNotThrow(() => clearGuestProgress(refusing, [TITLE_PROGRESS_STORAGE_KEY]));
});
