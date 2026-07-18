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

test("TopBar renders preloader bar below the brand logo", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const topbarPath = path.join(process.cwd(), "app", "components", "TopBar.tsx");
  const content = await fs.readFile(topbarPath, "utf8");

  // Verify brand-beacon appears before preloader-bar-container in the source code
  const logoIndex = content.indexOf("className=\"brand-beacon\"");
  const preloaderIndex = content.indexOf("className=\"preloader-bar-container\"");

  assert.ok(logoIndex !== -1, "Logo should be present");
  assert.ok(preloaderIndex !== -1, "Preloader should be present");
  assert.ok(logoIndex < preloaderIndex, "Logo must be rendered above the preloader line");
});

test("gesture listener lifecycle cannot cancel or stale the active animation", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const experiencePath = path.join(process.cwd(), "app", "v2", "V2Experience.tsx");
  const content = await fs.readFile(experiencePath, "utf8");

  assert.match(
    content,
    /const visualProgressRef = useRef\(0\);/,
    "Animations must read their start value from a live progress ref",
  );
  assert.match(
    content,
    /const start = visualProgressRef\.current;/,
    "A gesture handler retained across renders must not capture stale progress",
  );

  const gestureEffectStart = content.indexOf("// Event handlers for gestures");
  const keyboardEffectStart = content.indexOf("// Handle keyboard navigation");
  const gestureEffect = content.slice(gestureEffectStart, keyboardEffectStart);

  assert.ok(gestureEffectStart !== -1, "Gesture effect should be present");
  assert.ok(keyboardEffectStart > gestureEffectStart, "Keyboard effect should follow gesture effect");
  assert.doesNotMatch(
    gestureEffect,
    /cancelAnimationFrame/,
    "Rebinding gesture listeners must never cancel the active RAF",
  );
  assert.match(
    gestureEffect,
    /\}, \[loadingState\]\);/,
    "Gesture listeners should not rebind for every visual progress frame",
  );
});

test("tap cue pulse is scoped to the ready state", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const cssPath = path.join(process.cwd(), "app", "globals.css");
  const content = await fs.readFile(cssPath, "utf8");

  const baseRule = content.match(/\.tap-cue\s*\{([^}]*)\}/)?.[1] ?? "";
  const readyRule = content.match(/\.topbar\[data-state="ready"\] \.tap-cue\s*\{([^}]*)\}/)?.[1] ?? "";

  assert.doesNotMatch(baseRule, /animation:/, "Hidden cue must not keep a pulse animation active");
  assert.match(baseRule, /pointer-events:\s*none/, "Cue must never intercept logo interaction");
  assert.match(readyRule, /animation:\s*cue-pulse/, "Only the ready cue should pulse");
});
