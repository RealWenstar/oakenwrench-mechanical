import assert from "node:assert/strict";
import test from "node:test";
import {
  STEPS,
  getNextStep,
  getPrevStep,
  getClosestStepIndex,
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

test("TopBar keeps only the brand logo in the intro", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const topbarPath = path.join(process.cwd(), "app", "components", "TopBar.tsx");
  const content = await fs.readFile(topbarPath, "utf8");

  assert.match(content, /className="brand-beacon"/, "Logo should be present");
  assert.doesNotMatch(content, /preloader-bar-container/, "Intro should not show a loading bar");
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
  assert.doesNotMatch(
    content,
    /^  visualProgressRef\.current = visualProgress;$/m,
    "React refs must not be updated during render",
  );
  assert.match(
    content,
    /useEffect\(\(\) => \{\s*visualProgressRef\.current = visualProgress;\s*\}, \[visualProgress\]\);/,
    "External visual progress changes should synchronize the live ref in an effect",
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

test("ready screen has no instructional cue", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const cssPath = path.join(process.cwd(), "app", "globals.css");
  const content = await fs.readFile(cssPath, "utf8");

  assert.doesNotMatch(content, /\.tap-cue\s*\{/);
  assert.doesNotMatch(content, /\.topbar\[data-state="ready"\] \.tap-cue/);
});
