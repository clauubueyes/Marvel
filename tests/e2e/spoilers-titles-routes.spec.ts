import { expect, test, type Page } from "@playwright/test";
import { getViewingRoute } from "../../data/viewingRoutes";
import { getEntitiesForTitle, getTitle, getTitleDossier } from "../../repositories/contentRepository";
import { getTitleDetails } from "../../data/titles";

async function setWatched(page: Page, ids: string[]) {
  await page.evaluate((values) => {
    localStorage.setItem("nexus:titles:watched", JSON.stringify(values));
    window.dispatchEvent(new CustomEvent("nexus-title-progress", { detail: "nexus:titles:watched" }));
  }, ids);
}

const afterTitles = getTitleDetails("vengadores-endgame")!.watchAfter.flatMap((slug) => {
  const related = getTitle(slug);
  return related ? [related.title] : [];
});

test("titles dossier: summaries, post-credits, cast, connections and watch order stay locked until the title is watched", async ({ page }) => {
  const slug = "vengadores-endgame";
  const title = getTitleDossier(slug)!;
  const summaries = getEntitiesForTitle(slug).flatMap(({ summary }) => [summary]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://*.supabase.co/**", (route) => route.fulfill({ json: { counts: {}, favorite: null } }));
  await page.addInitScript(() => localStorage.setItem("nexus:analytics-consent", "rejected"));

  await page.goto(`/titulos/${slug}`);
  const disclosure = page.locator(".spoiler-disclosure button", { hasText: "RESUMEN CON SPOILERS" });
  await expect(disclosure).toHaveCount(0);
  await expect(page.locator(".title-dossier-event")).not.toContainText(title.event);
  await expect(page.locator(".title-cast-grid")).toHaveCount(0);
  await expect(page.locator(".title-cast .spoiler-notice")).toHaveCount(1);
  await expect(page.locator(".title-cast")).not.toContainText(title.characters[0].name);
  await expect(page.locator(".context-nodes")).toContainText("Bloqueado por spoilers");
  for (const summary of summaries) await expect(page.locator(".context-nodes")).not.toContainText(summary);
  await expect(page.locator(".title-watch-columns .spoiler-notice")).toHaveCount(1);
  for (const after of afterTitles) await expect(page.locator(".title-watch")).not.toContainText(after);

  await setWatched(page, [slug]);
  await expect(disclosure).toHaveCount(1);
  await expect(page.locator(".title-cast-grid")).toHaveCount(1);
  await expect(page.locator(".title-cast")).toContainText(title.characters[0].name);
  for (const summary of summaries) await expect(page.locator(".context-nodes").first()).toContainText(summary);
  for (const after of afterTitles) await expect(page.locator(".title-watch")).toContainText(after);
  await expect(page.locator(".spoiler-notice")).toHaveCount(0);

  await page.locator(".spoiler-disclosure button", { hasText: "RESUMEN CON SPOILERS" }).click();
  await expect(page.locator(".title-dossier-event")).toContainText(title.event);
});

test("viewing route: a step spoiler stays locked until its title is watched", async ({ page }) => {
  const route = getViewingRoute("camino-a-doomsday")!;
  const first = route.steps[0];
  const second = route.steps[1];
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("https://*.supabase.co/**", (route) => route.fulfill({ json: { counts: {}, favorite: null } }));
  await page.addInitScript(() => localStorage.setItem("nexus:analytics-consent", "rejected"));

  await page.goto(`/rutas/${route.slug}`);
  await page.getByRole("button", { name: "MOSTRAR SPOILERS" }).click();
  const step = (titleId: string) => page.locator(`.viewing-route-list li`, { has: page.locator(`a[href="/titulos/${titleId}"]`) });
  await expect(step(first.titleId).locator(".route-spoiler")).toContainText("para revelar su spoiler");
  await expect(step(first.titleId).locator(".route-spoiler")).not.toContainText(first.spoiler);

  await setWatched(page, [first.titleId]);
  await expect(step(first.titleId).locator(".route-spoiler")).toContainText(first.spoiler);
  await expect(step(second.titleId).locator(".route-spoiler")).toContainText("para revelar su spoiler");
  await expect(step(second.titleId).locator(".route-spoiler")).not.toContainText(second.spoiler);
});
