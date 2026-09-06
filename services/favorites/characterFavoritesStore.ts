import type { CharacterFavoritesRepository, FavoritesData } from "@/repositories/characterFavoritesRepository";

type Snapshot = FavoritesData & {
  userId: string | null;
  initialized: boolean;
  ready: boolean;
  loading: boolean;
  pending: boolean;
  error: string | null;
};
const initial: Snapshot = { counts: {}, favorite: null, userId: null, initialized: false, ready: false, loading: false, pending: false, error: null };

export class CharacterFavoritesStore {
  private snapshot = initial;
  private confirmed: FavoritesData = { counts: {}, favorite: null };
  private generation = 0;
  private listeners = new Set<() => void>();
  constructor(private repository: CharacterFavoritesRepository) {}
  getSnapshot = () => this.snapshot;
  getServerSnapshot = () => initial;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  private publish(update: Partial<Snapshot>) {
    this.snapshot = { ...this.snapshot, ...update };
    this.listeners.forEach((listener) => listener());
  }
  setUser(userId: string | null) {
    if (this.snapshot.initialized && this.snapshot.userId === userId) return;
    this.generation++;
    this.confirmed = { counts: this.confirmed.counts, favorite: null };
    this.publish({ ...this.confirmed, userId, initialized: true, ready: false, loading: false, pending: false, error: null });
  }
  ensureLoaded = () => {
    if (!this.snapshot.ready && !this.snapshot.error) void this.load();
  };
  load = async () => {
    if (!this.snapshot.initialized || this.snapshot.loading || this.snapshot.pending) return;
    const generation = this.generation;
    this.publish({ loading: true, ready: false, error: null });
    try {
      const data = await this.repository.load();
      if (generation !== this.generation) return;
      this.confirmed = { ...data, favorite: this.snapshot.userId ? data.favorite : null };
      this.publish({ ...this.confirmed, loading: false, ready: true });
    } catch {
      if (generation === this.generation) this.publish({ loading: false, error: "No se pudieron cargar los favoritos. Reintenta para actualizarlos." });
    }
  };
  toggle = async (characterId: string) => {
    const { userId, ready, pending, favorite } = this.snapshot;
    if (!userId || !ready || pending) return;
    const generation = this.generation;
    const next = favorite === characterId ? null : characterId;
    const counts = { ...this.snapshot.counts };
    if (favorite) counts[favorite] = Math.max(0, (counts[favorite] ?? 0) - 1);
    if (next) counts[next] = (counts[next] ?? 0) + 1;
    this.publish({ favorite: next, counts, pending: true, error: null });
    try {
      await this.repository.save(userId, next);
    } catch {
      if (generation !== this.generation) return;
      // A lost response may have committed: require reconciliation before another vote.
      this.publish({ ...this.confirmed, pending: false, ready: false, error: "No se pudo confirmar el favorito. Se ha revertido la vista; reintenta para comprobar el guardado." });
      return;
    }
    if (generation !== this.generation) return;
    this.confirmed = { favorite: next, counts };
    // Refresh all totals after the write, including votes from other accounts.
    try {
      const data = await this.repository.load();
      if (generation !== this.generation) return;
      this.confirmed = data;
      this.publish({ ...data, pending: false });
    } catch {
      if (generation === this.generation) this.publish({ pending: false, ready: false, error: "Favorito guardado. No se pudieron actualizar los contadores; reintenta." });
    }
  };
}
