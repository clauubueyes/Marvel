import { expect, test } from "@playwright/test";

/*
 * El ranking se lee sin cuenta: `get_character_favorites()` está concedida a
 * `anon`, así que este spec no necesita token ni `/logout`.
 */
test.use({ storageState: { cookies: [], origins: [] } });

const mockFavorites = async (
  page: import("@playwright/test").Page,
  handler: (request: import("@playwright/test").Request) => {
    status?: number;
    body: unknown;
  },
) => {
  await page.addInitScript(() => localStorage.setItem("nexus:analytics-consent", "rejected"));
  await page.route("https://*.supabase.co/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;
    if (path.endsWith("/movie_progress")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
    }
    if (path.endsWith("/get_character_favorites")) {
      const { status = 200, body } = handler(request);
      return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
};

const ranking = (page: import("@playwright/test").Page) => page.locator(".mcu-community-list li");
/* `allTextContents` y no `allInnerTexts`: las filas usan `data-reveal` y el texto
   se lee del DOM, sin depender de que la animación de scroll ya haya corrido. */
const names = (page: import("@playwright/test").Page) =>
  ranking(page).locator(".mcu-community-identity b").allTextContents();

/* La intro de portada es un modal a pantalla completa: hay que cerrarla para poder clicar. */
const skipIntro = async (page: import("@playwright/test").Page) => {
  const skip = page.getByRole("button", { name: /SALTAR INTRO/i });
  if (await skip.isVisible()) await skip.click();
};

test("community top: shows the real aggregate ranking to guests, ignoring unknown ids", async ({
  page,
}) => {
  await mockFavorites(page, () => ({
    body: { counts: { thor: 40, iron: 12, "personaje-retirado": 999 }, favorite: null },
  }));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /TOP DE LA COMUNIDAD/i })).toBeVisible();
  await expect(ranking(page)).toHaveCount(2);
  expect(await names(page)).toEqual(["THOR", "IRON MAN"]);
  await expect(ranking(page).nth(0)).toContainText("40 fans");
  await expect(ranking(page).nth(1)).toContainText("12 fans");
  // Cada fila enlaza a su expediente.
  await expect(ranking(page).nth(0).getByRole("link")).toHaveAttribute("href", "/personajes/thor");
});

test("community top: invents no ranking when nobody has voted yet", async ({ page }) => {
  await mockFavorites(page, () => ({ body: { counts: {}, favorite: null } }));
  await page.goto("/");
  await expect(page.getByText(/Todavía no hay votos/i)).toBeVisible();
  await expect(ranking(page)).toHaveCount(0);
});

test("community top: a failed aggregate call offers a retry instead of breaking home", async ({
  page,
}) => {
  let attempts = 0;
  await mockFavorites(page, () => {
    attempts++;
    return attempts === 1
      ? { status: 500, body: { message: "offline" } }
      : { body: { counts: { thor: 5 }, favorite: null } };
  });
  await page.goto("/");
  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await skipIntro(page);
  await alert.getByRole("button", { name: /REINTENTAR/i }).click();
  await expect(ranking(page)).toHaveCount(1);
  expect(await names(page)).toEqual(["THOR"]);
});
