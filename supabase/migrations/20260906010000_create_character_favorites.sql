begin;

-- Stable Character.id values only; the editorial catalog stays in code.
create table public.character_favorites (
  user_id uuid primary key references auth.users(id) on delete cascade,
  character_id text not null constraint character_favorites_known_character check (character_id in (
    'spider', 'iron', 'strange', 'panther', 'wanda', 'captain-america', 'thor', 'hulk',
    'black-widow', 'hawkeye', 'loki', 'captain-marvel', 'sam-wilson', 'yelena-belova',
    'winter-soldier', 'vision', 'agatha-harkness', 'daredevil', 'kingpin', 'thanos',
    'shuri', 'ant-man', 'wasp', 'star-lord', 'gamora', 'rocket', 'shang-chi', 'moon-knight',
    'kate-bishop', 'ultron', 'killmonger', 'hela', 'green-goblin', 'mysterio', 'nick-fury',
    'wong', 'okoye', 'peggy-carter', 'monica-rambeau', 'ms-marvel', 'nebula', 'mantis',
    'groot', 'war-machine', 'mister-fantastic', 'invisible-woman', 'human-torch', 'thing', 'doctor-doom'
  ))
);
create index character_favorites_character_idx on public.character_favorites (character_id);
alter table public.character_favorites enable row level security;
alter table public.character_favorites force row level security;
revoke all on public.character_favorites from public, anon, authenticated;
grant select, insert, update, delete on public.character_favorites to authenticated;

create policy character_favorites_select_own on public.character_favorites
  for select to authenticated using ((select auth.uid()) = user_id);
create policy character_favorites_insert_own on public.character_favorites
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy character_favorites_update_own on public.character_favorites
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy character_favorites_delete_own on public.character_favorites
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Deliberate, read-only RLS boundary: expose aggregates and the caller's own
-- character, never user IDs or individual votes. One consistent SQL snapshot.
create function public.get_character_favorites()
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'counts', coalesce((
      select jsonb_object_agg(t.character_id, t.fans)
      from (select character_id, count(*) as fans
        from public.character_favorites group by character_id) t
    ), '{}'::jsonb),
    'favorite', (select character_id from public.character_favorites where user_id = (select auth.uid()))
  );
$$;
revoke all on function public.get_character_favorites() from public, anon, authenticated;
grant execute on function public.get_character_favorites() to anon, authenticated;

commit;
