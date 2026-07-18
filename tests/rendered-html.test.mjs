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

test("server-renders the complete Oakenwrench v2 construction shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Oakenwrench Mechanical \| Calgary Repairs<\/title>/i);
  assert.match(html, /viewport-fit=cover/i);
  assert.match(html, /Oakenwrench Mechanical/);
  assert.doesNotMatch(html, /Heavy-duty\. Small engines\. Real work\./);
  assert.match(html, /id="story"/);
  assert.equal((html.match(/class="v2-sticky-stage"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /class="story-chapter"/);
  assert.match(html, /src="\/media\/brand\/oakenwrench-mark\.png"/);
  assert.doesNotMatch(html, /Motion lab · v2/);
  assert.match(html, /oakenwrench-v2-latest-poster\.webp/);
  assert.doesNotMatch(html, />Raw<|>Clean</);
  assert.doesNotMatch(html, /Open control center/);
  assert.doesNotMatch(html, /Call Dave|call-pill/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 0);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/);
});
