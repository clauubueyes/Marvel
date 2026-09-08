import { expect, test, type Page } from "@playwright/test";
import { characters } from "../../repositories/characterRepository";
import { mcuCatalog } from "../../data/mcuCatalog";

async function setWatched(page: Page, ids: string[]) {
  await page.evaluate((values) => {
    localStorage.setItem("nexus:titles:watched", JSON.stringify(values));
    window.dispatchEvent(new CustomEvent("nexus-title-progress", { detail: "nexus:titles:watched" }));
  }, ids);
}

test("trailer continues the story in the image column and stops when leaving", async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem("nexus:analytics-consent", "rejected"));
  await page.route("https://*.supabase.co/**", route => route.fulfill({ json: { counts: {}, favorite: null } }));
  await page.route("https://www.youtube-nocookie.com/**", route => route.fulfill({ body: "<html><body>Trailer</body></html>", contentType: "text/html" }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/personajes/iron");
  await setWatched(page, ["iron-man"]);
  const story = page.locator(".story-cinema");
  const next = story.locator("[data-next-watch]");
  const trailer = story.locator(".next-watch-trailer");
  await expect(next.getByRole("heading")).toContainText("Iron Man 2");
  await expect(page.locator(".story-cinema + [data-next-watch]")).toHaveCount(0);
  await next.scrollIntoViewIfNeeded();
  await expect(next).toHaveAttribute("data-active", "true");
  await expect(trailer.getByRole("button")).toBeEnabled();
  const copyBox = await next.boundingBox();
  const videoBox = await trailer.boundingBox();
  expect(videoBox!.x).toBeGreaterThan(copyBox!.x + copyBox!.width - 2);
  expect(videoBox!.y).toBeLessThan(900);
  await page.screenshot({ path: testInfo.outputPath("story-trailer-desktop.png") });
  await trailer.getByRole("button").click();
  await expect(trailer.locator("iframe")).toHaveCount(1);
  await story.locator(".story-card:not([data-next-watch])").scrollIntoViewIfNeeded();
  await expect(trailer.locator("iframe")).toHaveCount(0);
  await setWatched(page, ["iron-man", "iron-man-2"]);
  await expect(next.getByRole("heading")).toContainText("Los Vengadores");
  await page.setViewportSize({ width: 390, height: 900 });
  await next.scrollIntoViewIfNeeded();
  await expect(trailer.getByRole("button")).toBeEnabled();
  await trailer.getByRole("button").click();
  await expect(trailer.locator("iframe")).toHaveCount(1);
  await page.screenshot({ path: testInfo.outputPath("story-trailer-mobile.png") });
});

for (const character of characters) {
  test(`${character.id}: empty, partial, complete and revoked progress`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("https://*.supabase.co/**", (route) => route.fulfill({ json: { counts: {}, favorite: null } }));
    await page.addInitScript(() => localStorage.setItem("nexus:analytics-consent", "rejected"));
    await page.goto(`/personajes/${character.id}`);
    const cards = page.locator(".story-card:not([data-next-watch])");
    await expect(cards).toHaveCount(0);
    await expect(page.locator("[data-next-watch]")).toHaveCount(1);
    await expect(page.locator(".story-cinema img:not([data-trailer-poster]), .screen-moment img, .screen-moment iframe")).toHaveCount(0);

    const partial = character.story[0].spoiler!.allOf;
    await setWatched(page, [...partial]);
    const visible = character.story.filter(chapter => chapter.spoiler!.allOf.every(id => partial.includes(id)));
    await expect(cards).toHaveCount(visible.length);
    for (const chapter of character.story) {
      if (visible.includes(chapter)) await expect(page.locator(".story-cinema")).toContainText(chapter.title);
      else await expect(page.locator(".story-track")).not.toContainText(chapter.text);
    }

    await setWatched(page, mcuCatalog.map(({ slug }) => slug));
    await expect(cards).toHaveCount(character.story.length);
    await expect(page.locator("[data-next-watch]")).toHaveCount(0);
    await expect(page.locator(".intro-copy")).toContainText(character.description);
    await expect(page.locator(".intro-copy")).toContainText(character.affiliations.join(" · "));
    await expect(page.locator(".ability-list")).toContainText(character.abilities[0]);
    await expect(page.locator(".screen-moment")).toContainText(character.screenMoment.title);
    await expect(page.locator(".profile-section").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(0);

    await setWatched(page, []);
    await expect(cards).toHaveCount(0);
    await expect(page.locator("[data-next-watch]")).toHaveCount(1);
    await expect(page.locator(".story-cinema img:not([data-trailer-poster]), .screen-moment img, .screen-moment iframe")).toHaveCount(0);
    await expect(page.locator(".intro-copy")).not.toContainText(character.description);
  });
}
