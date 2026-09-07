import { expect, test, type Page } from "@playwright/test";

async function mockSupabase(page: Page) {
  const progress = new Map<string, Map<string, boolean>>();
  let failSave = false;
  await page.route("https://*.supabase.co/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (url.pathname.endsWith("/signup")) return json({ user: { id: "alice", email: "alice@example.com", identities: [] }, session: null });
    if (url.pathname.endsWith("/token")) {
      const email = request.postDataJSON().email;
      const id = email.startsWith("bob") ? "bob" : "alice";
      const payload = Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
      return json({ access_token: `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`, refresh_token: `refresh-${id}`, token_type: "bearer", expires_in: 3600, user: { id, email, aud: "authenticated", role: "authenticated" } });
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
  return { failWrites: () => { failSave = true; }, progress };
}

async function login(page: Page, email = "alice@example.com") {
  await page.goto("/cuenta");
  await page.getByLabel("EMAIL", { exact: true }).fill(email);
  await page.getByLabel("CONTRASEÑA", { exact: true }).fill("Test-password-123!");
  await page.getByRole("button", { name: "ENTRAR", exact: true }).click();
  await expect(page.getByRole("button", { name: "CERRAR SESIÓN", exact: true })).toBeVisible();
}

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

test("spoiler progress: bulk settings persist, Iron Man reveals only watched acts and logout locks them", async ({ page }) => {
  const mock = await mockSupabase(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await login(page);
  const settings = page.locator("#spoilers");
  await settings.getByLabel("BUSCAR PELÍCULA O SERIE").fill("Iron Man");
  await settings.getByRole("button", { name: "MARCAR 3 RESULTADOS COMO VISTOS", exact: true }).click();
  await expect.poll(() => [...(mock.progress.get("alice")?.values() ?? [])].filter(Boolean).length).toBe(3);
  await settings.getByRole("checkbox", { name: "Iron Man 3 PELÍCULA", exact: true }).uncheck();
  await expect.poll(() => mock.progress.get("alice")?.get("iron-man-3")).toBe(false);
  await page.reload();
  await settings.getByLabel("BUSCAR PELÍCULA O SERIE").fill("Iron Man");
  await expect(settings.getByRole("checkbox", { name: "Iron Man PELÍCULA", exact: true })).toBeChecked();
  await expect(settings.getByRole("checkbox", { name: "Iron Man 2 PELÍCULA", exact: true })).toBeChecked();
  const requestedImages: string[] = [];
  page.on("request", (request) => { if (request.resourceType() === "image") requestedImages.push(decodeURIComponent(request.url())); });
  await page.goto("/personajes/iron");
  const story = page.getByRole("region", { name: "Historia de IRON MAN", exact: true });
  await expect(story.locator(".story-card").first()).toContainText("Nacer en una cueva");
  await expect(story.locator(".story-card").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(3);
  await expect(story).not.toContainText(/Salvar la ciudad|El precio de la verdad|Enfrentar al Titán Loco|2012|2016|2023/);
  await expect(story.locator("img")).toHaveCount(2); // Base and first act only.
  await expect(page.locator(".storyline-rail")).not.toContainText(/2012|2016|2023/);
  await expect(page.locator(".profile-facts")).not.toContainText(/3000|despedida|batalla definitiva/);
  await expect(page.locator(".screen-moment img, .screen-moment iframe")).toHaveCount(0);
  expect(requestedImages.filter((url) => /history\/iron\/acto-[234]|moments\/iron/.test(url))).toEqual([]);

  await page.goto("/cuenta");
  await settings.getByLabel("BUSCAR PELÍCULA O SERIE").fill("Los Vengadores");
  await settings.getByRole("checkbox", { name: "Los Vengadores PELÍCULA", exact: true }).check();
  await expect.poll(() => mock.progress.get("alice")?.get("los-vengadores")).toBe(true);
  await page.goto("/personajes/iron");
  await expect(story.locator(".story-card").nth(1)).toContainText("Salvar la ciudad");
  await expect(story.locator(".story-card").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(2);
  await page.goto("/cuenta");
  await page.getByRole("button", { name: "CERRAR SESIÓN", exact: true }).click();
  await expect(page.getByRole("button", { name: "ENTRAR", exact: true })).toBeVisible();
  await page.goto("/personajes/iron");
  await expect(story.locator("img")).toHaveCount(0);
  await expect(story.locator(".story-card").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(4);
});

test("spoiler rendering fails closed before hydration and updates guest progress without reloading", async ({ page, browser, baseURL }) => {
  await mockSupabase(page);
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const serverPage = await noScript.newPage();
  await serverPage.goto(`${baseURL}/personajes/iron`);
  await expect(serverPage.locator(".story-cinema img")).toHaveCount(0);
  await expect(serverPage.locator(".story-card").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(4);
  await noScript.close();
  await page.goto("/personajes/iron");
  await expect(page.locator(".story-card").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(4);
  await page.evaluate(() => {
    localStorage.setItem("nexus:titles:watched", JSON.stringify(["iron-man", "iron-man-2"]));
    window.dispatchEvent(new CustomEvent("nexus-title-progress", { detail: "nexus:titles:watched" }));
  });
  await expect(page.locator(".story-card").first()).toContainText("Nacer en una cueva");
  await expect(page.locator(".story-card").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(3);
  await page.evaluate(() => {
    localStorage.removeItem("nexus:titles:watched");
    window.dispatchEvent(new CustomEvent("nexus-title-progress", { detail: "nexus:titles:watched" }));
  });
  await expect(page.locator(".story-cinema img")).toHaveCount(0);
  await expect(page.locator(".story-card").filter({ hasText: "Contenido bloqueado por spoilers" })).toHaveCount(4);
});
