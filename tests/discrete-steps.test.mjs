import assert from "node:assert/strict";
import test from "node:test";
import {
  STEPS,
  getNextStep,
  getPrevStep,
  getClosestStepIndex,
  getStepProgress,
  shouldProcessGesture
} from "../app/story/discreteSteps.mjs";

test("discrete steps constants and lookup", () => {
  assert.deepEqual(STEPS, [0, 0.18, 0.33, 0.55, 0.77, 1.0]);
  assert.equal(getClosestStepIndex(0.33), 2);
  assert.equal(getClosestStepIndex(0.35), 2);
  assert.equal(getClosestStepIndex(0.50), 3);
});

test("stepping logic forwards and backwards", () => {
  assert.equal(getNextStep(0), 0.18);
  assert.equal(getNextStep(0.18), 0.33);
  assert.equal(getNextStep(1.0), 1.0);

  assert.equal(getPrevStep(0.33), 0.18);
  assert.equal(getPrevStep(0.18), 0);
  assert.equal(getPrevStep(0), 0);
});

test("transition lock helper decides correctly", () => {
  // If currently animating, ignore gesture
  assert.equal(shouldProcessGesture(true, 0, 1000, 150), false);
  // If not animating, but cooldown has not passed, ignore gesture
  assert.equal(shouldProcessGesture(false, 900, 1000, 150), false);
  // If not animating and cooldown passed, allow gesture
  assert.equal(shouldProcessGesture(false, 800, 1000, 150), true);
});
