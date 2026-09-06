import type { MovieProgressRepository, ProgressChange } from "@/repositories/movieProgressRepository";

export type ProgressUser = { id: string; email?: string };
type Snapshot = {
  user: ProgressUser | null;
  initialized: boolean;
  ready: boolean;
  watched: ReadonlySet<string>;
  pending: number;
  error: string | null;
};

const initial: Snapshot = { user: null, initialized: false, ready: false, watched: new Set(), pending: 0, error: null };

// One queue per identity. Replay outstanding intentions over the last confirmed
// state so an older failure cannot undo a newer click, including bulk changes.
export class MovieProgressStore {
  private snapshot = initial;
  private listeners = new Set<() => void>();
  private generation = 0;
  private confirmed = new Set<string>();
  private queue: ProgressChange[][] = [];
  constructor(private repository: MovieProgressRepository | null) {}
  getSnapshot = () => this.snapshot;
  getServerSnapshot = () => initial;
  subscribe = (callback: () => void) => {
    this.listeners.add(callback);
    return () => { this.listeners.delete(callback); };
  };
  private publish(update: Partial<Snapshot>) {
    this.snapshot = { ...this.snapshot, ...update };
    this.listeners.forEach((listener) => listener());
  }
  setUser(user: ProgressUser | null) {
    if (this.snapshot.initialized && this.snapshot.user?.id === user?.id) return;
    this.generation++;
    this.confirmed = new Set();
    this.queue = [];
    this.publish({ user, initialized: true, ready: !user, watched: new Set(), pending: 0, error: null });
  }
  async load() {
    const user = this.snapshot.user;
    if (!user || !this.repository || this.snapshot.pending) return;
    const generation = ++this.generation;
    this.publish({ ready: false, watched: new Set(), error: null });
    try {
      const watched = await this.repository.load(user.id);
      if (generation !== this.generation) return;
      this.confirmed = watched;
      this.publish({ watched: new Set(watched), ready: true });
    } catch {
      if (generation === this.generation) this.publish({ error: "No se pudo cargar tu progreso. Reintenta para poder modificarlo." });
    }
  }
  setMany(ids: string[], watched: boolean) {
    if (!this.snapshot.user || !this.snapshot.ready || !this.repository) return;
    const changes = [...new Set(ids)].map((movieId) => ({ movieId, watched }));
    if (!changes.length) return;
    this.queue.push(changes);
    this.replay();
    if (this.queue.length === 1) void this.drain(this.generation, this.snapshot.user.id);
  }
  private apply(target: Set<string>, changes: ProgressChange[]) {
    changes.forEach(({ movieId, watched }) => watched ? target.add(movieId) : target.delete(movieId));
  }
  private replay() {
    const watched = new Set(this.confirmed);
    this.queue.forEach((changes) => this.apply(watched, changes));
    this.publish({ watched, pending: this.queue.length });
  }
  private async drain(generation: number, userId: string) {
    while (generation === this.generation && this.queue.length) {
      const changes = this.queue[0];
      try {
        await this.repository!.save(userId, changes);
        if (generation !== this.generation) return;
        this.apply(this.confirmed, changes);
      } catch {
        if (generation !== this.generation) return;
        this.publish({ error: "No se pudo guardar un cambio. Se ha revertido; puedes volver a marcarlo o recargar el progreso." });
      }
      this.queue.shift();
      this.replay();
    }
  }
}
