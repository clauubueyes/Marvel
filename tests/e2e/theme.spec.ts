import { expect, test } from "@playwright/test";

test.describe("theme", () => {
  test("sin preferencia guardada el tema es oscuro, aunque el sistema sea claro", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/cuenta");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByText("OSCURO", { exact: true })).toBeVisible();
  });

  test("hasta que exista la paleta clara, el control solo ofrece el oscuro", async ({ page }) => {
    await page.goto("/cuenta");
    const group = page.getByRole("group", { name: "APARIENCIA" });
    await expect(group).toBeVisible();
    // La fase 2 no está lista: no debe haber ningún radio de claro ni de sistema.
    await expect(page.getByRole("radio", { name: "CLARO", exact: true })).toHaveCount(0);
    await expect(page.getByRole("radio", { name: "SISTEMA", exact: true })).toHaveCount(0);
    await expect(group.getByText("OSCURO", { exact: true })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("una preferencia clara guardada se ignora al volver a cargar", async ({ page }) => {
    await page.goto("/cuenta");
    // Simula el estado roto de quien probó el control antes de desactivarlo.
    await page.evaluate(() => localStorage.setItem("nexus:theme", "light"));
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("nexus:theme"))).toBeNull();
  });
});
