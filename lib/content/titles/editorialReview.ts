const reviewedChronologyIds = new Set([
  "agatha-quien-si-no", "agent-carter", "agent-carter-temporada-1", "agent-carter-temporada-2",
  "ant-man-y-la-avispa-quantumania", "black-panther", "black-panther-wakanda-forever", "black-widow",
  "capitan-america-brave-new-world", "capitan-america-el-primer-vengador", "capitana-marvel",
  "cloak-dagger-temporadas-1-y-2", "daredevil-born-again-temporada-1", "daredevil-born-again-temporada-2",
  "daredevil-temporada-3", "deadpool-y-lobezno", "doctor-strange-en-el-multiverso-de-la-locura", "echo",
  "el-increible-hulk", "eternals", "falcon-y-el-soldado-de-invierno",
  "guardianes-de-la-galaxia-especial-felices-fiestas", "guardianes-de-la-galaxia-vol-2",
  "guardianes-de-la-galaxia-vol-3", "invasion-secreta", "iron-fist-temporada-1", "iron-fist-temporada-2",
  "iron-man", "iron-man-2", "iron-man-3", "jessica-jones-temporadas-2-y-3", "luke-cage-temporada-2",
  "moon-knight", "ms-marvel", "ojo-de-halcon", "shang-chi-y-la-leyenda-de-los-diez-anillos",
  "she-hulk-abogada-hulka", "spider-man-brand-new-day", "spider-man-homecoming", "spider-man-lejos-de-casa",
  "spider-man-no-way-home", "the-defenders", "the-marvels", "the-punisher-one-last-kill",
  "the-punisher-temporada-1", "the-punisher-temporada-2", "thor-love-and-thunder", "thunderbolts",
  "todos-aclaman-al-rey", "vengadores-endgame", "wandavision", "x-men-97",
]);

export function hasReviewedChronology(titleId: string) {
  return reviewedChronologyIds.has(titleId);
}

export const reviewedChronologyCount = reviewedChronologyIds.size;
