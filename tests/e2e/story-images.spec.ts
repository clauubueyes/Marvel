import { test, expect } from "@playwright/test";

test("Iron Man and Avengers images remain visible before the pending Iron Man 2 trailer", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem("nexus:analytics-consent", "rejected");
    localStorage.setItem("nexus:titles:watched", JSON.stringify(["iron-man", "los-vengadores"]));
  });
  await page.route("https://*.supabase.co/**", route => route.fulfill({ json: { counts: {}, favorite: null } }));
  await page.goto("/personajes/iron");
  const cards = page.locator(".story-card:not([data-next-watch])");
  const preview = page.locator(".story-trailer-image");
  await expect(cards).toHaveCount(2);
  await expect(page.locator("[data-next-watch] h3")).toContainText("Iron Man 2");
  for (const index of [0, 1]) {
    await cards.nth(index).scrollIntoViewIfNeeded();
    await expect(cards.nth(index)).toHaveAttribute("data-active", "true");
    await expect(preview).toHaveAttribute("inert", "");
    const image = page.locator(".story-image:not(.story-trailer-image) img").nth(index);
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
    // Let the scroll-linked scrub settle before comparing the rendered pixels.
    await page.waitForTimeout(1000);
    const panel = page.locator(".story-images");
    const actual = await panel.screenshot({ animations: "disabled" });
    await preview.evaluate(el => (el as HTMLElement).style.visibility = "hidden");
    const withoutPreview = await panel.screenshot({ animations: "disabled" });
    await preview.evaluate(el => (el as HTMLElement).style.removeProperty("visibility"));
    expect(actual.equals(withoutPreview), `Act ${index + 1}: inactive trailer must not cover the image`).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`act-${index + 1}.png`) });
  }
  await page.locator("[data-next-watch]").scrollIntoViewIfNeeded();
  await expect(preview.getByRole("button")).toBeEnabled();
  await expect(preview).not.toHaveAttribute("inert", "");
});
