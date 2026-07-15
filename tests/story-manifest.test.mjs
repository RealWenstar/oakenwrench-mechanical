import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const manifestUrl = new URL("../public/media/anchors/manifest.json", import.meta.url);

async function readManifest() {
  return JSON.parse(await readFile(manifestUrl, "utf8"));
}

test("defines the complete ordered scroll story", async () => {
  const manifest = await readManifest();
  assert.deepEqual(
    manifest.chapters.map(({ id }) => id),
    ["garage", "truck", "equipment", "contact"],
  );

  for (const chapter of manifest.chapters) {
    const progress = chapter.beats.map((beat) => beat.progress);
    assert.equal(progress[0], 0, `${chapter.id} must begin at progress 0`);
    assert.equal(progress.at(-1), 1, `${chapter.id} must end at progress 1`);
    assert.deepEqual([...progress].sort((a, b) => a - b), progress);
    assert.ok(chapter.heightVh >= 300);
  }
});

test("every story beat has an existing local fallback asset", async () => {
  const manifest = await readManifest();
  const fallbacks = manifest.chapters.flatMap((chapter) =>
    chapter.beats.map(({ asset }) => asset),
  );
  assert.ok(fallbacks.length >= 20);

  await Promise.all(
    fallbacks.map((asset) =>
      access(new URL(`../public${asset}`, import.meta.url)),
    ),
  );
});

test("production scroll videos are local, scrub-safe assets", async () => {
  const manifest = await readManifest();
  const videos = manifest.chapters.flatMap((chapter) =>
    chapter.video ? [chapter.video] : [],
  );

  assert.equal(videos.length, 2);
  assert.ok(videos.every((asset) => asset.endsWith("-web.mp4")));
  await Promise.all(
    videos.map((asset) => access(new URL(`../public${asset}`, import.meta.url))),
  );
});
