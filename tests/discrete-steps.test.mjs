import assert from "node:assert/strict";
import test from "node:test";

test("TopBar keeps only the brand logo in the intro", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const topbarPath = path.join(process.cwd(), "app", "components", "TopBar.tsx");
  const content = await fs.readFile(topbarPath, "utf8");

  assert.match(content, /className="brand-beacon"/, "Logo should be present");
  assert.doesNotMatch(content, /preloader-bar-container/, "Intro should not show a loading bar");
});

test("ready screen has no instructional cue", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const cssPath = path.join(process.cwd(), "app", "globals.css");
  const content = await fs.readFile(cssPath, "utf8");

  assert.doesNotMatch(content, /\.tap-cue\s*\{/);
  assert.doesNotMatch(content, /\.topbar\[data-state="ready"\] \.tap-cue/);
});
