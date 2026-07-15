import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("keeps motion optional and mobile controls touch-safe", async () => {
  const [css, video] = await Promise.all([
    readFile(new URL("app/globals.css", root), "utf8"),
    readFile(new URL("app/components/ScrollVideo.tsx", root), "utf8"),
  ]);

  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.media-layer-to \{ display: none; \}/);
  assert.match(css, /\.chapter-link[\s\S]*min-height: 44px/);
  assert.match(css, /\.contact-primary[\s\S]*min-height: 56px/);
  assert.match(video, /muted/);
  assert.match(video, /playsInline/);
  assert.match(video, /aria-hidden="true"/);
});
