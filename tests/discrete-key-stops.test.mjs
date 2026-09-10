import assert from "node:assert/strict";
import test from "node:test";
import {
  STEPS,
  getClosestStepIndex,
  getNextStep,
  getPrevStep,
  shouldProcessGesture,
} from "../app/story/discreteSteps.mjs";

test("discrete swipe stops match the approved timeline percentages", () => {
  assert.deepEqual(STEPS, [0, 0.17, 0.33, 0.44, 0.56, 0.69, 0.78, 1]);
});

test("each swipe advances or reverses exactly one approved stop", () => {
  assert.equal(getNextStep(0), 0.17);
  assert.equal(getNextStep(0.44), 0.56);
  assert.equal(getNextStep(1), 1);
  assert.equal(getPrevStep(0.78), 0.69);
  assert.equal(getPrevStep(0.17), 0);
  assert.equal(getClosestStepIndex(0.55), 4);
});

test("gesture lock rejects input during animation and cooldown", () => {
  assert.equal(shouldProcessGesture(true, 0, 1000, 180), false);
  assert.equal(shouldProcessGesture(false, 900, 1000, 180), false);
  assert.equal(shouldProcessGesture(false, 700, 1000, 180), true);
});
