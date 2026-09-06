// Shared by all progress controls; no context or listeners are created on import.
export const SOUND_ENABLED_STORAGE_KEY = "soundEnabled";
export const SOUND_VOLUME = 0.035;

let context: AudioContext | undefined;
let enabledFallback = true;

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try { return window.localStorage.getItem(SOUND_ENABLED_STORAGE_KEY) !== "false"; }
  catch { return enabledFallback; }
}

export function setSoundEnabled(enabled: boolean): void {
  enabledFallback = enabled;
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(SOUND_ENABLED_STORAGE_KEY, String(enabled)); }
  catch { /* Keep the preference in memory when storage is unavailable. */ }
}

// Call only from a user action, never from an effect or a store subscription.
export function playMovieProgressSound(watched: boolean): void {
  if (!isSoundEnabled() || !navigator.userActivation?.isActive) return;
  try {
    if (!window.AudioContext) return;
    context ??= new window.AudioContext();
    const audio = context;
    const play = () => {
      if (!isSoundEnabled() || audio.state !== "running") return;
      const start = audio.currentTime;
      const duration = 0.12;
      const oscillator = audio.createOscillator();
      const envelope = audio.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(watched ? 520 : 660, start);
      oscillator.frequency.exponentialRampToValueAtTime(watched ? 780 : 440, start + duration);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(SOUND_VOLUME, start + 0.008);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      envelope.gain.setValueAtTime(0, start + duration + 0.01);
      oscillator.connect(envelope);
      envelope.connect(audio.destination);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
      };
      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);
    };
    if (audio.state === "running") play();
    else void audio.resume().then(() => {
      try { play(); } catch { /* Audio must never interrupt progress. */ }
    }).catch(() => {});
  } catch { /* Unsupported or blocked audio must not affect the interaction. */ }
}
