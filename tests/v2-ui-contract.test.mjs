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

test("v2 exposes one-tap Full and Lite modes, always starts Full, and has no sound UI", async () => {
  const controls = await source("app/v2/components/ExperienceTools.tsx");
  const experience = await source("app/v2/V2Experience.tsx");

  assert.match(controls, /"Use Lite mode"/);
  assert.match(controls, /"Use Full mode"/);
  assert.match(controls, /aria-label="Business information"/);
  assert.match(controls, /aria-pressed/);
  assert.doesNotMatch(controls, /sound/i);
  assert.doesNotMatch(experience, /StorySoundscape|soundEnabled|onSoundChange|localStorage|PERFORMANCE_MODE_KEY/);
  assert.match(experience, /useState<PerformanceMode>\("full"\)/);
  assert.match(experience, /data-performance-mode=\{performanceMode\}/);
});

test("v2 ready screen is logo-only and interaction UI waits for the opening transition", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const topbar = await source("app/components/TopBar.tsx");
  const css = await source("app/globals.css");

  assert.match(experience, /"black" \| "ready" \| "holding" \| "opening" \| "truck_exit" | "active"/);
  assert.match(experience, /introVisible/);
  assert.match(experience, /setLoadingState\("opening"\)/);
  assert.match(experience, /setLoadingState\("active"\)/);
  assert.match(experience, /visible=\{loadingState === "active"\}/);
  assert.match(experience, /loadingState === "active"/);
  assert.doesNotMatch(topbar, /Tap logo to open/i);
  assert.doesNotMatch(topbar, /tap-cue/);
  assert.doesNotMatch(topbar, /preloader-bar/);
  assert.match(topbar, /data-intro-visible=\{introVisible\}/);
  assert.match(css, /\.brand-intro-stack[\s\S]*opacity:\s*0/);
  assert.match(css, /data-intro-visible="true"[\s\S]*opacity:\s*1/);
  assert.doesNotMatch(topbar, /Motion lab/i);
});

test("v2 loading window waits for an opening reserve and reports honest buffer progress", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const video = await source("app/components/ScrollVideo.tsx");
  const meter = await source("app/v2/components/V2LoadMeter.tsx");
  const nav = await source("app/v2/components/V2StopNav.tsx");
  const css = await source("app/globals.css");

  assert.doesNotMatch(experience, /const MIN_LOADING_MS/);
  assert.match(experience, /MAX_LOADING_MS/);
  assert.match(experience, /canEnterStory/);
  assert.match(experience, /onBufferProgress/);
  assert.match(experience, /V2LoadMeter/);
  assert.match(experience, /progress=\{bufferProgress\}/);
  assert.match(video, /getContiguousStartBuffer/);
  assert.match(video, /durationchange/);
  assert.match(video, /SEEK_STALL_MS\s*=\s*3000/);
  assert.doesNotMatch(experience, /onStall=\{\(\)\s*=>\s*\{[\s\S]{0,160}setVideoFailed/);
  assert.match(meter, /role="progressbar"/);
  assert.match(meter, /Loading workshop media/);
  assert.match(nav, /getSegmentLoad/);
  assert.match(nav, /v2-stop-load/);
  assert.match(css, /--load-cool:/);
  assert.match(css, /\.v2-load-meter/);
  assert.match(css, /\.v2-stop-load/);
});

test("v2 first story copy enters from below and stays inside the phone frame", async () => {
  const css = await source("app/globals.css");
  assert.match(css, /@keyframes copy-in[\s\S]*translateY\(32px\)/);
  assert.match(css, /\.story-copy[\s\S]*animation:\s*copy-in 620ms/);
  assert.match(css, /\.v2-phone-stage \.story-copy h1,[\s\S]*font-size:\s*clamp\(2\.75rem, 12vw, 3\.6rem\)/);
  assert.match(css, /\.v2-phone-stage \.story-overlay[\s\S]*padding-bottom:\s*7\.75rem/);
});

test("v2 keeps the core video timeline animated when iOS Reduce Motion is enabled", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  assert.doesNotMatch(
    experience,
    /isReduced\s*\|\|\s*duration\s*<=\s*0/,
    "Reduce Motion must not collapse the scrub timeline into instantaneous still frames",
  );
});

test("v2 replaces the settings trigger with persistent Call and left-side tools", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const call = await source("app/v2/components/PersistentCallButton.tsx");
  const tools = await source("app/v2/components/ExperienceTools.tsx");
  const css = await source("app/globals.css");

  assert.doesNotMatch(experience, /ControlCenter/);
  assert.match(experience, /PersistentCallButton/);
  assert.match(experience, /ExperienceTools/);
  assert.match(experience, /loadingState === "active"/);
  assert.match(call, /href="tel:\+15879176991"/);
  assert.match(call, /aria-label="Call Dave at 587-917-6991"/);
  assert.doesNotMatch(call, /persistent-call-icon|☎/);
  assert.match(tools, /className="experience-tools"/);
  assert.match(css, /\.persistent-call-button[\s\S]*z-index:\s*110/);
  assert.match(css, /\.persistent-call-button[\s\S]*touch-action:\s*manipulation/);
  assert.match(css, /\.persistent-call-button[\s\S]*align-items:\s*center/);
  assert.match(css, /\.persistent-call-button[\s\S]*justify-content:\s*center/);
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

test("v2 bottom navigation represents all seven swipe stops", async () => {
  const nav = await source("app/v2/components/V2StopNav.tsx");
  const stops = await source("app/story/keyStops.mjs");
  const experience = await source("app/v2/V2Experience.tsx");
  const css = await source("app/globals.css");

  assert.match(nav, /aria-label="Story stops"/);
  assert.match(nav, /stops\.map/);
  assert.match(nav, /aria-current/);
  assert.match(experience, /V2StopNav/);
  assert.doesNotMatch(experience, /ConstructionTimeline/);
  for (const label of ["Truck", "Jobs", "Seasonal", "Yard", "Compact", "Engines", "Contact"]) {
    assert.match(stops, new RegExp(`navLabel:\\s*["']${label}["']`));
  }
  assert.match(css, /\.v2-stop-nav[\s\S]*grid-template-columns:\s*repeat\(7,/);
});

test("v2 locks each swipe to the approved discrete key stops", async () => {
  const experience = await source("app/v2/V2Experience.tsx");

  assert.match(experience, /\bSTEPS\b/);
  assert.match(experience, /getClosestStepIndex/);
  assert.match(experience, /animateTo/);
  assert.match(experience, /touchAction:\s*performanceMode === "full" \? "none" : "manipulation"/);
  assert.match(experience, /addEventListener\("touchstart"/);
  assert.match(experience, /addEventListener\("touchmove"/);
  assert.match(experience, /addEventListener\("touchend"/);
  assert.match(experience, /addEventListener\("wheel"/);
  assert.match(experience, /data-animating=\{isAnimating\}/);
  assert.match(experience, /closest\(["']a, button, \[role="button"\], input, select, textarea["']\)/);
});

test("v2 logo halo uses an unclipped iPhone-safe radial gradient", async () => {
  const css = await source("app/globals.css");
  assert.match(css, /\.brand-beacon[\s\S]*overflow:\s*visible/);
  assert.match(css, /\.brand-beacon::before[\s\S]*radial-gradient/);
  assert.match(css, /\.brand-beacon::before[\s\S]*filter:\s*none/);
  assert.match(css, /\.brand-beacon:focus-visible[\s\S]*outline:\s*none/);
});

test("v2 Lite mode disables swipe interpolation and uses explicit previous and next buttons", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const controls = await source("app/v2/components/LiteStepControls.tsx");
  const css = await source("app/globals.css");

  assert.match(experience, /performanceMode === "lite" \? 0 : STEP_DURATION_MS/);
  assert.match(experience, /performanceMode === "lite"/);
  assert.match(controls, /aria-label="Previous scene"/);
  assert.match(controls, /aria-label="Next scene"/);
  assert.match(css, /data-performance-mode="lite"/);
  assert.match(css, /backdrop-filter:\s*none/);
});

test("v2 copy appears only at the seven approved key stops with distinct effects", async () => {
  const stops = await source("app/story/keyStops.mjs");
  const overlay = await source("app/components/StoryOverlay.tsx");

  assert.match(stops, /0\.17/);
  assert.match(stops, /0\.33/);
  assert.match(stops, /0\.44/);
  assert.match(stops, /0\.56/);
  assert.match(stops, /0\.69/);
  assert.match(stops, /0\.78/);
  assert.match(stops, /1/);
  for (const effect of ["slide-left", "glitch", "fade", "slide-right", "rise", "focus", "signal"]) {
    assert.match(stops, new RegExp(`effect:\\s*["']${effect}["']`));
  }
  assert.match(overlay, /getActiveKeyStop\(progress\)/);
  assert.match(overlay, /data-effect=\{stop\.effect\}/);
  assert.doesNotMatch(overlay, /getBeatWindow/);
});

test("v2 final contact graphic exposes responsive icon hotspots plus a receiver call target", async () => {
  const hotspots = await source("app/components/ContactGraphicHotspots.tsx");
  const overlay = await source("app/components/StoryOverlay.tsx");
  const css = await source("app/globals.css");

  assert.match(hotspots, /aria-label="WhatsApp Dave"/);
  assert.match(hotspots, /aria-label="Message Dave on Messenger"/);
  assert.match(hotspots, /aria-label="Open Dave's Facebook"/);
  assert.match(hotspots, /aria-label="Email Dave"/);
  assert.match(hotspots, /aria-label="Call Dave at 587-917-6991"/);
  assert.match(hotspots, /587 · 917 · 6991/);
  assert.match(hotspots, /tel:\+15879176991/);
  assert.match(hotspots, /wa\.me\/15879176991/);
  assert.match(hotspots, /m\.me\/61578764844956/);
  assert.match(hotspots, /Website currently being refined\. Call or message Dave directly for service\./);
  assert.match(overlay, /ContactGraphicHotspots/);
  assert.match(css, /\.contact-graphic-surface[\s\S]*aspect-ratio:\s*9\s*\/\s*16/);
  assert.match(css, /\.contact-icon-hotspots/);
  assert.match(css, /\.contact-receiver-hotspot/);
  assert.doesNotMatch(hotspots, /contact-hotspot-label|>WhatsApp<|>Messenger<|>Facebook<|>Email</);
  assert.doesNotMatch(css, /contact-hint-reveal|\.contact-icon-hotspots a::before/);
  assert.match(css, /height:\s*27%/);
  assert.match(css, /\.contact-call-label/);
  assert.match(css, /\.contact-status-note/);
});

test("v2 final contact stop hides navigation chrome and includes business-card disclosures", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const tools = await source("app/v2/components/ExperienceTools.tsx");

  assert.match(experience, /active\.id !== "contact"/);
  assert.match(tools, /informational business card/i);
  assert.match(tools, /not a diagnosis, binding quote, warranty, or repair authorization/i);
  assert.match(tools, /does not submit or store personal information/i);
  assert.match(tools, /Calgary, Alberta/);
});

test("v2 logo tap opens the garage while the black intro dissolves", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const css = await source("app/globals.css");

  assert.match(experience, /"black" \| "ready" \| "holding" \| "opening" \| "truck_exit" \| "active"/);
  assert.match(experience, /setLoadingState\("opening"\)/);
  assert.match(experience, /animateTo\(0\.17, INTRO_DURATION_MS/);
  assert.match(experience, /setLoadingState\("active"\)/);
  assert.match(css, /data-state="opening"[\s\S]*transition:\s*background 1800ms/);
  assert.match(css, /data-state="ready"[\s\S]*width:\s*clamp\(15\.6rem, 71\.5vw, 19\.5rem\)/);
});
