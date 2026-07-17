import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("v2 latest cut owns the full duration and scroll length", async () => {
  const manifest = JSON.parse(await source("app/v2/story-manifest.json"));
  const latest = manifest.variants.find(({ id }) => id === "latest");

  assert.equal(manifest.variants.length, 1);
  assert.equal(latest.durationSeconds, 50.538667);
  assert.equal(latest.scrollVh, 1120);
});

test("v2 experience binds media, sound and all four construction lanes", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const timeline = await source("app/v2/components/ConstructionTimeline.tsx");
  const soundscape = await source("app/v2/components/StorySoundscape.tsx");

  assert.doesNotMatch(experience, /VariantSwitcher/);
  assert.match(experience, /ConstructionTimeline/);
  assert.match(experience, /V2ChapterNav/);
  assert.match(experience, /StorySoundscape/);
  assert.match(experience, /variant\.video/);
  assert.match(timeline, /Audio/);
  assert.match(timeline, /Visual/);
  assert.match(timeline, /UI/);
  assert.match(timeline, /QA/);
  assert.match(soundscape, /new Audio/);
  assert.match(soundscape, /progress\s*\*\s*durationSeconds/);
  assert.match(soundscape, /window\.setTimeout/);
  assert.doesNotMatch(soundscape, /variant\.video/);
});

test("v2 desktop layout keeps the mobile stage and side shaders", async () => {
  const css = await source("app/globals.css");
  assert.match(css, /\.v2-phone-stage/);
  assert.match(css, /max-width:\s*430px/);
  assert.match(css, /\.v2-side-shader/);
  assert.match(css, /@media \(min-width:\s*800px\)/);
  assert.match(css, /scrollbar-width:\s*none/);
  assert.match(css, /::-webkit-scrollbar/);
});
