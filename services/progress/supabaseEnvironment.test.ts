import assert from "node:assert/strict";
import { test } from "node:test";
import { assertPublicSupabaseKey } from "@/config/supabaseEnvironment";

test("public environment validation rejects private and privileged keys before bundling", () => {
  const jwt = (role: string) => `header.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.signature`;
  assert.doesNotThrow(() => assertPublicSupabaseKey("sb_publishable_test"));
  assert.doesNotThrow(() => assertPublicSupabaseKey(jwt("anon")));
  for (const key of ["sb_secret_test", jwt("service_role"), jwt("authenticated"), "malformed"]) {
    assert.throws(() => assertPublicSupabaseKey(key), /claves privadas no están permitidas/);
  }
});
