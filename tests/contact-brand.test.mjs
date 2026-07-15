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

test("uses the supplied Oakenwrench logo in the persistent header", async () => {
  const source = await readFile(
    new URL("app/components/TopBar.tsx", projectRoot),
    "utf8",
  );

  assert.match(source, /\/media\/brand\/oakenwrench-logo-source\.jpg/);
});
