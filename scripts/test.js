const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const config = require("../config.js");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

const requiredConfig = [
  "copilotAppWindows",
  "copilotAppDocs",
  "workshopJoin",
  "organization",
  "lab1",
  "altLab1",
  "lab2",
  "altLab2",
  "portal",
];
requiredConfig.forEach((key) => {
  assert.match(config[key], /^https:\/\//, `${key} must be an HTTPS URL`);
  assert.match(html, new RegExp(`data-(?:url|copy-url)="${key}"`), `${key} must be wired into HTML`);
});

assert.match(html, /<html lang="en">/);
assert.match(html, /class="skip-link"/);
assert.match(html, /aria-label="Workshop navigation"/);
assert.match(html, /<progress id="setup-progress"/);
assert.match(html, /GitHub Copilot Enterprise is active for your account/);
assert.match(html, /Enterprise Managed User \(EMU\)/);
assert.match(html, /Add GitHub repository/);
assert.match(html, /Clone repository/);
assert.match(html, /New worktree/);
assert.match(html, /may be deleted after the event/i);
assert.match(html, /Do not add confidential/i);
assert.match(html, /Open the README and follow the instructions/i);
assert.match(css, /prefers-reduced-motion/);
assert.match(css, /@media print/);
assert.match(css, /:focus-visible/);
assert.match(app, /localStorage/);
assert.match(app, /navigator\.clipboard/);

const externalRuntime = [...html.matchAll(/<(?:script|link|img)[^>]+(?:src|href)="(https?:\/\/[^"]+)"/g)];
assert.equal(externalRuntime.length, 0, "The portal must not load runtime assets from external hosts.");

for (const name of [
  "portal.png",
  "portal.svg",
  "workshop-join.png",
  "workshop-join.svg",
  "alt-lab-1.png",
  "alt-lab-1.svg",
  "alt-lab-2.png",
  "alt-lab-2.svg",
]) {
  assert.ok(fs.existsSync(path.join(root, "assets", name)), `${name} is missing`);
}

console.log("Portal content, wiring, accessibility hooks, and static assets passed tests.");
