import assert from "node:assert/strict";
import test from "node:test";
import { createGtagCommandQueue, GA_MEASUREMENT_ID } from "./index";

test("gtag encola consent, config y event como objetos arguments compatibles con gtag.js", () => {
  const dataLayer: unknown[] = [];
  const gtag = createGtagCommandQueue(dataLayer);
  const consent = { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  const config = { send_page_view: false };
  const event = { route_slug: "camino-a-doomsday", route_name: "Camino a Doomsday" };

  gtag("consent", "update", consent);
  gtag("config", GA_MEASUREMENT_ID, config);
  gtag("event", "route_view", event);

  assert.equal(dataLayer.length, 3);
  for (const command of dataLayer) assert.equal(Object.prototype.toString.call(command), "[object Arguments]");
  assert.deepEqual(Array.from(dataLayer[0] as IArguments), ["consent", "update", consent]);
  assert.deepEqual(Array.from(dataLayer[1] as IArguments), ["config", GA_MEASUREMENT_ID, config]);
  assert.deepEqual(Array.from(dataLayer[2] as IArguments), ["event", "route_view", event]);
});
