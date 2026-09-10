import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

async function source(relPath) {
  return await readFile(new URL(`../${relPath}`, import.meta.url), "utf8");
}

test("V2Experience supports both horizontal (left/right) and vertical (up/down) swipes", async () => {
  const experience = await source("app/v2/V2Experience.tsx");

  assert.match(experience, /touchStartXRef = useRef\(0\)/);
  assert.match(experience, /deltaX = touchStartXRef\.current - endX/);
  assert.match(experience, /deltaY = touchStartYRef\.current - endY/);
  assert.match(experience, /absX > absY \? deltaX > 0 : deltaY > 0/);
});

test("V2Experience enables gestures in both Full and Lite modes", async () => {
  const experience = await source("app/v2/V2Experience.tsx");

  // Must not exclude performanceMode !== "full" in gesture effect
  assert.match(experience, /if \(!stage \|\| loadingState !== "active"\) return/);
  assert.match(experience, /performanceMode === "lite" \? 0 : STEP_DURATION_MS/);
});

test("isInteractiveTarget excludes interactive elements but allows swiping on container surfaces", async () => {
  const experience = await source("app/v2/V2Experience.tsx");

  assert.match(
    experience,
    /Boolean\(target\.closest\('a, button, \[role="button"\], input, select, textarea'\)\)/
  );
});
