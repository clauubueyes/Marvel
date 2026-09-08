import type { Character } from "@/types/character";

/** Keep every protected field in the account selector and the editorial validation. */
export function getCharacterSpoilerRequirements(character: Character) {
  const spoilers = character.spoilers;
  return [
    ...character.story.map(({ spoiler }) => spoiler),
    spoilers?.overview, spoilers?.powers, spoilers?.status, spoilers?.affiliations, spoilers?.screenMoment,
    ...character.facts.map((_, index) => spoilers?.facts?.[index]),
    ...character.variants.map((_, index) => spoilers?.variants?.[index]),
  ];
}

export function getCharacterProgressTitleIds(character: Character) {
  return [...new Set([
    ...character.appearances.map(({ titleId }) => titleId),
    ...getCharacterSpoilerRequirements(character).flatMap((requirement) => requirement?.allOf ?? []),
  ])];
}
