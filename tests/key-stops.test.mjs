import assert from "node:assert/strict";
import test from "node:test";
import { getActiveKeyStop } from "../app/story/keyStops.mjs";

test("contact stop remains active across the stable final-scroll landing zone", () => {
  assert.equal(getActiveKeyStop(0.9702)?.id, "contact");
  assert.equal(getActiveKeyStop(1)?.id, "contact");
});

test("copy stays hidden between approved key stops", () => {
  assert.equal(getActiveKeyStop(0.25), null);
  assert.equal(getActiveKeyStop(0.38), null);
  assert.equal(getActiveKeyStop(0.85), null);
});
