import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("migration: PostgreSQL enforces ownership, uniqueness, timestamps and anonymous denial", async () => {
  const db = new PGlite();
  const alice = "00000000-0000-4000-8000-000000000001";
  const bob = "00000000-0000-4000-8000-000000000002";
  try {
    // Standalone PostgreSQL: reproduce Supabase's roles and JWT subject helper.
    await db.exec(`
      create role anon nologin; create role authenticated nologin;
      create schema auth;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth, public to authenticated, anon;
      grant execute on function auth.uid() to authenticated, anon;
      insert into auth.users values ('${alice}'), ('${bob}');
    `);
    await db.exec(await readFile("supabase/migrations/20260906000000_create_movie_progress.sql", "utf8"));
    const identity = async (id: string) => {
      await db.exec("reset role; set role authenticated");
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
    };
    await identity(alice);
    await db.query("insert into public.movie_progress (user_id, movie_id, watched) values ($1, 'iron-man', true)", [alice]);
    await assert.rejects(db.query("insert into public.movie_progress (user_id, movie_id) values ($1, 'thor')", [bob]), /row-level security/);
    await assert.rejects(db.query("insert into public.movie_progress (user_id, movie_id) values ($1, 'iron-man')", [alice]), /unique constraint/);
    await assert.rejects(db.query("update public.movie_progress set user_id = $1", [bob]), /row-level security/);
    await identity(bob);
    assert.equal((await db.query("select * from public.movie_progress")).rows.length, 0);
    assert.equal((await db.query("update public.movie_progress set watched = false returning id")).rows.length, 0);
    assert.equal((await db.query("delete from public.movie_progress returning id")).rows.length, 0);
    await assert.rejects(db.query("insert into public.movie_progress (user_id, movie_id, watched) values ($1, 'iron-man', false) on conflict (user_id, movie_id) do update set watched = false", [alice]), /row-level security/);
    await db.query("insert into public.movie_progress (user_id, movie_id) values ($1, 'iron-man')", [bob]);
    await identity(alice);
    const before = (await db.query<{ created_at: Date; updated_at: Date }>("select created_at, updated_at from public.movie_progress")).rows[0];
    await db.query("insert into public.movie_progress (user_id, movie_id, watched) values ($1, 'iron-man', false) on conflict (user_id, movie_id) do update set watched = excluded.watched", [alice]);
    const after = (await db.query<{ watched: boolean; created_at: Date; updated_at: Date }>("select watched, created_at, updated_at from public.movie_progress")).rows[0];
    assert.equal(after.watched, false);
    assert.deepEqual(after.created_at, before.created_at);
    assert.ok(new Date(after.updated_at) >= new Date(before.updated_at));
    assert.equal((await db.query("delete from public.movie_progress returning id")).rows.length, 1);
    await db.exec("reset role; set role anon");
    for (const sql of ["select * from public.movie_progress", `insert into public.movie_progress (user_id,movie_id) values ('${alice}','thor')`, "update public.movie_progress set watched = true", "delete from public.movie_progress"]) {
      await assert.rejects(db.exec(sql), /permission denied/);
    }
    await identity("");
    assert.equal((await db.query("select * from public.movie_progress")).rows.length, 0);
    await assert.rejects(db.query("insert into public.movie_progress (user_id, movie_id) values ($1, 'thor')", [bob]), /row-level security/);
    await db.exec("reset role");
    await db.query("delete from auth.users where id = $1", [bob]);
    assert.equal((await db.query("select * from public.movie_progress")).rows.length, 0);
  } finally { await db.close(); }
});
