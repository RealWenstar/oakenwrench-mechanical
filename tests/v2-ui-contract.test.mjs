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

test("v2 shell is a centered mobile-only 9:16 surface", async () => {
  const shell = await source("app/v2/components/V2MobileShell.tsx");
  assert.match(shell, /data-experience="v2"/);
  assert.match(shell, /data-layout="mobile-only"/);
  assert.match(shell, /aspectRatio:\s*["']9 \/ 16["']/);
  assert.match(shell, /marginInline:\s*["']auto["']/);
  assert.match(shell, /maxWidth:\s*["']430px["']/);
});

test("v2 removes the obsolete Raw and Clean switcher", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  assert.doesNotMatch(experience, /VariantSwitcher/);
  assert.doesNotMatch(experience, /raw|clean/i);
});

test("v2 exposes an explicit opt-in Sound control", async () => {
  const controls = await source("app/v2/components/ControlCenter.tsx");
  assert.match(controls, /aria-label="Open control center"/);
  assert.match(controls, /aria-expanded/);
  assert.match(controls, /aria-label="Sound"/);
  assert.match(controls, /aria-pressed/);
  assert.match(controls, /Sound on/);
  assert.match(controls, /Sound off/);
  assert.match(controls, /defaultSoundEnabled\s*=\s*false/);
  assert.match(controls, /localStorage/);
  assert.match(controls, /Escape/);
});

test("v2 ready screen is logo-only and story copy waits for the completed opening", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const topbar = await source("app/components/TopBar.tsx");
  const css = await source("app/globals.css");

  assert.match(experience, /"loading" \| "ready" \| "opening" \| "active"/);
  assert.match(experience, /const INTRO_REVEAL_DELAY_MS = 500/);
  assert.match(experience, /const INTRO_DURATION_MS = 2760/);
  assert.match(experience, /const STEP_DURATION_MS = 1900/);
  assert.match(experience, /introVisible/);
  assert.match(experience, /setLoadingState\("opening"\)/);
  assert.match(experience, /animateTo\(0\.18, INTRO_DURATION_MS, \(\) => setLoadingState\("active"\)\)/);
  assert.match(experience, /visible=\{loadingState === "active"\}/);
  assert.match(experience, /loadingState === "active" && interfaceVisible/);
  assert.doesNotMatch(topbar, /Tap logo to open/i);
  assert.doesNotMatch(topbar, /tap-cue/);
  assert.doesNotMatch(topbar, /preloader-bar/);
  assert.match(topbar, /data-intro-visible=\{introVisible\}/);
  assert.match(css, /\.brand-intro-stack[\s\S]*opacity:\s*0/);
  assert.match(css, /data-intro-visible="true"[\s\S]*opacity:\s*1/);
  assert.doesNotMatch(topbar, /Motion lab/i);
});

test("v2 first story copy enters from below and stays inside the phone frame", async () => {
  const css = await source("app/globals.css");
  assert.match(css, /@keyframes copy-in[\s\S]*translateY\(32px\)/);
  assert.match(css, /\.story-copy[\s\S]*animation:\s*copy-in 620ms/);
  assert.match(css, /\.v2-phone-stage \.story-copy h1,[\s\S]*font-size:\s*clamp\(2\.75rem, 12vw, 3\.6rem\)/);
  assert.match(css, /\.v2-phone-stage \.story-overlay[\s\S]*padding-bottom:\s*7\.75rem/);
});

test("v2 control center is the only persistent chrome and can hide the interface", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const controls = await source("app/v2/components/ControlCenter.tsx");

  assert.doesNotMatch(experience, /SoundControl/);
  assert.doesNotMatch(experience, /v2-lab-label/);
  assert.match(experience, /ControlCenter/);
  assert.match(experience, /interfaceVisible/);
  assert.match(controls, /Hide interface/);
  assert.match(controls, /Show interface/);
  assert.match(controls, /aria-label="Interface"/);
  assert.match(
    controls,
    /const toggleInterface = \(\) => \{[\s\S]*setOpen\(false\);[\s\S]*\};/,
    "Changing interface visibility must close the panel and leave only the restore trigger",
  );
});

test("v2 mobile CSS uses dynamic viewport sizing and safe-area bounds", async () => {
  const css = await source("app/globals.css");
  assert.match(css, /\.v2-site-shell[\s\S]*min-height:\s*100dvh/);
  assert.match(css, /\.v2-sticky-stage[\s\S]*height:\s*100dvh/);
  assert.match(css, /\.v2-mobile-shell[\s\S]*height:\s*100dvh/);
  assert.match(css, /\.v2-phone-stage[\s\S]*width:\s*100%/);
  assert.match(css, /env\(safe-area-inset-top\)/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /@media \(max-height:\s*720px\)/);
  assert.match(css, /--visual-width:\s*min\(100%, calc\(100svh \* 9 \/ 16\)\)/);
  assert.match(css, /width:\s*var\(--visual-width\)/);
  const layout = await source("app/layout.tsx");
  assert.match(layout, /viewportFit:\s*"cover"/);
});

test("v2 chapter navigation stays at four chapters", async () => {
  const nav = await source("app/v2/components/V2ChapterNav.tsx");
  assert.match(nav, /aria-label="Story chapters"/);
  assert.match(nav, /chapters\.map/);
  assert.match(nav, /chapters\.length !== 4/);
  assert.match(nav, /aria-current/);
});
