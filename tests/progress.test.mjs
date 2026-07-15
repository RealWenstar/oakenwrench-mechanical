import assert from "node:assert/strict";
import test from "node:test";

import {
  getBeatWindow,
  getChapterJumpProgress,
  getTimelineWindow,
  isActiveAtViewportCenter,
  normalizeProgress,
  progressToTime,
} from "../app/story/progress.mjs";
import * as progressHelpers from "../app/story/progress.mjs";

test("normalizes and clamps chapter scroll progress", () => {
  assert.equal(normalizeProgress(50, 100, 500), 0);
  assert.equal(normalizeProgress(100, 100, 500), 0);
  assert.equal(normalizeProgress(200, 100, 500), 0.25);
  assert.equal(normalizeProgress(500, 100, 500), 1);
  assert.equal(normalizeProgress(900, 100, 500), 1);
  assert.equal(normalizeProgress(100, 100, 100), 0);
});

test("returns the adjacent beats and local interpolation", () => {
  const beats = [0, 0.25, 0.5, 0.75, 1].map((progress) => ({ progress }));

  assert.deepEqual(getBeatWindow(0, beats), {
    fromIndex: 0,
    toIndex: 1,
    t: 0,
  });
  assert.deepEqual(getBeatWindow(0.375, beats), {
    fromIndex: 1,
    toIndex: 2,
    t: 0.5,
  });
  assert.deepEqual(getBeatWindow(1, beats), {
    fromIndex: 4,
    toIndex: 4,
    t: 1,
  });
});

test("marks only a chapter crossing the viewport center as active", () => {
  assert.equal(isActiveAtViewportCenter(-1200, 900, 800), true);
  assert.equal(isActiveAtViewportCenter(-1200, 300, 800), false);
  assert.equal(isActiveAtViewportCenter(401, 2200, 800), false);
  assert.equal(isActiveAtViewportCenter(400, 2200, 800), true);
});

test("maps continuous chapter progress onto scrub-video time", () => {
  assert.equal(progressToTime(0, 5), 0);
  assert.equal(progressToTime(0.25, 5), 1.25);
  assert.equal(progressToTime(0.5, 5), 2.5);
  assert.equal(progressToTime(1.2, 5), 5);
  assert.equal(progressToTime(-0.2, 5), 0);
});

test("maps global progress into one continuous chapter window", () => {
  const timeline = [
    { id: "garage", start: 0, end: 0.32 },
    { id: "truck", start: 0.32, end: 0.62 },
    { id: "equipment", start: 0.62, end: 0.84 },
    { id: "contact", start: 0.84, end: 1 },
  ];

  assert.deepEqual(getTimelineWindow(0.47, timeline), {
    id: "truck",
    index: 1,
    localProgress: 0.5,
  });
  assert.deepEqual(getTimelineWindow(1, timeline), {
    id: "contact",
    index: 3,
    localProgress: 1,
  });
});

test("navigation lands inside the requested timeline chapter", () => {
  assert.equal(getChapterJumpProgress({ start: 0, end: 0.32 }), 0);
  assert.equal(getChapterJumpProgress({ start: 0.62, end: 0.84 }), 0.621);
});

test("waits for an in-flight video seek before scheduling the latest scrub target", () => {
  assert.equal(typeof progressHelpers.shouldSeek, "function");
  assert.equal(progressHelpers.shouldSeek(1, 2, true), false);
  assert.equal(progressHelpers.shouldSeek(1, 1.04, false), false);
  assert.equal(progressHelpers.shouldSeek(1, 1.08, false), true);
});

test("keeps scaled desktop imagery inside its native source width", () => {
  assert.equal(typeof progressHelpers.sourceWidthForScale, "function");
  assert.equal(progressHelpers.sourceWidthForScale(1080, 1), 1080);
  assert.equal(progressHelpers.sourceWidthForScale(1080, 1.2), 900);
});
