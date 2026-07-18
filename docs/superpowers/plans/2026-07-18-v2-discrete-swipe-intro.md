# Implementation Plan: V2 Discrete Swipe & Intro Flow

This document details the step-by-step TDD (Test-Driven Development) plan to implement the discrete swipe gesture controls and the preloader/intro sequence.

## 1. Pure Helper Boundary (Testable Steps Helper)

Before modifying the UI components, we will implement a pure utility library for managing the state transition of discrete steps. This module will reside at `app/story/discreteSteps.mjs` and will be testable in Node.js without requiring DOM API or React context.

### Contract API (`app/story/discreteSteps.mjs`)
- `STEPS`: `[0, 0.18, 0.33, 0.55, 0.77, 1.0]`
- `getNextStep(currentProgress)`: returns next step value.
- `getPrevStep(currentProgress)`: returns previous step value.
- `getClosestStepIndex(progress)`: returns step index `0..5`.
- `getStepProgress(index)`: returns step value.

## 2. Test-Driven Development (TDD) Phase 1: Failing Tests

We will create a new test suite file at `tests/discrete-steps.test.mjs` verifying the pure step logic and integration contracts.

### Step 1: Create `tests/discrete-steps.test.mjs`
```javascript
import assert from "node:assert/strict";
import test from "node:test";
import {
  STEPS,
  getNextStep,
  getPrevStep,
  getClosestStepIndex,
  getStepProgress
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
```

### Step 2: Run Tests to Verify Failure
We run the test command in PowerShell:
```powershell
node --test tests/discrete-steps.test.mjs
```
*Expected Failure*: `ERR_MODULE_NOT_FOUND` (since `app/story/discreteSteps.mjs` does not exist yet).

## 3. Phase 2: Implementation of Pure Steps Logic

We write the code for `app/story/discreteSteps.mjs`.

```javascript
export const STEPS = [0, 0.18, 0.33, 0.55, 0.77, 1.0];

export function getClosestStepIndex(progress) {
  return STEPS.reduce((closestIdx, stepVal, currentIdx) => {
    const currentDiff = Math.abs(stepVal - progress);
    const closestDiff = Math.abs(STEPS[closestIdx] - progress);
    return currentDiff < closestDiff ? currentIdx : closestIdx;
  }, 0);
}

export function getStepProgress(index) {
  return STEPS[Math.max(0, Math.min(STEPS.length - 1, index))];
}

export function getNextStep(progress) {
  const currentIdx = getClosestStepIndex(progress);
  return getStepProgress(currentIdx + 1);
}

export function getPrevStep(progress) {
  const currentIdx = getClosestStepIndex(progress);
  return getStepProgress(currentIdx - 1);
}
```

### Run Tests to Verify Pass
```powershell
node --test tests/discrete-steps.test.mjs
```
*Expected Result*: Tests pass.

## 4. Phase 3: UI and Gesture Integration

### Step 1: Preloader & Intro State in `app/v2/V2Experience.tsx`
We will add an explicit workflow state machine:
- `'loading'`: video loading, black overlay with center logo and buffering bar.
- `'ready'`: video metadata ready. Logo transitions to the top-center position. Tap cue appears.
- `'playing-intro'`: animating visualProgress from 0 to 0.18.
- `'active'`: gestures unlocked, discrete steps active.

We'll manage `visualProgress` explicitly in a state variable, bypassing standard `useStoryProgress` for the timeline controller on v2, but keeping `scrollVh` to satisfy integration tests.

### Step 2: Gesture Interceptor (Wheel and Swipe)
We will create a hook/event handler inside `V2Experience.tsx`:
- Intercept touch Y-movement on `.v2-phone-stage` via `touchstart` and `touchend`.
- Intercept mouse `wheel` events.
- On gesture direction matching:
  - If state is `'active'` and no transition is running, animate `visualProgress` to the next or previous step.
- Intercept and block default touch scrolling inside the shell using `touch-action: none`.

### Step 3: TopBar Logo Animation
We will modify [app/components/TopBar.tsx](file:///F:/projects/_worktrees/oakenwrench-v2-motion/app/components/TopBar.tsx) to accept a `loadingState` prop (e.g., `"loading" | "ready" | "active"`) to animate the `.brand-beacon` position from absolute center to top-center using CSS transitions.

## 5. Verification Plan

### Automated Test Suites
Run the full test suite to make sure we didn't break any regressions:
```powershell
npm test
```
*Expected Result*: All 32 tests pass (including our new discrete-steps tests).

### Manual Verification (Visual QA)
1. Load page. Verify absolute black background, centered logo, and progress bar.
2. Verify logo smoothly animates to the top center when the video is ready.
3. Tap the logo. Verify the door rises (0% -> 18%) smoothly.
4. Try to swipe/scroll during the intro. Verify interaction is blocked.
5. Once open, swipe up. Verify timeline transitions to 33% (Truck) and content updates.
6. Verify transitions ignore fast duplicate swipes.
7. Verify all points match the respective screenshots from 0% up to 100%.
