import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const manifestUrl = new URL("../public/media/anchors/manifest.json", import.meta.url);

async function readManifest() {
  return JSON.parse(await readFile(manifestUrl, "utf8"));
}

test("defines one continuous scroll timeline", async () => {
  const manifest = await readManifest();
  assert.equal(manifest.version, 3);
  assert.equal(manifest.scrollVh, 400);
  assert.match(manifest.video, /story-master-web\.mp4$/);
  assert.match(manifest.mobileVideo, /story-master-mobile\.mp4$/);
  assert.deepEqual(
    manifest.timeline.map(({ id }) => id),
    ["garage", "truck", "equipment", "contact"],
  );

  for (const [index, chapter] of manifest.timeline.entries()) {
    assert.ok(chapter.start >= 0 && chapter.end <= 1);
    assert.ok(chapter.start < chapter.end);
    if (index > 0) assert.equal(chapter.start, manifest.timeline[index - 1].end);
  }
  assert.equal(manifest.timeline[0].start, 0);
  assert.equal(manifest.timeline.at(-1).end, 1);
});

test("every story beat has an existing local fallback asset", async () => {
  const manifest = await readManifest();
  const fallbacks = manifest.fallbackFrames.map(({ asset }) => asset);
  assert.ok(fallbacks.length >= 4);

  await Promise.all(
    fallbacks.map((asset) =>
      access(new URL(`../public${asset}`, import.meta.url)),
    ),
  );
});

test("production scroll videos are local, scrub-safe assets", async () => {
  const manifest = await readManifest();
  const videos = [manifest.video];
  const mobileVideos = [manifest.mobileVideo];

  assert.equal(videos.length, 1);
  assert.equal(mobileVideos.length, 1);
  assert.ok(videos.every((asset) => asset.endsWith("-web.mp4")));
  assert.ok(mobileVideos.every((asset) => asset.endsWith("-mobile.mp4")));
  await Promise.all(
    [...videos, ...mobileVideos].map((asset) =>
      access(new URL(`../public${asset}`, import.meta.url)),
    ),
  );

  const mobileSizes = await Promise.all(
    mobileVideos.map(async (asset) => {
      const { size } = await import("node:fs/promises").then(({ stat }) =>
        stat(new URL(`../public${asset}`, import.meta.url)),
      );
      return size;
    }),
  );
  assert.ok(mobileSizes.every((size) => size < 15_000_000));
});

test("renders one global sticky stage instead of separate chapter pages", async () => {
  const source = await readFile(
    new URL("../app/components/StoryExperience.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /story-timeline/);
  assert.equal((source.match(/sticky-stage/g) ?? []).length, 1);
  assert.doesNotMatch(source, /storyChapters\.map|<StoryChapter/);
});
