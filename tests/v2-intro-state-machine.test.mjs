import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  try {
    return await readFile(new URL(path, root), "utf8");
  } catch {
    return "";
  }
}

test("state/timing contract defines deterministic intro states and timeouts", async () => {
  const experience = await source("app/v2/V2Experience.tsx");

  assert.match(experience, /type IntroState = "black" \| "ready" \| "holding" \| "opening" \| "truck_exit" \| "active"/);
  assert.match(experience, /const PASSIVE_HOLD_MS = 200/);
  assert.doesNotMatch(experience, /const MIN_LOADING_MS/);
  assert.match(experience, /const MAX_LOADING_MS = 12000/);
  assert.match(experience, /const INTRO_DURATION_MS = 2760/);
});

test("auto-open and logo tap logic is guarded and idempotent", async () => {
  const experience = await source("app/v2/V2Experience.tsx");

  assert.match(experience, /hasTappedRef = useRef\(false\)/);
  assert.match(experience, /if \(hasTappedRef\.current\) return/);
  assert.match(experience, /hasTappedRef\.current = true/);
  assert.match(experience, /PASSIVE_HOLD_MS/);
  assert.match(experience, /triggerOpening\(\)/);
});

test("UI reveal gate keeps story UI hidden until truck_exit completes into active state", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const overlay = await source("app/components/StoryOverlay.tsx");

  assert.match(experience, /loadingState === "active"/);
  assert.match(experience, /visible=\{loadingState === "active"\}/);
  assert.match(experience, /setLoadingState\("truck_exit"\)/);
  assert.match(experience, /setLoadingState\("active"\)/);
  assert.match(overlay, /if \(!visible\) return null/);
});

test("cold-load fallback and honest load meter prevent loading freezes", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const meter = await source("app/v2/components/V2LoadMeter.tsx");
  const loading = await source("app/story/loading.mjs");

  assert.match(experience, /MAX_LOADING_MS/);
  assert.match(experience, /<V2LoadMeter progress=\{bufferProgress\}/);
  assert.match(meter, /percent = mediaReady/);
  assert.match(loading, /if \(mediaFailed \|\| timedOut\) return true/);
});

test("reverse direction swipes in active mode clamp to Truck stop and do not re-enter intro", async () => {
  const experience = await source("app/v2/V2Experience.tsx");

  assert.match(experience, /minIndex = loadingState === "active" \? 1 : 0/);
  assert.match(experience, /Math\.max\(minIndex, Math\.min\(STEPS\.length - 1, index\)\)/);
  assert.match(experience, /Math\.max\(1, Math\.min\(STEPS\.length - 1, currentIndex \+ \(forward \? 1 : -1\)\)\)/);
});
