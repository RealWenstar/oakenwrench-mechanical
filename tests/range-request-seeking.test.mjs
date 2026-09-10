import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { shouldSeek } from "../app/story/progress.mjs";

const root = new URL("../", import.meta.url);

async function source(path) {
  try {
    return await readFile(new URL(path, root), "utf8");
  } catch {
    return "";
  }
}

test("shouldSeek blocks seek operations while seeking is in flight", () => {
  assert.equal(shouldSeek(0, 10, true, 0.035), false);
  assert.equal(shouldSeek(0, 10, false, 0.035), true);
  assert.equal(shouldSeek(5.001, 5.002, false, 0.035), false);
});

test("V2Experience defines a 2.2s deliberate swipe timing contract", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  assert.match(experience, /const STEP_DURATION_MS = 2200/);
});

test("ScrollVideo binds mobile intraframe video source and guards seeking", async () => {
  const scrollVideo = await source("app/components/ScrollVideo.tsx");
  const experience = await source("app/v2/V2Experience.tsx");

  assert.match(scrollVideo, /if \(!shouldSeek\(video\.currentTime, target, video\.seeking, 0\.035\)\) return/);
  assert.match(experience, /mobileSrc=\{variant\.video\}/);
});
