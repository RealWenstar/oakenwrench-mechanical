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
  const sound = await source("app/v2/components/SoundControl.tsx");
  assert.match(sound, /aria-label="Sound"/);
  assert.match(sound, /aria-pressed/);
  assert.match(sound, /Sound on/);
  assert.match(sound, /Sound off/);
  assert.match(sound, /defaultEnabled\s*=\s*false/);
});

test("v2 chapter navigation stays at four chapters", async () => {
  const nav = await source("app/v2/components/V2ChapterNav.tsx");
  assert.match(nav, /aria-label="Story chapters"/);
  assert.match(nav, /chapters\.map/);
  assert.match(nav, /chapters\.length !== 4/);
  assert.match(nav, /aria-current/);
});
