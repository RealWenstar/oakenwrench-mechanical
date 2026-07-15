import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete Oakenwrench story shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Oakenwrench Mechanical \| Calgary Repairs<\/title>/i);
  assert.match(html, /Oakenwrench Mechanical/);
  assert.match(html, /Heavy-duty\. Small engines\. Real work\./);
  assert.match(html, /id="garage"/);
  assert.match(html, /id="truck"/);
  assert.match(html, /id="equipment"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /href="tel:\+15879176991"/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});
