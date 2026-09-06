import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { characters } from "@/repositories/characterRepository";

test("favorites SQL: public aggregates, private votes, one vote per user, moves, deletes and catalog IDs", async () => {
  const db = new PGlite();
  const alice = "00000000-0000-4000-8000-000000000001";
  const bob = "00000000-0000-4000-8000-000000000002";
  try {
    await db.exec(`create role anon nologin; create role authenticated nologin;
      create schema auth; create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth, public to authenticated, anon;
      grant execute on function auth.uid() to authenticated, anon;
      insert into auth.users values ('${alice}'), ('${bob}');`);
    await db.exec(await readFile("supabase/migrations/20260906010000_create_character_favorites.sql", "utf8"));
    const identity = async (id: string | null) => {
      await db.exec(`reset role; set role ${id ? "authenticated" : "anon"}`);
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id ?? ""]);
    };
    const snapshot = async () => (await db.query<{ data: { counts: Record<string, number>; favorite: string | null } }>("select public.get_character_favorites() as data")).rows[0].data;
    const vote = (userId: string, characterId: string) => db.query("insert into public.character_favorites values ($1, $2) on conflict (user_id) do update set character_id = excluded.character_id", [userId, characterId]);
    await identity(null);
    assert.deepEqual(await snapshot(), { counts: {}, favorite: null });
    for (const sql of ["select * from public.character_favorites", `insert into public.character_favorites values ('${alice}', 'spider')`, "update public.character_favorites set character_id = 'iron'", "delete from public.character_favorites"]) {
      await assert.rejects(db.exec(sql), /permission denied/);
    }
    await identity(alice);
    for (const character of characters) await vote(alice, character.id);
    await assert.rejects(vote(alice, "invented-character"), /check constraint/);
    await vote(alice, "spider");
    assert.deepEqual(await snapshot(), { counts: { spider: 1 }, favorite: "spider" });
    await assert.rejects(db.query("insert into public.character_favorites values ($1, 'iron')", [alice]), /unique constraint/);
    await assert.rejects(vote(bob, "iron"), /row-level security/);
    await assert.rejects(db.query("update public.character_favorites set user_id = $1", [bob]), /row-level security/);
    await identity(bob);
    assert.equal((await db.query("select * from public.character_favorites")).rows.length, 0);
    assert.equal((await db.query("update public.character_favorites set character_id = 'iron' returning user_id")).rows.length, 0);
    assert.equal((await db.query("delete from public.character_favorites returning user_id")).rows.length, 0);
    await assert.rejects(vote(alice, "iron"), /row-level security/);
    await vote(bob, "spider");
    assert.deepEqual(await snapshot(), { counts: { spider: 2 }, favorite: "spider" });
    await identity(alice);
    await Promise.all([vote(alice, "iron"), vote(alice, "wanda"), vote(alice, "iron")]);
    assert.equal((await db.query("select * from public.character_favorites")).rows.length, 1);
    assert.deepEqual(await snapshot(), { counts: { spider: 1, iron: 1 }, favorite: "iron" });
    await identity(null);
    assert.deepEqual(await snapshot(), { counts: { spider: 1, iron: 1 }, favorite: null });
    await identity(alice);
    await db.exec("delete from public.character_favorites");
    assert.deepEqual(await snapshot(), { counts: { spider: 1 }, favorite: null });
    await db.exec("reset role");
    await db.query("delete from auth.users where id = $1", [bob]);
    assert.deepEqual(await snapshot(), { counts: {}, favorite: null });
  } finally { await db.close(); }
});
