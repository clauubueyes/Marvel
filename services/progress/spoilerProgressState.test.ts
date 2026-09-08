import assert from "node:assert/strict";
import test from "node:test";
import { buildSpoilerProgress, type SpoilerAccountState } from "./spoilerProgressState";

const base = { ready: true, values: new Set(["iron-man"]) } as const;

function account(overrides: Partial<SpoilerAccountState> = {}): SpoilerAccountState {
  return { initialized: true, user: null, pending: 0, error: null, ...overrides };
}

test("an uninitialized account has no confirmed progress and stays protected", () => {
  const guest = buildSpoilerProgress(account({ initialized: false, user: null }), { ready: false, values: new Set() });
  assert.equal(guest.allowSpoilers, false);
  assert.equal(guest.ready, false);
});

test("a pending optimistic write never reveals protected content", () => {
  const progress = buildSpoilerProgress(account({ pending: 2 }), base);
  assert.equal(progress.ready, false);
  assert.equal(buildSpoilerProgress(account({ pending: 1 }), base).ready, false);
});

test("a failed load keeps protection until it recovers", () => {
  assert.equal(buildSpoilerProgress(account({ error: "fallo" }), base).ready, false);
});

test("an explicit spoiler opt-out reveals as soon as the account is initialized", () => {
  const progress = buildSpoilerProgress(account({ user: { user_metadata: { avoid_spoilers: false } } }), base);
  assert.equal(progress.allowSpoilers, true);
  assert.equal(progress.ready, true);
  assert.equal(progress.watched.has("iron-man"), true);
});

test("the default and absent preferences keep protection on", () => {
  assert.equal(buildSpoilerProgress(account({ user: {} }), base).allowSpoilers, false);
  assert.equal(buildSpoilerProgress(account({ user: { user_metadata: { avoid_spoilers: true } } }), base).allowSpoilers, false);
});

test("without an opt-out, readiness also requires a confirmed base state", () => {
  assert.equal(buildSpoilerProgress(account(), { ready: false, values: new Set() }).ready, false);
});
