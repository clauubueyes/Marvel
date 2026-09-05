import type { SupabaseClient } from "@supabase/supabase-js";

export type ProgressChange = { movieId: string; watched: boolean };
export interface MovieProgressRepository {
  load(userId: string): Promise<Set<string>>;
  save(userId: string, changes: ProgressChange[]): Promise<void>;
}

export function createMovieProgressRepository(client: SupabaseClient): MovieProgressRepository {
  return {
    async load(userId) {
      const { data, error } = await client.from("movie_progress")
        .select("movie_id").eq("user_id", userId).eq("watched", true).abortSignal(AbortSignal.timeout(15000));
      if (error) throw error;
      return new Set(data.map((row) => row.movie_id as string));
    },
    async save(userId, changes) {
      const { error } = await client.from("movie_progress").upsert(
        changes.map(({ movieId, watched }) => ({ user_id: userId, movie_id: movieId, watched })),
        { onConflict: "user_id,movie_id" },
      ).abortSignal(AbortSignal.timeout(15000));
      if (error) throw error;
    },
  };
}
