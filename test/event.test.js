import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { event } from "../event.config.js";

const exactUrls = {
  portal: "https://dhruv-maker-og.github.io/wearedevelopers-bengaluru-workshop/",
  windowsApp: "https://gh.io/copilot-app-win6",
  docs: "https://docs.github.com/en/copilot/concepts/copilot-surfaces/github-copilot-app",
  join: "https://polite-glacier-0ea2cfe0f.7.azurestaticapps.net/#token=eyJ2IjozLCJpc3N1ZSI6NzQwLCJvcmciOiJoYWNrYXRob24tYmx1ZS10dW5hLTE5IiwiZXZlbnQiOiJXZUFyZURldmVsb3BlciB8IEJlbmdhbHVydSB8IDI1dGggTm92IHwgSVNUIiwiZGF0ZSI6IjIwMjYtMTEtMjUiLCJvcmdhbml6ZXJzIjpbImRocnV2LW1ha2VyLW9nIiwicHJhZGVlcGt1MDciXSwibmJmIjoxNzk1NTIxMjI1LCJleHAiOjE3OTU4MjQwMDAsImRlbGV0aW9uIjoxNzk1ODI0MDAwfQ.szr5ho1fLOiQu-BmogK7lCaDqQfZHJddFO7kJxdwrmQ",
  org: "https://github.com/orgs/hackathon-blue-tuna-19",
  lab1: "https://github.com/hackathon-blue-tuna-19/tail-spin-toys",
  alt1: "https://github.com/Sandbox-AppOrg/tailspin1",
  lab2: "https://github.com/hackathon-blue-tuna-19/Build-your-automation-Lab2",
  alt2: "https://github.com/octodemo/virtual-universe-26",
};

test("event config preserves every approved URL exactly", () => assert.deepEqual(event.urls, exactUrls));

for (const [name, configKey] of Object.entries(event.qr)) {
  test(`${name}.png decodes to the configured ${configKey} URL`, async () => {
    const png = PNG.sync.read(await readFile(new URL(`../site/assets/qr/${name}.png`, import.meta.url)));
    const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    assert.ok(decoded, `${name}.png did not decode`);
    assert.equal(decoded.data, event.urls[configKey]);
  });
}

test("built page contains all approved URLs and has no unresolved values", async () => {
  const html = await readFile(new URL("../site/index.html", import.meta.url), "utf8");
  for (const url of Object.values(exactUrls)) assert.ok(html.includes(url), `Missing ${url}`);
  assert.doesNotMatch(html, /\{\{/);
  for (const phrase of ["GitHub Copilot Enterprise is active for your account", "Add GitHub repository", "Clone repository", "This computer", "New worktree", "Interactive"]) {
    assert.ok(html.includes(phrase), `Missing ${phrase}`);
  }
});
