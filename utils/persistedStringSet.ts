export function parsePersistedStringSet(value: string, validIds: ReadonlySet<string>) {
  try {
    const parsed: unknown = JSON.parse(value);
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string" && validIds.has(id)) : []);
  } catch {
    return new Set<string>();
  }
}
