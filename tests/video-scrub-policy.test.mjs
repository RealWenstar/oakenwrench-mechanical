import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

test("manifest scrub video is all-intra for deterministic Safari seeking", async () => {
  const manifest = JSON.parse(await readFile(new URL("../app/v2/story-manifest.json", import.meta.url), "utf8"));
  assert.match(manifest.variants[0].video, /intraframe\.mp4$/);
  const file = fileURLToPath(new URL(`../public${manifest.variants[0].video}`, import.meta.url));
  const ffprobeCmd = `ffprobe -v error -select_streams v:0 -show_entries stream=has_b_frames -show_entries frame=key_frame,pict_type -of json "${file}"`;
  const output = JSON.parse(execSync(ffprobeCmd, { encoding: "utf8" }));

  assert.equal(output.streams[0].has_b_frames, 0, "has_b_frames should be 0");
  for (const frame of output.frames) {
    assert.equal(frame.key_frame, 1, "frame is not a keyframe");
    assert.equal(frame.pict_type, "I", "frame is not an I-frame");
  }
});
