import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

test("publishes Dave's direct Facebook, Messenger, and WhatsApp contact links", async () => {
  const source = await readFile(
    new URL("app/components/ContactActions.tsx", projectRoot),
    "utf8",
  );

  assert.match(source, /https:\/\/wa\.me\/15879176991/);
  assert.match(source, /https:\/\/m\.me\/61578764844956/);
  assert.match(
    source,
    /https:\/\/www\.facebook\.com\/profile\.php\?id=61578764844956/,
  );
});

test("uses a centered Oakenwrench beacon driven by the restored discrete animation state", async () => {
  const [source, experience, css] = await Promise.all([
    readFile(new URL("app/components/TopBar.tsx", projectRoot), "utf8"),
    readFile(new URL("app/v2/V2Experience.tsx", projectRoot), "utf8"),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
  ]);

  assert.match(source, /\/media\/brand\/oakenwrench-mark\.png/);
  assert.doesNotMatch(source, /data-scrolling/);
  assert.match(experience, /data-animating=\{isAnimating\}/);
  assert.match(experience, /setIsAnimating/);
  assert.doesNotMatch(source, /Call Dave|call-pill/);
});

test("keeps the amber signal on the logo and removes the full-stage light wash", async () => {
  const [media, css] = await Promise.all([
    readFile(
      new URL("app/components/TimelineMedia.tsx", projectRoot),
      "utf8",
    ),
    readFile(new URL("app/globals.css", projectRoot), "utf8"),
  ]);

  assert.doesNotMatch(media, /AtmosphereCanvas/);
  assert.doesNotMatch(css, /\.atmosphere-canvas/);
  assert.match(css, /\.brand-beacon::before/);
});
