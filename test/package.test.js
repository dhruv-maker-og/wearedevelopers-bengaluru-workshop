import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("package metadata defines static build and verification commands", async () => {
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.private, true);
  assert.equal(pkg.version, "1.0.0");
  assert.equal(pkg.type, "module");
  assert.match(pkg.scripts.build, /scripts\/build\.mjs/);
  assert.match(pkg.scripts.test, /node --test/);
  assert.match(pkg.scripts.smoke, /scripts\/smoke\.mjs/);
  assert.match(pkg.scripts["check:ui"], /browser-checks/);
  assert.equal(pkg.dependencies, undefined);
});

test("portal source has no runtime framework or CDN references", async () => {
  const [html, css, js] = await Promise.all(["index.html", "styles.css", "app.js"].map((file) => readFile(new URL(`../src/${file}`, import.meta.url), "utf8")));
  const runtime = `${html}\n${css}\n${js}`;
  assert.doesNotMatch(runtime, /https:\/\/[^"' )]+(?:cdn|unpkg|jsdelivr|cdnjs)/i);
  assert.doesNotMatch(runtime, /react|vue|angular|svelte/i);
});
