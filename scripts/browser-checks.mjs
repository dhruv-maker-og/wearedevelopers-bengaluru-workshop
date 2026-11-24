import AxeBuilder from "@axe-core/playwright";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = path.join(process.cwd(), "site");
const mime = { ".css": "text/css", ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".png": "image/png" };
const server = createServer(async (request, response) => {
  const relative = new URL(request.url, "http://localhost").pathname.replace(/^\/+/, "") || "index.html";
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    await stat(file);
    response.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404).end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [
    { name: "mobile", width: 368, height: 749 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "projector", width: 1440, height: 900 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) throw new Error(`${viewport.name}: ${overflow}px horizontal overflow`);
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const active = document.activeElement;
      return { className: active.className, outlineStyle: getComputedStyle(active).outlineStyle };
    });
    if (focus.className !== "skip-link" || focus.outlineStyle === "none") {
      throw new Error(`${viewport.name}: keyboard focus is not visible from the first tab stop`);
    }
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    if (results.violations.length) {
      const violations = results.violations.map(({ id, impact, nodes }) =>
        `${id} (${impact}): ${nodes.map(({ target, failureSummary }) => `${target.join(" ")} ${failureSummary}`).join("; ")}`,
      ).join("\n");
      throw new Error(`${viewport.name}: accessibility violations: ${violations}`);
    }
    if (viewport.name === "mobile") {
      const layout = await page.evaluate(() => ({
        pageHeight: document.documentElement.scrollHeight,
        heroHeight: document.querySelector(".hero").getBoundingClientRect().height,
        qrTop: document.querySelector(".ticket-main img").getBoundingClientRect().top,
      }));
      if (layout.heroHeight > 950) throw new Error(`mobile: hero is ${layout.heroHeight}px, expected <= 950px`);
      if (layout.qrTop > 650) throw new Error(`mobile: primary QR starts at ${layout.qrTop}px, expected <= 650px`);
      if (layout.pageHeight > 7500) throw new Error(`mobile: page is ${layout.pageHeight}px, expected <= 7500px`);
      console.log(`mobile layout: ${Math.round(layout.heroHeight)}px hero; QR at ${Math.round(layout.qrTop)}px; ${layout.pageHeight}px page`);
      await page.locator(".check-control").first().click();
      await page.reload();
      if (!(await page.locator('[data-check="join"]').isChecked())) throw new Error("Checklist progress did not persist");
      await page.locator("#clear-progress").click();
      if (await page.locator('[data-check="join"]').isChecked()) throw new Error("Checklist reset failed");
    }
    await page.close();
    await context.close();
    console.log(`${viewport.name}: layout, keyboard focus, and WCAG A/AA automated checks passed`);
  }
} finally {
  await browser.close();
  server.close();
}
