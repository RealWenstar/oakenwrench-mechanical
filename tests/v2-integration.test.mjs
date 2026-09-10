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
  assert.equal(latest.durationSeconds, 49.533333);
  assert.equal(latest.scrollVh, 1120);
});

test("v2 experience binds media without sound and uses the honest stop navigation", async () => {
  const experience = await source("app/v2/V2Experience.tsx");
  const manifest = JSON.parse(await source("app/v2/story-manifest.json"));

  assert.doesNotMatch(experience, /VariantSwitcher/);
  assert.doesNotMatch(experience, /ConstructionTimeline/);
  assert.match(experience, /V2StopNav/);
  assert.doesNotMatch(experience, /StorySoundscape|soundEnabled|Audio/);
  assert.match(experience, /variant\.video/);
  assert.equal("sound" in manifest, false);
  assert.deepEqual(manifest.lanes.map(({ id }) => id), ["visual", "ui", "qa"]);
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
