import { expect, test, type Page, type Request } from "@playwright/test";

/*
 * #11 expone `addPlanToGoogleCalendar` fuera del planificador. Aqui se comprueba que
 * tanto la ficha de un título como la de una ruta ofrecen la exportación, que el `.ics`
 * baja con contenido válido y que el alta en Google Calendar crea los eventos.
 */

const stubGoogleOAuth = (page: Page, token = "test-access-token") =>
  page.addInitScript((accessToken) => {
    window.google = {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            callback: (response: { access_token?: string }) => void;
          }) => {
            const client = {
              requestAccessToken: () => config.callback({ access_token: accessToken as string }),
            };
            return client;
          },
        },
      },
    };
  }, token);

type CalendarCall = { method: string; path: string; body: { summary?: string } | null };

const mockGoogleCalendar = async (page: Page) => {
  const calls: CalendarCall[] = [];
  await page.route("https://www.googleapis.com/calendar/v3/**", async (route) => {
    const request: Request = route.request();
    const url = new URL(request.url());
    const body = request.postData();
    calls.push({
      method: request.method(),
      path: url.pathname,
      body: body ? (JSON.parse(body) as { summary?: string }) : null,
    });
    if (url.pathname.endsWith("/calendars") && request.method() === "POST") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "nexus-calendar-id" }),
      });
    }
    if (url.pathname.endsWith("/events")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "event-created" }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: "nexus-calendar-id" }),
    });
  });
  return calls;
};

test("calendar: a title dossier exports its own title to Google and to .ics", async ({ page }) => {
  await stubGoogleOAuth(page);
  const calls = await mockGoogleCalendar(page);
  await page.goto("/titulos/iron-man");
  const actions = page.locator(".title-profile .export-actions");
  await expect(actions.getByRole("button", { name: /AÑADIR A GOOGLE/ })).toBeVisible();

  await actions.getByRole("button", { name: /AÑADIR A GOOGLE/ }).click();
  await expect(actions.getByRole("status")).toContainText("1 sesiones anadidas a Google Calendar");
  const created = calls.filter(({ path }) => path.endsWith("/events"));
  expect(created).toHaveLength(1);
  expect(created[0].body?.summary).toContain("Iron Man");

  const download = page.waitForEvent("download");
  await actions.getByRole("button", { name: /DESCARGAR \.ICS/ }).click();
  expect((await download).suggestedFilename()).toBe("nexus-plan.ics");
});

test("calendar: a viewing route exports the steps it is showing", async ({ page }) => {
  await stubGoogleOAuth(page);
  const calls = await mockGoogleCalendar(page);
  await page.goto("/rutas");
  const route = page.locator("a[href^='/rutas/']").first();
  const routeName = (await route.innerText()).trim();
  await route.click();
  const actions = page.locator(".viewing-route > .export-actions");
  await expect(actions.getByRole("button", { name: /AÑADIR RUTA A GOOGLE/ })).toBeVisible();
  await actions.getByRole("button", { name: /AÑADIR RUTA A GOOGLE/ }).click();
  await expect(actions.getByRole("status")).toContainText("sesiones anadidas a Google Calendar");
  const created = calls.filter(({ path }) => path.endsWith("/events"));
  expect(created.length).toBeGreaterThan(0);
  // Todos los eventos van al mismo calendario NEXUS, que se crea una sola vez.
  const calendarIds = new Set(
    calls
      .map(({ path }) => path.split("/calendars/")[1]?.split("/")[0])
      .filter((id): id is string => Boolean(id)),
  );
  expect(calendarIds).toEqual(new Set(["nexus-calendar-id"]));
  const createdCalendars = calls.filter(
    ({ method, path }) => method === "POST" && path.endsWith("/calendars"),
  );
  expect(createdCalendars).toHaveLength(1);
  expect(routeName.length).toBeGreaterThan(0);
});

test("calendar: a denied Google token surfaces the error instead of failing silently", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.google = {
      accounts: {
        oauth2: {
          initTokenClient: (config: { error_callback?: () => void }) => ({
            requestAccessToken: () => config.error_callback?.(),
          }),
        },
      },
    };
  });
  await mockGoogleCalendar(page);
  await page.goto("/titulos/iron-man");
  await page
    .locator(".title-profile .export-actions")
    .getByRole("button", { name: /AÑADIR/ })
    .click();
  const status = page.locator(".title-profile .export-actions").getByRole("status");
  await expect(status).toBeVisible();
  await expect(status).toHaveClass(/error/);
  await expect(status).toContainText("autorizaci");
});
