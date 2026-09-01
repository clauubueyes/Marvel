import { getDetailedTitleIds, getTitleDetails } from "../data/titles";

type LinkTarget = { titleId: string; label: string; url: string };
type LinkResult = LinkTarget & { status: number; ok: boolean; error?: string };

const targets: LinkTarget[] = getDetailedTitleIds().flatMap((titleId) => {
  const details = getTitleDetails(titleId);
  if (!details) return [];
  const sources = details.sources.map(({ label, url }) => ({ titleId, label, url }));
  const trailer = details.trailerId
    ? [{ titleId, label: "TRÁILER", url: `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${details.trailerId}&format=json` }]
    : [];
  return [...sources, ...trailer];
});

async function checkLink(target: LinkTarget): Promise<LinkResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(target.url, { method: "GET", redirect: "follow", signal: controller.signal });
    return { ...target, status: response.status, ok: response.ok || response.status === 403 || response.status === 429 };
  } catch (error) {
    return { ...target, status: 0, ok: false, error: error instanceof Error ? error.message : "Error desconocido" };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const results = [];
  for (let index = 0; index < targets.length; index += 8) {
    results.push(...await Promise.all(targets.slice(index, index + 8).map(checkLink)));
  }

  const failures = results.filter(({ ok }) => !ok);
  if (failures.length) {
    console.error(`Enlaces con incidencias (${failures.length}/${results.length}):`);
    failures.forEach(({ titleId, label, url, status, error }) => console.error(`- ${titleId} · ${label}: ${status || error} · ${url}`));
    process.exitCode = 1;
  } else {
    console.log(`Enlaces editoriales accesibles: ${results.length} comprobaciones superadas.`);
  }
}

void main();
