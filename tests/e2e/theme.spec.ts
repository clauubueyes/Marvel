import { expect, test } from "@playwright/test";

test.describe("theme", () => {
  test("sin preferencia guardada el tema es oscuro, aunque el sistema sea claro", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/cuenta");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.getByRole("radio", { name: "OSCURO", exact: true })).toBeChecked();
  });

  test("elegir claro aplica data-theme light y persiste en localStorage", async ({ page }) => {
    await page.goto("/cuenta");
    await page.getByRole("radio", { name: "CLARO", exact: true }).check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate(() => localStorage.getItem("nexus:theme"))).toBe("light");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("radio", { name: "CLARO", exact: true })).toBeChecked();
  });

  test("el modo sistema sigue la preferencia del sistema en vivo", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/cuenta");
    await page.getByRole("radio", { name: "SISTEMA", exact: true }).check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("el control esta disponible sin sesion iniciada", async ({ page }) => {
    await page.goto("/cuenta");
    await expect(page.getByRole("group", { name: "APARIENCIA" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "OSCURO", exact: true })).toBeVisible();
  });
});
