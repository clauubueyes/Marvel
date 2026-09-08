import { expect, test, type Page } from "@playwright/test";
import { characters } from "../../repositories/characterRepository";
import { mcuCatalog } from "../../data/mcuCatalog";

async function setWatched(page: Page, ids: string[]) {
  await page.evaluate((values) => {
    localStorage.setItem("nexus:titles:watched", JSON.stringify(values));
    window.dispatchEvent(new CustomEvent("nexus-title-progress", { detail: "nexus:titles:watched" }));
  }, ids);
}

for (const character of characters) {
  test(`${character.id}: empty, partial, complete and revoked progress`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route("https://*.supabase.co/**", (route) => route.fulfill({ json: { counts: {}, favorite: null } }));
    await page.addInitScript(() => localStorage.setItem("nexus:analytics-consent", "rejected"));
    await page.goto(`/personajes/${character.id}`);
    const cards = page.locator(".story-card");
    await expect(cards.filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(character.story.length);
    await expect(page.locator(".story-cinema img, .screen-moment img, .screen-moment iframe")).toHaveCount(0);

    const partial = character.story[0].spoiler!.allOf;
    await setWatched(page, [...partial]);
    for (let index = 0; index < character.story.length; index++) {
      const chapter = character.story[index];
      const unlocked = chapter.spoiler!.allOf.every((id) => partial.includes(id));
      await expect(cards.nth(index)).toContainText(unlocked ? chapter.title : "Contenido bloqueado por spoilers");
      if (!unlocked) await expect(cards.nth(index)).not.toContainText(chapter.text);
    }

    await setWatched(page, mcuCatalog.map(({ slug }) => slug));
    await expect(cards.filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(0);
    await expect(page.locator(".intro-copy")).toContainText(character.description);
    await expect(page.locator(".intro-copy")).toContainText(character.affiliations.join(" · "));
    await expect(page.locator(".ability-list")).toContainText(character.abilities[0]);
    await expect(page.locator(".screen-moment")).toContainText(character.screenMoment.title);
    await expect(page.locator(".profile-section").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(0);

    await setWatched(page, []);
    await expect(cards.filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(character.story.length);
    await expect(page.locator(".story-cinema img, .screen-moment img, .screen-moment iframe")).toHaveCount(0);
    await expect(page.locator(".intro-copy")).not.toContainText(character.description);
  });
}
