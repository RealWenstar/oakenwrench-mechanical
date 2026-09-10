import assert from "node:assert/strict";
import test from "node:test";
import { canEnterStory, getReserveProgress, getSegmentLoad } from "../app/story/loading.mjs";

test("canEnterStory allows entry when mediaReady is true even if bufferProgress is stalled at 12% or 14%", () => {
  const stalledAt14Percent = {
    bufferProgress: 0.14,
    mediaFailed: false,
    mediaReady: true,
    minimumWaitElapsed: true,
    timedOut: false,
  };

  assert.equal(
    canEnterStory(stalledAt14Percent),
    true,
    "Story entry must proceed when decoder is mediaReady, even if mobile browser pauses preloading at 14%",
  );

  const stalledAt12Percent = {
    bufferProgress: 0.12,
    mediaFailed: false,
    mediaReady: true,
    minimumWaitElapsed: true,
    timedOut: false,
  };

  assert.equal(
    canEnterStory(stalledAt12Percent),
    true,
    "Story entry must proceed when decoder is mediaReady, even if mobile browser pauses preloading at 12%",
  );
});

test("canEnterStory ignores obsolete minimum dwell but still requires media readiness", () => {
  const notDweltYet = {
    bufferProgress: 0.5,
    mediaFailed: false,
    mediaReady: true,
    minimumWaitElapsed: false,
    timedOut: false,
  };

  assert.equal(canEnterStory(notDweltYet), true, "A decoded frame must not wait for a decorative timer");

  const notReadyYet = {
    bufferProgress: 0.14,
    mediaFailed: false,
    mediaReady: false,
    minimumWaitElapsed: true,
    timedOut: false,
  };

  assert.equal(canEnterStory(notReadyYet), false, "Must wait for mediaReady or timeout fallback");
});

test("canEnterStory allows immediate entry on timeout or media error fallback", () => {
  const timedOut = {
    bufferProgress: 0.05,
    mediaFailed: false,
    mediaReady: false,
    minimumWaitElapsed: true,
    timedOut: true,
  };

  assert.equal(canEnterStory(timedOut), true, "Must proceed to story on timeout fallback");

  const mediaFailed = {
    bufferProgress: 0,
    mediaFailed: true,
    mediaReady: false,
    minimumWaitElapsed: true,
    timedOut: false,
  };

  assert.equal(canEnterStory(mediaFailed), true, "Must proceed to poster fallback on media error");
});

test("getReserveProgress reflects full readiness when mediaReady is true or buffer reaches opening threshold", () => {
  assert.equal(getReserveProgress(0.14, true), 1, "Should report 1 when mediaReady is true");
  assert.equal(getReserveProgress(0.09, false), 0.5, "Should calculate linear reserve progress when mediaReady is false");
  assert.equal(getReserveProgress(0.18, false), 1, "Should reach 1 when buffer reaches 18%");
});

test("getSegmentLoad distributes segment fill evenly across 7 timeline stops", () => {
  assert.equal(getSegmentLoad(1, 0, 7), 1);
  assert.equal(getSegmentLoad(1, 6, 7), 1);
  assert.equal(getSegmentLoad(0, 0, 7), 0);
});
