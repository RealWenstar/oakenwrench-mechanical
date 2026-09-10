import assert from "node:assert/strict";
import test from "node:test";

let helpers = {};
try {
  helpers = await import("../app/story/loading.mjs");
} catch {
  // RED until the loading contract exists.
}

test("story entry requires a decoded frame, without artificial dwell", () => {
  assert.equal(typeof helpers.canEnterStory, "function");

  const base = {
    bufferProgress: 0.18,
    mediaFailed: false,
    mediaReady: true,
    minimumWaitElapsed: true,
    timedOut: false,
  };

  assert.equal(helpers.canEnterStory(base), true);
  assert.equal(helpers.canEnterStory({ ...base, mediaReady: true, bufferProgress: 0.14 }), true);
  assert.equal(helpers.canEnterStory({ ...base, mediaReady: false, bufferProgress: 0.17 }), false);
  assert.equal(helpers.canEnterStory({ ...base, minimumWaitElapsed: false }), true);
  assert.equal(helpers.canEnterStory({ ...base, timedOut: true, bufferProgress: 0 }), true);
  assert.equal(helpers.canEnterStory({ ...base, mediaFailed: true, bufferProgress: 0 }), true);
});

test("loading progress fills the seven timeline segments in order", () => {
  assert.equal(typeof helpers.getSegmentLoad, "function");
  assert.equal(helpers.getSegmentLoad(0.36, 0, 7), 1);
  assert.equal(helpers.getSegmentLoad(0.36, 1, 7), 1);
  assert.ok(Math.abs(helpers.getSegmentLoad(0.36, 2, 7) - 0.52) < 0.0001);
  assert.equal(helpers.getSegmentLoad(0.36, 3, 7), 0);
});

test("intro reserve progress reaches one at the opening threshold", () => {
  assert.equal(typeof helpers.getReserveProgress, "function");
  assert.equal(helpers.getReserveProgress(0), 0);
  assert.equal(helpers.getReserveProgress(0.09), 0.5);
  assert.equal(helpers.getReserveProgress(0.18), 1);
  assert.equal(helpers.getReserveProgress(0.8), 1);
});
