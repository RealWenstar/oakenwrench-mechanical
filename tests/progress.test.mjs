import assert from "node:assert/strict";
import test from "node:test";

import {
  getBeatWindow,
  isActiveAtViewportCenter,
  normalizeProgress,
  progressToTime,
} from "../app/story/progress.mjs";

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
