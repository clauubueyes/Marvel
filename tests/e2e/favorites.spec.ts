import { expect, test } from "@playwright/test";

test("favorites: guest totals, login, choose, move, remove, refresh, rollback and account isolation", async ({ page }) => {
  const votes = new Map<string, string>([["observer", "iron"]]);
  let reads = 0; let writes = 0; let fail = false;
  await page.addInitScript(() => localStorage.setItem("nexus:analytics-consent", "rejected"));
  await page.route("https://*.supabase.co/**", async route => {
    const request = route.request(); const path = new URL(request.url()).pathname;
    const json = (body: unknown, status = 200) => route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
    if (path.endsWith("/token")) {
      const email = request.postDataJSON().email;
      const id = email.startsWith("bob") ? "bob" : "alice";
      const payload = Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
      return json({ access_token: `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`, refresh_token: `refresh-${id}`, token_type: "bearer", expires_in: 3600, user: { id, email, aud: "authenticated", role: "authenticated" } });
    }
    if (path.endsWith("/logout")) return json({});
    if (path.endsWith("/movie_progress")) return json([]);
    let userId: string | null = null;
    try { userId = JSON.parse(Buffer.from(request.headers().authorization.split(".")[1], "base64url").toString()).sub ?? null; } catch { /* Public key, no session. */ }
    if (path.endsWith("/get_character_favorites")) {
      reads++;
      const counts: Record<string, number> = {};
      votes.forEach(id => { counts[id] = (counts[id] ?? 0) + 1; });
      return json({ counts, favorite: userId ? votes.get(userId) ?? null : null });
    }
    if (path.endsWith("/character_favorites")) {
      writes++;
      if (!userId) return json({ message: "denied" }, 403);
      if (fail) return json({ message: "offline" }, 500);
      if (request.method() === "DELETE") votes.delete(userId);
      else votes.set(userId, request.postDataJSON().character_id);
      return route.fulfill({ status: 204, body: "" });
    }
    return json({});
  });
  const card = (id: string) => page.locator(".character-directory-card").filter({ has: page.locator(`a.character-card-link[href='/personajes/${id}']`) });
  const favorite = (id: string) => card(id).locator(".character-favorite-control");
  const fans = (id: string) => card(id).locator(".character-favorite small");
  const login = async (email: string) => {
    await page.getByLabel("EMAIL", { exact: true }).fill(email);
    await page.getByLabel("CONTRASEÑA", { exact: true }).fill("Test-password-123!");
    await page.getByRole("button", { name: "ENTRAR", exact: true }).click();
    await expect(page.getByRole("button", { name: "CERRAR SESIÓN", exact: true })).toBeVisible();
  };
  await page.goto("/personajes");
  await expect(fans("iron")).toHaveText("1 fan");
  await expect(fans("spider")).toHaveText("0 fans");
  expect(reads).toBe(1); expect(writes).toBe(0);
  await favorite("spider").click(); await page.waitForURL("**/cuenta");
  expect(writes).toBe(0);
  await login("alice@example.com"); await page.goto("/personajes");
  await expect(favorite("spider")).toBeEnabled();
  await favorite("spider").click();
  await expect(favorite("spider")).toHaveAttribute("aria-pressed", "true");
  await expect(fans("spider")).toHaveText("1 fan");
  await expect(favorite("iron")).toBeEnabled();
  await favorite("iron").click();
  await expect(favorite("iron")).toHaveAttribute("aria-pressed", "true");
  await expect(fans("spider")).toHaveText("0 fans"); await expect(fans("iron")).toHaveText("2 fans");
  await expect.poll(() => votes.get("alice")).toBe("iron");
  await page.reload(); await expect(favorite("iron")).toHaveAttribute("aria-pressed", "true");
  await favorite("iron").click(); await expect(fans("iron")).toHaveText("1 fan");
  await expect.poll(() => votes.has("alice")).toBe(false);
  await expect(favorite("spider")).toBeEnabled(); await favorite("spider").click();
  await expect(favorite("iron")).toBeEnabled();
  fail = true; await favorite("iron").click();
  await expect(card("iron").getByText("REINTENTAR", { exact: true })).toBeVisible();
  await expect(favorite("spider")).toHaveAttribute("aria-pressed", "true");
  fail = false; await card("iron").getByText("REINTENTAR", { exact: true }).click();
  await expect(fans("spider")).toHaveText("1 fan"); await expect(fans("iron")).toHaveText("1 fan");
  const readsBeforeNavigation = reads;
  await card("spider").locator(".character-card-link").click();
  await page.waitForURL("**/personajes/spider");
  await expect(page.locator(".character-favorite-control")).toHaveAttribute("aria-pressed", "true");
  expect(reads).toBe(readsBeforeNavigation);
  await page.goto("/cuenta"); await page.getByRole("button", { name: "CERRAR SESIÓN", exact: true }).click();
  await expect(page.getByRole("button", { name: "ENTRAR", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "PERSONAJES", exact: true }).first().click();
  await expect(favorite("spider")).toHaveAttribute("href", "/cuenta");
  await expect(fans("spider")).toHaveText("1 fan");
  await favorite("iron").click(); await page.waitForURL("**/cuenta"); await login("bob@example.com");
  await page.goto("/personajes"); await expect(favorite("spider")).toHaveAttribute("aria-pressed", "false");
  await favorite("iron").click(); await expect(fans("iron")).toHaveText("2 fans");
  await expect.poll(() => votes.get("bob")).toBe("iron");
  expect(votes.get("alice")).toBe("spider"); expect(votes.size).toBe(3);
});
