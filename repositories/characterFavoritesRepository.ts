import type { SupabaseClient } from "@supabase/supabase-js";

export type FavoritesData = { counts: Record<string, number>; favorite: string | null };
export interface CharacterFavoritesRepository {
  load(): Promise<FavoritesData>;
  save(userId: string, characterId: string | null): Promise<void>;
}

export function createCharacterFavoritesRepository(client: SupabaseClient): CharacterFavoritesRepository {
  return {
    async load() {
      const { data, error } = await client.rpc("get_character_favorites").abortSignal(AbortSignal.timeout(15000));
      if (error) throw error;
      if (!data || typeof data.counts !== "object" || data.counts === null
        || (data.favorite !== null && typeof data.favorite !== "string")) throw new Error("Invalid favorites response");
      return data as FavoritesData;
    },
    async save(userId, characterId) {
      const request = characterId === null
        ? client.from("character_favorites").delete().eq("user_id", userId)
        : client.from("character_favorites").upsert({ user_id: userId, character_id: characterId }, { onConflict: "user_id" });
      const { error } = await request.abortSignal(AbortSignal.timeout(15000));
      if (error) throw error;
    },
  };
}
