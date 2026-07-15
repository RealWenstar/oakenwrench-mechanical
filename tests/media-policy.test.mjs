import assert from "node:assert/strict";
import test from "node:test";

import { selectMediaMode } from "../app/story/media-policy.mjs";

const ready = {
  hasVideo: true,
  reducedMotion: false,
  saveData: false,
  canPlayVideo: true,
  videoFailed: false,
};

test("lets iPhone attempt the local H.264 video instead of forcing poster mode", () => {
  assert.equal(selectMediaMode(ready), "video");
  assert.equal(selectMediaMode({ ...ready, reducedMotion: true }), "video");
  assert.equal(selectMediaMode({ ...ready, saveData: true }), "video");
  assert.equal(selectMediaMode({ ...ready, canPlayVideo: false }), "video");
  assert.equal(selectMediaMode({ ...ready, videoFailed: true }), "poster");
});

test("keeps still chapters on the adjacent-anchor crossfade path", () => {
  assert.equal(selectMediaMode({ ...ready, hasVideo: false }), "crossfade");
});
