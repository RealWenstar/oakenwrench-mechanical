import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("v2 uses the Safari scrub-optimized intraframe video", async () => {
  const manifest = JSON.parse(await readFile(new URL("../app/v2/story-manifest.json", import.meta.url), "utf8"));
  assert.match(manifest.variants[0].video, /intraframe\.mp4$/);
});
