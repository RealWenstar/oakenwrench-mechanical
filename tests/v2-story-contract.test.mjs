import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const manifestUrl = new URL("../app/v2/story-manifest.json", import.meta.url);
const helpersUrl = new URL("../app/v2/story-contract.mjs", import.meta.url);

async function readManifest() {
  try {
    return JSON.parse(await readFile(manifestUrl, "utf8"));
  } catch {
    return null;
  }
}

async function readHelpers() {
  try {
    return await import(`${helpersUrl.href}?test=${Date.now()}`);
  } catch {
    return null;
  }
}

test("v2 manifest points only at the latest user-edited cut without replacing v1", async () => {
  const manifest = await readManifest();
  assert.ok(manifest, "expected app/v2/story-manifest.json to exist");
  assert.equal(manifest.version, 2);
  assert.equal(manifest.defaultVariant, "latest");
  assert.deepEqual(
    manifest.variants.map(({ id }) => id),
    ["latest"],
  );
  assert.deepEqual(
    manifest.variants.map(({ video }) => video),
    [
      "/media/v2/oakenwrench-v2-latest-intraframe.mp4",
    ],
  );
});

test("v2 sound contract uses the matching latest-cut audio", async () => {
  const manifest = await readManifest();
  assert.ok(manifest, "expected v2 manifest to exist");
  assert.equal(manifest.sound.defaultEnabled, false);
  assert.equal(manifest.sound.scrubTrack, "/media/v2/audio/oakenwrench-v2-latest.m4a");
  await access(new URL(`../public${manifest.sound.scrubTrack}`, import.meta.url));
});

test("v2 timeline has independent visual, audio, ui, and qa lanes", async () => {
  const manifest = await readManifest();
  assert.ok(manifest, "expected v2 manifest to exist");
  assert.deepEqual(
    manifest.lanes.map(({ id }) => id),
    ["visual", "audio", "ui", "qa"],
  );

  for (const lane of manifest.lanes) {
    assert.ok(lane.cues.length > 0, `${lane.id} lane must contain cues`);
    assert.ok(lane.cues.every(({ at }) => at >= 0 && at <= 1));
    assert.deepEqual(
      lane.cues.map(({ at }) => at),
      lane.cues.map(({ at }) => at).toSorted((a, b) => a - b),
    );
  }
});

test("v2 keeps exactly four continuous navigation chapters", async () => {
  const manifest = await readManifest();
  assert.ok(manifest, "expected v2 manifest to exist");
  assert.deepEqual(
    manifest.chapters.map(({ id }) => id),
    ["garage", "truck", "equipment", "contact"],
  );
  assert.equal(manifest.chapters[0].start, 0);
  assert.equal(manifest.chapters.at(-1).end, 1);
  for (const [index, chapter] of manifest.chapters.entries()) {
    assert.ok(chapter.start < chapter.end);
    if (index > 0) assert.equal(chapter.start, manifest.chapters[index - 1].end);
  }
});

test("v2 contract resolves variants, lanes, and chapters", async () => {
  const [manifest, helpers] = await Promise.all([readManifest(), readHelpers()]);
  assert.ok(manifest, "expected v2 manifest to exist");
  assert.ok(helpers, "expected app/v2/story-contract.mjs to exist");
  assert.equal(helpers.getStoryVariant(manifest, "latest").label, "Latest cut");
  assert.equal(helpers.getStoryVariant(manifest, "missing").id, "latest");
  assert.equal(helpers.getTimelineLane(manifest, "audio").id, "audio");
  assert.equal(helpers.getChapterAtProgress(manifest, 0).id, "garage");
  assert.equal(helpers.getChapterAtProgress(manifest, 1).id, "contact");
});
