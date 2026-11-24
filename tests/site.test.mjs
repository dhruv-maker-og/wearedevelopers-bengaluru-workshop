import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { PNG } from "pngjs";
import jsQR from "jsqr";

const root = resolve(import.meta.dirname, "..");
const config = JSON.parse(await readFile(resolve(root, "event.config.json"), "utf8"));
const expected = {
  portal: "https://dhruv-maker-og.github.io/wearedevelopers-bengaluru-workshop/",
  windowsApp: "https://gh.io/copilot-app-win6",
  appDocs: "https://docs.github.com/en/copilot/concepts/copilot-surfaces/github-copilot-app",
  join: "https://polite-glacier-0ea2cfe0f.7.azurestaticapps.net/#token=eyJ2IjozLCJpc3N1ZSI6NzQwLCJvcmciOiJoYWNrYXRob24tYmx1ZS10dW5hLTE5IiwiZXZlbnQiOiJXZUFyZURldmVsb3BlciB8IEJlbmdhbHVydSB8IDI1dGggTm92IHwgSVNUIiwiZGF0ZSI6IjIwMjYtMTEtMjUiLCJvcmdhbml6ZXJzIjpbImRocnV2LW1ha2VyLW9nIiwicHJhZGVlcGt1MDciXSwibmJmIjoxNzk1NTIxMjI1LCJleHAiOjE3OTU4MjQwMDAsImRlbGV0aW9uIjoxNzk1ODI0MDAwfQ.szr5ho1fLOiQu-BmogK7lCaDqQfZHJddFO7kJxdwrmQ",
  organization: "https://github.com/orgs/hackathon-blue-tuna-19",
  lab1: "https://github.com/hackathon-blue-tuna-19/tail-spin-toys",
  alternateLab1: "https://github.com/Sandbox-AppOrg/tailspin1",
  lab2: "https://github.com/hackathon-blue-tuna-19/Build-your-automation-Lab2",
  alternateLab2: "https://github.com/octodemo/virtual-universe-26",
};

test("event configuration contains every approved destination exactly", () => {
  for (const [key, url] of Object.entries(expected)) {
    assert.equal(config[key], url, `${key} must not drift`);
    const parsed = new URL(config[key]);
    assert.equal(parsed.protocol, "https:");
  }
});

test("all URL-bearing markup is driven by event configuration", async () => {
  const html = await readFile(resolve(root, "src/index.html"), "utf8");
  const destinationKeys = [...html.matchAll(/data-(?:url|copy)="([^"]+)"/g)].map((match) => match[1]);

  for (const key of new Set(destinationKeys)) {
    assert.ok(config[key], `Missing config URL for ${key}`);
  }
  for (const url of Object.values(expected)) {
    assert.equal(html.includes(url), false, "destinations must remain centralized in event.config.json");
  }
});

test("portal includes the required operational instructions and safeguards", async () => {
  const html = await readFile(resolve(root, "src/index.html"), "utf8");
  const requiredCopy = [
    "The 15-minute setup",
    "Enterprise Managed User",
    "GitHub Copilot Enterprise is active for your account",
    "Sessions</b> → <b>Add GitHub repository",
    "This computer</b> → <b>New worktree</b> → <b>Interactive",
    "README.md",
    "No confidential content",
    "Workshop content may be deleted",
    'data-copy="alternateLab1"',
    'data-copy="alternateLab2"',
  ];

  for (const copy of requiredCopy) {
    assert.ok(html.includes(copy), `Missing required portal copy: ${copy}`);
  }
});

for (const [file, key] of [
  ["portal.png", "portal"],
  ["join.png", "join"],
  ["alternate-lab-1.png", "alternateLab1"],
  ["alternate-lab-2.png", "alternateLab2"],
]) {
  test(`${file} decodes to its configured destination`, async () => {
    const png = PNG.sync.read(await readFile(resolve(root, "dist/assets", file)));
    const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    assert.ok(decoded, `${file} must be decodable`);
    assert.equal(decoded.data, config[key]);
  });
}
