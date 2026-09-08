import { expect, test, type Page } from "@playwright/test";

async function mockSupabase(page: Page) {
  const progress = new Map<string, Map<string, boolean>>();
  const preferences = new Map<string, { avoid_spoilers?: boolean }>();
  let failPreference = false;
  let failSave = false;
  await page.route("https://*.supabase.co/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname.endsWith("/signup")) {
      preferences.set("alice", request.postDataJSON().data);
      return json({ user: { id: "alice", email: "alice@example.com", identities: [] }, session: null });
    }
    if (url.pathname.endsWith("/user")) {
      const id = JSON.parse(Buffer.from(request.headers().authorization.split(".")[1], "base64url").toString()).sub;
      if (request.method() === "PUT") {
        if (failPreference) return json({ message: "test failure" }, 500);
        preferences.set(id, request.postDataJSON().data);
      }
      return json({ id, email: `${id}@example.com`, aud: "authenticated", role: "authenticated", user_metadata: preferences.get(id) ?? {} });
    }
    if (url.pathname.endsWith("/token")) {
      const email = request.postDataJSON().email;
      const id = email.startsWith("bob") ? "bob" : "alice";
      const payload = Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
      return json({ access_token: `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`, refresh_token: `refresh-${id}`, token_type: "bearer", expires_in: 3600, user: { id, email, aud: "authenticated", role: "authenticated", user_metadata: preferences.get(id) ?? {} } });
    }
    if (url.pathname.endsWith("/logout")) return json({});
    if (url.pathname.endsWith("/movie_progress")) {
      if (request.method() === "GET") {
        const id = url.searchParams.get("user_id")!.slice(3);
        return json([...(progress.get(id) ?? [])].filter(([, watched]) => watched).map(([movie_id]) => ({ movie_id })));
      }
      if (failSave) return json({ message: "test failure", code: "42501" }, 403);
      for (const row of request.postDataJSON()) {
        if (!progress.has(row.user_id)) progress.set(row.user_id, new Map());
        progress.get(row.user_id)!.set(row.movie_id, row.watched);
      }
      return route.fulfill({ status: 201, body: "" });
    }
    return json({});
  });
  await page.addInitScript(() => localStorage.setItem("nexus:analytics-consent", "rejected"));
  return { failWrites: () => { failSave = true; }, failPreferenceWrites: () => { failPreference = true; }, progress, preferences };
}

async function login(page: Page, email = "alice@example.com") {
  await page.goto("/cuenta");
  await page.getByLabel("EMAIL", { exact: true }).fill(email);
  await page.getByLabel("CONTRASEÑA", { exact: true }).fill("Test-password-123!");
  await page.getByRole("button", { name: "ENTRAR", exact: true }).click();
  await expect(page.getByRole("button", { name: "CERRAR SESIÓN", exact: true })).toBeVisible();
}

test("account dashboard fits mobile and desktop and reloads progress from another device", async ({ page }, testInfo) => {
  const mock = await mockSupabase(page);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/cuenta");
  await expect(page.getByLabel("EMAIL", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await login(page, "alice.long.email.for.responsive.check@example.com");
  await expect(page.getByText("Progreso actualizado", { exact: false })).toBeVisible();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole("button", { name: "CERRAR SESIÓN", exact: true })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Evitar spoilers", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const panel = await page.locator(".account-panel-settings").boundingBox();
    const content = await page.locator(".account-settings-content").boundingBox();
    expect(content!.width).toBeGreaterThan(width < 700 ? panel!.width - 40 : 250);
    await page.screenshot({ path: testInfo.outputPath(`account-${width}.png`), fullPage: true });
  }
  mock.progress.set("alice", new Map([["iron-man", true]]));
  await page.getByRole("button", { name: "RECARGAR PROGRESO", exact: true }).click();
  await expect(page.locator(".account-spoiler-summary-count strong")).toHaveText("01");
  await page.goto("/cuenta#spoilers");
  await expect(page.getByRole("checkbox", { name: "Evitar spoilers", exact: true })).toBeVisible();
});

test("spoiler-free accounts protect Captain America and unreviewed character stories", async ({ page }) => {
  const mock = await mockSupabase(page);
  mock.preferences.set("alice", { avoid_spoilers: true });
  await login(page);
  for (const id of ["captain-america", "sam-wilson", "thor", "spider"]) {
    await page.goto(`/personajes/${id}`);
    await expect(page.locator(".story-card:not([data-next-watch])")).toHaveCount(0);
    await expect(page.locator(".story-cinema img:not([data-trailer-poster]), .screen-moment img, .screen-moment iframe")).toHaveCount(0);
    await expect(page.locator(".storyline-rail")).toHaveCount(0);
  }
  mock.progress.set("alice", new Map([["capitan-america-el-primer-vengador", true]]));
  await page.goto("/personajes/captain-america");
  await expect(page.locator(".story-card:not([data-next-watch])").first()).toContainText("El hombre que no paraba");
  await expect(page.locator(".story-card:not([data-next-watch])")).toHaveCount(2);
  await expect(page.locator(".story-cinema")).not.toContainText(/El final del baile|Devuelve las Gemas|agencia está tomada/);
  await expect(page.locator(".intro-copy")).not.toContainText("INACTIVO");
  mock.progress.get("alice")!.set("vengadores-endgame", true);
  await page.reload();
  await expect(page.locator(".story-card:not([data-next-watch])").last()).toContainText("El final del baile");
  await expect(page.locator(".story-card:not([data-next-watch])")).toHaveCount(3);
});

test("registration is compact and spoiler preference persists independently of watched works", async ({ page }) => {
  const mock = await mockSupabase(page);
  await page.goto("/cuenta");
  await expect(page.locator("#spoilers")).toHaveCount(0);
  await expect(page.getByRole("checkbox", { name: "Evitar spoilers", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "CREAR UNA CUENTA" }).click();
  await expect(page.locator("#spoilers")).toHaveCount(0);
  const preference = page.getByRole("checkbox", { name: "Evitar spoilers", exact: true });
  await expect(preference).toBeChecked();
  await preference.uncheck();
  await page.getByLabel("EMAIL", { exact: true }).fill("alice@example.com");
  await page.getByLabel("CONTRASEÑA", { exact: true }).fill("Test-password-123!");
  await page.getByRole("button", { name: "REGISTRARME", exact: true }).click();
  await expect(page.getByText("Revisa tu correo para confirmar", { exact: false })).toBeVisible();
  expect(mock.preferences.get("alice")?.avoid_spoilers).toBe(false);
  await expect(page.locator("#spoilers")).toHaveCount(0);
  await login(page);
  await expect(page.locator("#spoilers")).toBeVisible();
  await expect(preference).not.toBeChecked();
  await page.goto("/personajes/iron");
  await expect(page.locator(".story-card:not([data-next-watch])")).toHaveCount(4);
  await page.goto("/cuenta");
  await preference.click();
  await expect.poll(() => mock.preferences.get("alice")?.avoid_spoilers).toBe(true);
  await page.reload();
  await expect(preference).toBeChecked();
  mock.failPreferenceWrites();
  await preference.click();
  await expect(page.getByRole("alert").filter({ hasText: "No se pudo guardar tu preferencia" })).toBeVisible();
  await expect(preference).toBeChecked();
  await page.goto("/personajes/iron");
  await expect(page.locator(".story-card:not([data-next-watch])")).toHaveCount(0);
  expect(mock.progress.get("alice")?.size ?? 0).toBe(0);
});

test("guest, registration, session refresh, watch/unwatch, rollback and account isolation", async ({ page }) => {
  const mock = await mockSupabase(page);
  await page.goto("/titulos");
  const first = page.locator(".title-watch-toggle").first();
  await expect(first).toBeEnabled();
  await first.click(); await expect(first).toHaveAttribute("aria-pressed", "true");
  await page.goto("/cuenta");
  await page.getByRole("button", { name: "CREAR UNA CUENTA" }).click();
  await page.getByLabel("EMAIL", { exact: true }).fill("alice@example.com");
  await page.getByLabel("CONTRASEÑA", { exact: true }).fill("Test-password-123!");
  await page.getByRole("button", { name: "REGISTRARME" }).click();
  await expect(page.getByText("Revisa tu correo para confirmar", { exact: false })).toBeVisible();
  await login(page);
  await page.goto("/titulos");
  await expect(first).toBeEnabled();
  await expect(first).toHaveAttribute("aria-pressed", "false");
  await first.click();
  await expect(page.getByText("GUARDANDO PROGRESO…", { exact: true })).toHaveCount(0);
  await expect.poll(() => mock.progress.get("alice")?.size).toBe(1);
  await page.reload();
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await first.click();
  await expect.poll(() => [...mock.progress.get("alice")!.values()][0]).toBe(false);
  await page.reload();
  await expect(first).toBeEnabled(); await expect(first).toHaveAttribute("aria-pressed", "false");
  mock.failWrites(); await first.click();
  await expect(page.getByRole("alert").filter({ hasText: "No se pudo guardar" })).toBeVisible();
  await expect(first).toHaveAttribute("aria-pressed", "false");
  await page.goto("/cuenta");
  await page.getByRole("button", { name: "CERRAR SESIÓN", exact: true }).click();
  await expect(page.getByRole("button", { name: "ENTRAR", exact: true })).toBeVisible();
  await page.goto("/titulos");
  await expect(first).toHaveAttribute("aria-pressed", "true"); // Guest state, not account state.
  await login(page, "bob@example.com");
  await page.goto("/titulos");
  await expect(first).toBeEnabled(); await expect(first).toHaveAttribute("aria-pressed", "false");
});

test("intro runs once per browser and contact preserves the current page", async ({ page }) => {
  await mockSupabase(page);
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Introducción de NEXUS" })).toBeVisible();
  await page.getByRole("button", { name: "SALTAR INTRO" }).click();
  await expect(page.getByRole("dialog", { name: "Introducción de NEXUS" })).toHaveCount(0);
  await page.goto("/titulos"); await page.goto("/");
  await expect(page.getByRole("dialog", { name: "Introducción de NEXUS" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("dialog", { name: "Introducción de NEXUS" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "CONTACTO", exact: true })).toHaveAttribute("target", "_blank");
});

test("spoiler progress: catalog changes persist, Iron Man reveals only watched acts and logout locks them", async ({ page }) => {
  const mock = await mockSupabase(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await login(page);
  await page.getByRole("link", { name: "GESTIONAR TÍTULOS" }).click();
  const titleToggle = (title: string) => page.locator(".title-directory-row").filter({ has: page.getByRole("heading", { name: title, exact: true }) }).locator(".title-watch-toggle");
  await titleToggle("Iron Man").click();
  await titleToggle("Iron Man 2").click();
  await titleToggle("Iron Man 3").click();
  await expect.poll(() => [...(mock.progress.get("alice")?.values() ?? [])].filter(Boolean).length).toBe(3);
  await titleToggle("Iron Man 3").click();
  await expect.poll(() => mock.progress.get("alice")?.get("iron-man-3")).toBe(false);
  await page.reload();
  await expect(titleToggle("Iron Man")).toHaveAttribute("aria-pressed", "true");
  await expect(titleToggle("Iron Man 2")).toHaveAttribute("aria-pressed", "true");
  const requestedImages: string[] = [];
  page.on("request", (request) => { if (request.resourceType() === "image") requestedImages.push(decodeURIComponent(request.url())); });
  await page.goto("/personajes/iron");
  const story = page.getByRole("region", { name: "Historia de IRON MAN", exact: true });
  await expect(story.locator(".story-card:not([data-next-watch])").first()).toContainText("Nacer en una cueva");
  await expect(story.locator(".story-card:not([data-next-watch])")).toHaveCount(1);
  await expect(story).not.toContainText(/Salvar la ciudad|El precio de la verdad|Enfrentar al Titán Loco|2012|2016|2023/);
  await expect(story.locator("img:not([data-trailer-poster])")).toHaveCount(2); // Base and first act only.
  await expect(page.locator(".storyline-rail")).not.toContainText(/2012|2016|2023/);
  await expect(page.locator(".profile-facts")).not.toContainText(/3000|despedida|batalla definitiva/);
  await expect(page.locator(".screen-moment img, .screen-moment iframe")).toHaveCount(0);
  expect(requestedImages.filter((url) => /history\/iron\/acto-[234]|moments\/iron/.test(url))).toEqual([]);

  await page.goto("/cuenta");
  await page.getByRole("link", { name: "GESTIONAR TÍTULOS" }).click();
  await titleToggle("Los Vengadores").click();
  await expect.poll(() => mock.progress.get("alice")?.get("los-vengadores")).toBe(true);
  await page.goto("/personajes/iron");
  await expect(story.locator(".story-card:not([data-next-watch])").nth(1)).toContainText("Salvar la ciudad");
  await expect(story.locator(".story-card:not([data-next-watch])")).toHaveCount(2);
  await page.goto("/cuenta");
  await page.getByRole("button", { name: "CERRAR SESIÓN", exact: true }).click();
  await expect(page.getByRole("button", { name: "ENTRAR", exact: true })).toBeVisible();
  await page.goto("/personajes/iron");
  await expect(story.locator("img:not([data-trailer-poster])")).toHaveCount(0);
  await expect(story.locator(".story-card:not([data-next-watch])")).toHaveCount(0);
});

test("spoiler rendering fails closed before hydration and updates guest progress without reloading", async ({ page, browser, baseURL }) => {
  await mockSupabase(page);
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const serverPage = await noScript.newPage();
  await serverPage.goto(`${baseURL}/personajes/iron`);
  await expect(serverPage.locator(".story-cinema img:not([data-trailer-poster])")).toHaveCount(0);
  await expect(serverPage.locator(".story-card:not([data-next-watch])")).toHaveCount(0);
  await noScript.close();
  await page.goto("/personajes/iron");
  await expect(page.locator(".story-card:not([data-next-watch])")).toHaveCount(0);
  await page.evaluate(() => {
    localStorage.setItem("nexus:titles:watched", JSON.stringify(["iron-man", "iron-man-2"]));
    window.dispatchEvent(new CustomEvent("nexus-title-progress", { detail: "nexus:titles:watched" }));
  });
  await expect(page.locator(".story-card:not([data-next-watch])").first()).toContainText("Nacer en una cueva");
  await expect(page.locator(".story-card:not([data-next-watch])")).toHaveCount(1);
  await page.evaluate(() => {
    localStorage.removeItem("nexus:titles:watched");
    window.dispatchEvent(new CustomEvent("nexus-title-progress", { detail: "nexus:titles:watched" }));
  });
  await expect(page.locator(".story-cinema img:not([data-trailer-poster])")).toHaveCount(0);
  await expect(page.locator(".story-card:not([data-next-watch])")).toHaveCount(0);
});
