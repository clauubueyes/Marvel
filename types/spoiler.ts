/** Every listed work must have been watched; release order never implies progress. */
export type SpoilerRequirement = { allOf: readonly string[] };

export type SpoilerProgress = {
  allowSpoilers?: boolean;
  ready: boolean;
  watched: ReadonlySet<string>;
};
