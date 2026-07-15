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

test("uses a centered transparent Oakenwrench scroll beacon without a call pill", async () => {
  const source = await readFile(
    new URL("app/components/TopBar.tsx", projectRoot),
    "utf8",
  );

  assert.match(source, /\/media\/brand\/oakenwrench-mark\.png/);
  assert.match(source, /data-scrolling/);
  assert.match(source, /passive: true/);
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
