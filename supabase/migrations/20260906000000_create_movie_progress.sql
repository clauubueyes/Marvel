begin;

create table public.movie_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  movie_id text not null check (char_length(movie_id) between 1 and 200 and movie_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  watched boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint movie_progress_user_movie_unique unique (user_id, movie_id)
);

create function public.set_movie_progress_timestamps()
returns trigger language plpgsql set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' then
    new.created_at = old.created_at;
  else
    new.created_at = now();
  end if;
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_movie_progress_timestamps() from public, anon, authenticated;
create trigger movie_progress_timestamps before insert or update on public.movie_progress
  for each row execute function public.set_movie_progress_timestamps();

alter table public.movie_progress enable row level security;
alter table public.movie_progress force row level security;
revoke all on table public.movie_progress from public, anon, authenticated;
grant select, insert, update, delete on table public.movie_progress to authenticated;

create policy movie_progress_select_own on public.movie_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy movie_progress_insert_own on public.movie_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy movie_progress_update_own on public.movie_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy movie_progress_delete_own on public.movie_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

commit;
