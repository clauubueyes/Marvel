import { expect, test } from "@playwright/test";

for (const [path, selector] of [["/titulos", ".title-watch-toggle"], ["/rutas/camino-a-doomsday", ".route-check"]]) {
test(`progress audio at ${path} is lazy, unique, distinct and respects the persisted preference`, async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("nexus:analytics-consent", "rejected");
    const stats = { contexts: 0, frequencies: [] as number[] };
    Object.assign(window, { audioStats: stats });
    const NativeAudioContext = window.AudioContext;
    window.AudioContext = class extends NativeAudioContext {
      constructor() { super(); stats.contexts++; }
      createOscillator() {
        const oscillator = super.createOscillator();
        let frequency = 0;
        const setFrequency = oscillator.frequency.setValueAtTime.bind(oscillator.frequency);
        oscillator.frequency.setValueAtTime = (value, when) => {
          frequency = value;
          return setFrequency(value, when);
        };
        const start = oscillator.start.bind(oscillator);
        oscillator.start = (when) => { stats.frequencies.push(frequency); start(when); };
        return oscillator;
      }
    };
  });
  const stats = () => page.evaluate(() => (window as unknown as {
    audioStats: { contexts: number; frequencies: number[] };
  }).audioStats);
  await page.goto(path);
  const toggle = page.locator(selector).first();
  await expect(toggle).toBeEnabled();
  expect(await stats()).toEqual({ contexts: 0, frequencies: [] });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect.poll(async () => (await stats()).frequencies.length).toBe(1);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect.poll(async () => (await stats()).frequencies.length).toBe(2);
  const played = await stats();
  expect(played.contexts).toBe(1);
  expect(played.frequencies[0]).not.toBe(played.frequencies[1]);
  await page.evaluate(() => localStorage.setItem("soundEnabled", "false"));
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(await stats()).toEqual(played);
  await page.reload();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(await stats()).toEqual({ contexts: 0, frequencies: [] });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(await stats()).toEqual({ contexts: 0, frequencies: [] });
  await page.evaluate(() => localStorage.setItem("soundEnabled", "true"));
  await toggle.click();
  await expect.poll(async () => (await stats()).frequencies.length).toBe(1);
  await page.reload();
  await expect(toggle).toBeEnabled();
  expect(await stats()).toEqual({ contexts: 0, frequencies: [] });
});
}
