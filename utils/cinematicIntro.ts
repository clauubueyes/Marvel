export const INTRO_SEEN_KEY = "nexus:cinematic-intro:seen";
let seenInMemory = false;

// localStorage means once per browser, independently of account and progress.
export function claimCinematicIntro(storage: Pick<Storage, "getItem" | "setItem">) {
  if (seenInMemory) return false;
  seenInMemory = true;
  try {
    if (storage.getItem(INTRO_SEEN_KEY) === "1") return false;
    storage.setItem(INTRO_SEEN_KEY, "1");
  } catch { /* Still once per application lifetime when storage is unavailable. */ }
  return true;
}
