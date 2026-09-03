import assert from "node:assert/strict";
import test from "node:test";
import { createGtagCommandQueue, GA_MEASUREMENT_ID, initializeConsentMode, updateAnalyticsConsent } from "./index";

test("gtag encola js, consent, config y event como objetos arguments compatibles con gtag.js", () => {
  const dataLayer: unknown[] = [];
  const gtag = createGtagCommandQueue(dataLayer);
  const consent = { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  const config = { send_page_view: false };
  const event = { route_slug: "camino-a-doomsday", route_name: "Camino a Doomsday" };
  const loadedAt = new Date("2026-09-03T12:00:00.000Z");

  gtag("js", loadedAt);
  gtag("consent", "update", consent);
  gtag("config", GA_MEASUREMENT_ID, config);
  gtag("event", "route_view", event);

  assert.equal(dataLayer.length, 4);
  for (const command of dataLayer) assert.equal(Object.prototype.toString.call(command), "[object Arguments]");
  assert.deepEqual(Array.from(dataLayer[0] as IArguments), ["js", loadedAt]);
  assert.ok(Array.from(dataLayer[0] as IArguments)[1] instanceof Date);
  assert.strictEqual(Array.from(dataLayer[0] as IArguments)[1], loadedAt);
  assert.deepEqual(Array.from(dataLayer[1] as IArguments), ["consent", "update", consent]);
  assert.deepEqual(Array.from(dataLayer[2] as IArguments), ["config", GA_MEASUREMENT_ID, config]);
  assert.deepEqual(Array.from(dataLayer[3] as IArguments), ["event", "route_view", event]);
});

test("Consent Mode inicializa default una vez y cada decisión produce solo su update", () => {
  const originalWindow = globalThis.window;
  const dataLayer: unknown[] = [];
  const fakeWindow = { dataLayer, gtag: createGtagCommandQueue(dataLayer) } as unknown as Window;
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: fakeWindow });

  try {
    initializeConsentMode();
    initializeConsentMode();

    assert.equal(dataLayer.length, 1);
    assert.deepEqual(Array.from(dataLayer[0] as IArguments), ["consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    }]);

    updateAnalyticsConsent(true);
    assert.equal(dataLayer.length, 2);
    assert.deepEqual(Array.from(dataLayer[1] as IArguments), ["consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted",
    }]);

    updateAnalyticsConsent(false);
    assert.equal(dataLayer.length, 3);
    assert.deepEqual(Array.from(dataLayer[2] as IArguments), ["consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    }]);
  } finally {
    Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: originalWindow });
  }
});
